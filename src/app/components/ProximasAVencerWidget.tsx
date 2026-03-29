import { AlertCircle, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { usePayables } from "../contexts/PayablesContext";
import { motion } from "motion/react";

export function ProximasAVencerWidget() {
  const navigate = useNavigate();
  const { getProximasAVencer, payables } = usePayables();

  const proximasAVencer = getProximasAVencer(7);
  const totalEmRisco = proximasAVencer
    .filter((p) => p.status === "pendente")
    .reduce((sum, p) => sum + p.valor, 0);

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  if (payables.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.55 }}
    >
      <div className="p-6 bg-[#1B1B1B] rounded-2xl border border-white/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-400" />
            <h3 className="font-bold text-white">Próximas a Vencer</h3>
          </div>
          <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full font-semibold">
            {proximasAVencer.length} conta{proximasAVencer.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="mb-4">
          <p className="text-[#A1A1A1] text-xs mb-1">Valor em risco (7 dias)</p>
          <p className="text-2xl font-bold text-yellow-400">{fmt(totalEmRisco)}</p>
        </div>

        {proximasAVencer.length > 0 ? (
          <div className="space-y-2 mb-4">
            {proximasAVencer.slice(0, 3).map((payable) => {
              const vencimento = new Date(payable.dataVencimento);
              const hoje = new Date();
              const diasRestantes = Math.ceil(
                (vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
              );
              const vencido = diasRestantes < 0;

              return (
                <div
                  key={payable.id}
                  className={`p-3 rounded-xl border-l-4 ${
                    vencido
                      ? "bg-red-500/10 border-l-red-500"
                      : "bg-yellow-500/10 border-l-yellow-500"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-sm font-medium text-white truncate">
                      {payable.descricao}
                    </span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-semibold whitespace-nowrap ${
                        vencido
                          ? "bg-red-500/20 text-red-300"
                          : "bg-yellow-500/20 text-yellow-300"
                      }`}
                    >
                      {vencido ? "Vencido" : `${diasRestantes}d`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#686F6F] text-xs">
                      {payable.categoria}
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        vencido ? "text-red-400" : "text-yellow-400"
                      }`}
                    >
                      {fmt(payable.valor)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-3 text-center mb-4">
            <p className="text-xs text-[#686F6F]">Nenhuma conta vencendo</p>
          </div>
        )}

        {proximasAVencer.length > 0 && (
          <button
            onClick={() => navigate("/app/contas-a-pagar")}
            className="w-full flex items-center justify-center gap-2 p-3 bg-[#28A263]/20 hover:bg-[#28A263]/30 text-[#2DDB81] rounded-xl text-sm font-medium transition-colors"
          >
            Ver todas as contas
            <ArrowRight className="w-3 h-3" />
          </button>
        )}

        <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-2">
          <AlertCircle className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-300">
            <strong>Lembre-se:</strong> Contas pendentes precisam de ação para
            não atrasar.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
