import { useState, useEffect, useMemo } from "react";
import { CheckCircle, Clock, AlertTriangle, Info, ChevronDown, ChevronUp, ExternalLink, CreditCard } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCashFlow } from "../contexts/CashFlowContext";
import { pb } from "../../lib/pocketbase";
import { toast } from "sonner";
import { colors, spacing } from "../../utils/designTokens";
import { PremiumPageLayout } from "../components/PremiumPageLayout";

// DAS-MEI 2026 values (salário mínimo R$1.518,00)
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

// Month helpers
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

// Component
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
      // Store the transaction under the competency month (not the due-date month)
      // so that paidMonths[mesKey] resolves to the correct month.
      const dataStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-20`;
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
    <PremiumPageLayout
      title="DAS-MEI"
      description="Controle o pagamento mensal do Documento de Arrecadação do Simples Nacional"
    >
      <div className={spacing.sectionGap}>
        {/* Gerar DAS-MEI CTA */}
        <div className="rounded-2xl border p-6 shadow-sm" style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colors.primary}15` }}>
                <CreditCard className="w-6 h-6" style={{ color: colors.primary }} />
              </div>
              <div>
                <h3 className="font-bold text-base mb-1" style={{ color: colors.textPrimary }}>Emitir guia de pagamento</h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Você será redirecionado ao portal oficial do governo para gerar seu DAS-MEI.
                </p>
                {(user as any)?.cnpj ? (
                  <p className="text-xs mt-1 font-medium" style={{ color: colors.primary }}>
                    CNPJ: {(user as any).cnpj}
                  </p>
                ) : (
                  <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                    Tenha seu CNPJ em mãos para continuar.
                  </p>
                )}
              </div>
            </div>
            <a
              href="https://www8.receita.fazenda.gov.br/simplesnacional/aplicacoes/atspo/pgmei.app/identificacao"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm text-white transition-all hover:opacity-90"
              style={{ backgroundColor: colors.primary }}
            >
              Gerar DAS-MEI
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Activity Selector */}
        <div className="bg-[#EBE4D6] rounded-2xl p-6 shadow-sm border" style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}>
          <label className="text-sm font-medium mb-3 block" style={{ color: colors.textPrimary }}>Sua atividade principal</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ATIVIDADES.map((a) => {
              const valor = getValorDAS(a.id);
              const selected = atividade === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => setAtividade(a.id)}
                  className="flex items-center justify-between p-3 rounded-lg border text-left transition-all hover:border-opacity-80"
                  style={{
                    backgroundColor: selected ? `${colors.primary}/10` : colors.bgLight,
                    borderColor: selected ? colors.primary : colors.borderDefault
                  }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: selected ? colors.primary : colors.textPrimary }}>{a.label}</p>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>{a.desc}</p>
                  </div>
                  <span className="text-sm font-bold whitespace-nowrap ml-3" style={{ color: selected ? colors.primary : colors.textSecondary }}>
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

          const bgColor = isPago ? `${colors.success}/10` : isVencido ? `${colors.danger}/10` : diasRestantes <= 5 ? `${colors.warning}/10` : colors.bgLighter;
          const borderCol = isPago ? colors.success : isVencido ? colors.danger : diasRestantes <= 5 ? colors.warning : colors.borderDefault;
          const textCol = isPago ? colors.success : isVencido ? colors.danger : diasRestantes <= 5 ? colors.warning : colors.textSecondary;

          return (
            <div className="rounded-2xl border p-6 shadow-sm" style={{ backgroundColor: bgColor, borderColor: borderCol }}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {isPago
                      ? <CheckCircle className="w-5 h-5" style={{ color: colors.success }} />
                      : isVencido
                      ? <AlertTriangle className="w-5 h-5" style={{ color: colors.danger }} />
                      : <Clock className="w-5 h-5" style={{ color: colors.warning }} />}
                    <span className="text-sm font-medium" style={{ color: textCol }}>
                      {isPago ? "Pago" : isVencido ? "Vencido" : diasRestantes <= 5 ? `Vence em ${diasRestantes} dia${diasRestantes !== 1 ? "s" : ""}` : "Pendente"}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold capitalize" style={{ color: colors.textPrimary }}>{getMesLabel(now)}</h2>
                  <p className="text-sm mt-0.5" style={{ color: colors.textSecondary }}>
                    {`Vencimento: dia 20/${String(venc.getMonth() + 1).padStart(2, "0")}/${venc.getFullYear()}`} · {atividadeInfo.label}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs" style={{ color: colors.textSecondary }}>Valor do DAS</p>
                    <p className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
                      R$ {valorDAS.toFixed(2).replace(".", ",")}
                    </p>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>INSS R${INSS.toFixed(2).replace(".", ",")} + impostos</p>
                  </div>
                  {!isPago && (
                    <button
                      onClick={() => handlePagar(now)}
                      disabled={paying === currentMesKey}
                      className="flex-shrink-0 px-5 py-2.5 text-white font-bold rounded-lg text-sm transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: colors.primary }}
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
        <div className="bg-[#EBE4D6] rounded-2xl shadow-sm border overflow-hidden" style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="w-full flex items-center justify-between p-6 text-left hover:opacity-80 transition-opacity"
            style={{ backgroundColor: colors.bgLight }}
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4" style={{ color: colors.primary }} />
              <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>Como funciona o DAS-MEI?</span>
            </div>
            {showInfo ? <ChevronUp className="w-4 h-4" style={{ color: colors.textSecondary }} /> : <ChevronDown className="w-4 h-4" style={{ color: colors.textSecondary }} />}
          </button>
          {showInfo && (
            <div className="px-6 pb-6 space-y-3 text-sm" style={{ color: colors.textSecondary, borderTop: `1px solid ${colors.borderDefault}` }}>
              <p>O DAS-MEI é o pagamento mensal obrigatório do MEI, composto por:</p>
              <ul className="space-y-1.5 ml-4">
                <li>• <strong style={{ color: colors.textPrimary }}>INSS:</strong> 5% do salário mínimo (R${INSS.toFixed(2).replace(".", ",")} em 2026)</li>
                <li>• <strong style={{ color: colors.textPrimary }}>ICMS:</strong> R$1,00 — para atividades de comércio e transporte</li>
                <li>• <strong style={{ color: colors.textPrimary }}>ISS:</strong> R$5,00 — para atividades de serviços</li>
              </ul>
              <p>Vence sempre no <strong style={{ color: colors.textPrimary }}>dia 20 do mês seguinte</strong> ao de competência.</p>
              <p className="text-xs" style={{ color: colors.textSecondary }}>Ao marcar como pago, o valor é lançado automaticamente no Fluxo de Caixa (categoria DAS-MEI) e aparece no DRE em Impostos.</p>
            </div>
          )}
        </div>

        {/* History — last 12 months */}
        <div className="bg-[#EBE4D6] rounded-2xl shadow-sm border overflow-hidden" style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}>
          <div className="p-6" style={{ borderBottom: `1px solid ${colors.borderDefault}` }}>
            <h3 className="font-semibold" style={{ color: colors.textPrimary }}>Histórico — últimos 12 meses</h3>
          </div>
          <div style={{ borderTop: `1px solid ${colors.borderDefault}` }}>
            {[...months].reverse().map((date) => {
              const mesKey = getMesKey(date);
              const pago = paidMonths[mesKey];
              const isCurrent = mesKey === currentMesKey;
              const venc = getVencimento(date.getFullYear(), date.getMonth() + 1);
              const isFuture = date > now;
              const isVencido = !pago && !isFuture && new Date() > venc;

              return (
                <div
                  key={mesKey}
                  className="flex items-center justify-between px-6 py-3.5 border-b"
                  style={{
                    backgroundColor: isCurrent ? colors.bgLighter : colors.bgLight,
                    borderColor: colors.borderDefault
                  }}
                >
                  <div className="flex items-center gap-3">
                    {pago
                      ? <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: colors.success }} />
                      : isFuture
                      ? <div className="w-4 h-4 rounded-full border flex-shrink-0" style={{ borderColor: colors.borderDefault }} />
                      : isVencido
                      ? <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: colors.danger }} />
                      : <Clock className="w-4 h-4 flex-shrink-0" style={{ color: colors.warning }} />}
                    <div>
                      <p className="text-sm font-medium capitalize" style={{ color: isCurrent ? colors.textPrimary : colors.textSecondary }}>
                        {getMesLabel(date)}
                        {isCurrent && <span className="ml-2 text-xs font-normal" style={{ color: colors.primary }}>mês atual</span>}
                      </p>
                      <p className="text-xs" style={{ color: colors.textSecondary }}>
                        {`Venc. 20/${String(venc.getMonth() + 1).padStart(2, "0")}/${venc.getFullYear()}`}
                        {pago && ` · Pago em ${new Date(pago.data).toLocaleDateString("pt-BR")}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {pago ? (
                      <div className="text-right">
                        <span className="text-sm font-medium" style={{ color: colors.success }}>R$ {pago.valor.toFixed(2).replace(".", ",")}</span>
                      </div>
                    ) : isFuture ? (
                      <span className="text-xs" style={{ color: colors.textSecondary }}>R$ {valorDAS.toFixed(2).replace(".", ",")}</span>
                    ) : (
                      <button
                        onClick={() => handlePagar(date)}
                        disabled={paying === mesKey}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-90 disabled:opacity-50"
                        style={{
                          backgroundColor: isVencido ? `${colors.danger}/10` : `${colors.primary}/10`,
                          color: isVencido ? colors.danger : colors.primary
                        }}
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
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-[#EBE4D6] rounded-2xl p-6 shadow-sm border text-center" style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}>
              <p className="text-2xl font-bold" style={{ color: colors.success }}>{Object.keys(paidMonths).length}</p>
              <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Meses pagos</p>
            </div>
            <div className="bg-[#EBE4D6] rounded-2xl p-6 shadow-sm border text-center" style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}>
              <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                R$ {Object.values(paidMonths).reduce((s, p) => s + p.valor, 0).toFixed(2).replace(".", ",")}
              </p>
              <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Total pago</p>
            </div>
            <div className="bg-[#EBE4D6] rounded-2xl p-6 shadow-sm border text-center" style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}>
              <p className="text-2xl font-bold" style={{ color: colors.warning }}>
                R$ {(valorDAS * 12).toFixed(2).replace(".", ",")}
              </p>
              <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Custo anual est.</p>
            </div>
          </div>
        )}

        <p className="text-xs text-center pb-4" style={{ color: colors.textSecondary }}>
          Valores baseados no salário mínimo de 2026 (R${SALARIO_MINIMO.toLocaleString("pt-BR")}). Para emitir a guia oficial, acesse o{" "}
          <a href="https://www8.receita.fazenda.gov.br/simplesnacional/aplicacoes/atspo/pgmei.app/identificacao" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" style={{ color: colors.primary }}>
            PGMEI — Portal do Simples Nacional
          </a>.
        </p>
      </div>
    </PremiumPageLayout>
  );
}
