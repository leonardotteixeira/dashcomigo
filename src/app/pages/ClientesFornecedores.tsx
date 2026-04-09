import { Plus, Search, User, Building2, Mail, Phone, Users, TrendingUp } from "lucide-react";
import { KPICard } from "../components/KPICard";
import { PageHeader } from "../components/PageHeader";

const customers = [
  {
    id: 1,
    name: "Empresa XYZ Ltda",
    type: "PJ",
    email: "contato@xyz.com",
    phone: "(11) 98765-4321",
    totalRevenue: 15000,
    lastTransaction: "2026-04-08",
  },
  {
    id: 2,
    name: "João Silva",
    type: "PF",
    email: "joao@email.com",
    phone: "(11) 91234-5678",
    totalRevenue: 3500,
    lastTransaction: "2026-04-07",
  },
  {
    id: 3,
    name: "StartupTech Inc",
    type: "PJ",
    email: "tech@startup.com",
    phone: "(11) 99999-8888",
    totalRevenue: 25000,
    lastTransaction: "2026-04-06",
  },
  {
    id: 4,
    name: "Maria Santos",
    type: "PF",
    email: "maria@email.com",
    phone: "(11) 97777-6666",
    totalRevenue: 2800,
    lastTransaction: "2026-04-05",
  },
];

export function ClientesFornecedores() {
  const totalClients = customers.length;
  const activeClients = customers.filter(c => new Date(c.lastTransaction) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalRevenue, 0);

  return (
    <div className="space-y-6">
      {/* Header with PageHeader component */}
      <PageHeader
        title="Clientes"
        subtitle="Gerencie seus clientes e acompanhe o histórico"
        action={{
          label: "Novo Cliente",
          icon: Plus,
        }}
      />

      {/* KPI Cards - Premium Financial Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          title="Total de Clientes"
          value={totalClients}
          icon={Users}
          iconColor="blue"
          status={{
            label: `${activeClients} ativos`,
            color: "blue",
          }}
        />

        <KPICard
          title="Clientes Ativos"
          value={activeClients}
          icon={TrendingUp}
          iconColor="green"
          status={{
            label: "Últimos 30 dias",
            color: "green",
          }}
        />

        <KPICard
          title="Receita Total"
          value={`R$ ${totalRevenue.toLocaleString("pt-BR")}`}
          icon={User}
          iconColor="blue"
          status={{
            label: `Média: R$ ${(totalRevenue / totalClients).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`,
            color: "blue",
          }}
        />
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-lg">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar clientes..."
            className="bg-transparent border-none outline-none text-sm flex-1 text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-lg ${
                  customer.type === "PF" ? "bg-pf/10" : "bg-pj/10"
                } flex items-center justify-center`}
              >
                {customer.type === "PF" ? (
                  <User className={`w-6 h-6 text-pf`} />
                ) : (
                  <Building2 className={`w-6 h-6 text-pj`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{customer.name}</h3>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      customer.type === "PF"
                        ? "bg-pf/10 text-pf"
                        : "bg-pj/10 text-pj"
                    }`}
                  >
                    {customer.type}
                  </span>
                </div>
                <div className="space-y-1 mb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    {customer.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-3 h-3" />
                    {customer.phone}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Receita Total</p>
                    <p className="font-semibold text-success">
                      R$ {customer.totalRevenue.toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Última Transação</p>
                    <p className="text-sm text-foreground">
                      {new Date(customer.lastTransaction).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
