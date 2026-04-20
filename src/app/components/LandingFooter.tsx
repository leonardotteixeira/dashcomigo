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
            <h4 className="font-bold mb-4" style={{ color: "#F4EFE6" }}>Produto</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/ferramentas" style={{ color: "rgba(244,239,230,0.6)" }} onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#F4EFE6"; }} onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(244,239,230,0.6)"; }}>Ferramentas</Link></li>
              <li><Link to="/beneficios" style={{ color: "rgba(244,239,230,0.6)" }} onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#F4EFE6"; }} onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(244,239,230,0.6)"; }}>Benefícios</Link></li>
              <li><Link to="/planos" style={{ color: "rgba(244,239,230,0.6)" }} onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#F4EFE6"; }} onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(244,239,230,0.6)"; }}>Planos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4" style={{ color: "#F4EFE6" }}>Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/sobre" style={{ color: "rgba(244,239,230,0.6)" }} onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#F4EFE6"; }} onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(244,239,230,0.6)"; }}>Sobre</Link></li>
              <li><Link to="/blog" style={{ color: "rgba(244,239,230,0.6)" }} onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#F4EFE6"; }} onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(244,239,230,0.6)"; }}>Blog</Link></li>
              <li><Link to="/contato" style={{ color: "rgba(244,239,230,0.6)" }} onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#F4EFE6"; }} onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(244,239,230,0.6)"; }}>Contato</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4" style={{ color: "#F4EFE6" }}>Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacidade" style={{ color: "rgba(244,239,230,0.6)" }} onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#F4EFE6"; }} onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(244,239,230,0.6)"; }}>Privacidade</Link></li>
              <li><Link to="/termos-de-uso" style={{ color: "rgba(244,239,230,0.6)" }} onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#F4EFE6"; }} onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(244,239,230,0.6)"; }}>Termos</Link></li>
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
