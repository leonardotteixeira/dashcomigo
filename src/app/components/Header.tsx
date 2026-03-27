import { Calculator, Menu, X, LogIn } from "lucide-react";
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
    <header className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md border-b border-white/5 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-9 h-9 bg-[#2DDB81] rounded-xl flex items-center justify-center">
              <Calculator className="w-5 h-5 text-black" />
            </div>
            <span className="text-lg font-bold text-white">
              Hub do Empreendedor
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              className="px-4 py-1.5 text-white font-medium transition-colors hover:text-[#C0F497]"
              onClick={(e) => {
                e.preventDefault();
                onScrollToSimulator();
              }}
            >
              Ferramentas
            </button>
            <button
              className="px-4 py-1.5 text-white font-medium transition-colors hover:text-[#C0F497]"
            >
              Benefícios
            </button>
            <button
              className="px-4 py-1.5 text-white font-medium transition-colors hover:text-[#C0F497]"
              onClick={() => navigate("/pricing")}
            >
              Planos
            </button>

            {isAuthenticated ? (
              <Button
                className="ml-4 bg-[#28A263] hover:bg-[#2DDB81] text-white rounded-lg"
                onClick={() => navigate("/app")}
              >
                Acessar Dashboard
              </Button>
            ) : (
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="ghost"
                  className="text-[#C0F497] border border-[#C0F497] hover:bg-[#C0F497]/10 rounded-lg"
                  onClick={() => navigate("/login")}
                >
                  Entrar
                </Button>
                <Button
                  className="bg-[#28A263] hover:bg-[#2DDB81] text-white rounded-lg"
                  onClick={() => navigate("/signup")}
                >
                  Criar Conta
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col gap-4">
              <button
                className="text-white hover:text-[#C0F497] font-medium transition-colors py-2 text-left"
                onClick={() => {
                  onScrollToSimulator();
                  setMobileMenuOpen(false);
                }}
              >
                Ferramentas
              </button>
              <button
                className="text-white hover:text-[#C0F497] font-medium transition-colors py-2 text-left"
                onClick={() => setMobileMenuOpen(false)}
              >
                Benefícios
              </button>
              <button
                className="text-white hover:text-[#C0F497] font-medium transition-colors py-2 text-left"
                onClick={() => {
                  navigate("/pricing");
                  setMobileMenuOpen(false);
                }}
              >
                Planos
              </button>

              {isAuthenticated ? (
                <Button
                  className="bg-[#28A263] hover:bg-[#2DDB81] text-white w-full mt-2 rounded-lg"
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
                    className="w-full border-[#C0F497] text-[#C0F497] hover:bg-[#C0F497]/10 rounded-lg"
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </Button>
                  <Button
                    className="bg-[#28A263] hover:bg-[#2DDB81] text-white w-full rounded-lg"
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
