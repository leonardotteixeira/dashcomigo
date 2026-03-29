import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { InventoryItem, CATEGORIAS_ESTOQUE, CONSTRAINTS } from "../../types/inventory";

interface InventoryFormProps {
  item?: InventoryItem;
  onSubmit: (data: Omit<InventoryItem, "id" | "created" | "updated">) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function InventoryForm({ item, onSubmit, onCancel, loading = false }: InventoryFormProps) {
  const [formData, setFormData] = useState({
    nome: item?.nome ?? "",
    descricao: item?.descricao ?? "",
    quantidade: item?.quantidade ?? 0,
    preco_unitario: item?.preco_unitario ?? 0,
    categoria: item?.categoria ?? CATEGORIAS_ESTOQUE[0],
    quantidade_minima: item?.quantidade_minima ?? CONSTRAINTS.QUANTIDADE_MINIMA_DEFAULT,
    status: item?.status ?? "ativo",
    sku: item?.sku ?? "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    } else if (formData.nome.length > CONSTRAINTS.NOME_MAX) {
      newErrors.nome = `Nome não pode exceder ${CONSTRAINTS.NOME_MAX} caracteres`;
    }

    if (formData.quantidade < CONSTRAINTS.QUANTIDADE_MIN) {
      newErrors.quantidade = "Quantidade não pode ser negativa";
    }

    if (formData.preco_unitario <= CONSTRAINTS.PRECO_MIN) {
      newErrors.preco_unitario = "Preço deve ser maior que 0";
    }

    if (formData.quantidade_minima < CONSTRAINTS.QUANTIDADE_MIN) {
      newErrors.quantidade_minima = "Quantidade mínima não pode ser negativa";
    }

    if (formData.sku && formData.sku.length > CONSTRAINTS.SKU_MAX) {
      newErrors.sku = `SKU não pode exceder ${CONSTRAINTS.SKU_MAX} caracteres`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        ...formData,
        user_id: "", // Will be set by context
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao salvar item";
      setErrors({ submit: message });
    }
  };

  if (!isMounted) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nome */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">Nome *</label>
        <input
          type="text"
          value={formData.nome}
          onChange={(e) =>
            setFormData({ ...formData, nome: e.target.value })
          }
          placeholder="Ex: Produto X"
          className={`w-full px-4 py-2 rounded bg-[#0F0F0F] border text-white placeholder-[#686F6F] focus:outline-none transition-colors ${
            errors.nome
              ? "border-red-500 focus:border-red-500"
              : "border-white/10 focus:border-[#28A263]"
          }`}
          disabled={loading}
        />
        {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
      </div>

      {/* SKU */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">SKU (Código)</label>
        <input
          type="text"
          value={formData.sku}
          onChange={(e) =>
            setFormData({ ...formData, sku: e.target.value })
          }
          placeholder="Ex: PROD-001"
          className={`w-full px-4 py-2 rounded bg-[#0F0F0F] border text-white placeholder-[#686F6F] focus:outline-none transition-colors ${
            errors.sku
              ? "border-red-500 focus:border-red-500"
              : "border-white/10 focus:border-[#28A263]"
          }`}
          disabled={loading}
        />
        {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku}</p>}
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">Descrição</label>
        <textarea
          value={formData.descricao}
          onChange={(e) =>
            setFormData({ ...formData, descricao: e.target.value })
          }
          placeholder="Detalhes do produto..."
          rows={2}
          className="w-full px-4 py-2 rounded bg-[#0F0F0F] border border-white/10 text-white placeholder-[#686F6F] focus:outline-none focus:border-[#28A263] transition-colors resize-none"
          disabled={loading}
        />
      </div>

      {/* Categoria */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">Categoria *</label>
        <select
          value={formData.categoria}
          onChange={(e) =>
            setFormData({ ...formData, categoria: e.target.value })
          }
          className="w-full px-4 py-2 rounded bg-[#0F0F0F] border border-white/10 text-white focus:outline-none focus:border-[#28A263] transition-colors"
          disabled={loading}
        >
          {CATEGORIAS_ESTOQUE.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Quantidade e Preço */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Quantidade *</label>
          <input
            type="number"
            value={formData.quantidade}
            onChange={(e) =>
              setFormData({ ...formData, quantidade: Number(e.target.value) })
            }
            min="0"
            step="0.01"
            className={`w-full px-4 py-2 rounded bg-[#0F0F0F] border text-white placeholder-[#686F6F] focus:outline-none transition-colors ${
              errors.quantidade
                ? "border-red-500 focus:border-red-500"
                : "border-white/10 focus:border-[#28A263]"
            }`}
            disabled={loading}
          />
          {errors.quantidade && (
            <p className="text-red-500 text-xs mt-1">{errors.quantidade}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Preço Unitário *</label>
          <input
            type="number"
            value={formData.preco_unitario}
            onChange={(e) =>
              setFormData({ ...formData, preco_unitario: Number(e.target.value) })
            }
            min="0.01"
            step="0.01"
            className={`w-full px-4 py-2 rounded bg-[#0F0F0F] border text-white placeholder-[#686F6F] focus:outline-none transition-colors ${
              errors.preco_unitario
                ? "border-red-500 focus:border-red-500"
                : "border-white/10 focus:border-[#28A263]"
            }`}
            disabled={loading}
          />
          {errors.preco_unitario && (
            <p className="text-red-500 text-xs mt-1">{errors.preco_unitario}</p>
          )}
        </div>
      </div>

      {/* Quantidade Mínima */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">Quantidade Mínima</label>
        <input
          type="number"
          value={formData.quantidade_minima}
          onChange={(e) =>
            setFormData({ ...formData, quantidade_minima: Number(e.target.value) })
          }
          min="0"
          step="1"
          className={`w-full px-4 py-2 rounded bg-[#0F0F0F] border text-white placeholder-[#686F6F] focus:outline-none transition-colors ${
            errors.quantidade_minima
              ? "border-red-500 focus:border-red-500"
              : "border-white/10 focus:border-[#28A263]"
          }`}
          disabled={loading}
        />
        {errors.quantidade_minima && (
          <p className="text-red-500 text-xs mt-1">{errors.quantidade_minima}</p>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">Status</label>
        <select
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value as "ativo" | "inativo" })
          }
          className="w-full px-4 py-2 rounded bg-[#0F0F0F] border border-white/10 text-white focus:outline-none focus:border-[#28A263] transition-colors"
          disabled={loading}
        >
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
      </div>

      {/* Error message */}
      {errors.submit && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <p className="text-red-500 text-sm">{errors.submit}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#28A263] hover:bg-[#1F8A4A] disabled:opacity-50"
        >
          {loading ? "Salvando..." : item ? "Atualizar" : "Adicionar"}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 bg-white/10 hover:bg-white/20 disabled:opacity-50"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
