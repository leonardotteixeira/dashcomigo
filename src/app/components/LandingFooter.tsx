import { TrendingUp } from "lucide-react";
import { Link } from "react-router";

export function LandingFooter() {
  return (
    <footer className="bg-[#001529] border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">FinMEI</span>
            </div>
            <p className="text-sm text-white/60">
              Gestão financeira inteligente para microempreendedores individuais.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Produto</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="/#ferramentas" className="hover:text-white transition-colors">Ferramentas</a></li>
              <li><a href="/#beneficios" className="hover:text-white transition-colors">Benefícios</a></li>
              <li><a href="/#planos" className="hover:text-white transition-colors">Planos</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/sobre" className="hover:text-white transition-colors">Sobre</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/contato" className="hover:text-white transition-colors">Contato</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/privacidade" className="hover:text-white transition-colors">Privacidade</Link></li>
              <li><Link to="/termos-de-uso" className="hover:text-white transition-colors">Termos</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-sm text-white/60">
          <p>&copy; 2026 FinMEI. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
