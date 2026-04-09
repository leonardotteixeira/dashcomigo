import { Outlet, useNavigate, Navigate, useLocation, Link } from "react-router";
import {
  LayoutDashboard,
  TrendingUp,
  Menu,
  X,
  LogOut,
  Crown,
  User,
  Wallet,
  Settings,
  Receipt,
  BarChart3,
  Users,
  Calculator,
  Landmark,
  FileSpreadsheet,
  Handshake,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import LimitedOfferBanner from "../components/LimitedOfferBanner";
import NotificationCenter from "../components/NotificationCenter";
import FreePlanUsage from "../components/FreePlanUsage";
import { MenuItem } from "../components/MenuItem";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4 animate-pulse">
            <img src="/logo.png" alt="FinMEI" className="h-20 w-auto" />
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

  const navItems = [
    { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
    { name: "Fluxo de Caixa", href: "/app", icon: Wallet, end: true },
    { name: "Contas a Pagar", href: "/app/contas-a-pagar", icon: Receipt },
    { name: "Contas a Receber", href: "/app/contas-a-receber", icon: TrendingUp },
    { name: "Relatórios", href: "/app/relatorios", icon: BarChart3 },
    { name: "Clientes", href: "/app/clientes", icon: Users },
    { name: "Fornecedores", href: "/app/fornecedores", icon: Truck },
    { name: "Propostas", href: "/app/propostas", icon: Handshake, badge: "novo", badgeColor: "green" as const },
    { name: "Orçamentos", href: "/app/orcamentos", icon: FileSpreadsheet },
    { name: "Simuladores", href: "/app/simuladores", icon: Calculator },
    { name: "Investimentos", href: "/app/investimentos", icon: Landmark },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Limited Offer Banner - Fixed on top */}
      <div className="fixed top-0 left-0 right-0 z-[60]">
        <LimitedOfferBanner />
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 z-50 w-[256px] bg-[#FFFFFF] border-r border-[#E5E7EB] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ top: "52px", bottom: 0 }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img src="/logo.png" alt="FinMEI" className="h-20 w-auto" />
            </div>
            <button
              className="lg:hidden p-2 text-[rgba(0,21,41,0.6)] hover:text-[#001529]"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
            {navItems.map((item) => (
              <MenuItem
                key={item.name}
                name={item.name}
                href={item.href}
                icon={item.icon}
                badge={item.badge}
                badgeColor={item.badgeColor}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
              />
            ))}

            {/* Free plan usage widget */}
            {user.plan === "free" && (
              <div className="px-1 pt-2 mt-4 border-t border-[#E5E7EB]">
                <FreePlanUsage />
              </div>
            )}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-[#E5E7EB]">
            {user.plan === "free" && (
              <div className="mb-3 p-4 bg-[#F0FDF4] border border-[#28A263]/20 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4 text-[#28A263]" />
                  <span className="text-sm font-bold text-[#28A263]">Upgrade para PRO</span>
                </div>
                <p className="text-xs text-[rgba(0,21,41,0.6)] mb-3">Desbloqueie todos os recursos</p>
                <Button
                  size="sm"
                  className="w-full bg-[#28A263] hover:bg-[#20915a] text-white h-8 text-xs rounded-xl"
                  onClick={() => navigate("/checkout")}
                >
                  Ver Planos
                </Button>
              </div>
            )}

            <Link
              to="/app/profile"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#F5F7FA] transition-colors mb-1"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="w-8 h-8 rounded-full bg-[#F5F7FA] border border-[#E5E7EB] flex items-center justify-center overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-[#001529]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#001529] truncate">{user.name}</p>
                <p className="text-xs text-[rgba(0,21,41,0.6)] truncate">{user.plan === "pro" ? "Plano PRO" : "Plano Gratuito"}</p>
              </div>
            </Link>

            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 text-[#001529] hover:bg-[#F5F7FA] transition-colors text-sm rounded-lg"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-[256px]" style={{ marginTop: "52px" }}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#E5E7EB]">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-[#F5F7FA]"
              >
                <Menu className="w-5 h-5 text-[#001529]" />
              </button>
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 bg-[#F5F7FA] px-3 py-2 rounded-lg min-w-[300px] border border-[#E5E7EB]">
                <Settings className="w-4 h-4 text-[#001529]/60" />
                <input
                  type="text"
                  placeholder="Buscar transações, clientes..."
                  className="bg-transparent border-none outline-none text-sm flex-1 text-[#001529] placeholder:text-[#001529]/60"
                />
              </div>
            </div>

            {/* Welcome + Notifications */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:block text-right">
                <p className="text-sm font-semibold text-[#001529]">
                  Bem-vindo, <span className="capitalize">{user.name.split(" ")[0]}</span>
                </p>
                <p className="text-xs text-[#001529]/60">{user.plan === "pro" ? "Plano PRO ✨" : "Plano Gratuito"}</p>
              </div>
              <NotificationCenter />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
