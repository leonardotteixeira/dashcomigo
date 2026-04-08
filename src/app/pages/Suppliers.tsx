import { Plus, Search, Building2, Mail, Phone } from "lucide-react";

const suppliers = [
  {
    id: 1,
    name: "Imobiliária ABC",
    category: "Infraestrutura",
    email: "contato@imobiliaria.com",
    phone: "(11) 3333-4444",
    totalExpense: 15000,
    lastTransaction: "2026-04-10",
  },
  {
    id: 2,
    name: "Telecom XYZ",
    category: "Tecnologia",
    email: "suporte@telecom.com",
    phone: "(11) 4000-5000",
    totalExpense: 1080,
    lastTransaction: "2026-04-08",
  },
  {
    id: 3,
    name: "Tech Solutions",
    category: "Software",
    email: "vendas@techsolutions.com",
    phone: "(11) 5555-6666",
    totalExpense: 2700,
    lastTransaction: "2026-04-07",
  },
  {
    id: 4,
    name: "Fornecedor ABC",
    category: "Material",
    email: "comercial@fornecedor.com",
    phone: "(11) 7777-8888",
    totalExpense: 4500,
    lastTransaction: "2026-04-05",
  },
];

export default function Suppliers() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-foreground mb-1">Fornecedores</h1>
          <p className="text-muted-foreground">
            Gerencie seus fornecedores e despesas
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium">
          <Plus className="w-4 h-4" />
          Novo Fornecedor
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-lg">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar fornecedores..."
            className="bg-transparent border-none outline-none text-sm flex-1 text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <Building2 className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{supplier.name}</h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent/10 text-accent">
                    {supplier.category}
                  </span>
                </div>
                <div className="space-y-1 mb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    {supplier.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-3 h-3" />
                    {supplier.phone}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Gasto Total</p>
                    <p className="font-semibold text-expense">
                      R$ {supplier.totalExpense.toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Última Compra</p>
                    <p className="text-sm text-foreground">
                      {new Date(supplier.lastTransaction).toLocaleDateString("pt-BR")}
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
