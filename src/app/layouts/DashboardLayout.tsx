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
  Settings
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
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4 animate-pulse">
            <img src="/logo.png" alt="Meu Fluxo" className="h-26 w-auto" />
          </div>
          <p className="text-[#A1A1A1] font-medium">Carregando...</p>
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

  const navigation = [
    { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
    { name: "Fluxo de Caixa", href: "/app", icon: Wallet, end: true },
    { name: "MEI → ME", href: "/app/mei-me", icon: ArrowRightLeft },
    { name: "Preço Ideal", href: "/app/preco", icon: Tag, isPro: true },
    { name: "Simulador de Lucro", href: "/app/lucro", icon: TrendingUp, isPro: true },
    { name: "Propostas", href: "/app/propostas", icon: FileText },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#141414]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[266px] bg-[#1B1B1B] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Green left accent bar */}
        <div className="absolute left-0 top-[100px] bottom-[100px] w-1 bg-[#28A263] rounded-r-full" />

        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img src="/logo.png" alt="Meu Fluxo" className="h-23 w-auto" />
            </div>
            <button
              className="lg:hidden p-2 text-[#A1A1A1] hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-full font-medium transition-all text-sm ${
                      isActive
                        ? "bg-[#28A263]/15 text-[#28A263]"
                        : "text-[#A1A1A1] hover:text-white hover:bg-white/5"
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-[#28A263]" : ""}`} />
                      <span className="flex-1">{item.name}</span>
                      {item.isPro && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-[#28A263]/20 text-[#2DDB81] rounded-full font-semibold">
                          PRO
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* User section */}
          <div className="px-4 pb-4">
            {/* Plan upgrade CTA */}
            {user.plan === "free" && (
              <div className="mb-3 p-4 bg-[#28A263]/10 border border-[#28A263]/20 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4 text-[#2DDB81]" />
                  <span className="text-sm font-bold text-[#2DDB81]">Upgrade para PRO</span>
                </div>
                <p className="text-xs text-[#868898] mb-3">
                  Desbloqueie todos os recursos
                </p>
                <Button
                  size="sm"
                  className="w-full bg-[#28A263] hover:bg-[#2DDB81] text-white h-8 text-xs rounded-xl"
                  onClick={() => navigate("/checkout")}
                >
                  Ver Planos
                </Button>
              </div>
            )}

            {/* User info */}
            <div className="flex items-center gap-3 px-3 py-3 rounded-2xl mb-2">
              <div className="w-9 h-9 rounded-full bg-[#313131] border border-[#28A263]/30 flex items-center justify-center text-[#A1A1A1] overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : user.plan === "pro" ? (
                  <Crown className="w-4 h-4 text-[#2DDB81]" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#A1A1A1] truncate">{user.name}</p>
                <p className="text-xs text-white truncate">{user.email}</p>
              </div>
            </div>

            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 text-[#A1A1A1] hover:text-white transition-colors text-sm rounded-xl hover:bg-white/5 mb-2"
              onClick={() => {
                navigate("/app/profile");
                setSidebarOpen(false);
              }}
            >
              <Settings className="w-4 h-4" />
              Meu Perfil
            </button>

            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 text-[#A1A1A1] hover:text-white transition-colors text-sm rounded-xl hover:bg-white/5"
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
        <header className="sticky top-0 z-30 bg-[#141414]/90 backdrop-blur-sm border-b border-white/5">
          <div className="flex items-center justify-between px-6 py-3 gap-4">
            <button
              className="lg:hidden p-2 text-[#A1A1A1] hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Welcome text */}
            <div className="hidden lg:block">
              <p className="text-white font-semibold text-base">
                Bem-vindo de volta, <span className="capitalize">{user.name.split(" ")[0]}</span>
              </p>
              <p className="text-[#A1A1A1] text-xs">Hey {user.name.split(" ")[0]}, o que está acontecendo!</p>
            </div>

            {/* Search bar */}
            <div className="flex-1 max-w-sm mx-auto lg:mx-0">
              <div className="flex items-center gap-2 bg-[#1D1D1D] rounded-lg px-3 py-2 border border-white/5">
                <Search className="w-4 h-4 text-[#A1A1A1]" />
                <input
                  type="text"
                  placeholder="Pesquise algo..."
                  className="bg-transparent text-[#A1A1A1] text-sm outline-none w-full placeholder:text-[#A1A1A1]"
                />
              </div>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 text-[#A1A1A1] hover:text-white transition-colors bg-[#1B1B1B] rounded-lg border border-white/5"
                >
                  <Bell className="w-5 h-5 text-[#28A263]" />
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-[#1B1B1B] rounded-2xl border border-white/10 shadow-xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-white/5">
                      <h3 className="text-white font-bold text-sm">Notificações</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-8 text-center">
                        <p className="text-sm text-[#686F6F]">Nenhuma notificação no momento</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="w-8 h-8 rounded-full bg-[#313131] border border-[#28A263]/30 flex items-center justify-center overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-[#A1A1A1]" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
