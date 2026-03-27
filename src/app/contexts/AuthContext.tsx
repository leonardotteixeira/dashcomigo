import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../../lib/supabase";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

export type UserPlan = "free" | "pro";

export interface User {
  id: string;
  name: string;
  email: string;
  plan: UserPlan;
  proposalUsageToday: number;
  onboardingCompleted: boolean;
  avatarUrl?: string;
  phone?: string;
  company?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  upgradeToPro: () => Promise<void>;
  incrementProposalUsage: () => Promise<void>;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapProfile(supabaseUser: SupabaseUser, profile: any): User {
  return {
    id: supabaseUser.id,
    name: profile?.name ?? supabaseUser.email?.split("@")[0] ?? "Usuário",
    email: supabaseUser.email ?? "",
    plan: profile?.plan ?? "free",
    proposalUsageToday: profile?.proposal_usage_today ?? 0,
    onboardingCompleted: profile?.onboarding_completed ?? false,
    avatarUrl: profile?.avatar_url,
    phone: profile?.phone,
    company: profile?.company,
    bio: profile?.bio,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(supabaseUser: SupabaseUser) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", supabaseUser.id)
      .single();

    setUser(mapProfile(supabaseUser, profile));
  }

  useEffect(() => {
    // Obtém sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Escuta mudanças de auth (evita refetch duplicado)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        if (newSession?.user) {
          // Só busca profile se o user mudou (evita double-fetch no login)
          setUser((currentUser) => {
            if (currentUser?.id === newSession.user.id) return currentUser;
            // Se é um user novo, busca profile em background
            fetchProfile(newSession.user);
            return currentUser;
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    // Já temos o user, busca o profile imediatamente sem esperar onAuthStateChange
    if (data.user) {
      await fetchProfile(data.user);
      setSession(data.session);
    }
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw new Error(error.message);
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw new Error(error.message);
    return !!data.session; // true = login imediato (sem confirmação de email)
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    setUser(null);
    setSession(null);
  };

  const upgradeToPro = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ plan: "pro" })
      .eq("id", user.id);
    if (error) throw new Error(error.message);
    setUser({ ...user, plan: "pro" });
  };

  const incrementProposalUsage = async () => {
    if (!user) return;
    const newUsage = user.proposalUsageToday + 1;
    const { error } = await supabase
      .from("profiles")
      .update({ proposal_usage_today: newUsage })
      .eq("id", user.id);
    if (error) throw new Error(error.message);
    setUser({ ...user, proposalUsageToday: newUsage });
  };

  const resetProposalUsage = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ proposal_usage_today: 0, proposal_reset_date: new Date().toISOString().split("T")[0] })
      .eq("id", user.id);
    if (error) throw new Error(error.message);
    setUser({ ...user, proposalUsageToday: 0 });
  };

  const refreshUser = async () => {
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (supabaseUser) await fetchProfile(supabaseUser);
  };

  const completeOnboarding = async (data: {
    cpfCnpj?: string;
    tipoNegocio?: string;
    faturamentoMensal?: number;
    objetivo?: string;
  }) => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        cpf_cnpj: data.cpfCnpj ?? null,
        tipo_negocio: data.tipoNegocio ?? null,
        faturamento_mensal: data.faturamentoMensal ?? null,
        objetivo: data.objetivo ?? null,
        onboarding_completed: true,
      })
      .eq("id", user.id);
    if (error) throw new Error(error.message);
    setUser({ ...user, onboardingCompleted: true });
  };

  const updateProfile = async (updates: { name?: string; phone?: string; company?: string; bio?: string }) => {
    if (!user) return;

    // Update name in auth if provided
    if (updates.name) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { name: updates.name }
      });
      if (updateError) throw new Error(updateError.message);
    }

    // Update profile in database
    const { error } = await supabase
      .from("profiles")
      .update({
        name: updates.name ?? undefined,
        phone: updates.phone ?? undefined,
        company: updates.company ?? undefined,
        bio: updates.bio ?? undefined,
      })
      .eq("id", user.id);
    if (error) throw new Error(error.message);

    setUser({
      ...user,
      name: updates.name ?? user.name,
      phone: updates.phone ?? user.phone,
      company: updates.company ?? user.company,
      bio: updates.bio ?? user.bio,
    });
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    if (!user) throw new Error("User not authenticated");

    // Validate file
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      throw new Error("Apenas imagens JPG, PNG ou WebP são permitidas");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Arquivo não pode ser maior que 5MB");
    }

    // Upload to storage
    const fileName = `${user.id}-${Date.now()}.${file.name.split(".").pop()}`;
    const { error: uploadError, data } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw new Error(uploadError.message);

    // Get public URL
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
    const avatarUrl = urlData.publicUrl;

    // Update profile with avatar URL
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", user.id);

    if (updateError) throw new Error(updateError.message);

    setUser({ ...user, avatarUrl });
    return avatarUrl;
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!session?.user?.email) throw new Error("User not authenticated");

    // Re-authenticate with current password
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: session.user.email,
      password: currentPassword,
    });
    if (authError) throw new Error("Senha atual está incorreta");

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (updateError) throw new Error(updateError.message);

    // Auto-logout after password change
    await logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        loading,
        login,
        loginWithGoogle,
        signup,
        logout,
        upgradeToPro,
        incrementProposalUsage,
        resetProposalUsage,
        refreshUser,
        completeOnboarding,
        updateProfile,
        uploadAvatar,
        changePassword,
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
