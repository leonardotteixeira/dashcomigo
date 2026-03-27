export type ObligationStatus = "pendente" | "completa" | "futura";

export interface Obligation {
  id: string;
  user_id: string;
  titulo: string;
  data: string; // YYYY-MM-DD
  valor?: number;
  status: ObligationStatus;
  categoria?: string;
  anotacoes?: string;
  created_at: string;
  updated_at: string;
  isFixture?: boolean; // DAS/DASN são fixtures (read-only)
}
