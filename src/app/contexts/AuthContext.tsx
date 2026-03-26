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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapProfile(supabaseUser: SupabaseUser, profile: any): User {
  return {
    id: supabaseUser.id,
    name: profile?.name ?? supabaseUser.email?.split("@")[0] ?? "Usuário",
    email: supabaseUser.email ?? "",
    plan: profile?.plan ?? "free",
    proposalUsageToday: profile?.proposal_usage_today ?? 0,
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

    // Escuta mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          await fetchProfile(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
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
