import { Outlet, NavLink, useNavigate, Navigate } from "react-router";
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
  Wallet
} from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../contexts/AuthContext";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  // Show loading spinner while auth state is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 animate-pulse">
            <LayoutDashboard className="w-8 h-8 text-white" />
          </div>
          <p className="text-slate-600 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navigation = [
    { name: "Fluxo de Caixa", href: "/app", icon: Wallet, end: true },
    { name: "Ferramentas", href: "/app/dashboard", icon: LayoutDashboard },
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
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Hub do</h1>
                <p className="text-sm text-slate-600 -mt-1">Empreendedor</p>
              </div>
            </div>
            <button
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  {({ isActive }) => (
                    <>
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                      )}
                      {item.isPro && (
                        <Badge
                          variant="outline"
                          className="ml-2"
                        >
                          Pro
                        </Badge>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-slate-200">
            {/* Plan upgrade CTA */}
            {user.plan === "free" && (
              <div className="mb-3 p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-bold text-purple-900">Upgrade para PRO</span>
                </div>
                <p className="text-xs text-purple-700 mb-3">
                  Desbloqueie todos os recursos
                </p>
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-8 text-xs"
                  onClick={() => navigate("/pricing")}
                >
                  Ver Planos
                </Button>
              </div>
            )}

            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 ${
              user.plan === "pro" 
                ? "bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-purple-200" 
                : "bg-slate-50"
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                user.plan === "pro"
                  ? "bg-gradient-to-br from-purple-600 to-blue-600"
                  : "bg-slate-400"
              }`}>
                {user.plan === "pro" ? (
                  <Crown className="w-5 h-5" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                <div className="flex items-center gap-1">
                  {user.plan === "pro" && (
                    <Crown className="w-3 h-3 text-purple-600" />
                  )}
                  <p className={`text-xs truncate ${
                    user.plan === "pro" ? "text-purple-700 font-bold" : "text-slate-600"
                  }`}>
                    {user.plan === "pro" ? "Plano PRO" : "Plano Gratuito"}
                  </p>
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-600 hover:text-slate-900"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex-1 lg:flex-none">
              <h2 className="text-xl font-bold text-slate-900">
                Bem-vindo ao seu Hub
              </h2>
            </div>

            <Button
              className="hidden lg:flex bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              Nova Simulação
            </Button>
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