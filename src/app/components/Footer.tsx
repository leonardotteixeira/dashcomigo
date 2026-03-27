export function Footer() {
  return (
    <footer className="bg-[#111218] text-[#9C9EAB] py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Hub do Empreendedor" className="h-26 w-auto" />
              <span className="text-lg font-bold text-white">Hub do Empreendedor</span>
            </div>
            <p className="text-[#868898] leading-relaxed max-w-md text-sm">
              Plataforma completa para empreendedores tomarem decisões inteligentes sobre regime tributário,
              controlarem finanças e crescerem com segurança.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-[#DEDFE3] font-bold mb-4">Recursos</h3>
            <ul className="space-y-3">
              <li>
                <a href="#simulador" className="text-[#868898] hover:text-[#2DDB81] transition-colors text-sm">
                  Simulador
                </a>
              </li>
              <li>
                <a href="#beneficios" className="text-[#868898] hover:text-[#2DDB81] transition-colors text-sm">
                  Benefícios
                </a>
              </li>
              <li>
                <a href="#depoimentos" className="text-[#868898] hover:text-[#2DDB81] transition-colors text-sm">
                  Depoimentos
                </a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-[#DEDFE3] font-bold mb-4">Informações</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-[#868898] hover:text-[#2DDB81] transition-colors text-sm">
                  Sobre o MEI
                </a>
              </li>
              <li>
                <a href="#" className="text-[#868898] hover:text-[#2DDB81] transition-colors text-sm">
                  Como migrar
                </a>
              </li>
              <li>
                <a href="#" className="text-[#868898] hover:text-[#2DDB81] transition-colors text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#45485F]">
            &copy; 2026 Hub do Empreendedor. Todos os direitos reservados.
          </p>

          <div className="flex gap-6 text-sm">
            <a href="#" className="text-[#868898] hover:text-[#2DDB81] transition-colors">
              Termos de Uso
            </a>
            <a href="#" className="text-[#868898] hover:text-[#2DDB81] transition-colors">
              Privacidade
            </a>
            <a href="#" className="text-[#868898] hover:text-[#2DDB81] transition-colors">
              Contato
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-[#1B1B1B] rounded-2xl border border-white/5">
          <p className="text-xs text-[#45485F] leading-relaxed">
            <strong className="text-[#868898]">Aviso Legal:</strong> Esta ferramenta fornece simulações aproximadas
            baseadas em dados gerais do Simples Nacional e MEI. Os valores reais podem variar dependendo de diversos
            fatores específicos do seu negócio. Recomendamos consultar um contador para análises precisas e
            personalizadas.
          </p>
        </div>
      </div>
    </footer>
  );
}
