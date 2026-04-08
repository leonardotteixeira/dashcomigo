import {
  Plus,
  CheckCircle,
  Clock,
  Calendar,
  Filter,
  Download,
  User,
  Building2,
} from "lucide-react";
import { useState } from "react";

const receivables = [
  {
    id: 1,
    description: "Projeto Website - Cliente A",
    customer: "Empresa XYZ Ltda",
    amount: 5000,
    dueDate: "2026-04-15",
    status: "pending",
    pfpj: "PJ",
  },
  {
    id: 2,
    description: "Consultoria MEI",
    customer: "João Silva",
    amount: 1200,
    dueDate: "2026-04-12",
    status: "pending",
    pfpj: "PF",
  },
  {
    id: 3,
    description: "Desenvolvimento App Mobile",
    customer: "StartupTech Inc",
    amount: 8500,
    dueDate: "2026-04-20",
    status: "pending",
    pfpj: "PJ",
  },
  {
    id: 4,
    description: "Design de Logo",
    customer: "Maria Santos",
    amount: 850,
    dueDate: "2026-04-07",
    status: "received",
    pfpj: "PF",
  },
  {
    id: 5,
    description: "Manutenção Site",
    customer: "Comércio ABC",
    amount: 1500,
    dueDate: "2026-04-08",
    status: "received",
    pfpj: "PJ",
  },
];

export default function AccountsReceivable() {
  const [filter, setFilter] = useState("all");

  const filteredReceivables = receivables.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  const totalPending = receivables
    .filter((r) => r.status === "pending")
    .reduce((sum, r) => sum + r.amount, 0);

  const totalReceived = receivables
    .filter((r) => r.status === "received")
    .reduce((sum, r) => sum + r.amount, 0);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "A Receber",
          color: "text-warning",
          bgColor: "bg-warning/10",
          icon: Clock,
        };
      case "received":
        return {
          label: "Recebido",
          color: "text-success",
          bgColor: "bg-success/10",
          icon: CheckCircle,
        };
      default:
        return {
          label: status,
          color: "text-muted-foreground",
          bgColor: "bg-muted",
          icon: Clock,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-foreground mb-1">Contas a Receber</h1>
          <p className="text-muted-foreground">
            Acompanhe seus recebíveis e pagamentos de clientes
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium">
          <Plus className="w-4 h-4" />
          Nova Conta
        </button>
      </div>

      {/* Summary Cards - Premium Financial Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-warning/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">A Receber</span>
          </div>
          <p className="financial-medium text-foreground mb-2">
            R$ {totalPending.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-muted-foreground font-medium">
            {receivables.filter((r) => r.status === "pending").length} contas pendentes
          </p>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Recebido (mês)</span>
          </div>
          <p className="financial-medium text-foreground mb-2">
            R$ {totalReceived.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-muted-foreground font-medium">
            {receivables.filter((r) => r.status === "received").length} contas recebidas
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                  filter === "all"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                  filter === "pending"
                    ? "bg-warning text-white shadow-sm"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                A Receber
              </button>
              <button
                onClick={() => setFilter("received")}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                  filter === "received"
                    ? "bg-success text-white shadow-sm"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                Recebidas
              </button>
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-secondary transition-all text-sm font-semibold text-foreground">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Receivables List - Premium Clean Design */}
      <div className="space-y-4">
        {filteredReceivables.map((item) => {
          const statusInfo = getStatusInfo(item.status);
          const StatusIcon = statusInfo.icon;

          return (
            <div
              key={item.id}
              className="bg-card rounded-2xl p-6 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div
                      className={`w-12 h-12 rounded-xl ${statusInfo.bgColor} flex items-center justify-center`}
                    >
                      <StatusIcon className={`w-6 h-6 ${statusInfo.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="font-bold text-foreground">
                          {item.description}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            item.pfpj === "PF"
                              ? "bg-pf/10 text-pf"
                              : "bg-pj/10 text-pj"
                          }`}
                        >
                          {item.pfpj === "PF" ? (
                            <User className="w-3 h-3" />
                          ) : (
                            <Building2 className="w-3 h-3" />
                          )}
                          {item.pfpj}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">
                        {item.customer}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-16">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground font-medium">
                      {item.status === "pending" ? "Vencimento" : "Recebido em"}:{" "}
                      {new Date(item.dueDate).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="financial-small text-success mb-3">
                    +R$ {item.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-xl text-xs font-semibold ${statusInfo.bgColor} ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredReceivables.length === 0 && (
        <div className="bg-card rounded-2xl p-16 text-center shadow-sm">
          <p className="text-muted-foreground font-medium">Nenhuma conta encontrada</p>
        </div>
      )}
    </div>
  );
}
