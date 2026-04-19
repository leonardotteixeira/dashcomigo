import { Outlet, useNavigate, Navigate, useLocation, Link } from "react-router";
import { HeaderKPIStrip } from "../components/HeaderKPIStrip";
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
  Handshake,
  Truck,
  FileText,
} from "lucide-react";
import { Logo, LogoMark } from "../components/ui/Logo";
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
      <div className="min-h-screen bg-[#F4EFE6] flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4 animate-pulse">
            <LogoMark size={56} />
          </div>
          <p className="text-[#0E3B2E] font-medium">Carregando...</p>
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
    { name: "Propostas", href: "/app/propostas", icon: Handshake },
    { name: "Simuladores", href: "/app/simuladores", icon: Calculator },
    { name: "Investimentos", href: "/app/investimentos", icon: Landmark },
    { name: "DAS MEI", href: "/app/das-mei", icon: FileText },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6]">
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
        className={`fixed left-0 z-50 w-[256px] bg-[#F4EFE6] border-r border-[rgba(20,18,15,0.13)] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ top: "52px", bottom: 0 }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-[rgba(20,18,15,0.13)]">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <Logo />
            </div>
            <button
              className="lg:hidden p-2 text-[rgba(20,18,15,0.6)] hover:text-[#0E3B2E]"
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
              <div className="px-1 pt-2 mt-4 border-t border-[rgba(20,18,15,0.13)]">
                <FreePlanUsage />
              </div>
            )}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-[rgba(20,18,15,0.13)]">
            {user.plan === "free" && (
              <div className="mb-3 p-4 bg-[#EBE4D6] border border-[rgba(20,18,15,0.13)] rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4 text-[#1F5A3A]" />
                  <span className="text-sm font-bold text-[#1F5A3A]">Upgrade para PRO</span>
                </div>
                <p className="text-xs text-[rgba(20,18,15,0.6)] mb-3">Desbloqueie todos os recursos</p>
                <Button
                  size="sm"
                  className="w-full bg-[#0E3B2E] hover:bg-[#082219] text-white h-8 text-xs rounded-xl"
                  onClick={() => navigate("/checkout")}
                >
                  Ver Planos
                </Button>
              </div>
            )}

            <Link
              to="/app/profile"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#EBE4D6] transition-colors mb-1"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="w-8 h-8 rounded-full bg-[#EBE4D6] border border-[rgba(20,18,15,0.13)] flex items-center justify-center overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-[#0E3B2E]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0E3B2E] truncate">{user.name}</p>
                <p className="text-xs text-[rgba(20,18,15,0.6)] truncate">{user.plan === "pro" ? "Plano PRO" : "Plano Gratuito"}</p>
              </div>
            </Link>

            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 text-[#0E3B2E] hover:bg-[#EBE4D6] transition-colors text-sm rounded-lg"
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
        <header className="sticky top-0 z-30 bg-[#F4EFE6] border-b border-[rgba(20,18,15,0.13)]">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-[#EBE4D6]"
              >
                <Menu className="w-5 h-5 text-[#0E3B2E]" />
              </button>
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 bg-[#EBE4D6] px-3 py-2 rounded-lg min-w-[300px] border border-[rgba(20,18,15,0.13)]">
                <Settings className="w-4 h-4 text-[#0E3B2E]/60" />
                <input
                  type="text"
                  placeholder="Buscar transações, clientes..."
                  className="bg-transparent border-none outline-none text-sm flex-1 text-[#0E3B2E] placeholder:text-[#0E3B2E]/60"
                />
              </div>
            </div>

            {/* Financial KPI Strip + Welcome + Notifications */}
            <div className="flex items-center gap-4">
              <HeaderKPIStrip />
              <div className="hidden xl:block h-6 w-px bg-[#E5E7EB]" />
              <div className="hidden lg:block text-right">
                <p className="text-sm font-semibold text-[#0E3B2E]">
                  <span className="capitalize">{user.name.split(" ")[0]}</span>
                </p>
                <p className="text-xs text-[#0E3B2E]/60">{user.plan === "pro" ? "✨ Plano PRO" : "Plano Gratuito"}</p>
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
