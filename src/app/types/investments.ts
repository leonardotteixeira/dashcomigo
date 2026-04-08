/**
 * Investimentos - Types para recomendações de investimento
 */

export type RiskProfile = 'conservador' | 'moderado' | 'agressivo';
export type TimeHorizon = 'curto_prazo' | 'medio_prazo' | 'longo_prazo';
export type RiskLevel = 'minimo' | 'baixo' | 'medio' | 'alto';

/**
 * Perfil de investimento do usuário
 */
export interface InvestmentProfile {
  userid: string;

  // Respostas do questionário
  riskTolerance: RiskProfile;
  investmentExperience: 'iniciante' | 'intermediario' | 'avancado';
  timeHorizonYears: number;
  investmentGoal: 'seguranca' | 'renda' | 'crescimento';

  // Situação financeira
  monthlyIncome: number;
  monthlyExpenses: number;
  availableToInvest: number; // calculado

  // Meta
  investmentGoalValue?: number;
  investmentGoalDate?: Date;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastReviewAt: Date;
}

/**
 * Uma recomendação de investimento específica
 */
export interface InvestmentRecommendation {
  id: string;

  // Identidade
  name: string; // "Tesouro SELIC", "CDB", "Fundo Imobiliário"
  description: string;

  // Características
  bucket: TimeHorizon; // qual bucket recomendado
  minAmount: number; // valor mínimo
  expectedAnnualReturn: number; // 0.045 = 4.5%
  riskLevel: RiskLevel;

  // Educação
  howItWorks: string; // explicação simplificada
  pros: string[];
  cons: string[];

  // Action
  externalLink?: string; // link para investir (Tesouro, Nubank, etc)
  provider?: string; // "Tesouro Direto", "Nubank", "XP", etc

  // Metadata
  recommended: boolean;
  forProfiles: RiskProfile[];
}

/**
 * Alocação recomendada para 3 períodos
 */
export interface InvestmentAllocation {
  userid: string;

  // Informações base
  profileId: string;
  availableAmount: number;
  riskProfile: RiskProfile;

  // Buckets
  curto_prazo: {
    amount: number; // R$
    percentage: number; // %
    recommendations: InvestmentRecommendation[];
  };

  medio_prazo: {
    amount: number;
    percentage: number;
    recommendations: InvestmentRecommendation[];
  };

  longo_prazo: {
    amount: number;
    percentage: number;
    recommendations: InvestmentRecommendation[];
  };

  // Resumo
  projectedAnnualReturn: number; // ganho esperado/ano

  // Metadata
  createdAt: Date;
  validUntil: Date; // recomendação válida por 90 dias
}

/**
 * Cálculo de dinheiro disponível para investir
 */
export interface AvailableCalculation {
  currentBalance: number;

  // Deduções
  emergencyFund: number; // 2-3 meses de despesa
  minimumWorkingCapital: number; // 30 dias
  upcomingObligations: number; // contas a pagar próximas 30d

  // Resultado
  availableForInvestment: number;

  // Breakdown
  details: {
    label: string;
    amount: number;
  }[];
}

/**
 * Investimento rastreado do usuário
 */
export interface UserInvestment {
  id: string;
  userid: string;

  // Informações
  recommendationId: string;
  investmentName: string;
  amountInvested: number;
  dateInvested: Date;

  // Provedor
  provider: string;
  externalId?: string; // ID no broker/Tesouro

  // Performance (atualizado periodicamente)
  currentValue: number;
  currentReturn: number; // R$
  currentReturnPercentage: number; // %
  lastSyncedAt: Date;

  // Metadata
  linkedToAllocationId?: string;
  notes?: string;
  createdAt: Date;
}

/**
 * Context Type
 */
export interface InvestmentsContextType {
  // Estado
  profile: InvestmentProfile | null;
  allocation: InvestmentAllocation | null;
  recommendations: InvestmentRecommendation[];
  userInvestments: UserInvestment[];
  loading: boolean;
  error: string | null;

  // Operações
  createProfile(data: Omit<InvestmentProfile, 'userid' | 'createdAt' | 'updatedAt' | 'lastReviewAt'>): Promise<void>;
  updateProfile(data: Partial<InvestmentProfile>): Promise<void>;

  calculateAvailable(): Promise<AvailableCalculation>;
  getRecommendations(profile: InvestmentProfile): Promise<InvestmentAllocation>;

  // User Investments
  addUserInvestment(investment: Omit<UserInvestment, 'id' | 'createdAt' | 'lastSyncedAt'>): Promise<void>;
  updateUserInvestment(id: string, data: Partial<UserInvestment>): Promise<void>;

  // Refresh
  refresh(): Promise<void>;
}

/**
 * Configurações de alocação por perfil
 */
export const ALLOCATION_CONFIG = {
  conservador: {
    curto_prazo: 0.50,
    medio_prazo: 0.35,
    longo_prazo: 0.15,
  },
  moderado: {
    curto_prazo: 0.30,
    medio_prazo: 0.40,
    longo_prazo: 0.30,
  },
  agressivo: {
    curto_prazo: 0.20,
    medio_prazo: 0.30,
    longo_prazo: 0.50,
  },
} as const;

