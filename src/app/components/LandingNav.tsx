import { Link } from "react-router";
import { Logo } from "./ui/Logo";

export function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F4EFE6] border-b border-[rgba(20,18,15,0.13)]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/ferramentas" className="text-[#0E3B2E]/70 hover:text-[#0E3B2E] transition-colors font-semibold">
            Ferramentas
          </Link>
          <Link to="/beneficios" className="text-[#0E3B2E]/70 hover:text-[#0E3B2E] transition-colors font-semibold">
            Benefícios
          </Link>
          <Link to="/planos" className="text-[#0E3B2E]/70 hover:text-[#0E3B2E] transition-colors font-semibold">
            Planos
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-[#0E3B2E] font-semibold hover:text-[#082219] transition-colors"
          >
            Entrar
          </Link>
          <Link
            to="/signup"
            className="bg-[#0E3B2E] text-[#F4EFE6] px-6 py-3 rounded-lg font-semibold hover:bg-[#082219] transition-all"
          >
            Abrir conta
          </Link>
        </div>
      </div>
    </nav>
  );
}
