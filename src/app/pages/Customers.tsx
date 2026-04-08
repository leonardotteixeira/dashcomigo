import { Plus, Search, User, Building2, Mail, Phone } from "lucide-react";

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

export default function Customers() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-foreground mb-1">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie seus clientes e acompanhe o histórico
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium">
          <Plus className="w-4 h-4" />
          Novo Cliente
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
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
