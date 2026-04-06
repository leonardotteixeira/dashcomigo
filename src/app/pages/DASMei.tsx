import { useState, useEffect, useMemo } from "react";
import { CheckCircle, Clock, AlertTriangle, FileText, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCashFlow } from "../contexts/CashFlowContext";
import { pb } from "../../lib/pocketbase";
import { toast } from "sonner";

// ─── DAS-MEI 2026 values (salário mínimo R$1.518,00) ────────────────────────
const SALARIO_MINIMO = 1518.0;
const INSS = parseFloat((SALARIO_MINIMO * 0.05).toFixed(2)); // 5% = R$75,90

const ATIVIDADES = [
  { id: "comercio",              label: "Comércio",                  icms: 1.0,  iss: 0.0,  desc: "Vendas de produtos" },
  { id: "servicos",              label: "Serviços",                  icms: 0.0,  iss: 5.0,  desc: "Prestação de serviços" },
  { id: "comercio_servicos",     label: "Comércio + Serviços",       icms: 1.0,  iss: 5.0,  desc: "Ambas as atividades" },
  { id: "transp_cargas",         label: "Transporte de Cargas",      icms: 1.0,  iss: 0.0,  desc: "Frete e logística" },
  { id: "transp_passageiros",    label: "Transporte de Passageiros", icms: 0.0,  iss: 5.0,  desc: "Táxi, mototáxi etc." },
] as const;

type AtividadeId = typeof ATIVIDADES[number]["id"];

function getValorDAS(atividadeId: AtividadeId): number {
  const a = ATIVIDADES.find((x) => x.id === atividadeId);
  if (!a) return INSS + 5.0;
  return parseFloat((INSS + a.icms + a.iss).toFixed(2));
}

