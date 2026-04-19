import { Link } from "react-router";
import { Logo } from "./ui/Logo";

export function LandingFooter() {
  return (
    <footer className="bg-[#0E3B2E] border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <Logo variant="knockout" />
            </div>
            <p className="text-sm text-white/60">
              Gestão financeira inteligente para microempreendedores individuais.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Produto</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/ferramentas" className="hover:text-white transition-colors">Ferramentas</Link></li>
              <li><Link to="/beneficios" className="hover:text-white transition-colors">Benefícios</Link></li>
              <li><Link to="/planos" className="hover:text-white transition-colors">Planos</Link></li>
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
          <p>&copy; 2026 DashComigo. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
