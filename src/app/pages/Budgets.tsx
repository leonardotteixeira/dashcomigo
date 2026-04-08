import { Plus, FileText, Clock, CheckCircle } from "lucide-react";

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

export function Budgets() {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Pendente",
          color: "text-warning",
          bgColor: "bg-warning/10",
          icon: Clock,
        };
      case "approved":
        return {
          label: "Aprovado",
          color: "text-success",
          bgColor: "bg-success/10",
          icon: CheckCircle,
        };
      default:
        return {
          label: status,
          color: "text-muted-foreground",
          bgColor: "bg-muted",
          icon: FileText,
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-foreground mb-1">Orçamentos</h1>
          <p className="text-muted-foreground">
            Crie e gerencie propostas comerciais
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium">
          <Plus className="w-4 h-4" />
          Novo Orçamento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-warning" />
            <span className="text-sm text-muted-foreground">Pendentes</span>
          </div>
          <p className="font-bold text-foreground">
            R$ {budgets.filter(b => b.status === "pending").reduce((sum, b) => sum + b.value, 0).toLocaleString("pt-BR")}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <span className="text-sm text-muted-foreground">Aprovados</span>
          </div>
          <p className="font-bold text-foreground">
            R$ {budgets.filter(b => b.status === "approved").reduce((sum, b) => sum + b.value, 0).toLocaleString("pt-BR")}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-accent" />
            <span className="text-sm text-muted-foreground">Total</span>
          </div>
          <p className="font-bold text-foreground">
            R$ {budgets.reduce((sum, b) => sum + b.value, 0).toLocaleString("pt-BR")}
          </p>
        </div>
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
