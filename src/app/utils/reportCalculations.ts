/**
 * Funções puras para cálculos de relatórios financeiros
 * Sem estado, sem side effects
 */

/**
 * Formata número para moeda brasileira
 */
export const formatCurrency = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
};

/**
 * Formata porcentagem com 1 casa decimal
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

/**
 * Calcula margem bruta: (receita - custo) / receita * 100
 */
export const calculateMargin = (receita: number, despesa: number): number => {
  if (receita === 0) return 0;
  return ((receita - despesa) / receita) * 100;
};

/**
 * Calcula crescimento percentual: (novo - antigo) / antigo * 100
 */
export const calculateGrowth = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Agrupa array de objetos por uma chave
 */
export const groupBy = <T extends Record<string, any>>(
  array: T[],
  key: keyof T
): Record<string, T[]> => {
  return array.reduce((acc, item) => {
    const groupKey = String(item[key]);
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, T[]>);
};

/**
 * Soma valores de um array de objetos
 */
export const sumByKey = <T extends Record<string, any>>(
  array: T[],
  key: keyof T
): number => {
  return array.reduce((sum, item) => {
    const value = Number(item[key]) || 0;
    return sum + value;
  }, 0);
};

/**
 * Conta ocorrências em array com filtro
 */
export const countByPredicate = <T>(
  array: T[],
  predicate: (item: T) => boolean
): number => {
  return array.filter(predicate).length;
};

/**
 * Gera array de datas do mês atual
 */
export const getCurrentMonthRange = (): [Date, Date] => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return [startOfMonth, endOfMonth];
};

/**
 * Gera array de datas do trimestre atual
 */
export const getCurrentQuarterRange = (): [Date, Date] => {
  const now = new Date();
  const quarter = Math.floor(now.getMonth() / 3);
  const startOfQuarter = new Date(now.getFullYear(), quarter * 3, 1);
  const endOfQuarter = new Date(now.getFullYear(), (quarter + 1) * 3, 0, 23, 59, 59);
  return [startOfQuarter, endOfQuarter];
};

/**
 * Gera array de datas do ano atual
 */
export const getCurrentYearRange = (): [Date, Date] => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
  return [startOfYear, endOfYear];
};

/**
 * Obtém últimas N datas de 24 horas cada
 */
export const getLast30DaysRange = (): [Date, Date] => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  return [startDate, endDate];
};

/**
 * Valida se uma data está dentro de um intervalo
 */
export const isDateInRange = (
  date: Date,
  startDate: Date,
  endDate: Date
): boolean => {
  return date >= startDate && date <= endDate;
};

/**
 * Formata data para exibição em português
 */
export const formatDatePT = (date: Date): string => {
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Formata mês/ano (ex: "Jan/2026")
 */
export const formatMonthYear = (date: Date): string => {
  return date.toLocaleString("pt-BR", {
    month: "short",
    year: "2-digit",
  });
};

/**
 * Calcula diferença em dias entre duas datas
 */
export const getDaysDifference = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Ordena array por uma chave em ordem decrescente
 */
export const sortByKeyDesc = <T extends Record<string, any>>(
  array: T[],
  key: keyof T
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = Number(a[key]) || 0;
    const bVal = Number(b[key]) || 0;
    return bVal - aVal;
  });
};

/**
 * Ordena array por uma chave em ordem crescente
 */
export const sortByKeyAsc = <T extends Record<string, any>>(
  array: T[],
  key: keyof T
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = Number(a[key]) || 0;
    const bVal = Number(b[key]) || 0;
    return aVal - bVal;
  });
};

/**
 * Retorna top N items de um array de objetos ordenados por uma chave
 */
export const topNByKey = <T extends Record<string, any>>(
  array: T[],
  key: keyof T,
  n: number
): T[] => {
  return sortByKeyDesc(array, key).slice(0, n);
};

/**
 * Calcula média de valores em um array
 */
export const calculateAverage = (array: number[]): number => {
  if (array.length === 0) return 0;
  return array.reduce((sum, val) => sum + val, 0) / array.length;
};

/**
 * Cria objeto para chart com formatação padrão
 */
export const buildChartData = (
  items: Array<{ label: string; value: number }>
): Array<{ name: string; value: number; formatted: string }> => {
  return items.map((item) => ({
    name: item.label,
    value: item.value,
    formatted: formatCurrency(item.value),
  }));
};

/**
 * Cria objeto para comparação de período
 */
export const buildComparisonData = (
  label: string,
  current: number,
  previous: number
): {
  label: string;
  current: number;
  previous: number;
  growth: number;
  growthFormatted: string;
} => {
  const growth = calculateGrowth(current, previous);
  return {
    label,
    current,
    previous,
    growth,
    growthFormatted: formatPercentage(growth),
  };
};

/**
 * Determina cor baseada em valor (positivo/negativo)
 */
