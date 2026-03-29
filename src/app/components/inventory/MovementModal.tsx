import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { InventoryItem, MovementType, MOVEMENT_REASONS } from "../../types/inventory";

interface MovementModalProps {
  item: InventoryItem;
  isOpen: boolean;
  onSubmit: (data: {
    tipo: MovementType;
    quantidade: number;
    motivo?: string;
    anotacoes?: string;
  }) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export function MovementModal({
  item,
  isOpen,
  onSubmit,
  onClose,
  loading = false,
}: MovementModalProps) {
  const [tipo, setTipo] = useState<MovementType>("entrada");
  const [quantidade, setQuantidade] = useState(0);
  const [motivo, setMotivo] = useState("");
  const [anotacoes, setAnotacoes] = useState("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (quantidade <= 0) {
      setError("Quantidade deve ser maior que 0");
      return;
    }

    if (tipo === "saida" && quantidade > item.quantidade) {
      setError(`Quantidade não pode exceder ${item.quantidade} itens disponíveis`);
      return;
    }

    try {
      await onSubmit({
        tipo,
        quantidade,
        motivo: motivo || undefined,
        anotacoes: anotacoes || undefined,
      });

      // Reset form
      setTipo("entrada");
      setQuantidade(0);
      setMotivo("");
      setAnotacoes("");
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao registrar movimento";
      setError(message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1B1B1B] border border-white/10 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold text-lg">Registrar Movimento</h3>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-[#A1A1A1] hover:text-white disabled:opacity-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[#A1A1A1] text-sm mb-4">{item.nome}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de Movimento */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Tipo de Movimento *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["entrada", "saida", "ajuste"] as MovementType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTipo(t)}
                  disabled={loading}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    tipo === t
                      ? "bg-[#28A263] text-white"
                      : "bg-white/10 text-[#A1A1A1] hover:bg-white/20"
                  } disabled:opacity-50`}
                >
                  {t === "entrada"
                    ? "Entrada"
                    : t === "saida"
                      ? "Saída"
                      : "Ajuste"}
                </button>
              ))}
            </div>
          </div>

          {/* Quantidade */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Quantidade *
            </label>
            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              min="0"
              step="0.01"
              placeholder={
                tipo === "ajuste"
                  ? "Nova quantidade"
                  : tipo === "saida"
                    ? `Máx: ${item.quantidade}`
                    : "0"
              }
              className="w-full px-4 py-2 rounded bg-[#0F0F0F] border border-white/10 text-white placeholder-[#686F6F] focus:outline-none focus:border-[#28A263] transition-colors"
              disabled={loading}
            />
            {tipo === "saida" && (
              <p className="text-[#686F6F] text-xs mt-1">
                Disponível: {item.quantidade} unidades
              </p>
            )}
          </div>

          {/* Motivo */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Motivo {tipo !== "ajuste" && "*"}
            </label>
            <select
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full px-4 py-2 rounded bg-[#0F0F0F] border border-white/10 text-white focus:outline-none focus:border-[#28A263] transition-colors"
              disabled={loading}
            >
              <option value="">Selecionar motivo...</option>
              {MOVEMENT_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          {/* Anotações */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Anotações</label>
            <textarea
              value={anotacoes}
              onChange={(e) => setAnotacoes(e.target.value)}
              placeholder="Detalhes adicionais..."
              rows={3}
              className="w-full px-4 py-2 rounded bg-[#0F0F0F] border border-white/10 text-white placeholder-[#686F6F] focus:outline-none focus:border-[#28A263] transition-colors resize-none"
              disabled={loading}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#28A263] hover:bg-[#1F8A4A] disabled:opacity-50"
            >
              {loading ? "Registrando..." : "Registrar"}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-white/10 hover:bg-white/20 disabled:opacity-50"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
