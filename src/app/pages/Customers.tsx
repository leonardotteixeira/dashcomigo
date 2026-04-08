import { Plus, Search, User, Building2, Mail, Phone } from "lucide-react";
import { PremiumPageLayout } from "../components/PremiumPageLayout";
import { colors } from "../../utils/designTokens";
import { useState } from "react";

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
  const [search, setSearch] = useState("");

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PremiumPageLayout
      title="Clientes"
      description="Gerencie seus clientes e acompanhe o histórico"
      actions={
        <button
          style={{ backgroundColor: colors.primary }}
          className="flex items-center gap-2 text-white font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" />
          Novo Cliente
        </button>
      }
    >
      <div className="space-y-8">
        <div
          className="rounded-2xl p-6 shadow-sm border"
          style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}
        >
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg" style={{ backgroundColor: colors.bgLighter }}>
            <Search className="w-4 h-4" style={{ color: colors.textSecondary }} />
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm flex-1"
              style={{ color: colors.textPrimary }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((customer) => (
            <div
              key={customer.id}
              className="rounded-2xl p-6 shadow-sm border hover:shadow-md transition-all cursor-pointer"
              style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: customer.type === "PF" ? `${colors.secondary}/10` : `${colors.info}/10`,
                  }}
                >
                  {customer.type === "PF" ? (
                    <User
                      className="w-6 h-6"
                      style={{ color: colors.secondary }}
                    />
                  ) : (
                    <Building2
                      className="w-6 h-6"
                      style={{ color: colors.info }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
                      {customer.name}
                    </h3>
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        backgroundColor: customer.type === "PF" ? `${colors.secondary}/10` : `${colors.info}/10`,
                        color: customer.type === "PF" ? colors.secondary : colors.info,
                      }}
                    >
                      {customer.type}
                    </span>
                  </div>
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center gap-2 text-sm" style={{ color: colors.textSecondary }}>
                      <Mail className="w-3 h-3" />
                      {customer.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: colors.textSecondary }}>
                      <Phone className="w-3 h-3" />
                      {customer.phone}
                    </div>
                  </div>
                  <div
                    className="flex items-center justify-between pt-4"
                    style={{ borderTop: `1px solid ${colors.borderDefault}` }}
                  >
                    <div>
                      <p className="text-xs" style={{ color: colors.textSecondary }}>
                        Receita Total
                      </p>
                      <p className="font-semibold" style={{ color: colors.success }}>
                        R$ {customer.totalRevenue.toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs" style={{ color: colors.textSecondary }}>
                        Última Transação
                      </p>
                      <p className="text-sm" style={{ color: colors.textPrimary }}>
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
    </PremiumPageLayout>
  );
}
