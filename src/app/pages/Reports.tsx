import {
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Lock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useState } from "react";
import FeatureLock from "../components/FeatureLock";
import UpgradeCard from "../components/UpgradeCard";
import SocialProof from "../components/SocialProof";
import PaywallModal from "../components/PaywallModal";

const monthlyData = [
  { month: "Nov", receitas: 7800, despesas: 5900, lucro: 1900 },
  { month: "Dez", receitas: 8200, despesas: 6400, lucro: 1800 },
  { month: "Jan", receitas: 8500, despesas: 6200, lucro: 2300 },
  { month: "Fev", receitas: 9200, despesas: 7100, lucro: 2100 },
  { month: "Mar", receitas: 11000, despesas: 8320, lucro: 2680 },
  { month: "Abr", receitas: 12450, despesas: 8320, lucro: 4130 },
];

const categoryData = [
  { name: "Serviços", value: 65, color: "#00A868" },
  { name: "Produtos", value: 25, color: "#0066FF" },
  { name: "Consultoria", value: 10, color: "#8B5CF6" },
];

const expenseData = [
  { name: "Infraestrutura", value: 40, color: "#EF4444" },
  { name: "Operacional", value: 30, color: "#F59E0B" },
  { name: "Tecnologia", value: 20, color: "#8B5CF6" },
  { name: "Outros", value: 10, color: "#6B7280" },
];

export function Reports() {
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallTrigger, setPaywallTrigger] = useState<"export_blocked" | "feature_locked">("export_blocked");

  // Simula que exportações estão bloqueadas
  const canExport = false;
  const exportLimit = 5;

  const handleExport = (type: string) => {
    if (!canExport) {
      setPaywallTrigger("export_blocked");
      setShowPaywall(true);
    } else {
      // Lógica de exportação real
      console.log(`Exportando ${type}...`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-foreground mb-1">Relatórios Financeiros</h1>
          <p className="text-muted-foreground">
            Análise detalhada do desempenho do seu negócio
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => handleExport("PDF")}
            className={`flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg transition-all font-medium ${
              canExport 
                ? "hover:bg-secondary text-foreground" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed relative"
            }`}
          >
            {!canExport && <Lock className="w-4 h-4 absolute -top-1 -right-1 text-red-500" />}
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
          <button 
            onClick={() => handleExport("Excel")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all font-medium relative ${
              canExport
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {!canExport && <Lock className="w-4 h-4 absolute -top-1 -right-1 text-red-500" />}
            <Download className="w-4 h-4" />
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Alerta de exportações esgotadas */}
      {!canExport && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-[#0E3B2E] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-[#0E3B2E] mb-1">
                Exportações do plano gratuito
              </h4>
              <p className="text-sm text-[#0E3B2E]/70 mb-3">
                Você atingiu o limite de {exportLimit} exportações mensais. Com o plano PRO, exporte sem limites.
              </p>
              <button 
                onClick={() => {
                  setPaywallTrigger("export_blocked");
                  setShowPaywall(true);
                }}
                className="bg-gradient-to-r from-[#0E3B2E] to-[#0066FF] text-white px-4 py-2 rounded-lg hover:from-[#002a5d] hover:to-[#0056EF] transition-all font-semibold text-sm"
              >
                Ver Plano PRO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Receita Total</span>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <p className="font-bold text-foreground">R$ 57.150,00</p>
          <p className="text-xs text-success mt-1">+18,5% vs período anterior</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Despesa Total</span>
            <TrendingDown className="w-4 h-4 text-expense" />
          </div>
          <p className="font-bold text-foreground">R$ 42.240,00</p>
          <p className="text-xs text-muted-foreground mt-1">+7,2% vs período anterior</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Lucro Líquido</span>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <p className="font-bold text-foreground">R$ 14.910,00</p>
          <p className="text-xs text-success mt-1">+35,2% vs período anterior</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Margem Lucro</span>
            <FileText className="w-4 h-4 text-accent" />
          </div>
          <p className="font-bold text-foreground">26,1%</p>
          <p className="text-xs text-success mt-1">+3,8 pontos percentuais</p>
        </div>
      </div>

      {/* Profit Trend */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4">
          Evolução de Lucro (últimos 6 meses)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="lucro"
              stroke="#00A868"
              strokeWidth={3}
              name="Lucro"
              dot={{ fill: "#00A868", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Income by Category */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4">
            Receitas por Categoria
          </h3>
          <div className="flex items-center justify-between">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-foreground">{item.name}</span>
                  <span className="text-sm font-semibold text-foreground ml-auto">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expenses by Category */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4">
            Despesas por Categoria
          </h3>
          <div className="flex items-center justify-between">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={expenseData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.value}%`}
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {expenseData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-foreground">{item.name}</span>
                  <span className="text-sm font-semibold text-foreground ml-auto">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Comparison */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4">
          Comparativo Mensal (Receitas vs Despesas)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="receitas" fill="#00A868" radius={[8, 8, 0, 0]} name="Receitas" />
            <Bar dataKey="despesas" fill="#EF4444" radius={[8, 8, 0, 0]} name="Despesas" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Locked Features - PRO Upsell */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FeatureLock
          feature="Análise Preditiva"
          description="Previsão de receitas e despesas para os próximos 3 meses com IA"
          size="md"
        />
        <FeatureLock
          feature="Comparativo de Períodos"
          description="Compare qualquer período personalizado e identifique tendências"
          size="md"
        />
      </div>

      {/* Social Proof */}
      <SocialProof />

      {/* Upgrade CTA */}
      <UpgradeCard
        variant="full"
        context="Desbloqueie relatórios avançados, exportação automática e insights preditivos para tomar melhores decisões financeiras"
      />

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        trigger={paywallTrigger}
      />
    </div>
  );
}