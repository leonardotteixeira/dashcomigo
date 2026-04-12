import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { pb } from "../../lib/pocketbase";
import { jwtDecode } from "jwt-decode";
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
  cnpj?: string;
  address?: string;
  loginStreak: number;
  bestStreak: number;
  lastLoginDate?: string;
  streakRewardClaimed: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<{ onboardingCompleted: boolean }>;
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
  updateProfile: (updates: { name?: string; phone?: string; company?: string; bio?: string; cnpj?: string; address?: string }) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updatePaymentReminders: (enabled: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapProfile(pbRecord: RecordModel): User {
  return {
    id: pbRecord.id,
    name: pbRecord.name ?? pbRecord.email?.split("@")[0] ?? "Usuário",
    email: pbRecord.email ?? "",
    plan: pbRecord.plan ?? "free",
    proposalUsageToday: pbRecord.proposal_usage_today ?? 0,
    transactionsUsageToday: pbRecord.transactions_usage_today ?? 0,
    onboardingCompleted: pbRecord.onboarding_completed ?? false,
    receivePaymentReminders: pbRecord.receive_payment_reminders ?? true,
    avatarUrl: pbRecord.avatar_url ? pb.files.getURL(pbRecord, pbRecord.avatar_url) : undefined,
    phone: pbRecord.phone,
    company: pbRecord.company,
    bio: pbRecord.bio,
    cnpj: pbRecord.cpf_cnpj,
    address: pbRecord.address,
    loginStreak: pbRecord.login_streak ?? 0,
    bestStreak: pbRecord.best_streak ?? 0,
    lastLoginDate: pbRecord.last_login_date ?? undefined,
    streakRewardClaimed: pbRecord.streak_reward_claimed ?? false,
  };
}

async function updateLoginStreak(userId: string, currentUser: User): Promise<Partial<User> | null> {
  const today = new Date().toISOString().split("T")[0];
  const lastLogin = currentUser.lastLoginDate;

  if (lastLogin === today) return null; // Already logged in today — nothing to update

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const newStreak = lastLogin === yesterdayStr ? currentUser.loginStreak + 1 : 1;
  const newBest = Math.max(newStreak, currentUser.bestStreak);

  const updates: Record<string, unknown> = {
    login_streak: newStreak,
    best_streak: newBest,
    last_login_date: today,
  };

  // Grant 1 free month PRO to users who reach 7-day streak (only once)
  const earnedReward = newStreak >= 7 && !currentUser.streakRewardClaimed && currentUser.plan === "free";
  if (earnedReward) {
    updates.plan = "pro";
    updates.streak_reward_claimed = true;
  }

  try {
    await pb.collection("profiles").update(userId, updates, { requestKey: null });
    return {
      loginStreak: newStreak,
      bestStreak: newBest,
      lastLoginDate: today,
      ...(earnedReward ? { plan: "pro" as UserPlan, streakRewardClaimed: true } : {}),
    };
  } catch (err) {
    console.error("Failed to update streak:", err);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(userId: string) {
    try {
      const record = await pb.collection("profiles").getOne(userId, { requestKey: null });
      const mapped = mapProfile(record);

      // ── Optimistic streak calculation (synchronous) ─────────────────────────
      // Calculate the correct streak value BEFORE the first setUser so the
      // component renders with the right number immediately, avoiding the
      // 0 → 1 flicker caused by two sequential setUser calls.
      const today = new Date().toISOString().split("T")[0];
      const lastLogin = mapped.lastLoginDate;

      if (lastLogin !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        const newStreak = lastLogin === yesterdayStr ? mapped.loginStreak + 1 : 1;
        const newBest = Math.max(newStreak, mapped.bestStreak);

        setUser({ ...mapped, loginStreak: newStreak, bestStreak: newBest, lastLoginDate: today });
      } else {
        // Already logged in today — streak unchanged
        setUser(mapped);
      }

      // Write to PocketBase in background; only update state again if the
      // streak reward (plan upgrade) was earned — that's a one-time event.
      updateLoginStreak(userId, mapped).then((streakUpdates) => {
        if (streakUpdates?.plan === "pro") {
          setUser((prev) =>
            prev ? { ...prev, plan: "pro" as UserPlan, streakRewardClaimed: true } : null
          );
        }
      }).catch((err) => console.error("Streak update failed:", err));

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
    if (pb.authStore.isValid) {
      const user = pb.authStore.record;
      if (user) {
        fetchProfile(user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
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
      const authData = await pb
        .collection("profiles")
        .authWithPassword(email, password);

      if (authData.record) {
        setUser(mapProfile(authData.record));
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Login failed");
    }
  };

  const loginWithGoogle = async (googleToken: string): Promise<{ onboardingCompleted: boolean }> => {
    try {
      console.log("[OAuth] Starting Google login with token");

      // Decodificar token do Google para obter informações do usuário
      const decoded: any = jwtDecode(googleToken);
      const { email, name, picture } = decoded;

      console.log("[OAuth] Google user info - Email:", email, "Name:", name);

      if (!email) {
        throw new Error("Email não encontrado no token Google.");
      }

      // Tentar fazer login com o email
      let authData: any;
      let isNewUser = false;

      try {
        // Tentar fazer login com email (usando email como password inicialmente)
        authData = await pb
          .collection("profiles")
          .authWithPassword(email, email);
        console.log("[OAuth] User already exists, logged in");
      } catch (loginError) {
        // Usuário não existe, criar novo
        console.log("[OAuth] User doesn't exist, creating new user");
        isNewUser = true;

        try {
          await pb.collection("profiles").create({
            email,
            password: email, // Usar email como senha inicial
            passwordConfirm: email,
            name: name || email.split("@")[0],
            plan: "free",
            proposal_usage_today: 0,
            proposal_reset_date: new Date().toISOString().split("T")[0],
            transactions_usage_today: 0,
            transactions_reset_date: new Date().toISOString().split("T")[0],
            onboarding_completed: false,
            receive_payment_reminders: true,
            avatar_url: "", // Will be populated if needed
          });

          // Agora fazer login
          authData = await pb
            .collection("profiles")
            .authWithPassword(email, email);
          console.log("[OAuth] New user created and logged in");
        } catch (createError) {
          throw new Error(`Erro ao criar usuário Google: ${createError instanceof Error ? createError.message : String(createError)}`);
        }
      }

      if (!authData.record) {
        throw new Error("Falha ao autenticar com Google. Tente novamente.");
      }

      // Atualizar profile com informações do Google se for novo usuário
      if (isNewUser && picture) {
        try {
          await pb.collection("profiles").update(authData.record.id, {
            name: name || authData.record.name,
          }, { requestKey: null });
        } catch (updateError) {
          console.warn("[OAuth] Could not update profile with Google info:", updateError);
        }
      }

      const mapped = mapProfile(authData.record);
      setUser(mapped);
      console.log("[OAuth] User authenticated, onboarding:", mapped.onboardingCompleted);
      return { onboardingCompleted: mapped.onboardingCompleted };
    } catch (error) {
      console.error("[OAuth] Full error object:", error);
      const msg = error instanceof Error ? error.message : String(error);
      console.error("[OAuth] Error message:", msg);
      throw new Error(msg || "Google login failed");
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      await pb.collection("profiles").create({
        email,
        password,
        passwordConfirm: password,
        name,
        plan: "free",
        proposal_usage_today: 0,
        proposal_reset_date: new Date().toISOString().split("T")[0],
        transactions_usage_today: 0,
        transactions_reset_date: new Date().toISOString().split("T")[0],
        onboarding_completed: false,
        receive_payment_reminders: true,
      });

      const authData = await pb
        .collection("profiles")
        .authWithPassword(email, password);

      if (authData.record) {
        setUser(mapProfile(authData.record));
        try {
          await pb.collection("profiles").requestVerification(email);
        } catch (_) {}
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Signup failed");
    }
  };

  const logout = async () => {
    try {
      pb.authStore.clear();
      setUser(null);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Logout failed");
    }
  };

  const upgradeToPro = async () => {
    if (!user) return;
    try {
      const record = await pb.collection("profiles").update(user.id, {
        plan: "pro",
      });
      setUser(mapProfile(record));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Upgrade failed");
    }
  };

  const incrementProposalUsage = async () => {
    if (!user) return;
    try {
      const currentRecord = await pb.collection("profiles").getOne(user.id, { requestKey: null });
      const today = new Date().toISOString().split("T")[0];
      const lastResetDate = (currentRecord.proposal_reset_date ?? "").slice(0, 10);

      let newUsage = 1;
      if (lastResetDate === today) {
        newUsage = (currentRecord.proposal_usage_today ?? 0) + 1;
      }

      const record = await pb.collection("profiles").update(user.id, {
        proposal_usage_today: newUsage,
        proposal_reset_date: today,
      });
      setUser(mapProfile(record));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Update failed");
    }
  };

  const incrementTransactionUsage = async () => {
    if (!user) return;
    try {
      const currentRecord = await pb.collection("profiles").getOne(user.id, { requestKey: null });
      const today = new Date();
      const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
      const lastResetDate = currentRecord.transactions_reset_date || "";
      const lastResetMonth = lastResetDate.slice(0, 7);

      let newUsage = 1;
      if (lastResetMonth === currentMonth) {
        newUsage = (currentRecord.transactions_usage_today ?? 0) + 1;
      }

      const resetDate = `${currentMonth}-01`;
      const record = await pb.collection("profiles").update(user.id, {
        transactions_usage_today: newUsage,
        transactions_reset_date: resetDate,
      });
      setUser(mapProfile(record));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Update failed");
    }
  };

  const resetProposalUsage = async () => {
    if (!user) return;
    try {
      const record = await pb.collection("profiles").update(user.id, {
        proposal_usage_today: 0,
        proposal_reset_date: new Date().toISOString().split("T")[0],
      });
      setUser(mapProfile(record));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Reset failed");
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    try {
      const record = await pb.collection("profiles").getOne(user.id, { requestKey: null });
      setUser(mapProfile(record));
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  const completeOnboarding = async (data: {
    cpfCnpj?: string;
    tipoNegocio?: string;
    faturamentoMensal?: number;
    objetivo?: string;
  }) => {
    if (!user) return;
    try {
      const updateData: Record<string, unknown> = { onboarding_completed: true };
      if (data.cpfCnpj) updateData.cpf_cnpj = data.cpfCnpj;
      if (data.tipoNegocio) updateData.tipo_negocio = data.tipoNegocio;
      if (data.faturamentoMensal) updateData.faturamento_mensal = data.faturamentoMensal;
      if (data.objetivo) updateData.objetivo = data.objetivo;

      const record = await pb.collection("profiles").update(user.id, updateData);
      setUser(mapProfile(record));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Onboarding failed");
    }
  };

  const updateProfile = async (updates: { name?: string; phone?: string; company?: string; bio?: string; cnpj?: string; address?: string }) => {
    if (!user) return;
    try {
      // Only include fields that have actual values to prevent auto-cancellation
      const updateData: Record<string, string | undefined> = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.company !== undefined) updateData.company = updates.company;
      if (updates.bio !== undefined) updateData.bio = updates.bio;
      if (updates.cnpj !== undefined) updateData.cpf_cnpj = updates.cnpj;
      if (updates.address !== undefined) updateData.address = updates.address;

      const record = await pb.collection("profiles").update(user.id, updateData, {
        requestKey: null, // Disable auto-cancellation
      });
      setUser(mapProfile(record));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Profile update failed");
    }
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    if (!user) throw new Error("User not authenticated");

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      throw new Error("Apenas imagens JPG, PNG ou WebP são permitidas");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Arquivo não pode ser maior que 5MB");
    }

    try {
      const formData = new FormData();
      formData.append("avatar_url", file);

      const record = await pb.collection("profiles").update(user.id, formData, {
        requestKey: null, // Disable auto-cancellation
      });

      const avatarUrl = pb.files.getURL(record, record.avatar_url);

      setUser(mapProfile(record));
      return avatarUrl;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Avatar upload failed");
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      await pb.collection("profiles").authWithPassword(user.email, currentPassword);

      await pb.collection("profiles").update(user.id, {
        password: newPassword,
        passwordConfirm: newPassword,
        oldPassword: currentPassword,
      }, {
        requestKey: null, // Disable auto-cancellation
      });

      await logout();
    } catch (error) {
      if (error instanceof Error && error.message.includes("401")) {
        throw new Error("Senha atual está incorreta");
      }
      throw new Error(error instanceof Error ? error.message : "Password change failed");
    }
  };

  const updatePaymentReminders = async (enabled: boolean) => {
    if (!user) return;
    try {
      const record = await pb.collection("profiles").update(user.id, {
        receive_payment_reminders: enabled,
      }, {
        requestKey: null, // Disable auto-cancellation
      });
      setUser(mapProfile(record));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Update payment reminders failed");
    }
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
