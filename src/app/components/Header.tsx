import { Menu, X, LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Logo, LogoMark } from "./ui/Logo";

interface HeaderProps {
  onScrollToSimulator: () => void;
}

export function Header({ onScrollToSimulator }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#F4EFE6] backdrop-blur-md border-b border-[rgba(20,18,15,0.13)] z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <span className="hidden sm:inline"><Logo /></span>
            <span className="sm:hidden"><LogoMark size={32} /></span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              className="px-4 py-1.5 text-[#0E3B2E] font-medium transition-colors hover:text-[#1F5A3A]"
              onClick={(e) => {
                e.preventDefault();
                onScrollToSimulator();
              }}
            >
              Ferramentas
            </button>
            <button
              className="px-4 py-1.5 text-[#0E3B2E] font-medium transition-colors hover:text-[#1F5A3A]"
            >
              Benefícios
            </button>
            <button
              className="px-4 py-1.5 text-[#0E3B2E] font-medium transition-colors hover:text-[#1F5A3A]"
              onClick={() => navigate("/pricing")}
            >
              Planos
            </button>

            {isAuthenticated ? (
              <Button
                className="ml-4 bg-[#0E3B2E] hover:bg-[#082219] text-white rounded-lg"
                onClick={() => navigate("/app")}
              >
                Acessar Dashboard
              </Button>
            ) : (
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="ghost"
                  className="text-[#0E3B2E] border border-[#0E3B2E] hover:bg-[#0E3B2E]/10 rounded-lg"
                  onClick={() => navigate("/login")}
                >
                  Entrar
                </Button>
                <Button
                  className="bg-[#0E3B2E] hover:bg-[#082219] text-white rounded-lg"
                  onClick={() => navigate("/signup")}
                >
                  Criar Conta
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[#0E3B2E]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[rgba(20,18,15,0.13)] bg-[#F4EFE6]">
            <nav className="flex flex-col gap-4">
              <button
                className="text-[#0E3B2E] hover:text-[#1F5A3A] font-medium transition-colors py-2 text-left"
                onClick={() => {
                  onScrollToSimulator();
                  setMobileMenuOpen(false);
                }}
              >
                Ferramentas
              </button>
              <button
                className="text-[#0E3B2E] hover:text-[#1F5A3A] font-medium transition-colors py-2 text-left"
                onClick={() => setMobileMenuOpen(false)}
              >
                Benefícios
              </button>
              <button
                className="text-[#0E3B2E] hover:text-[#1F5A3A] font-medium transition-colors py-2 text-left"
                onClick={() => {
                  navigate("/pricing");
                  setMobileMenuOpen(false);
                }}
              >
                Planos
              </button>

              {isAuthenticated ? (
                <Button
                  className="bg-[#0E3B2E] hover:bg-[#082219] text-white w-full mt-2 rounded-lg"
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
                    className="w-full border-[#0E3B2E] text-[#28A263] hover:bg-[#28A263]/10 rounded-lg"
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </Button>
                  <Button
                    className="bg-[#0E3B2E] hover:bg-[#082219] text-white w-full rounded-lg"
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
