import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { useCashFlow } from "./CashFlowContext";
import {
  InvestmentProfile,
  InvestmentRecommendation,
  InvestmentAllocation,
  AvailableCalculation,
  ALLOCATION_CONFIG,
  DEFAULT_RECOMMENDATIONS,
  TimeHorizon,
  RiskProfile,
} from "../types/investments";

interface InvestmentsContextType {
  profile: InvestmentProfile | null;
  allocation: InvestmentAllocation | null;
  recommendations: InvestmentRecommendation[];
  available: AvailableCalculation | null;
  loading: boolean;
  error: string | null;

  calculateAvailable(): AvailableCalculation;
  getRecommendations(profile: InvestmentProfile): InvestmentAllocation;
  detectRiskProfile(
    experience: string,
    tolerance: string,
    timeHorizon: number
  ): RiskProfile;
}

const InvestmentsContext = createContext<InvestmentsContextType | undefined>(undefined);

export function InvestmentsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { transactions, summary } = useCashFlow();
  const [profile, setProfile] = useState<InvestmentProfile | null>(null);
  const [allocation, setAllocation] = useState<InvestmentAllocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calcula fundo de emergência baseado em despesas mensais
  const getEmergencyFundMonths = () => 3;
  const getWorkingCapitalDays = () => 30;

  // Calcula quanto está disponível para investimento
  const calculateAvailable = useCallback((): AvailableCalculation => {
    const currentBalance = summary.saldoAtual;

    // Despesa mensal média
    const monthlyExpense =
      transactions.filter((t) => t.tipo === "saida").length > 0
        ? summary.totalSaidas / 12
        : 500; // default se não houver despesas

    // Fundo de emergência: 2-3 meses de despesa
    const emergencyFund = monthlyExpense * getEmergencyFundMonths();

    // Capital de giro mínimo: 30 dias de despesa
    const minimumWorkingCapital = (monthlyExpense / 30) * getWorkingCapitalDays();

    // Obrigações próximas (próximos 30 dias) - aproximação
    const upcomingObligations = 0; // Implementação futura com calendário de pagamentos

    // Disponível para investimento
    const availableForInvestment = Math.max(
      0,
      currentBalance - emergencyFund - minimumWorkingCapital - upcomingObligations
    );

    return {
      currentBalance,
      emergencyFund,
      minimumWorkingCapital,
      upcomingObligations,
      availableForInvestment,
      details: [
        {
          label: "Saldo Atual",
          amount: currentBalance,
        },
        {
          label: "Fundo Emergência (-)",
          amount: -emergencyFund,
        },
        {
          label: "Capital Giro (-)",
          amount: -minimumWorkingCapital,
        },
        {
          label: "Obrigações 30d (-)",
          amount: -upcomingObligations,
        },
        {
          label: "Disponível para Investir",
          amount: availableForInvestment,
        },
      ],
    };
  }, [summary, transactions]);

  // Detecta perfil de risco baseado em respostas
  const detectRiskProfile = useCallback(
    (experience: string, tolerance: string, timeHorizonYears: number): RiskProfile => {
      let score = 0;

      // Experiência (0-3 pontos)
      if (experience === "avancado") score += 3;
      else if (experience === "intermediario") score += 2;
      else score += 1;

      // Tolerância ao risco (0-3 pontos)
      if (tolerance === "agressivo") score += 3;
      else if (tolerance === "moderado") score += 2;
      else score += 1;

      // Horizonte de tempo (0-3 pontos)
      if (timeHorizonYears >= 10) score += 3;
      else if (timeHorizonYears >= 5) score += 2;
      else score += 1;

      // Total: 3-9 pontos
      if (score <= 3) return "conservador";
      if (score <= 6) return "moderado";
      return "agressivo";
    },
    []
  );

  // Gera alocação de investimentos baseada no perfil e disponível
  const getRecommendations = useCallback(
    (profile: InvestmentProfile): InvestmentAllocation => {
      const available = calculateAvailable();
      const config = ALLOCATION_CONFIG[profile.riskTolerance];

      // Força conservador se saldo muito baixo
      let effectiveRiskProfile = profile.riskTolerance;
      if (available.availableForInvestment < 5000) {
        effectiveRiskProfile = "conservador";
      }

      const effectiveConfig = ALLOCATION_CONFIG[effectiveRiskProfile];

      // Aloca os 3 buckets
      const curtoAmount = available.availableForInvestment * effectiveConfig.curto_prazo;
      const medioAmount = available.availableForInvestment * effectiveConfig.medio_prazo;
      const longoAmount = available.availableForInvestment * effectiveConfig.longo_prazo;

      // Filtra recomendações por bucket
      const getCurtoPrazoRecommendations = (): InvestmentRecommendation[] =>
        DEFAULT_RECOMMENDATIONS.filter((r) => r.bucket === "curto_prazo");

      const getMedioPrazoRecommendations = (): InvestmentRecommendation[] =>
        DEFAULT_RECOMMENDATIONS.filter((r) => r.bucket === "medio_prazo");

      const getLongoPrazoRecommendations = (): InvestmentRecommendation[] =>
        DEFAULT_RECOMMENDATIONS.filter((r) => r.bucket === "longo_prazo");

      // Calcula retorno esperado
      const curtoReturn =
        getCurtoPrazoRecommendations().reduce((sum, r) => sum + r.expectedAnnualReturn, 0) /
        getCurtoPrazoRecommendations().length;
      const medioReturn =
        getMedioPrazoRecommendations().reduce((sum, r) => sum + r.expectedAnnualReturn, 0) /
        getMedioPrazoRecommendations().length;
      const longoReturn =
        getLongoPrazoRecommendations().reduce((sum, r) => sum + r.expectedAnnualReturn, 0) /
        getLongoPrazoRecommendations().length;

      const projectedAnnualReturn =
        curtoAmount * curtoReturn +
        medioAmount * medioReturn +
        longoAmount * longoReturn;

      return {
        userid: profile.userid,
        profileId: profile.userid, // Simplificado
        availableAmount: available.availableForInvestment,
        riskProfile: effectiveRiskProfile,

        curto_prazo: {
          amount: curtoAmount,
          percentage: effectiveConfig.curto_prazo * 100,
          recommendations: getCurtoPrazoRecommendations(),
        },

        medio_prazo: {
          amount: medioAmount,
          percentage: effectiveConfig.medio_prazo * 100,
          recommendations: getMedioPrazoRecommendations(),
        },

        longo_prazo: {
          amount: longoAmount,
          percentage: effectiveConfig.longo_prazo * 100,
          recommendations: getLongoPrazoRecommendations(),
        },

        projectedAnnualReturn,
        createdAt: new Date(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 dias
      };
    },
    [calculateAvailable]
  );

  const available = calculateAvailable();

  return (
    <InvestmentsContext.Provider
      value={{
        profile,
        allocation,
        recommendations: DEFAULT_RECOMMENDATIONS,
        available,
        loading,
        error,
        calculateAvailable,
        getRecommendations,
        detectRiskProfile,
      }}
    >
      {children}
    </InvestmentsContext.Provider>
  );
}

export function useInvestments() {
  const context = useContext(InvestmentsContext);
  if (!context) {
    throw new Error("useInvestments must be used within InvestmentsProvider");
  }
  return context;
}
