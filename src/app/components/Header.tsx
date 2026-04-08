import { Menu, X, LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

interface HeaderProps {
  onScrollToSimulator: () => void;
}

export function Header({ onScrollToSimulator }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white backdrop-blur-md border-b border-[#E5E7EB] z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/logo.png" alt="Meu Fluxo" className="h-23 w-auto" />
            <span className="text-lg font-bold text-[#001529] hidden sm:inline">
              FinMEI
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              className="px-4 py-1.5 text-[#001529] font-medium transition-colors hover:text-[#28A263]"
              onClick={(e) => {
                e.preventDefault();
                onScrollToSimulator();
              }}
            >
              Ferramentas
            </button>
            <button
              className="px-4 py-1.5 text-[#001529] font-medium transition-colors hover:text-[#28A263]"
            >
              Benefícios
            </button>
            <button
              className="px-4 py-1.5 text-[#001529] font-medium transition-colors hover:text-[#28A263]"
              onClick={() => navigate("/pricing")}
            >
              Planos
            </button>

            {isAuthenticated ? (
              <Button
                className="ml-4 bg-[#28A263] hover:bg-[#20915a] text-white rounded-lg"
                onClick={() => navigate("/app")}
              >
                Acessar Dashboard
              </Button>
            ) : (
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="ghost"
                  className="text-[#28A263] border border-[#28A263] hover:bg-[#28A263]/10 rounded-lg"
                  onClick={() => navigate("/login")}
                >
                  Entrar
                </Button>
                <Button
                  className="bg-[#28A263] hover:bg-[#20915a] text-white rounded-lg"
                  onClick={() => navigate("/signup")}
                >
                  Criar Conta
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[#001529]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#E5E7EB] bg-white">
            <nav className="flex flex-col gap-4">
              <button
                className="text-[#001529] hover:text-[#28A263] font-medium transition-colors py-2 text-left"
                onClick={() => {
                  onScrollToSimulator();
                  setMobileMenuOpen(false);
                }}
              >
                Ferramentas
              </button>
              <button
                className="text-[#001529] hover:text-[#28A263] font-medium transition-colors py-2 text-left"
                onClick={() => setMobileMenuOpen(false)}
              >
                Benefícios
              </button>
              <button
                className="text-[#001529] hover:text-[#28A263] font-medium transition-colors py-2 text-left"
                onClick={() => {
                  navigate("/pricing");
                  setMobileMenuOpen(false);
                }}
              >
                Planos
              </button>

              {isAuthenticated ? (
                <Button
                  className="bg-[#28A263] hover:bg-[#20915a] text-white w-full mt-2 rounded-lg"
                  onClick={() => {
                    navigate("/app");
                    setMobileMenuOpen(false);
                  }}
                >
                  Acessar Dashboard
                </Button>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Button
                    variant="outline"
                    className="w-full border-[#28A263] text-[#28A263] hover:bg-[#28A263]/10 rounded-lg"
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </Button>
                  <Button
                    className="bg-[#28A263] hover:bg-[#20915a] text-white w-full rounded-lg"
                    onClick={() => {
                      navigate("/signup");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Criar Conta
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
