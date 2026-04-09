import { Plus, FileText, Clock, CheckCircle, DollarSign } from "lucide-react";
import { KPICard } from "../components/KPICard";
import { PageHeader } from "../components/PageHeader";

const budgets = [
  {
    id: 1,
    client: "Empresa XYZ Ltda",
    description: "Desenvolvimento de Sistema Web",
    value: 25000,
    status: "pending",
    date: "2026-04-07",
    validUntil: "2026-04-21",
  },
  {
    id: 2,
    client: "StartupTech Inc",
    description: "Consultoria em Tecnologia",
    value: 15000,
    status: "approved",
    date: "2026-04-05",
    validUntil: "2026-04-19",
  },
  {
    id: 3,
    client: "Comércio ABC",
    description: "Manutenção de Site - 6 meses",
    value: 9000,
    status: "pending",
    date: "2026-04-03",
    validUntil: "2026-04-17",
  },
];

export function Orcamentos() {
  const totalPending = budgets.filter(b => b.status === "pending").reduce((sum, b) => sum + b.value, 0);
  const totalApproved = budgets.filter(b => b.status === "approved").reduce((sum, b) => sum + b.value, 0);
  const totalBudgets = budgets.reduce((sum, b) => sum + b.value, 0);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Pendente",
          color: "text-[#f59e0b]",
          bgColor: "bg-[#f59e0b]/10",
          icon: Clock,
        };
      case "approved":
        return {
          label: "Aprovado",
          color: "text-[#10b981]",
          bgColor: "bg-[#10b981]/10",
          icon: CheckCircle,
        };
      default:
        return {
          label: status,
          color: "text-[#001529]/60",
          bgColor: "bg-[#F5F7FA]",
          icon: FileText,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with PageHeader component */}
      <PageHeader
        title="Orçamentos"
        subtitle="Crie e gerencie propostas comerciais"
        action={{
          label: "Novo Orçamento",
          icon: Plus,
        }}
      />

      {/* KPI Cards - Premium Financial Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          title="Pendentes"
          value={`R$ ${totalPending.toLocaleString("pt-BR")}`}
          icon={Clock}
          iconColor="blue"
          status={{
            label: `${budgets.filter(b => b.status === "pending").length} orçamentos`,
            color: "blue",
          }}
        />

        <KPICard
          title="Aprovados"
          value={`R$ ${totalApproved.toLocaleString("pt-BR")}`}
          icon={CheckCircle}
          iconColor="green"
          status={{
            label: `${budgets.filter(b => b.status === "approved").length} orçamentos`,
            color: "green",
          }}
        />

        <KPICard
          title="Total"
          value={`R$ ${totalBudgets.toLocaleString("pt-BR")}`}
          icon={DollarSign}
          iconColor="blue"
          status={{
            label: `${budgets.length} orçamentos`,
            color: "blue",
          }}
        />
      </div>

      <div className="space-y-3">
        {budgets.map((budget) => {
          const statusInfo = getStatusInfo(budget.status);
          const StatusIcon = statusInfo.icon;

          return (
            <div
              key={budget.id}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg ${statusInfo.bgColor} flex items-center justify-center`}>
                      <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {budget.description}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {budget.client}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-13 text-sm text-muted-foreground">
                    <span>Criado em: {new Date(budget.date).toLocaleDateString("pt-BR")}</span>
                    <span>Válido até: {new Date(budget.validUntil).toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground mb-2">
                    R$ {budget.value.toLocaleString("pt-BR")}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
