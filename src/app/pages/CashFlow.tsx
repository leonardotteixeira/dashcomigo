import {
  Filter,
  Download,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Search,
  User,
  Building2,
  Lock,
  Crown,
} from "lucide-react";
import { useState } from "react";
import { PremiumPageLayout } from "../components/PremiumPageLayout";
import { colors } from "../../utils/designTokens";

const transactions = [
  {
    id: 1,
    date: "2026-04-08",
    description: "Pagamento Cliente A - Projeto Website",
    category: "Serviços",
    type: "income",
    amount: 3500,
    pfpj: "PJ",
    status: "paid",
  },
  {
    id: 2,
    date: "2026-04-08",
    description: "Fornecedor XYZ - Material de Escritório",
    category: "Despesas Operacionais",
    type: "expense",
    amount: 1200,
    pfpj: "PJ",
    status: "paid",
  },
  {
    id: 3,
    date: "2026-04-07",
    description: "Freelance - Design de Logo",
    category: "Serviços",
    type: "income",
    amount: 850,
    pfpj: "PF",
    status: "paid",
  },
  {
    id: 4,
    date: "2026-04-07",
    description: "Aluguel Escritório",
    category: "Infraestrutura",
    type: "expense",
    amount: 2500,
    pfpj: "PJ",
    status: "paid",
  },
  {
    id: 5,
    date: "2026-04-06",
    description: "Consultoria MEI - Cliente B",
    category: "Serviços",
    type: "income",
    amount: 1200,
    pfpj: "PF",
    status: "paid",
  },
  {
    id: 6,
    date: "2026-04-06",
    description: "Internet e Telefonia",
    category: "Despesas Operacionais",
    type: "expense",
    amount: 180,
    pfpj: "PJ",
    status: "paid",
  },
  {
    id: 7,
    date: "2026-04-05",
    description: "Desenvolvimento App Mobile",
    category: "Serviços",
    type: "income",
    amount: 5000,
    pfpj: "PJ",
    status: "paid",
  },
  {
    id: 8,
    date: "2026-04-05",
    description: "Software e Licenças",
    category: "Tecnologia",
    type: "expense",
    amount: 450,
    pfpj: "PJ",
    status: "paid",
  },
];

