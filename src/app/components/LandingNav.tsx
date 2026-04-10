import { TrendingUp } from "lucide-react";
import { Link } from "react-router";

export function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#003a6d] flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <span className="font-extrabold text-2xl text-[#001529]">FinMEI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/ferramentas" className="text-[#001529]/70 hover:text-[#001529] transition-colors font-semibold">
            Ferramentas
          </Link>
          <Link to="/beneficios" className="text-[#001529]/70 hover:text-[#001529] transition-colors font-semibold">
            Benefícios
          </Link>
          <Link to="/planos" className="text-[#001529]/70 hover:text-[#001529] transition-colors font-semibold">
            Planos
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-[#001529] font-semibold hover:text-[#003a6d] transition-colors"
          >
            Entrar
          </Link>
          <Link
            to="/signup"
            className="bg-[#003a6d] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#002a50] transition-all"
          >
            Abrir conta
          </Link>
        </div>
      </div>
    </nav>
  );
}
