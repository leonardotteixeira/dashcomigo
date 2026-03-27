import { useState } from "react";
import { FileText, Download, Send, Eye, Info, Crown, Copy, Check, Sparkles } from "lucide-react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type Template = "basico" | "detalhado" | "premium";

const TEMPLATES: { id: Template; label: string; desc: string; badge?: string }[] = [
  { id: "basico", label: "Básico", desc: "Simples e direto ao ponto" },
  { id: "detalhado", label: "Detalhado", desc: "Inclui escopo e cronograma", badge: "Popular" },
  { id: "premium", label: "Premium", desc: "Header destacado e termos", badge: "PRO" },
];

export function GeradorPropostas() {
  const { user, incrementProposalUsage } = useAuth();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template>("basico");
  const [nomeCliente, setNomeCliente] = useState("");
  const [emailCliente, setEmailCliente] = useState("");
  const [nomeServico, setNomeServico] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState(0);
  const [prazo, setPrazo] = useState("");
  const [condicoesPagamento, setCondicoesPagamento] = useState("50-50");
  const [validade, setValidade] = useState(7);
  const [limitDialogOpen, setLimitDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const FREE_LIMIT = 2;
  const limite = user?.plan === "pro" ? Infinity : FREE_LIMIT;
  const usageCount = user?.proposalUsageToday ?? 0;
  const limitReached = usageCount >= limite;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const formatDate = (daysFromNow: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  };

  const getValorParcela = () => {
    if (condicoesPagamento === "50-50") return valor / 2;
    if (condicoesPagamento === "30-70") return valor * 0.3;
    if (condicoesPagamento === "3x") return valor / 3;
    return valor;
  };

  const getPagamentoText = () => {
    if (condicoesPagamento === "integral") return `À vista: ${formatCurrency(valor)}`;
    if (condicoesPagamento === "50-50") return `50%/50%: ${formatCurrency(valor / 2)} entrada + ${formatCurrency(valor / 2)} na entrega`;
    if (condicoesPagamento === "30-70") return `30%/70%: ${formatCurrency(valor * 0.3)} entrada + ${formatCurrency(valor * 0.7)} na entrega`;
    return `3x de ${formatCurrency(valor / 3)} sem juros`;
  };

  const getProposalText = () => {
    const lines = [
      `PROPOSTA COMERCIAL`,
      `Data: ${new Date().toLocaleDateString("pt-BR")}`,
      ``,
      `CLIENTE`,
      `Nome: ${nomeCliente || "[Nome do Cliente]"}`,
      `Email: ${emailCliente || "[email@cliente.com]"}`,
      ``,
      `PROJETO`,
      `Serviço: ${nomeServico || "[Nome do Serviço]"}`,
      ``,
      `Descrição:`,
      descricao || "[Descrição do projeto]",
      ``,
    ];

    if (template === "detalhado" || template === "premium") {
      lines.push(
        `ESCOPO DE ENTREGA`,
        `• Levantamento de requisitos e planejamento`,
        `• Desenvolvimento e implementação`,
        `• Revisões e ajustes`,
        `• Entrega final e suporte inicial`,
        ``,
        `CRONOGRAMA`,
        `• Início: Após aprovação e pagamento da entrada`,
        `• Prazo total: ${prazo || "[prazo]"}`,
        ``
      );
    }

    lines.push(
      `INVESTIMENTO`,
      `Valor total: ${formatCurrency(valor)}`,
      `Condições: ${getPagamentoText()}`,
      ``,
      `PRAZO DE ENTREGA: ${prazo || "[prazo]"}`,
      `VALIDADE: ${formatDate(validade)}`,
    );

    if (template === "premium") {
      lines.push(
        ``,
        `TERMOS E CONDIÇÕES`,
        `• O projeto inicia após pagamento da entrada`,
        `• Revisões incluídas: até 2 rodadas`,
        `• Direitos autorais transferidos após pagamento integral`,
        `• Alterações fora do escopo serão orçadas separadamente`,
      );
    }

    lines.push(``, `Hub do Empreendedor`, `contato@hubempreendedor.com.br`);

    return lines.join("\n");
  };

  const checkLimitAndRun = async (action: () => void) => {
    if (limitReached) {
      setLimitDialogOpen(true);
      return;
    }
    action();
    try {
      await incrementProposalUsage();
    } catch {
      // não bloqueia a ação principal se o contador falhar
    }
  };

  const handleDownloadPDF = () => {
    checkLimitAndRun(() => {
      document.body.classList.add("printing-proposal");
      window.print();
      document.body.classList.remove("printing-proposal");
      toast.success("Use Ctrl+P → Salvar como PDF para baixar!");
    });
  };

  const handleSendEmail = () => {
    checkLimitAndRun(() => {
      const body = getProposalText();
      window.open(
        `mailto:${emailCliente}?subject=${encodeURIComponent(`Proposta Comercial - ${nomeServico}`)}&body=${encodeURIComponent(body)}`
      );
      toast.success("Cliente de email aberto!");
    });
  };

  const handleCopyText = () => {
    const text = getProposalText();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("Proposta copiada para a área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const inputClass = "bg-[#141414] border-white/10 text-white placeholder:text-[#686F6F] rounded-xl focus:border-[#28A263]";

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div className="w-12 h-12 bg-[#2DDB81]/20 rounded-2xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-[#2DDB81]" />
          </div>
          Gerador de Propostas Comerciais
        </h1>
        <p className="text-[#A1A1A1]">
          Crie propostas profissionais em minutos com preview em tempo real
        </p>
      </div>

      {/* Info Alert + counter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex-1">
          <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-300">
            Preencha os campos ao lado e veja sua proposta sendo gerada em tempo real.
            Você pode baixar em PDF, copiar o texto ou enviar diretamente por email.
          </p>
        </div>
        {user?.plan !== "pro" && (
          <span className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full border font-medium ${
            limitReached
              ? "bg-red-500/10 text-red-400 border-red-500/20"
              : "bg-[#28A263]/10 text-[#2DDB81] border-[#28A263]/20"
          }`}>
            {usageCount}/{FREE_LIMIT} propostas hoje
          </span>
        )}
      </div>

      {/* Template Selector */}
      <div className="p-5 bg-[#1B1B1B] rounded-2xl border border-white/5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-[#2DDB81]" />
          <h3 className="text-sm font-bold text-white">Escolha o modelo da proposta</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={`relative p-4 rounded-xl border text-left transition-all ${
                template === t.id
                  ? "border-[#28A263] bg-[#28A263]/10"
                  : "border-white/10 bg-[#141414] hover:border-white/20"
              }`}
            >
              {t.badge && (
                <span className={`absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                  t.badge === "PRO"
                    ? "bg-[#28A263]/20 text-[#2DDB81]"
                    : "bg-blue-500/20 text-blue-400"
                }`}>
                  {t.badge}
                </span>
              )}
              <p className={`font-bold text-sm mb-1 ${template === t.id ? "text-[#2DDB81]" : "text-white"}`}>
                {t.label}
              </p>
              <p className="text-xs text-[#686F6F]">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Dialog - Limit */}
      <Dialog open={limitDialogOpen} onOpenChange={setLimitDialogOpen}>
        <DialogContent className="max-w-md text-center bg-[#1B1B1B] border-white/10">
          <DialogHeader>
            <div className="flex justify-center mb-4 mt-2">
              <div className="w-16 h-16 bg-[#28A263]/20 rounded-2xl flex items-center justify-center">
                <Crown className="w-8 h-8 text-[#2DDB81]" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-white">
              Limite diário atingido!
            </DialogTitle>
            <DialogDescription className="text-[#A1A1A1] mt-2">
              Você usou todas as {FREE_LIMIT} propostas gratuitas de hoje.
              Faça upgrade para o PRO e gere propostas ilimitadas!
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button
              size="lg"
              className="w-full bg-[#28A263] hover:bg-[#2DDB81] text-white rounded-xl"
              onClick={() => { setLimitDialogOpen(false); navigate("/checkout"); }}
            >
              <Crown className="w-4 h-4 mr-2" />
              Ver Planos PRO
            </Button>
            <Button
              size="lg"
              className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl"
              onClick={() => setLimitDialogOpen(false)}
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="space-y-6">
          <div className="p-6 bg-[#1B1B1B] rounded-2xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-6">Dados do Cliente</h3>

            <div className="space-y-4">
              <div>
                <Label className="text-[#A1A1A1] mb-2 block">Nome do Cliente</Label>
                <Input
                  value={nomeCliente}
                  onChange={(e) => setNomeCliente(e.target.value)}
                  placeholder="Ex: João Silva"
                  className={inputClass}
                />
              </div>
              <div>
                <Label className="text-[#A1A1A1] mb-2 block">Email do Cliente</Label>
                <Input
                  type="email"
                  value={emailCliente}
                  onChange={(e) => setEmailCliente(e.target.value)}
                  placeholder="cliente@email.com"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#1B1B1B] rounded-2xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-6">Dados do Serviço</h3>

            <div className="space-y-4">
              <div>
                <Label className="text-[#A1A1A1] mb-2 block">Nome do Serviço/Projeto</Label>
                <Input
                  value={nomeServico}
                  onChange={(e) => setNomeServico(e.target.value)}
                  placeholder="Ex: Desenvolvimento de Website Institucional"
                  className={inputClass}
                />
              </div>

              <div>
                <Label className="text-[#A1A1A1] mb-2 block">Descrição Detalhada</Label>
                <Textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva o escopo do projeto, entregas, benefícios..."
                  className={`min-h-[120px] ${inputClass}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#A1A1A1] mb-2 block">Valor Total</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1A1]">R$</span>
                    <Input
                      type="number"
                      value={valor}
                      onChange={(e) => setValor(Number(e.target.value))}
                      className={`pl-10 ${inputClass}`}
                      min={0}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-[#A1A1A1] mb-2 block">Prazo de Entrega</Label>
                  <Input
                    value={prazo}
                    onChange={(e) => setPrazo(e.target.value)}
                    placeholder="Ex: 30 dias"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <Label className="text-[#A1A1A1] mb-2 block">Condições de Pagamento</Label>
                <Select value={condicoesPagamento} onValueChange={setCondicoesPagamento}>
                  <SelectTrigger className="bg-[#141414] border-white/10 text-white rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1B1B1B] border-white/10 text-white">
                    <SelectItem value="integral">À vista (integral)</SelectItem>
                    <SelectItem value="50-50">50% entrada + 50% entrega</SelectItem>
                    <SelectItem value="30-70">30% entrada + 70% entrega</SelectItem>
                    <SelectItem value="3x">3x sem juros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[#A1A1A1] mb-2 block">Validade da Proposta (dias)</Label>
                <Input
                  type="number"
                  value={validade}
                  onChange={(e) => setValidade(Number(e.target.value))}
                  className={inputClass}
                  min={1}
                  max={90}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button
              size="lg"
              className="flex-1 bg-[#28A263] hover:bg-[#2DDB81] text-white rounded-xl"
              onClick={handleDownloadPDF}
              disabled={!nomeCliente || !nomeServico}
            >
              <Download className="w-5 h-5 mr-2" />
              Baixar PDF
            </Button>

            <Button
              size="lg"
              className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl"
              onClick={handleCopyText}
              disabled={!nomeCliente || !nomeServico}
            >
              {copied ? (
                <Check className="w-5 h-5 mr-2 text-[#2DDB81]" />
              ) : (
                <Copy className="w-5 h-5 mr-2" />
              )}
              {copied ? "Copiado!" : "Copiar Texto"}
            </Button>

            <Button
              size="lg"
              className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl"
              onClick={handleSendEmail}
              disabled={!emailCliente || !nomeServico}
            >
              <Send className="w-5 h-5 mr-2" />
              Enviar Email
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-white/5 overflow-hidden">
            <div className="bg-[#1D1D1D] text-white px-6 py-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#2DDB81]" />
                <span className="font-bold text-white">Preview da Proposta</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                template === "basico" ? "bg-white/10 text-[#A1A1A1]" :
                template === "detalhado" ? "bg-blue-500/20 text-blue-400" :
                "bg-[#28A263]/20 text-[#2DDB81]"
              }`}>
                {TEMPLATES.find(t => t.id === template)?.label}
              </span>
            </div>

            {/* Document Preview */}
            <div className="p-8 bg-white min-h-[600px]">
              <div id="proposal-preview" className="space-y-6">

                {/* Premium Header */}
                {template === "premium" && (
                  <div className="bg-[#28A263] rounded-xl p-5 mb-2">
                    <h1 className="text-2xl font-bold text-white">Proposta Comercial</h1>
                    <p className="text-green-100 text-sm mt-1">
                      {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                    </p>
                  </div>
                )}

                {/* Basic/Detailed Header */}
                {template !== "premium" && (
                  <div className={`text-center pb-6 border-b-2 ${template === "detalhado" ? "border-blue-200" : "border-slate-200"}`}>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Proposta Comercial</h1>
                    <p className="text-slate-600">
                      {new Date().toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}

                {/* Client Info */}
                <div>
                  <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Cliente</h2>
                  <div className={`rounded-lg p-4 border ${template === "premium" ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200"}`}>
                    <p className="font-bold text-slate-900 text-lg">{nomeCliente || "[Nome do Cliente]"}</p>
                    <p className="text-slate-600 text-sm mt-1">{emailCliente || "[email@cliente.com]"}</p>
                  </div>
                </div>

                {/* Service Details */}
                <div>
                  <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Projeto</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Nome do Serviço</p>
                      <p className="font-bold text-slate-900 text-lg">
                        {nomeServico || "[Nome do Serviço/Projeto]"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Descrição</p>
                      <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {descricao || "[Descrição detalhada do projeto será exibida aqui]"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Scope — Detalhado & Premium */}
                {(template === "detalhado" || template === "premium") && (
                  <div>
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Escopo de Entrega</h2>
                    <ul className="space-y-2">
                      {[
                        "Levantamento de requisitos e planejamento",
                        "Desenvolvimento e implementação",
                        "Revisões e ajustes (até 2 rodadas)",
                        "Entrega final e suporte inicial",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Separator />

                {/* Investment */}
                <div>
                  <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Investimento</h2>

                  {template === "premium" ? (
                    <div className="border-2 border-[#28A263] rounded-xl p-6 text-center">
                      <p className="text-sm text-slate-500 mb-1">Valor Total do Projeto</p>
                      <p className="text-4xl font-bold text-[#28A263]">{formatCurrency(valor)}</p>
                      {condicoesPagamento !== "integral" && (
                        <p className="text-sm text-slate-600 mt-3">{getPagamentoText()}</p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                      <div className="text-center mb-4">
                        <p className="text-sm text-slate-600 mb-1">Valor Total</p>
                        <p className="text-4xl font-bold text-slate-900">{formatCurrency(valor)}</p>
                      </div>

                      {condicoesPagamento !== "integral" && (
                        <div className="pt-4 border-t border-green-200">
                          <p className="text-sm font-bold text-slate-700 mb-2">Condições de Pagamento:</p>
                          {condicoesPagamento === "50-50" && (
                            <div className="space-y-1 text-sm text-slate-700">
                              <p>• 1ª parcela: {formatCurrency(getValorParcela())} (entrada)</p>
                              <p>• 2ª parcela: {formatCurrency(getValorParcela())} (na entrega)</p>
                            </div>
                          )}
                          {condicoesPagamento === "30-70" && (
                            <div className="space-y-1 text-sm text-slate-700">
                              <p>• 1ª parcela: {formatCurrency(getValorParcela())} (entrada - 30%)</p>
                              <p>• 2ª parcela: {formatCurrency(valor * 0.7)} (na entrega - 70%)</p>
                            </div>
                          )}
                          {condicoesPagamento === "3x" && (
                            <div className="space-y-1 text-sm text-slate-700">
                              <p>• 3 parcelas mensais de {formatCurrency(getValorParcela())}</p>
                              <p className="text-xs text-slate-600">sem juros</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Timeline */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Prazo de Entrega</p>
                    <p className="font-bold text-slate-900">{prazo || "[Prazo]"}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Válida até</p>
                    <p className="font-bold text-slate-900">{formatDate(validade)}</p>
                  </div>
                </div>

                {/* Terms — Premium */}
                {template === "premium" && (
                  <>
                    <Separator />
                    <div>
                      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Termos e Condições</h2>
                      <ul className="space-y-1.5">
                        {[
                          "O projeto inicia após pagamento da entrada",
                          "Revisões incluídas: até 2 rodadas",
                          "Direitos autorais transferidos após pagamento integral",
                          "Alterações fora do escopo serão orçadas separadamente",
                        ].map((term) => (
                          <li key={term} className="text-sm text-slate-600 flex items-start gap-2">
                            <span className="text-slate-400 mt-0.5">•</span>
                            {term}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                <Separator />

                {/* Footer */}
                <div className="text-center pt-4">
                  <p className="text-sm text-slate-600 mb-4">
                    Estamos à disposição para esclarecer quaisquer dúvidas.
                  </p>
                  <div className={`rounded-lg p-4 text-xs text-slate-600 ${template === "premium" ? "bg-green-50 border border-green-200" : "bg-slate-100"}`}>
                    <p className="font-bold text-slate-900 mb-1">Hub do Empreendedor</p>
                    <p>contato@hubempreendedor.com.br</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
