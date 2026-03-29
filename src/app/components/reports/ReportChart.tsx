import {
  AreaChart,
  BarChart,
  LineChart,
  PieChart,
  Pie,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatCurrency } from "../../utils/reportCalculations";

type ChartType = "area" | "bar" | "line" | "pie";

interface ReportChartProps {
  title?: string;
  data: any[];
  dataKey: string;
  dataKey2?: string; // Para comparações (ex: receita + despesa)
  type: ChartType;
  height?: number;
  xAxisKey?: string;
  yAxisFormatter?: (v: number) => string;
  colors?: {
    primary?: string;
    secondary?: string;
    grid?: string;
    axis?: string;
  };
}

const defaultColors = {
  primary: "#28A263",
  secondary: "#5B5FFF",
  grid: "#2A2A2A",
  axis: "#686F6F",
  tooltip: { background: "#1B1B1B", border: "1px solid rgba(255,255,255,0.1)" },
};

const PIE_COLORS = [
  "#28A263", // Verde
  "#5B5FFF", // Azul
  "#F74C4C", // Vermelho
  "#F4B23C", // Amarelo
  "#FF9500", // Laranja
  "#A78BFA", // Roxo
  "#00D9FF", // Ciano
  "#FF69B4", // Pink
];

export function ReportChart({
  title,
  data,
  dataKey,
  dataKey2,
  type,
  height = 300,
  xAxisKey = "name",
  yAxisFormatter = (v) => `R$${(v / 1000).toFixed(0)}k`,
  colors = {},
}: ReportChartProps) {
  const mergedColors = { ...defaultColors, ...colors };

  if (!data || data.length === 0) {
    return (
      <div
        className="bg-[#1B1B1B] border border-white/10 rounded-lg p-8 flex items-center justify-center"
        style={{ height }}
      >
        <p className="text-[#A1A1A1]">Sem dados disponíveis</p>
      </div>
    );
  }

  const commonProps = {
    data,
    margin: { top: 10, right: 30, left: 0, bottom: 0 },
  };

  const tooltipFormatter = (value: number) => formatCurrency(value);

  return (
    <div className="bg-[#1B1B1B] border border-white/10 rounded-lg p-6">
      {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}

      <ResponsiveContainer width="100%" height={height}>
        {type === "area" && (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="gradPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={mergedColors.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={mergedColors.primary} stopOpacity={0} />
              </linearGradient>
              {dataKey2 && (
                <linearGradient id="gradSecondary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={mergedColors.secondary} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={mergedColors.secondary} stopOpacity={0} />
                </linearGradient>
              )}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={mergedColors.grid} />
            <XAxis dataKey={xAxisKey} stroke={mergedColors.axis} />
            <YAxis tickFormatter={yAxisFormatter} stroke={mergedColors.axis} />
            <Tooltip
              contentStyle={{ ...mergedColors.tooltip, borderRadius: "8px" }}
              formatter={tooltipFormatter}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
            {dataKey2 && <Legend />}
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={mergedColors.primary}
              fillOpacity={1}
              fill="url(#gradPrimary)"
            />
            {dataKey2 && (
              <Area
                type="monotone"
                dataKey={dataKey2}
                stroke={mergedColors.secondary}
                fillOpacity={1}
                fill="url(#gradSecondary)"
              />
            )}
          </AreaChart>
        )}

        {type === "bar" && (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={mergedColors.grid} />
            <XAxis dataKey={xAxisKey} stroke={mergedColors.axis} />
            <YAxis tickFormatter={yAxisFormatter} stroke={mergedColors.axis} />
            <Tooltip
              contentStyle={{ ...mergedColors.tooltip, borderRadius: "8px" }}
              formatter={tooltipFormatter}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
            {dataKey2 && <Legend />}
            <Bar dataKey={dataKey} fill={mergedColors.primary} />
            {dataKey2 && <Bar dataKey={dataKey2} fill={mergedColors.secondary} />}
          </BarChart>
        )}

        {type === "line" && (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={mergedColors.grid} />
            <XAxis dataKey={xAxisKey} stroke={mergedColors.axis} />
            <YAxis tickFormatter={yAxisFormatter} stroke={mergedColors.axis} />
            <Tooltip
              contentStyle={{ ...mergedColors.tooltip, borderRadius: "8px" }}
              formatter={tooltipFormatter}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
            {dataKey2 && <Legend />}
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={mergedColors.primary}
              strokeWidth={2}
              dot={false}
            />
            {dataKey2 && (
              <Line
                type="monotone"
                dataKey={dataKey2}
                stroke={mergedColors.secondary}
                strokeWidth={2}
                dot={false}
              />
            )}
          </LineChart>
        )}

        {type === "pie" && (
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={xAxisKey}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ ...mergedColors.tooltip, borderRadius: "8px" }}
              formatter={tooltipFormatter}
            />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
