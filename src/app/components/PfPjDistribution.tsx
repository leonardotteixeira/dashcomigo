import { useNavigate } from "react-router";
import { useCashFlow } from "../contexts/CashFlowContext";

export default function PfPjDistribution() {
  const navigate = useNavigate();
  const { transactions } = useCashFlow();

  const fmtBRL = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const now = new Date();
  const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const monthTx = transactions.filter((t) => t.data.startsWith(thisMonthKey));

  const pjAmount = monthTx
    .filter((t) => t.pfpj === "PJ")
    .reduce((s, t) => s + t.valor, 0);
  const pfAmount = monthTx
    .filter((t) => t.pfpj === "PF")
    .reduce((s, t) => s + t.valor, 0);
  const total = pjAmount + pfAmount;

  const pjPct = total > 0 ? Math.round((pjAmount / total) * 100) : 0;
  const pfPct = total > 0 ? Math.round((pfAmount / total) * 100) : 0;

  return (
    <div className="bg-[#EBE4D6] rounded-2xl p-7 shadow-sm border border-[rgba(20,18,15,0.13)]">
      <h3 className="font-bold text-lg text-[#0E3B2E] mb-5">Distribuição PF vs PJ</h3>

      {total === 0 ? (
        <p className="text-sm text-[#0E3B2E]/50 py-4 text-center">
          Registre transações para ver a distribuição PF vs PJ.
        </p>
      ) : (
        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-[#0E3B2E] font-medium">Pessoa Jurídica (PJ)</span>
              </div>
              <span className="text-sm font-bold text-[#0E3B2E]">{pjPct}%</span>
            </div>
            <div className="h-2.5 bg-[#F4EFE6] rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${pjPct}%` }}
              />
            </div>
            <p className="text-xs text-[#0E3B2E]/60 mt-2 font-medium">{fmtBRL(pjAmount)} este mês</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-sm text-[#0E3B2E] font-medium">Pessoa Física (PF)</span>
              </div>
              <span className="text-sm font-bold text-[#0E3B2E]">{pfPct}%</span>
            </div>
            <div className="h-2.5 bg-[#F4EFE6] rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-500"
                style={{ width: `${pfPct}%` }}
              />
            </div>
            <p className="text-xs text-[#0E3B2E]/60 mt-2 font-medium">{fmtBRL(pfAmount)} este mês</p>
          </div>
        </div>
      )}

      <div className="mt-6 pt-5 border-t border-[rgba(20,18,15,0.13)]">
        <p className="text-xs text-[#0E3B2E]/60 mb-2 font-medium">
          Dica: Separar PF de PJ facilita a declaração de impostos
        </p>
        <button
          className="text-sm text-[#0E3B2E] hover:underline font-medium"
          onClick={() => navigate("/app")}
        >
          Gerenciar categorização →
        </button>
      </div>
    </div>
  );
}