// ─── Month helpers ───────────────────────────────────────────────────────────
function getMesKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getMesLabel(date: Date): string {
  return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

function getVencimento(year: number, month: number): Date {
  // Vence dia 20 do mês seguinte
  const d = new Date(year, month, 20); // month is 0-indexed, so this is already next month's 20th
  return d;
}

function getLast12Months(): Date[] {
  const months: Date[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    months.push(new Date(now.getFullYear(), now.getMonth() - i, 1));
  }
  return months;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function DASMei() {
  const { user } = useAuth();
  const { transactions, addTransaction } = useCashFlow();

  const [atividade, setAtividade] = useState<AtividadeId>(() => {
    return (localStorage.getItem("das_atividade") as AtividadeId) ?? "servicos";
  });
  const [paying, setPaying] = useState<string | null>(null); // mesKey being paid
  const [showInfo, setShowInfo] = useState(false);

  const valorDAS = getValorDAS(atividade);

  // Persist activity choice
  useEffect(() => {
    localStorage.setItem("das_atividade", atividade);
  }, [atividade]);

  // Build payment map from existing transactions (categoria = "DAS-MEI")
  const paidMonths = useMemo(() => {
    const map: Record<string, { data: string; valor: number }> = {};
    transactions
      .filter((t) => t.tipo === "saida" && t.categoria === "DAS-MEI")
      .forEach((t) => {
        const key = t.data.slice(0, 7); // "YYYY-MM"
        if (!map[key]) map[key] = { data: t.data, valor: t.valor };
      });
    return map;
  }, [transactions]);

  const months = getLast12Months();
  const now = new Date();
  const currentMesKey = getMesKey(now);

  const handlePagar = async (date: Date) => {
    if (!user) return;
    const mesKey = getMesKey(date);
    if (paidMonths[mesKey]) return;

    setPaying(mesKey);
    try {
      // Due date: 20th of next month — we register as the 20th of next month
      const venc = getVencimento(date.getFullYear(), date.getMonth() + 1);
      const dataStr = `${venc.getFullYear()}-${String(venc.getMonth() + 1).padStart(2, "0")}-20`;
      const mesLabel = getMesLabel(date);

      await addTransaction({
        tipo: "saida",
        categoria: "DAS-MEI",
        valor: valorDAS,
        data: dataStr,
        descricao: `DAS-MEI — ${mesLabel.charAt(0).toUpperCase() + mesLabel.slice(1)}`,
      });

      toast.success(`DAS de ${mesLabel} marcado como pago!`);
    } catch (err) {
      toast.error("Erro ao registrar pagamento");
    }
    setPaying(null);
  };

  const atividadeInfo = ATIVIDADES.find((a) => a.id === atividade)!;

  return (
    <div className="min-h-screen bg-[#141414] px-4 md:px-8 py-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">DAS-MEI</h1>
          <p className="text-[#A1A1A1]">Controle o pagamento mensal do Documento de Arrecadação do Simples Nacional</p>
        </div>

        {/* Atividade selector */}
        <div className="bg-[#1B1B1B] border border-white/10 rounded-xl p-5">
          <label className="text-sm font-medium text-white mb-3 block">Sua atividade principal</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ATIVIDADES.map((a) => {
              const valor = getValorDAS(a.id);
              const selected = atividade === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => setAtividade(a.id)}
                  className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                    selected
                      ? "border-[#2DDB81] bg-[#2DDB81]/10"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div>
                    <p className={`text-sm font-medium ${selected ? "text-[#2DDB81]" : "text-white"}`}>{a.label}</p>
                    <p className="text-xs text-[#686F6F]">{a.desc}</p>
                  </div>
                  <span className={`text-sm font-bold whitespace-nowrap ml-3 ${selected ? "text-[#2DDB81]" : "text-[#A1A1A1]"}`}>
                    R$ {valor.toFixed(2).replace(".", ",")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current month hero card */}
        {(() => {
          const isPago = !!paidMonths[currentMesKey];
          const venc = getVencimento(now.getFullYear(), now.getMonth() + 1);
          const isVencido = !isPago && new Date() > venc;
          const diasRestantes = Math.ceil((venc.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

          return (
            <div
              className={`rounded-xl border p-6 ${
                isPago
                  ? "border-[#2DDB81]/30 bg-[#2DDB81]/8"
                  : isVencido
                  ? "border-[#F74C4C]/30 bg-[#F74C4C]/8"
                  : diasRestantes <= 5
                  ? "border-[#F4B23C]/30 bg-[#F4B23C]/8"
                  : "border-white/10 bg-[#1B1B1B]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {isPago
                      ? <CheckCircle className="w-5 h-5 text-[#2DDB81]" />
                      : isVencido
                      ? <AlertTriangle className="w-5 h-5 text-[#F74C4C]" />
                      : <Clock className="w-5 h-5 text-[#F4B23C]" />}
                    <span className={`text-sm font-medium ${isPago ? "text-[#2DDB81]" : isVencido ? "text-[#F74C4C]" : "text-[#F4B23C]"}`}>
                      {isPago ? "Pago" : isVencido ? "Vencido" : diasRestantes <= 5 ? `Vence em ${diasRestantes} dia${diasRestantes !== 1 ? "s" : ""}` : "Pendente"}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white capitalize">{getMesLabel(now)}</h2>
                  <p className="text-[#686F6F] text-sm mt-0.5">
                    Vencimento: dia 20/{String(venc.getMonth() + 1).padStart(2, "0")}/{venc.getFullYear()} · {atividadeInfo.label}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-[#686F6F]">Valor do DAS</p>
                    <p className="text-3xl font-bold text-white">
                      R$ {valorDAS.toFixed(2).replace(".", ",")}
                    </p>
                    <p className="text-xs text-[#686F6F]">INSS R${INSS.toFixed(2).replace(".", ",")} + impostos</p>
                  </div>
                  {!isPago && (
                    <button
                      onClick={() => handlePagar(now)}
                      disabled={paying === currentMesKey}
                      className="flex-shrink-0 px-5 py-2.5 bg-[#2DDB81] hover:bg-[#28C974] text-black font-bold rounded-xl text-sm transition-colors disabled:opacity-50"
                    >
                      {paying === currentMesKey ? "Salvando..." : "Marcar pago"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Info expandable */}
        <div className="bg-[#1B1B1B] border border-white/10 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-white/3 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#2DDB81]" />
              <span className="text-sm font-medium text-white">Como funciona o DAS-MEI?</span>
            </div>
            {showInfo ? <ChevronUp className="w-4 h-4 text-[#686F6F]" /> : <ChevronDown className="w-4 h-4 text-[#686F6F]" />}
          </button>
          {showInfo && (
            <div className="px-4 pb-4 space-y-3 text-sm text-[#A1A1A1]">
              <p>O DAS-MEI é o pagamento mensal obrigatório do MEI, composto por:</p>
              <ul className="space-y-1.5 ml-4">
                <li>• <strong className="text-white">INSS:</strong> 5% do salário mínimo (R${INSS.toFixed(2).replace(".", ",")} em 2026)</li>
                <li>• <strong className="text-white">ICMS:</strong> R$1,00 — para atividades de comércio e transporte</li>
                <li>• <strong className="text-white">ISS:</strong> R$5,00 — para atividades de serviços</li>
              </ul>
              <p>Vence sempre no <strong className="text-white">dia 20 do mês seguinte</strong> ao de competência.</p>
              <p className="text-[#686F6F] text-xs">Ao marcar como pago, o valor é lançado automaticamente no Fluxo de Caixa (categoria DAS-MEI) e aparece no DRE em Impostos.</p>
            </div>
          )}
        </div>

        {/* History — last 12 months */}
        <div className="bg-[#1B1B1B] border border-white/10 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-white/10">
            <h3 className="font-semibold text-white">Histórico — últimos 12 meses</h3>
          </div>
          <div className="divide-y divide-white/5">
            {[...months].reverse().map((date) => {
              const mesKey = getMesKey(date);
              const pago = paidMonths[mesKey];
              const isCurrent = mesKey === currentMesKey;
              const venc = getVencimento(date.getFullYear(), date.getMonth() + 1);
              const isFuture = date > now;
              const isVencido = !pago && !isFuture && new Date() > venc;

              return (
                <div key={mesKey} className={`flex items-center justify-between px-5 py-3.5 ${isCurrent ? "bg-white/3" : ""}`}>
                  <div className="flex items-center gap-3">
                    {pago
                      ? <CheckCircle className="w-4 h-4 text-[#2DDB81] flex-shrink-0" />
                      : isFuture
                      ? <div className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0" />
                      : isVencido
                      ? <AlertTriangle className="w-4 h-4 text-[#F74C4C] flex-shrink-0" />
                      : <Clock className="w-4 h-4 text-[#F4B23C] flex-shrink-0" />}
                    <div>
                      <p className={`text-sm font-medium capitalize ${isCurrent ? "text-white" : "text-[#A1A1A1]"}`}>
                        {getMesLabel(date)}
                        {isCurrent && <span className="ml-2 text-xs text-[#2DDB81] font-normal">mês atual</span>}
                      </p>
                      <p className="text-xs text-[#686F6F]">
                        Venc. 20/{String(venc.getMonth() + 1).padStart(2, "0")}/{venc.getFullYear()}
                        {pago && ` · Pago em ${new Date(pago.data).toLocaleDateString("pt-BR")}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {pago ? (
                      <div className="text-right">
                        <span className="text-sm text-[#2DDB81] font-medium">R$ {pago.valor.toFixed(2).replace(".", ",")}</span>
                      </div>
                    ) : isFuture ? (
                      <span className="text-xs text-[#686F6F]">R$ {valorDAS.toFixed(2).replace(".", ",")}</span>
                    ) : (
                      <button
                        onClick={() => handlePagar(date)}
                        disabled={paying === mesKey}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                          isVencido
                            ? "bg-[#F74C4C]/20 text-[#F74C4C] hover:bg-[#F74C4C]/30"
                            : "bg-[#2DDB81]/20 text-[#2DDB81] hover:bg-[#2DDB81]/30"
                        } disabled:opacity-50`}
                      >
                        {paying === mesKey ? "..." : "Marcar pago"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        {Object.keys(paidMonths).length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#1B1B1B] border border-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-[#2DDB81]">{Object.keys(paidMonths).length}</p>
              <p className="text-xs text-[#686F6F] mt-1">Meses pagos</p>
            </div>
            <div className="bg-[#1B1B1B] border border-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">
                R$ {Object.values(paidMonths).reduce((s, p) => s + p.valor, 0).toFixed(2).replace(".", ",")}
              </p>
              <p className="text-xs text-[#686F6F] mt-1">Total pago</p>
            </div>
            <div className="bg-[#1B1B1B] border border-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-[#F4B23C]">
                R$ {(valorDAS * 12).toFixed(2).replace(".", ",")}
              </p>
              <p className="text-xs text-[#686F6F] mt-1">Custo anual est.</p>
            </div>
          </div>
        )}

        <p className="text-xs text-[#686F6F] text-center pb-4">
          Valores baseados no salário mínimo de 2026 (R${SALARIO_MINIMO.toLocaleString("pt-BR")}). Para emitir a guia oficial, acesse o{" "}
          <a href="https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/servicos-para-mei/pagamento-das-mei" target="_blank" rel="noopener noreferrer" className="text-[#2DDB81] hover:underline">
            Portal do Empreendedor
          </a>.
        </p>
      </div>
    </div>
  );
}