export default function CashFlow() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredTransactions = transactions.filter((t) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "income" && t.type === "income") ||
      (filter === "expense" && t.type === "expense") ||
      (filter === "PF" && t.pfpj === "PF") ||
      (filter === "PJ" && t.pfpj === "PJ");

    const matchesSearch =
      search === "" ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const transactionLimit = 50;
  const currentTransactionCount = 42;
  const limitPercentage = (currentTransactionCount / transactionLimit) * 100;

  return (
    <PremiumPageLayout
      title="Fluxo de Caixa"
      description="Gerencie todas as entradas e saídas do seu negócio"
      actions={
        <button
          style={{ backgroundColor: colors.primary }}
          className="flex items-center gap-2 text-white px-4 py-2.5 rounded-lg hover:opacity-90 transition-all font-medium"
        >
          <Plus className="w-4 h-4" />
          Nova Transação
        </button>
      }
    >
      <div className="space-y-8">
        {/* Transaction Limit Warning */}
        {limitPercentage > 70 && (
          <div
            className="rounded-2xl p-6 border"
            style={{
              backgroundColor: "rgba(251, 191, 36, 0.05)",
              borderColor: "rgba(251, 191, 36, 0.2)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-5 h-5" style={{ color: colors.warning }} />
                  <h3 className="font-bold text-lg" style={{ color: colors.textPrimary }}>
                    {limitPercentage >= 100 ? "Limite Atingido" : "Atenção: Limite Próximo"}
                  </h3>
                </div>
                <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                  Você usou {currentTransactionCount} de {transactionLimit} transações mensais do plano gratuito.
                  {limitPercentage >= 100 && " Upgrade para Premium e tenha transações ilimitadas!"}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.borderDefault }}>
                    <div
                      className="h-full"
                      style={{
                        width: `${Math.min(limitPercentage, 100)}%`,
                        backgroundColor:
                          limitPercentage >= 100
                            ? colors.danger
                            : limitPercentage > 90
                              ? colors.warning
                              : colors.warning,
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                    {Math.round(limitPercentage)}%
                  </span>
                </div>
              </div>
              <button
                style={{ backgroundColor: colors.warning }}
                className="text-white px-4 py-2.5 rounded-lg hover:opacity-90 transition-all font-semibold text-sm whitespace-nowrap"
              >
                Upgrade Premium
              </button>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="bg-[#EBE4D6] rounded-2xl p-6 shadow-sm border"
            style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-wider font-medium" style={{ color: colors.textSecondary }}>
                Total Receitas
              </p>
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${colors.success}/10` }}
              >
                <ArrowUpRight className="w-5 h-5" style={{ color: colors.success }} />
              </div>
            </div>
            <p className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
              +R$ {totalIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: colors.success }}>
              <ArrowUpRight className="w-4 h-4" />
              <span>Total do mês</span>
            </div>
          </div>

          <div
            className="bg-[#EBE4D6] rounded-2xl p-6 shadow-sm border"
            style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-wider font-medium" style={{ color: colors.textSecondary }}>
                Total Despesas
              </p>
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${colors.danger}/10` }}
              >
                <ArrowDownRight className="w-5 h-5" style={{ color: colors.danger }} />
              </div>
            </div>
            <p className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
              -R$ {totalExpense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: colors.textSecondary }}>
              <span>Total do mês</span>
            </div>
          </div>

          <div
            className="bg-[#EBE4D6] rounded-2xl p-6 shadow-sm border"
            style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-wider font-medium" style={{ color: colors.textSecondary }}>
                Saldo Período
              </p>
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${colors.primary}/10` }}
              >
                <Calendar className="w-5 h-5" style={{ color: colors.primary }} />
              </div>
            </div>
            <p className="text-2xl font-bold" style={{ color: balance >= 0 ? colors.success : colors.danger }}>
              {balance >= 0 ? "+" : ""}R${" "}
              {Math.abs(balance).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div
          className="bg-[#EBE4D6] rounded-2xl p-6 shadow-sm border"
          style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div
              className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-lg"
              style={{ backgroundColor: colors.bgLighter }}
            >
              <Search className="w-4 h-4" style={{ color: colors.textSecondary }} />
              <input
                type="text"
                placeholder="Buscar por descrição ou categoria..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-sm flex-1"
                style={{ color: colors.textPrimary }}
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" style={{ color: colors.textSecondary }} />
              <div className="flex gap-2">
                {["all", "income", "expense", "PF", "PJ"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
                    style={{
                      backgroundColor:
                        filter === f
                          ? f === "income"
                            ? colors.success
                            : f === "expense"
                              ? colors.danger
                              : colors.primary
                          : colors.bgLighter,
                      color: filter === f ? "white" : colors.textPrimary,
                    }}
                  >
                    {f === "all"
                      ? "Todos"
                      : f === "income"
                        ? "Receitas"
                        : f === "expense"
                          ? "Despesas"
                          : f}
                  </button>
                ))}
              </div>
            </div>

            {/* Export */}
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:opacity-90 transition-all text-sm font-medium"
              style={{
                backgroundColor: colors.bgLighter,
                color: colors.textPrimary,
                border: `1px solid ${colors.borderDefault}`,
              }}
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div
          className="bg-[#EBE4D6] rounded-2xl shadow-sm border overflow-hidden"
          style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: colors.bgLighter }}>
                <tr style={{ borderBottom: `1px solid ${colors.borderDefault}` }}>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                    Data
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                    Descrição
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                    Categoria
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                    Tipo
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, idx) => (
                  <tr
                    key={transaction.id}
                    className="hover:opacity-75 transition-opacity"
                    style={{
                      borderBottom: idx < filteredTransactions.length - 1 ? `1px solid ${colors.borderDefault}` : "none",
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm" style={{ color: colors.textPrimary }}>
                        {new Date(transaction.date).toLocaleDateString("pt-BR")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                          {transaction.description}
                        </p>
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor:
                              transaction.pfpj === "PF"
                                ? `${colors.secondary}/10`
                                : `${colors.info}/10`,
                            color: transaction.pfpj === "PF" ? colors.secondary : colors.info,
                          }}
                        >
                          {transaction.pfpj === "PF" ? (
                            <User className="w-3 h-3" />
                          ) : (
                            <Building2 className="w-3 h-3" />
                          )}
                          {transaction.pfpj}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm" style={{ color: colors.textSecondary }}>
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium"
                        style={{
                          backgroundColor:
                            transaction.type === "income"
                              ? `${colors.success}/10`
                              : `${colors.danger}/10`,
                          color: transaction.type === "income" ? colors.success : colors.danger,
                        }}
                      >
                        {transaction.type === "income" ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {transaction.type === "income" ? "Receita" : "Despesa"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span
                        className="font-bold"
                        style={{
                          color: transaction.type === "income" ? colors.success : colors.danger,
                        }}
                      >
                        {transaction.type === "income" ? "+" : "-"}R${" "}
                        {transaction.amount.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <p style={{ color: colors.textSecondary }}>
                Nenhuma transação encontrada
              </p>
            </div>
          )}
        </div>
      </div>
    </PremiumPageLayout>
  );
}
