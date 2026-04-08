import {
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Filter,
  Download,
  User,
  Building2,
} from "lucide-react";
import { useState } from "react";

const bills = [
  {
    id: 1,
    description: "Aluguel Escritório",
    supplier: "Imobiliária ABC",
    amount: 2500,
    dueDate: "2026-04-10",
    status: "pending",
    pfpj: "PJ",
    recurrent: true,
  },
  {
    id: 2,
    description: "Internet e Telefonia",
    supplier: "Telecom XYZ",
    amount: 180,
    dueDate: "2026-04-12",
    status: "pending",
    pfpj: "PJ",
    recurrent: true,
  },
  {
    id: 3,
    description: "Software e Licenças",
    supplier: "Tech Solutions",
    amount: 450,
    dueDate: "2026-04-15",
    status: "pending",
    pfpj: "PJ",
    recurrent: true,
  },
  {
    id: 4,
    description: "Fornecedor Material",
    supplier: "Fornecedor ABC",
    amount: 1200,
    dueDate: "2026-04-05",
    status: "paid",
    pfpj: "PJ",
    recurrent: false,
  },
  {
    id: 5,
    description: "Conta de Luz",
    supplier: "Energia S.A.",
    amount: 280,
    dueDate: "2026-04-08",
    status: "paid",
    pfpj: "PJ",
    recurrent: true,
  },
  {
    id: 6,
    description: "Contador",
    supplier: "Contabilidade Pro",
    amount: 350,
    dueDate: "2026-04-05",
    status: "overdue",
    pfpj: "PJ",
    recurrent: true,
  },
];

export default function AccountsPayable() {
  const [filter, setFilter] = useState("all");

  const filteredBills = bills.filter((bill) => {
    if (filter === "all") return true;
    return bill.status === filter;
  });

  const totalPending = bills
    .filter((b) => b.status === "pending")
    .reduce((sum, b) => sum + b.amount, 0);

  const totalOverdue = bills
    .filter((b) => b.status === "overdue")
    .reduce((sum, b) => sum + b.amount, 0);

  const totalPaid = bills
    .filter((b) => b.status === "paid")
    .reduce((sum, b) => sum + b.amount, 0);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Pendente",
          color: "text-[#f59e0b]",
          bgColor: "bg-[#f59e0b]/10",
          icon: Clock,
        };
      case "paid":
        return {
          label: "Pago",
          color: "text-[#10b981]",
          bgColor: "bg-[#10b981]/10",
          icon: CheckCircle,
        };
      case "overdue":
        return {
          label: "Vencido",
          color: "text-[#ef4444]",
          bgColor: "bg-[#ef4444]/10",
          icon: AlertCircle,
        };
      default:
        return {
          label: status,
          color: "text-[#001529]/60",
          bgColor: "bg-[#F5F7FA]",
          icon: Clock,
        };
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-[#001529] mb-1">Contas a Pagar</h1>
          <p className="text-[#001529]/60">
            Gerencie e acompanhe suas obrigações financeiras
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#003a6d] text-white px-4 py-2.5 rounded-lg hover:bg-[#002a50] transition-colors font-medium">
          <Plus className="w-4 h-4" />
          Nova Conta
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#f59e0b]" />
            </div>
            <span className="text-sm text-[#001529]/60">A Pagar</span>
          </div>
          <p className="font-bold text-[#001529] mb-1">
            R$ {totalPending.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-[#001529]/60">
            {bills.filter((b) => b.status === "pending").length} contas pendentes
          </p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#ef4444]/10 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-[#ef4444]" />
            </div>
            <span className="text-sm text-[#001529]/60">Vencidas</span>
          </div>
          <p className="font-bold text-[#ef4444] mb-1">
            R$ {totalOverdue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-[#001529]/60">
            {bills.filter((b) => b.status === "overdue").length} contas atrasadas
          </p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-[#10b981]" />
            </div>
            <span className="text-sm text-[#001529]/60">Pagas (mês)</span>
          </div>
          <p className="font-bold text-[#001529] mb-1">
            R$ {totalPaid.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-[#001529]/60">
            {bills.filter((b) => b.status === "paid").length} contas quitadas
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#001529]/60" />
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filter === "all"
                    ? "bg-[#003a6d] text-white"
                    : "bg-[#F5F7FA] text-[#001529] hover:bg-[#E5E7EB]"
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filter === "pending"
                    ? "bg-[#f59e0b] text-white"
                    : "bg-[#F5F7FA] text-[#001529] hover:bg-[#E5E7EB]"
                }`}
              >
                Pendentes
              </button>
              <button
                onClick={() => setFilter("overdue")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filter === "overdue"
                    ? "bg-[#ef4444] text-white"
                    : "bg-[#F5F7FA] text-[#001529] hover:bg-[#E5E7EB]"
                }`}
              >
                Vencidas
              </button>
              <button
                onClick={() => setFilter("paid")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filter === "paid"
                    ? "bg-[#10b981] text-white"
                    : "bg-[#F5F7FA] text-[#001529] hover:bg-[#E5E7EB]"
                }`}
              >
                Pagas
              </button>
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F5F7FA] transition-colors text-sm font-medium text-[#001529]">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Bills List */}
      <div className="space-y-3">
        {filteredBills.map((bill) => {
          const statusInfo = getStatusInfo(bill.status);
          const StatusIcon = statusInfo.icon;
          const daysUntil = getDaysUntilDue(bill.dueDate);

          return (
            <div
              key={bill.id}
              className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-10 h-10 rounded-lg ${statusInfo.bgColor} flex items-center justify-center`}
                    >
                      <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[#001529]">
                          {bill.description}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                            bill.pfpj === "PF"
                              ? "bg-pf/10 text-pf"
                              : "bg-pj/10 text-pj"
                          }`}
                        >
                          {bill.pfpj === "PF" ? (
                            <User className="w-3 h-3" />
                          ) : (
                            <Building2 className="w-3 h-3" />
                          )}
                          {bill.pfpj}
                        </span>
                        {bill.recurrent && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#003a6d]/10 text-[#003a6d]">
                            Recorrente
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#001529]/60">
                        {bill.supplier}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 ml-13">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#001529]/60" />
                      <span className="text-sm text-[#001529]">
                        Vencimento: {new Date(bill.dueDate).toLocaleDateString("pt-BR")}
                      </span>
                      {bill.status === "pending" && daysUntil <= 5 && daysUntil > 0 && (
                        <span className="text-xs text-[#f59e0b] font-medium">
                          (em {daysUntil} {daysUntil === 1 ? "dia" : "dias"})
                        </span>
                      )}
                      {bill.status === "pending" && daysUntil === 0 && (
                        <span className="text-xs text-[#f59e0b] font-medium">
                          (vence hoje)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-[#001529] mb-2">
                    R$ {bill.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                  {bill.status === "pending" && (
                    <button className="mt-3 w-full bg-[#003a6d] text-white px-4 py-1.5 rounded-lg hover:bg-[#002a50] transition-colors text-xs font-medium">
                      Pagar Agora
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBills.length === 0 && (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-12 text-center">
          <p className="text-[#001529]/60">Nenhuma conta encontrada</p>
        </div>
      )}
    </div>
  );
}
