import { Outlet, NavLink, useNavigate, Navigate, useLocation } from "react-router";
import {
  LayoutDashboard,
  ArrowRightLeft,
  Tag,
  TrendingUp,
  FileText,
  Menu,
  X,
  LogOut,
  Crown,
  User,
  Wallet,
  Bell,
  Search,
  Settings,
  Receipt,
  BarChart3,
  Package,
  Users,
  PieChart,
  Target
} from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4 animate-pulse">
            <img src="/logo.png" alt="FinMEI" className="h-26 w-auto" />
          </div>
          <p className="text-[#001529] font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.onboardingCompleted && pathname !== "/app/onboarding") {
    return <Navigate to="/app/onboarding" replace />;
  }

  const navigationGroups = [
    {
      label: "OPERACIONAL",
      items: [
        { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
        { name: "Fluxo de Caixa", href: "/app", icon: Wallet, end: true },
      ],
    },
    {
      label: "FINANÇAS",
      items: [
        { name: "Contas a Pagar", href: "/app/contas-a-pagar", icon: Receipt },
        { name: "Contas a Receber", href: "/app/contas-a-receber", icon: TrendingUp },
        { name: "DAS-MEI", href: "/app/das-mei", icon: FileText },
        { name: "Relatórios", href: "/app/relatorios", icon: BarChart3, isPro: true },
        { name: "Guia de Investimentos", href: "/app/investimentos", icon: TrendingUp },
      ],
    },
    {
      label: "VENDAS & CLIENTES",
      items: [
        { name: "Clientes", href: "/app/clientes", icon: Users },
        { name: "Fornecedores", href: "/app/fornecedores", icon: Users },
        { name: "Propostas", href: "/app/propostas", icon: FileText },
      ],
    },
    {
      label: "PLANEJAMENTO",
      items: [
        { name: "Orçamentos", href: "/app/orcamentos", icon: PieChart, isPro: true },
        { name: "Metas", href: "/app/metas", icon: Target, isPro: true },
      ],
    },
    {
      label: "FERRAMENTAS",
      items: [
        { name: "Simuladores", href: "/app/simuladores", icon: TrendingUp },
        { name: "MEI → ME", href: "/app/mei-me", icon: ArrowRightLeft },
        { name: "Preço Ideal", href: "/app/preco", icon: Tag, isPro: true },
        { name: "Simulador de Lucro", href: "/app/lucro", icon: TrendingUp, isPro: true },
        { name: "Estoque", href: "/app/estoque", icon: Package },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[266px] bg-white border-r border-[#E5E7EB] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Green left accent bar */}
        <div className="absolute left-0 top-[100px] bottom-[100px] w-1 bg-[#28A263] rounded-r-full" />

        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7EB]">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img src="/logo.png" alt="FinMEI" className="h-23 w-auto" />
            </div>
            <button
              className="lg:hidden p-2 text-[rgba(0,21,41,0.6)] hover:text-[#001529]"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-3 space-y-2 overflow-y-auto">
            {navigationGroups.map((group) => (
              <div key={group.label}>
                <div className="px-4 py-2 text-xs font-semibold text-[rgba(0,21,41,0.5)] uppercase tracking-wider">
                  {group.label}
                </div>
                <div className="space-y-0.5 mb-4">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        end={item.end}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                            isActive
                              ? "bg-gradient-to-r from-[#003a6d] to-[#0066FF] text-white shadow-sm"
                              : "text-[#001529] hover:bg-[#F5F7FA]"
                          }`
                        }
                        onClick={() => setSidebarOpen(false)}
                      >
                        {({ isActive }) => (
                          <>
                            <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : "text-[#001529]"}`} />
                            <span className="flex-1">{item.name}</span>
                            {item.isPro && (
                              <span className="text-[7px] px-1.5 py-0.5 bg-[#10b981] text-white rounded-full font-semibold">
                                PRO
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User section */}
          <div className="px-4 pb-4 border-t border-[#E5E7EB] pt-4">
            {/* Plan upgrade CTA */}
            {user.plan === "free" && (
              <div className="mb-3 p-4 bg-[#F0FDF4] border border-[#28A263]/20 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4 text-[#28A263]" />
                  <span className="text-sm font-bold text-[#28A263]">Upgrade para PRO</span>
                </div>
                <p className="text-xs text-[rgba(0,21,41,0.6)] mb-3">
                  Desbloqueie todos os recursos
                </p>
                <Button
                  size="sm"
                  className="w-full bg-[#28A263] hover:bg-[#20915a] text-white h-8 text-xs rounded-xl"
                  onClick={() => navigate("/checkout")}
                >
                  Ver Planos
                </Button>
              </div>
            )}

            {/* User info */}
            <div className="flex items-center gap-3 px-3 py-3 rounded-2xl mb-2 hover:bg-[#F5F7FA] transition-colors">
              <div className="w-9 h-9 rounded-full bg-[#F5F7FA] border border-[#E5E7EB] flex items-center justify-center text-[#001529] overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : user.plan === "pro" ? (
                  <Crown className="w-4 h-4 text-[#28A263]" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#001529] truncate">{user.name}</p>
                <p className="text-xs text-[rgba(0,21,41,0.6)] truncate">{user.email}</p>
              </div>
            </div>

            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 text-[#001529] hover:bg-[#F5F7FA] transition-colors text-sm rounded-xl mb-2"
              onClick={() => {
                navigate("/app/profile");
                setSidebarOpen(false);
              }}
            >
              <Settings className="w-4 h-4" />
              Meu Perfil
            </button>

            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 text-[#001529] hover:bg-[#F5F7FA] transition-colors text-sm rounded-xl"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-[266px]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-[#E5E7EB]">
          <div className="flex items-center justify-between px-6 py-3 gap-4">
            <button
              className="lg:hidden p-2 text-[#001529] hover:text-[#0066FF]"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Welcome text */}
            <div className="hidden lg:block">
              <p className="text-[#001529] font-semibold text-base">
                Bem-vindo de volta, <span className="capitalize">{user.name.split(" ")[0]}</span>
              </p>
              <p className="text-[rgba(0,21,41,0.6)] text-xs">Hey {user.name.split(" ")[0]}, o que está acontecendo!</p>
            </div>

            {/* Search bar */}
            <div className="flex-1 max-w-sm mx-auto lg:mx-0">
              <div className="flex items-center gap-2 bg-[#F8F9FA] rounded-lg px-3 py-2 border border-[#E5E7EB]">
                <Search className="w-4 h-4 text-[rgba(0,21,41,0.6)]" />
                <input
                  type="text"
                  placeholder="Pesquise algo..."
                  className="bg-transparent text-[#001529] text-sm outline-none w-full placeholder:text-[rgba(0,21,41,0.5)]"
                />
              </div>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 text-[#001529] hover:text-[#0066FF] transition-colors bg-[#F5F7FA] rounded-lg border border-[#E5E7EB]"
                >
                  <Bell className="w-5 h-5 text-[#28A263]" />
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl border border-[#E5E7EB] shadow-lg z-50 overflow-hidden">
                    <div className="p-4 border-b border-[#E5E7EB]">
                      <h3 className="text-[#001529] font-bold text-sm">Notificações</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-8 text-center">
                        <p className="text-sm text-[rgba(0,21,41,0.6)]">Nenhuma notificação no momento</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="w-8 h-8 rounded-full bg-[#F5F7FA] border border-[#E5E7EB] flex items-center justify-center overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-[#001529]" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