/**
 * Investimentos recomendados padrão
 */
export const DEFAULT_RECOMMENDATIONS: InvestmentRecommendation[] = [
  {
    id: 'tesouro-selic',
    name: 'Tesouro SELIC',
    description: 'Investimento mais seguro que existe. Acompanha a taxa SELIC.',
    bucket: 'curto_prazo',
    minAmount: 30,
    expectedAnnualReturn: 0.044,
    riskLevel: 'minimo',
    howItWorks: 'Você empresta dinheiro para o governo e ganha juros. Pode sacar a qualquer momento.',
    pros: ['Máxima segurança', 'Líquido (saca quando quiser)', 'Sem taxa'],
    cons: ['Rentabilidade menor', 'Sofre com queda da SELIC'],
    externalLink: 'https://www.tesourodireto.com.br',
    provider: 'Tesouro Direto',
    recommended: true,
    forProfiles: ['conservador', 'moderado', 'agressivo'],
  },
  {
    id: 'cdb',
    name: 'CDB (Certificado de Depósito Bancário)',
    description: 'Mais rentável que Tesouro SELIC, mas fica preso por um tempo.',
    bucket: 'medio_prazo',
    minAmount: 100,
    expectedAnnualReturn: 0.065,
    riskLevel: 'baixo',
    howItWorks: 'Você empresta dinheiro para um banco. Quanto maior o prazo, maior a rentabilidade.',
    pros: ['Mais rentável que Tesouro', 'Seguro (garantido pelo FGC)', 'Sem taxa'],
    cons: ['Fica preso por X dias', 'Se sacar antes, perde rentabilidade'],
    externalLink: 'https://www.nubank.com.br/invest',
    provider: 'Nubank / Bancos',
    recommended: true,
    forProfiles: ['moderado', 'agressivo'],
  },
  {
    id: 'fundo-imobiliario',
    name: 'Fundo Imobiliário (FII)',
    description: 'Investe em imóveis e paga rendimentos mensais.',
    bucket: 'longo_prazo',
    minAmount: 100,
    expectedAnnualReturn: 0.082,
    riskLevel: 'medio',
    howItWorks: 'Você compra cotas de um fundo que investe em imóveis. Recebe aluguel mensalmente.',
    pros: ['Rentabilidade interessante', 'Dividendos mensais', 'Acesso a imóveis'],
    cons: ['Mais volátil que renda fixa', 'Mercado pode cair', 'Imposto de renda'],
    externalLink: 'https://www.xpi.com.br',
    provider: 'XP / Brokers',
    recommended: true,
    forProfiles: ['moderado', 'agressivo'],
  },
  {
    id: 'tesouro-prefixado',
    name: 'Tesouro Prefixado',
    description: 'Você conhece exatamente quanto vai ganhar.',
    bucket: 'longo_prazo',
    minAmount: 30,
    expectedAnnualReturn: 0.125,
    riskLevel: 'baixo',
    howItWorks: 'Você compra um título com rentabilidade fixa. Quanto maior o prazo, maior a taxa.',
    pros: ['Rentabilidade conhecida', 'Seguro', 'Sem surpresas'],
    cons: ['Se vender antes, pode perder', 'Sofre com inflação'],
    externalLink: 'https://www.tesourodireto.com.br',
    provider: 'Tesouro Direto',
    recommended: false,
    forProfiles: ['moderado', 'agressivo'],
  },
  {
    id: 'poupanca',
    name: 'Poupança',
    description: 'Seguro, mas rendimento muito baixo.',
    bucket: 'curto_prazo',
    minAmount: 1,
    expectedAnnualReturn: 0.005,
    riskLevel: 'minimo',
    howItWorks: 'Seu dinheiro fica no banco e rende 0,5% ao ano.',
    pros: ['Super seguro', 'Acesso imediato', 'Sem complicações'],
    cons: ['Rentabilidade muito baixa', 'Perde para inflação', 'Não recomendado para investir'],
    provider: 'Seu Banco',
    recommended: false,
    forProfiles: ['conservador'],
  },
];

/**
 * Disclaimer padrão
 */
export const INVESTMENT_DISCLAIMER = `
⚠️ AVISO IMPORTANTE - Leia antes de investir

Esta ferramenta fornece RECOMENDAÇÕES EDUCATIVAS baseadas no seu perfil.
NÃO é aconselhamento financeiro profissional.

Importante saber:
• Rentabilidades passadas não garantem ganhos futuros
• Mercados são voláteis e podem sofrer perdas
• Todo investimento tem risco
• Consulte um assessor financeiro antes de grandes decisões
• A plataforma não é responsável por perdas resultantes dessas recomendações

Nós NÃO recomendamos: Derivativos, Forex, Criptomoedas especulativas,
Operações alavancadas ou qualquer investimento de risco extremo.

Ao usar esta ferramenta, você concorda que entende esses termos.
`;
