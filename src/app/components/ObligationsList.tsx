import { useState } from "react";
import { useObligations } from "../contexts/ObligationsContext";
import { ObligationForm } from "./ObligationForm";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, Lock, Edit2, Trash2 } from "lucide-react";
import type { Obligation } from "../types/obligations";

export function ObligationsList() {
  const { obligations, completeObligation, deleteObligation } = useObligations();
  const [formOpen, setFormOpen] = useState(false);
  const [editingObligation, setEditingObligation] = useState<Obligation | undefined>();

  const handleEdit = (ob: Obligation) => {
    setEditingObligation(ob);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingObligation(undefined);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar esta obrigação?")) {
      await deleteObligation(id);
    }
  };

  // Agrupar por mês
  const grouped = new Map<string, Obligation[]>();
  obligations.forEach((ob) => {
    const monthKey = format(new Date(ob.data + "T00:00:00"), "yyyy-MM", { locale: ptBR });
    if (!grouped.has(monthKey)) {
      grouped.set(monthKey, []);
    }
    grouped.get(monthKey)!.push(ob);
  });

  const months = Array.from(grouped.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="space-y-6">
      {months.length === 0 ? (
        <p className="text-[#686F6F]">Nenhuma obrigação registrada</p>
      ) : (
        months.map(([monthKey, obs]) => (
          <div key={monthKey}>
            <h3 className="text-sm font-bold text-[#A1A1A1] uppercase mb-3">
              {format(new Date(monthKey + "-01"), "MMMM 'de' yyyy", { locale: ptBR })}
            </h3>

            <div className="space-y-2">
              {obs.map((ob) => (
                <div
                  key={ob.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    ob.isFixture
                      ? "bg-[#1B1B1B] border-[#686F6F]/20"
                      : ob.status === "completa"
                      ? "bg-[#28A263]/10 border-[#28A263]/30"
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Status icon */}
                    {ob.isFixture ? (
                      <Lock className="w-5 h-5 text-[#686F6F] flex-shrink-0 mt-0.5" />
                    ) : ob.status === "completa" ? (
                      <Check className="w-5 h-5 text-[#2DDB81] flex-shrink-0 mt-0.5" />
                    ) : (
                      <button
                        onClick={() => completeObligation(ob.id)}
                        className="w-5 h-5 rounded-full border border-yellow-400 flex-shrink-0 mt-0.5 hover:bg-yellow-400/20 transition-colors"
                        title="Marcar como completa"
                      />
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm md:text-base">{ob.titulo}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-xs text-[#A1A1A1]">
                          {format(new Date(ob.data + "T00:00:00"), "dd MMM", { locale: ptBR })}
                        </span>
                        {ob.categoria && (
                          <span className="text-xs bg-white/10 text-[#A1A1A1] px-2 py-0.5 rounded">
                            {ob.categoria}
                          </span>
                        )}
                        {ob.valor && (
                          <span className="text-xs font-bold text-[#2DDB81]">
                            R$ {ob.valor.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {ob.anotacoes && (
                        <p className="text-xs text-[#C8C9D0] mt-2 line-clamp-2">{ob.anotacoes}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {!ob.isFixture && (
                    <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(ob)}
                        className="p-1.5 md:p-2 text-[#A1A1A1] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ob.id)}
                        className="p-1.5 md:p-2 text-[#A1A1A1] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Deletar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <ObligationForm open={formOpen} onOpenChange={handleCloseForm} obligation={editingObligation} />
    </div>
  );
}
