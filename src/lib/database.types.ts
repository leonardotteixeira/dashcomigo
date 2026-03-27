export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          plan: "free" | "pro";
          proposal_usage_today: number;
          proposal_reset_date: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          avatar_url: string | null;
          phone: string | null;
          company: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          plan?: "free" | "pro";
          proposal_usage_today?: number;
          proposal_reset_date?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          company?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          plan?: "free" | "pro";
          proposal_usage_today?: number;
          proposal_reset_date?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          company?: string | null;
          bio?: string | null;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          valor: number;
          tipo: "entrada" | "saida";
          categoria: string;
          data: string;
          descricao: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          valor: number;
          tipo: "entrada" | "saida";
          categoria: string;
          data: string;
          descricao?: string | null;
          created_at?: string;
        };
        Update: {
          valor?: number;
          tipo?: "entrada" | "saida";
          categoria?: string;
          data?: string;
          descricao?: string | null;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