export const getColorByValue = (
  value: number,
  positiveColor: string = "#28A263",
  negativeColor: string = "#F74C4C"
): string => {
  return value >= 0 ? positiveColor : negativeColor;
};

/**
 * Ícone de tendência (↑/↓)
 */
export const getTrendIcon = (value: number): string => {
  if (value > 0) return "↑";
  if (value < 0) return "↓";
  return "→";
};

/**
 * Status de saúde baseado em margem
 */
export const getMarginHealthStatus = (
  margin: number
): "critica" | "baixa" | "normal" | "saudavel" => {
  if (margin < 0) return "critica";
  if (margin < 10) return "baixa";
  if (margin < 30) return "normal";
  return "saudavel";
};

/**
 * Mensagem de saúde de margem
 */
export const getMarginHealthMessage = (
  margin: number
): string => {
  const status = getMarginHealthStatus(margin);
  const messages = {
    critica: "Margem crítica! Você está tendo prejuízo.",
    baixa: "Margem baixa. Considere revisar seus preços.",
    normal: "Margem aceitável. Continue acompanhando.",
    saudavel: "Margem saudável! Parabéns!",
  };
  return messages[status];
};

// ─────────────────────────────────────────────────────────────────────────────
// INSIGHTS ENGINE
// ─────────────────────────────────────────────────────────────────────────────

export interface Insight {
  type: "warning" | "success" | "info";
  message: string;
}

export function generateInsights(params: {
  receitas: number;
  despesas: number;
  fluxo: number;
  margem: number;
  prevReceitas: number;
  prevDespesas: number;
  monthlyFlowData: Array<{ receitas: number; despesas: number; fluxo: number; name: string }>;
  overduePayables: number;
}): Insight[] {
  const { receitas, despesas, fluxo, margem, prevReceitas, prevDespesas, monthlyFlowData, overduePayables } = params;
  const insights: Insight[] = [];

  // Sem receitas
  if (receitas === 0) {
    insights.push({ type: "info", message: "Nenhuma receita registrada neste período. Registre suas entradas para uma análise completa." });
    return insights;
  }

  // Resultado do período
  if (fluxo < 0) {
    insights.push({ type: "warning", message: `Prejuízo de ${formatCurrency(Math.abs(fluxo))} neste período — despesas superam as receitas.` });
  } else if (margem >= 30) {
    insights.push({ type: "success", message: `Ótima margem de ${formatPercentage(margem)} — seu negócio está saudável e rentável.` });
  } else if (margem >= 10) {
    insights.push({ type: "info", message: `Margem de ${formatPercentage(margem)} — dentro do aceitável, mas há espaço para crescer.` });
  } else {
    insights.push({ type: "warning", message: `Margem de apenas ${formatPercentage(margem)} — muito baixa. Revise sua precificação.` });
  }

  // Comparação com período anterior
  if (prevReceitas > 0) {
    const receitaGrowth = calculateGrowth(receitas, prevReceitas);
    const despesaGrowth = calculateGrowth(despesas, prevDespesas);

    if (receitaGrowth <= -15) {
      insights.push({ type: "warning", message: `Receitas caíram ${formatPercentage(Math.abs(receitaGrowth))} em relação ao período anterior.` });
    } else if (receitaGrowth >= 15) {
      insights.push({ type: "success", message: `Receitas cresceram ${formatPercentage(receitaGrowth)} em relação ao período anterior.` });
    }

    if (despesaGrowth >= 20) {
      insights.push({ type: "warning", message: `Despesas aumentaram ${formatPercentage(despesaGrowth)} em relação ao período anterior — verifique o que subiu.` });
    }
  }

  // Peso das despesas
  if (receitas > 0 && despesas / receitas >= 0.85 && fluxo >= 0) {
    insights.push({ type: "warning", message: `Despesas equivalem a ${formatPercentage((despesas / receitas) * 100)} das receitas — margem de segurança muito pequena.` });
  }

  // Contas vencidas
  if (overduePayables > 0) {
    insights.push({ type: "warning", message: `${overduePayables} conta${overduePayables > 1 ? "s" : ""} a pagar vencida${overduePayables > 1 ? "s" : ""} — quite para evitar juros e proteger seu crédito.` });
  }

  // Tendência dos últimos 3 meses
  const last3 = monthlyFlowData.slice(-3);
  if (last3.length === 3) {
    const declining = last3[0].fluxo > last3[1].fluxo && last3[1].fluxo > last3[2].fluxo;
    const improving = last3[0].fluxo < last3[1].fluxo && last3[1].fluxo < last3[2].fluxo;
    if (declining && last3[2].fluxo < 0) {
      insights.push({ type: "warning", message: "Fluxo de caixa em queda nos últimos 3 meses — tendência preocupante." });
    } else if (improving) {
      insights.push({ type: "success", message: "Fluxo de caixa em crescimento nos últimos 3 meses — boa trajetória!" });
    }
  }

  return insights.slice(0, 4); // máximo 4 insights
}

