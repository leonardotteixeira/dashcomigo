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
