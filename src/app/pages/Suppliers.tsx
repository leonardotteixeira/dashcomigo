import { Plus, Search, Building2, Mail, Phone } from "lucide-react";
import { PremiumPageLayout } from "../components/PremiumPageLayout";
import { colors } from "../../utils/designTokens";
import { useState } from "react";

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

export function Suppliers() {
  const [search, setSearch] = useState("");

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PremiumPageLayout
      title="Fornecedores"
      description="Gerencie seus fornecedores e despesas"
      actions={
        <button
          style={{ backgroundColor: colors.primary }}
          className="flex items-center gap-2 text-white font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" />
          Novo Fornecedor
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
              placeholder="Buscar fornecedores..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm flex-1"
              style={{ color: colors.textPrimary }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((supplier) => (
            <div
              key={supplier.id}
              className="rounded-2xl p-6 shadow-sm border hover:shadow-md transition-all cursor-pointer"
              style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${colors.primary}/10` }}
                >
                  <Building2 className="w-6 h-6" style={{ color: colors.primary }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
                      {supplier.name}
                    </h3>
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        backgroundColor: `${colors.secondary}/10`,
                        color: colors.secondary,
                      }}
                    >
                      {supplier.category}
                    </span>
                  </div>
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center gap-2 text-sm" style={{ color: colors.textSecondary }}>
                      <Mail className="w-3 h-3" />
                      {supplier.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: colors.textSecondary }}>
                      <Phone className="w-3 h-3" />
                      {supplier.phone}
                    </div>
                  </div>
                  <div
                    className="flex items-center justify-between pt-4"
                    style={{ borderTop: `1px solid ${colors.borderDefault}` }}
                  >
                    <div>
                      <p className="text-xs" style={{ color: colors.textSecondary }}>
                        Gasto Total
                      </p>
                      <p className="font-semibold" style={{ color: colors.danger }}>
                        R$ {supplier.totalExpense.toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs" style={{ color: colors.textSecondary }}>
                        Última Compra
                      </p>
                      <p className="text-sm" style={{ color: colors.textPrimary }}>
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
    </PremiumPageLayout>
  );
}
