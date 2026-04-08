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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#001529] mb-1">DAS-MEI</h1>
        <p className="text-[rgba(0,21,41,0.6)]">Controle o pagamento mensal do Documento de Arrecadação do Simples Nacional</p>
      </div>

        {/* Atividade selector */}
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-xl p-5">
          <label className="text-sm font-medium text-[#001529] mb-3 block">Sua atividade principal</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ATIVIDADES.map((a) => {
              const valor = getValorDAS(a.id);
              const selected = atividade === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => setAtividade(a.id)}
                  className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${selected ? "border-[#28A263] bg-[#28A263]/10" : "border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.15)]"}`}
                >
                  <div>
                    <p className={`text-sm font-medium ${selected ? "text-[#28A263]" : "text-[#001529]"}`}>{a.label}</p>
                    <p className="text-xs text-[rgba(0,21,41,0.5)]">{a.desc}</p>
                  </div>
                  <span className={`text-sm font-bold whitespace-nowrap ml-3 ${selected ? "text-[#28A263]" : "text-[rgba(0,21,41,0.6)]"}`}>
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
              className={`rounded-xl border p-6 ${isPago ? "border-[#28A263]/30 bg-[#28A263]/8" : isVencido ? "border-red-500/30 bg-red-50" : diasRestantes <= 5 ? "border-yellow-400/30 bg-yellow-50" : "border-[rgba(0,0,0,0.1)] bg-[#F8F9FA]"}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {isPago
                      ? <CheckCircle className="w-5 h-5 text-[#28A263]" />
                      : isVencido
                      ? <AlertTriangle className="w-5 h-5 text-red-500" />
                      : <Clock className="w-5 h-5 text-yellow-600" />}
                    <span className={`text-sm font-medium ${isPago ? "text-[#28A263]" : isVencido ? "text-red-500" : "text-yellow-600"}`}>
                      {isPago ? "Pago" : isVencido ? "Vencido" : diasRestantes <= 5 ? `Vence em ${diasRestantes} dia${diasRestantes !== 1 ? "s" : ""}` : "Pendente"}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[#001529] capitalize">{getMesLabel(now)}</h2>
                  <p className="text-[rgba(0,21,41,0.5)] text-sm mt-0.5">
                    {`Vencimento: dia 20/${String(venc.getMonth() + 1).padStart(2, "0")}/${venc.getFullYear()}`} · {atividadeInfo.label}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-[rgba(0,21,41,0.5)]">Valor do DAS</p>
                    <p className="text-3xl font-bold text-[#001529]">
                      R$ {valorDAS.toFixed(2).replace(".", ",")}
                    </p>
                    <p className="text-xs text-[rgba(0,21,41,0.5)]">INSS R${INSS.toFixed(2).replace(".", ",")} + impostos</p>
                  </div>
                  {!isPago && (
                    <button
                      onClick={() => handlePagar(now)}
                      disabled={paying === currentMesKey}
                      className="flex-shrink-0 px-5 py-2.5 bg-[#28A263] hover:bg-[#1f7a4a] text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-50"
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
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-xl overflow-hidden">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-[#F8F9FA] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#28A263]" />
              <span className="text-sm font-medium text-[#001529]">Como funciona o DAS-MEI?</span>
            </div>
            {showInfo ? <ChevronUp className="w-4 h-4 text-[rgba(0,21,41,0.5)]" /> : <ChevronDown className="w-4 h-4 text-[rgba(0,21,41,0.5)]" />}
          </button>
          {showInfo && (
            <div className="px-4 pb-4 space-y-3 text-sm text-[rgba(0,21,41,0.6)]">
              <p>O DAS-MEI é o pagamento mensal obrigatório do MEI, composto por:</p>
              <ul className="space-y-1.5 ml-4">
                <li>• <strong className="text-[#001529]">INSS:</strong> 5% do salário mínimo (R${INSS.toFixed(2).replace(".", ",")} em 2026)</li>
                <li>• <strong className="text-[#001529]">ICMS:</strong> R$1,00 — para atividades de comércio e transporte</li>
                <li>• <strong className="text-[#001529]">ISS:</strong> R$5,00 — para atividades de serviços</li>
              </ul>
              <p>Vence sempre no <strong className="text-[#001529]">dia 20 do mês seguinte</strong> ao de competência.</p>
              <p className="text-[rgba(0,21,41,0.5)] text-xs">Ao marcar como pago, o valor é lançado automaticamente no Fluxo de Caixa (categoria DAS-MEI) e aparece no DRE em Impostos.</p>
            </div>
          )}
        </div>

        {/* History — last 12 months */}
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[rgba(0,0,0,0.1)]">
            <h3 className="font-semibold text-[#001529]">Histórico — últimos 12 meses</h3>
          </div>
          <div className="divide-y divide-[rgba(0,0,0,0.05)]">
            {[...months].reverse().map((date) => {
              const mesKey = getMesKey(date);
              const pago = paidMonths[mesKey];
              const isCurrent = mesKey === currentMesKey;
              const venc = getVencimento(date.getFullYear(), date.getMonth() + 1);
              const isFuture = date > now;
              const isVencido = !pago && !isFuture && new Date() > venc;

              return (
                <div key={mesKey} className={`flex items-center justify-between px-5 py-3.5 ${isCurrent ? "bg-[#F8F9FA]" : ""}`}>
                  <div className="flex items-center gap-3">
                    {pago
                      ? <CheckCircle className="w-4 h-4 text-[#28A263] flex-shrink-0" />
                      : isFuture
                      ? <div className="w-4 h-4 rounded-full border border-[rgba(0,0,0,0.15)] flex-shrink-0" />
                      : isVencido
                      ? <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      : <Clock className="w-4 h-4 text-yellow-600 flex-shrink-0" />}
                    <div>
                      <p className={`text-sm font-medium capitalize ${isCurrent ? "text-[#001529]" : "text-[rgba(0,21,41,0.6)]"}`}>
                        {getMesLabel(date)}
                        {isCurrent && <span className="ml-2 text-xs text-[#28A263] font-normal">mês atual</span>}
                      </p>
                      <p className="text-xs text-[rgba(0,21,41,0.5)]">
                        {`Venc. 20/${String(venc.getMonth() + 1).padStart(2, "0")}/${venc.getFullYear()}`}
                        {pago && ` · Pago em ${new Date(pago.data).toLocaleDateString("pt-BR")}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {pago ? (
                      <div className="text-right">
                        <span className="text-sm text-[#28A263] font-medium">R$ {pago.valor.toFixed(2).replace(".", ",")}</span>
                      </div>
                    ) : isFuture ? (
                      <span className="text-xs text-[rgba(0,21,41,0.5)]">R$ {valorDAS.toFixed(2).replace(".", ",")}</span>
                    ) : (
                      <button
                        onClick={() => handlePagar(date)}
                        disabled={paying === mesKey}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${isVencido ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-[#28A263]/10 text-[#28A263] hover:bg-[#28A263]/20"} disabled:opacity-50`}
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
            <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-[#28A263]">{Object.keys(paidMonths).length}</p>
              <p className="text-xs text-[rgba(0,21,41,0.5)] mt-1">Meses pagos</p>
            </div>
            <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-[#001529]">
                R$ {Object.values(paidMonths).reduce((s, p) => s + p.valor, 0).toFixed(2).replace(".", ",")}
              </p>
              <p className="text-xs text-[rgba(0,21,41,0.5)] mt-1">Total pago</p>
            </div>
            <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">
                R$ {(valorDAS * 12).toFixed(2).replace(".", ",")}
              </p>
              <p className="text-xs text-[rgba(0,21,41,0.5)] mt-1">Custo anual est.</p>
            </div>
          </div>
        )}

        <p className="text-xs text-[rgba(0,21,41,0.5)] text-center pb-4">
          Valores baseados no salário mínimo de 2026 (R${SALARIO_MINIMO.toLocaleString("pt-BR")}). Para emitir a guia oficial, acesse o{" "}
          <a href="https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/servicos-para-mei/pagamento-das-mei" target="_blank" rel="noopener noreferrer" className="text-[#28A263] hover:underline">
            Portal do Empreendedor
          </a>.
        </p>
      </div>
    </div>
  );
}
