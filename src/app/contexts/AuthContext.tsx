import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { pb } from "../../lib/pocketbase";
import type { RecordModel } from "pocketbase";

export type UserPlan = "free" | "pro";

export interface User {
  id: string;
  name: string;
  email: string;
  plan: UserPlan;
  proposalUsageToday: number;
  transactionsUsageToday: number;
  onboardingCompleted: boolean;
  receivePaymentReminders: boolean;
  avatarUrl?: string;
  phone?: string;
  company?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  upgradeToPro: () => Promise<void>;
  incrementProposalUsage: () => Promise<void>;
  incrementTransactionUsage: () => Promise<void>;
  resetProposalUsage: () => Promise<void>;
  refreshUser: () => Promise<void>;
  completeOnboarding: (data: {
    cpfCnpj?: string;
    tipoNegocio?: string;
    faturamentoMensal?: number;
    objetivo?: string;
  }) => Promise<void>;
  updateProfile: (updates: { name?: string; phone?: string; company?: string; bio?: string }) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updatePaymentReminders: (enabled: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// profileRecord guardado fora do estado para evitar re-renders desnecessários
let currentProfileId: string | null = null;

function mapProfile(pbRecord: RecordModel, authUserId: string): User {
  return {
    id: authUserId,
    name: pbRecord.name ?? pbRecord.email?.split("@")[0] ?? "Usuário",
    email: pbRecord.email ?? "",
    plan: pbRecord.plan ?? "free",
    proposalUsageToday: pbRecord.proposal_usage_today ?? 0,
    transactionsUsageToday: pbRecord.transactions_usage_today ?? 0,
    onboardingCompleted: pbRecord.onboardingCompleted ?? pbRecord.onboarding_completed ?? false,
    receivePaymentReminders: pbRecord.receive_payment_reminders ?? true,
    avatarUrl: pbRecord.avatarUrl ?? undefined,
    phone: pbRecord.phone,
    company: pbRecord.company,
    bio: pbRecord.bio,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Busca o profile na coleção "profiles" pelo userId do auth
  async function fetchProfile(authUserId: string) {
    try {
      let record: RecordModel;
      try {
        record = await pb.collection("profiles").getFirstListItem(
          `userId = "${authUserId}"`,
          { requestKey: null }
        );
      } catch {
        // Profile ainda não existe, cria um
        record = await pb.collection("profiles").create({
          userId: authUserId,
          name: pb.authStore.record?.name ?? "",
          email: pb.authStore.record?.email ?? "",
          plan: "free",
          onboardingCompleted: false,
        });
      }
      currentProfileId = record.id;
      setUser(mapProfile(record, authUserId));
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("autocancelled")) return;
      console.error("Error fetching profile:", error);
      if (error instanceof Error && (error.message.includes("404") || error.message.includes("401"))) {
        pb.authStore.clear();
        setUser(null);
      }
    }
  }

  useEffect(() => {
    if (pb.authStore.isValid && pb.authStore.record) {
      fetchProfile(pb.authStore.record.id).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    const unsubscribe = pb.authStore.onChange(() => {
      if (pb.authStore.isValid && pb.authStore.record) {
        fetchProfile(pb.authStore.record.id);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const authData = await pb.collection("users").authWithPassword(email, password);
      if (authData.record) {
        await fetchProfile(authData.record.id);
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Login failed");
    }
  };

  const loginWithGoogle = async () => {
    try {
      const authData = await pb.collection("users").authWithOAuth2({ provider: "google" });
      if (authData.record) {
        await fetchProfile(authData.record.id);
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Google login failed");
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Cria usuário na coleção "users" (Auth)
      await pb.collection("users").create({
        email,
        password,
        passwordConfirm: password,
        name,
        emailVisibility: true,
      });

      // Faz login automaticamente
      const authData = await pb.collection("users").authWithPassword(email, password);

      if (authData.record) {
        // Cria o perfil na coleção "profiles" (Base)
        const profileRecord = await pb.collection("profiles").create({
          userId: authData.record.id,
          name,
          email,
          plan: "free",
          onboardingCompleted: false,
        });
        currentProfileId = profileRecord.id;
        setUser(mapProfile(profileRecord, authData.record.id));

        // Envia email de verificação (não crítico)
        try {
          await pb.collection("users").requestVerification(email);
        } catch (_) {}

        return true;
      }
      return false;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Signup failed");
    }
  };

  const logout = async () => {
    pb.authStore.clear();
    currentProfileId = null;
    setUser(null);
  };

  const upgradeToPro = async () => {
    if (!user || !currentProfileId) return;
    const record = await pb.collection("profiles").update(currentProfileId, { plan: "pro" });
    setUser(mapProfile(record, user.id));
  };

  const incrementProposalUsage = async () => {
    if (!user || !currentProfileId) return;
    const currentRecord = await pb.collection("profiles").getOne(currentProfileId, { requestKey: null });
    const today = new Date().toISOString().split("T")[0];
    const lastResetDate = (currentRecord.proposal_reset_date ?? "").slice(0, 10);
    const newUsage = lastResetDate === today ? (currentRecord.proposal_usage_today ?? 0) + 1 : 1;
    const record = await pb.collection("profiles").update(currentProfileId, {
      proposal_usage_today: newUsage,
      proposal_reset_date: today,
    });
    setUser(mapProfile(record, user.id));
  };

  const incrementTransactionUsage = async () => {
    if (!user || !currentProfileId) return;
    const currentRecord = await pb.collection("profiles").getOne(currentProfileId, { requestKey: null });
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
    const lastResetMonth = (currentRecord.transactions_reset_date || "").slice(0, 7);
    const newUsage = lastResetMonth === currentMonth ? (currentRecord.transactions_usage_today ?? 0) + 1 : 1;
    const record = await pb.collection("profiles").update(currentProfileId, {
      transactions_usage_today: newUsage,
      transactions_reset_date: `${currentMonth}-01`,
    });
    setUser(mapProfile(record, user.id));
  };

  const resetProposalUsage = async () => {
    if (!user || !currentProfileId) return;
    const record = await pb.collection("profiles").update(currentProfileId, {
      proposal_usage_today: 0,
      proposal_reset_date: new Date().toISOString().split("T")[0],
    });
    setUser(mapProfile(record, user.id));
  };

  const refreshUser = async () => {
    if (!user || !currentProfileId) return;
    const record = await pb.collection("profiles").getOne(currentProfileId, { requestKey: null });
    setUser(mapProfile(record, user.id));
  };

  const completeOnboarding = async (data: {
    cpfCnpj?: string;
    tipoNegocio?: string;
    faturamentoMensal?: number;
    objetivo?: string;
  }) => {
    if (!user || !currentProfileId) return;
    const record = await pb.collection("profiles").update(currentProfileId, {
      cpf_cnpj: data.cpfCnpj ?? null,
      tipo_negocio: data.tipoNegocio ?? null,
      faturamento_mensal: data.faturamentoMensal ?? null,
      objetivo: data.objetivo ?? null,
      onboardingCompleted: true,
    });
    setUser(mapProfile(record, user.id));
  };

  const updateProfile = async (updates: { name?: string; phone?: string; company?: string; bio?: string }) => {
    if (!user || !currentProfileId) return;
    const record = await pb.collection("profiles").update(currentProfileId, {
      name: updates.name ?? undefined,
      phone: updates.phone ?? undefined,
      company: updates.company ?? undefined,
      bio: updates.bio ?? undefined,
    });
    setUser(mapProfile(record, user.id));
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    if (!user || !currentProfileId) throw new Error("User not authenticated");
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) throw new Error("Apenas imagens JPG, PNG ou WebP são permitidas");
    if (file.size > 5 * 1024 * 1024) throw new Error("Arquivo não pode ser maior que 5MB");

    const formData = new FormData();
    formData.append("avatarUrl", file);
    const record = await pb.collection("profiles").update(currentProfileId, formData);
    const avatarUrl = record.avatarUrl ? pb.files.getUrl(record, record.avatarUrl) : "";
    setUser(mapProfile(record, user.id));
    return avatarUrl;
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error("User not authenticated");
    await pb.collection("users").authWithPassword(user.email, currentPassword);
    await pb.collection("users").update(pb.authStore.record!.id, {
      password: newPassword,
      passwordConfirm: newPassword,
      oldPassword: currentPassword,
    });
    await logout();
  };

  const updatePaymentReminders = async (enabled: boolean) => {
    if (!user || !currentProfileId) return;
    const record = await pb.collection("profiles").update(currentProfileId, {
      receive_payment_reminders: enabled,
    });
    setUser(mapProfile(record, user.id));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        loginWithGoogle,
        signup,
        logout,
        upgradeToPro,
        incrementProposalUsage,
        incrementTransactionUsage,
        resetProposalUsage,
        refreshUser,
        completeOnboarding,
        updateProfile,
        uploadAvatar,
        changePassword,
        updatePaymentReminders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
