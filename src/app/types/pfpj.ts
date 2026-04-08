/**
 * PF vs PJ (Pessoa Física vs Jurídica) Types
 * Tipos para separação de transações pessoais vs empresariais
 */

export type PFPJType = 'pf' | 'pj' | 'misto';
export type PFPJSuggestionSource = 'user' | 'ai' | 'rule';

/**
 * Extensão da interface Transaction com campos PF/PJ
 */
export interface TransactionWithPFPJ {
  id: string;
  user_id: string;
  valor: number;
  tipo: 'entrada' | 'saida';
  categoria: string;
  data: string; // YYYY-MM-DD
  descricao?: string;
  created?: string;

  // PF/PJ Fields
  pf_pj_type: PFPJType; // 'pf', 'pj', ou 'misto'
  pf_pj_confidence?: number; // 0-100: confiança da sugestão automática
  pf_pj_suggested_by?: PFPJSuggestionSource; // quem sugeriu
  pf_pj_split_amounts?: {
    pf: number;
    pj: number;
  }; // se 'misto', quanto é de cada
}

/**
 * Resumo financeiro separado por PF/PJ
 */
export interface PFPJSummary {
  period: string; // "janeiro/2026" ou "últimos 30 dias"

  // Pessoa Física
  pf: {
    totalIncoming: number; // entradas pessoais
    totalOutgoing: number; // despesas pessoais
    balance: number; // saldo pessoal
    transactionCount: number; // qtd de transações
    categories: Record<string, number>; // por categoria
  };

  // Pessoa Jurídica (Empresa)
  pj: {
    totalIncoming: number; // receitas da empresa
    totalOutgoing: number; // despesas da empresa
    balance: number; // caixa da empresa
    profit: number; // receita - despesa
    profitMargin: number; // % de lucro
    transactionCount: number;
    categories: Record<string, number>;
  };

  // Transações Mistas
  misto?: {
    count: number;
    totalAmount: number;
  };

  // Resumo
  totalBalance: number; // PF + PJ
  lastUpdated: Date;
}

/**
 * Sugestão automática de categorização
 */
export interface PFPJPrediction {
  type: PFPJType;
  confidence: number; // 0-100
  reasoning: string; // "Internet é negócio" ou "Salário é pessoal"
}

/**
 * Regra customizada do usuário para categorização automática
 */
export interface PFPJRule {
  id: string;
  userid: string;

  // Critério
  name: string; // "Internet = PJ"
  criteria: {
    field: 'description' | 'category' | 'amount';
    operator: 'contains' | 'equals' | 'startsWith' | 'gt' | 'lt';
    value: string | number;
  }[];

  // Ação
  classification: PFPJType;
  confidence: number; // quanto boost ao score

  // Meta
  enabled: boolean;
  createdAt: Date;
  appliedCount: number; // quantas vezes foi aplicada
}

/**
 * Context Type para PFPJContext
 */
export interface PFPJContextType {
  // Estado
  transactions: TransactionWithPFPJ[];
  loading: boolean;
  error: string | null;
  summary: PFPJSummary | null;

  // Operações
  getTransactionsByType(type: PFPJType): TransactionWithPFPJ[];
  updateTransactionType(id: string, type: PFPJType): Promise<void>;
  calculateSummary(): PFPJSummary | null;

  // Automação
  predictType(transaction: any): PFPJPrediction;
  getTransactionsNeedingReview(minConfidence: number): TransactionWithPFPJ[];

  // Regras
  addRule(rule: Omit<PFPJRule, 'id' | 'createdAt' | 'appliedCount'>): Promise<void>;
  removeRule(ruleId: string): Promise<void>;
  getRules(): PFPJRule[];

  // Refresh
  refresh(): Promise<void>;
}

/**
 * Heurísticas pré-definidas para sugestão automática
 */
export const HEURISTICS = {
  // Palavras que indicam PF
  pfKeywords: [
    'salário',
    'pix pessoal',
    'retirada',
    'pessoal',
    'familia',
    'meu',
    'débito pessoal',
    'compra pessoal',
  ],

  // Palavras que indicam PJ
  pjKeywords: [
    'fornecedor',
    'supplier',
    'nfe',
    'nota fiscal',
    'empresa',
    'profissional',
    'serviço',
    'negócio',
    'cliente',
    'venda',
  ],

  // Categorias que são sempre PF
  pfCategories: [
    'Retirada do proprietário',
    'Despesas diversas pessoais',
  ],

  // Categorias que são sempre PJ
  pjCategories: [
    'Fornecedores/Mercadorias',
    'Custos de produção',
    'Frete/Entregas',
    'Anúncios/Marketing',
    'Taxas/Tarifas',
    'Impostos',
  ],
};

/**
 * Configurações de limites e cálculos
 */
export const PFPJ_CONFIG = {
  // Fundo de emergência (em meses de despesa)
  EMERGENCY_FUND_MONTHS: {
    baixo_risco: 3,
    medio_risco: 2,
    alto_risco: 1,
  },

  // Capital de giro mínimo (em dias)
  MIN_WORKING_CAPITAL_DAYS: 30,

  // Confiança mínima para auto-aceitar
  AUTO_ACCEPT_CONFIDENCE: 85,

  // Confiança mínima para usar em cálculos
  MIN_CONFIDENCE_FOR_CALCULATIONS: 70,
};