// ─────────────────────────────────────────────────────────────────────────────
// RECOMMENDATIONS ENGINE
// ─────────────────────────────────────────────────────────────────────────────

export interface Recommendation {
  priority: "alta" | "media" | "baixa";
  action: string;
}

export function generateRecommendations(params: {
  receitas: number;
  despesas: number;
  fluxo: number;
  margem: number;
  expenseByCategory: Array<{ name: string; value: number }>;
  overduePayables: number;
  totalPayablesPending: number;
}): Recommendation[] {
  const { receitas, despesas, fluxo, margem, expenseByCategory, overduePayables, totalPayablesPending } = params;
  const recs: Recommendation[] = [];

  if (receitas === 0) {
    recs.push({ priority: "alta", action: "Registre suas receitas no Fluxo de Caixa para ativar a análise completa." });
    return recs;
  }

  // Críticas
  if (fluxo < 0) {
    recs.push({ priority: "alta", action: "Reduza despesas não essenciais ou aumente seus preços — o negócio está no vermelho." });
  }
  if (overduePayables > 0) {
    recs.push({ priority: "alta", action: `Quite as ${overduePayables} conta${overduePayables > 1 ? "s" : ""} vencida${overduePayables > 1 ? "s" : ""} para evitar multas e proteger seu score de crédito.` });
  }
  if (margem < 10 && fluxo >= 0) {
    recs.push({ priority: "alta", action: "Margem abaixo de 10% — revise a precificação dos seus serviços ou produtos." });
  }

  // Médias
  if (totalPayablesPending > receitas * 0.5) {
    recs.push({ priority: "media", action: `Contas a pagar pendentes representam ${formatPercentage((totalPayablesPending / receitas) * 100)} das suas receitas — planeje o pagamento.` });
  }
  if (expenseByCategory.length > 0) {
    const topCategory = expenseByCategory[0];
    if (topCategory.value / despesas >= 0.5) {
      recs.push({ priority: "media", action: `"${topCategory.name}" representa ${formatPercentage((topCategory.value / despesas) * 100)} das despesas — avalie se é possível reduzir esse custo.` });
    }
  }

  // Baixas
  if (margem >= 20) {
    recs.push({ priority: "baixa", action: "Boa margem! Considere reinvestir parte do lucro em divulgação ou ferramentas para crescer." });
  }
  if (receitas > 0 && expenseByCategory.length === 0) {
    recs.push({ priority: "baixa", action: "Categorize suas despesas no Fluxo de Caixa para identificar onde o dinheiro vai." });
  }

  return recs.slice(0, 4);
}

// ─────────────────────────────────────────────────────────────────────────────
// ADVANCED INDICATORS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Índice de cobertura: quanto de contas a receber cobre as contas a pagar.
 * Acima de 1 = saudável (você tem mais a receber do que a pagar).
 */
export function calcularLiquidez(receivablesPending: number, payablesPending: number): number {
  if (payablesPending === 0) return receivablesPending > 0 ? 99 : 0;
  return receivablesPending / payablesPending;
}

/**
 * Ponto de equilíbrio: receita mínima necessária para cobrir todas as despesas.
 * Com margem de contribuição positiva, é o valor que zera o resultado.
 */
export function calcularPontoEquilibrio(despesasTotais: number, margemPct: number): number {
  if (margemPct <= 0 || margemPct >= 100) return despesasTotais;
  return despesasTotais / (margemPct / 100);
}

/**
 * Estimativa simplificada de valor de negócio: média mensal de lucro × 12.
 * Múltiplo conservador de 1 ano para negócios de serviço/MEI.
 */
export function estimarValorNegocio(monthlyFlowData: Array<{ fluxo: number }>): number {
  const profitable = monthlyFlowData.filter((m) => m.fluxo > 0);
  if (profitable.length === 0) return 0;
  const avgMonthlyProfit = profitable.reduce((sum, m) => sum + m.fluxo, 0) / profitable.length;
  return avgMonthlyProfit * 12;
}

/**
 * Projeção de fluxo para os próximos 30 dias baseada na média dos últimos 3 meses.
 */
export function projetarProximos30dias(monthlyFlowData: Array<{ receitas: number; despesas: number }>): {
  receitas: number;
  despesas: number;
  fluxo: number;
} {
  const recent = monthlyFlowData.slice(-3);
  if (recent.length === 0) return { receitas: 0, despesas: 0, fluxo: 0 };
  const avgReceitas = recent.reduce((s, m) => s + m.receitas, 0) / recent.length;
  const avgDespesas = recent.reduce((s, m) => s + m.despesas, 0) / recent.length;
  return {
    receitas: avgReceitas,
    despesas: avgDespesas,
    fluxo: avgReceitas - avgDespesas,
  };
}
