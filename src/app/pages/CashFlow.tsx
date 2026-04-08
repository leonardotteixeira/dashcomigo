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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-foreground mb-1">Fluxo de Caixa</h1>
          <p className="text-muted-foreground">
            Gerencie todas as entradas e saídas do seu negócio
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium">
          <Plus className="w-4 h-4" />
          Nova Transação
        </button>
      </div>

      {/* Transaction Limit Warning */}
      {limitPercentage > 70 && (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-foreground">
                  {limitPercentage >= 100 ? "Limite Atingido" : "Atenção: Limite Próximo"}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Você usou {currentTransactionCount} de {transactionLimit} transações mensais do plano gratuito.
                {limitPercentage >= 100 && " Upgrade para PRO e tenha transações ilimitadas!"}
              </p>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      limitPercentage >= 100 ? "bg-destructive" :
                      limitPercentage > 90 ? "bg-warning" : "bg-amber-500"
                    }`}
                    style={{ width: `${Math.min(limitPercentage, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {Math.round(limitPercentage)}%
                </span>
              </div>
            </div>
            <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all font-semibold text-sm whitespace-nowrap">
              Upgrade PRO
            </button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-success" />
            </div>
            <span className="text-sm text-muted-foreground">
              Total Receitas
            </span>
          </div>
          <p className="font-bold text-success">
            +R$ {totalIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-expense/10 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4 text-expense" />
            </div>
            <span className="text-sm text-muted-foreground">
              Total Despesas
            </span>
          </div>
          <p className="font-bold text-expense">
            -R$ {totalExpense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Saldo Período</span>
          </div>
          <p
            className={`font-bold ${
              balance >= 0 ? "text-success" : "text-expense"
            }`}
          >
            {balance >= 0 ? "+" : ""}R${" "}
            {Math.abs(balance).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 flex items-center gap-2 bg-secondary px-3 py-2 rounded-lg">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por descrição ou categoria..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm flex-1 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filter === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilter("income")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filter === "income"
                    ? "bg-success text-white"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                Receitas
              </button>
              <button
                onClick={() => setFilter("expense")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filter === "expense"
                    ? "bg-expense text-white"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                Despesas
              </button>
              <button
                onClick={() => setFilter("PF")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filter === "PF"
                    ? "bg-pf text-white"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                PF
              </button>
              <button
                onClick={() => setFilter("PJ")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filter === "PJ"
                    ? "bg-pj text-white"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                PJ
              </button>
            </div>
          </div>

          {/* Export */}
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm font-medium text-foreground">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Data
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Descrição
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Categoria
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Tipo
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-foreground">
                      {new Date(transaction.date).toLocaleDateString("pt-BR")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {transaction.description}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                          transaction.pfpj === "PF"
                            ? "bg-pf/10 text-pf"
                            : "bg-pj/10 text-pj"
                        }`}
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
                    <span className="text-sm text-muted-foreground">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                        transaction.type === "income"
                          ? "bg-success/10 text-success"
                          : "bg-expense/10 text-expense"
                      }`}
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
                      className={`font-semibold ${
                        transaction.type === "income"
                          ? "text-success"
                          : "text-expense"
                      }`}
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
            <p className="text-muted-foreground">
              Nenhuma transação encontrada
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
