import { Link } from "react-router";
import { TrendingUp } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center justify-center px-6">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 rounded-xl bg-[#003a6d] flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <span className="font-extrabold text-2xl text-[#001529]">FinMEI</span>
      </div>

      <p className="font-extrabold text-[#003a6d] text-8xl mb-4 leading-none">404</p>
      <h1 className="font-bold text-[#001529] text-3xl mb-3 text-center">Página não encontrada</h1>
      <p className="text-[#001529]/60 text-lg mb-10 text-center max-w-md">
        A página que você está procurando não existe ou foi movida.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="bg-[#003a6d] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#002a50] transition-all text-center"
        >
          Voltar ao início
        </Link>
        <Link
          to="/app/dashboard"
          className="border border-[#003a6d] text-[#003a6d] px-6 py-3 rounded-lg font-semibold hover:bg-[#003a6d]/5 transition-all text-center"
        >
          Ir ao Dashboard
        </Link>
      </div>
    </div>
  );
}
