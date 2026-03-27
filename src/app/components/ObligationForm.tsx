import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useObligations } from "../contexts/ObligationsContext";
import type { Obligation } from "../types/obligations";

interface ObligationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  obligation?: Obligation;
}

export function ObligationForm({ open, onOpenChange, obligation }: ObligationFormProps) {
  const { addObligation, updateObligation } = useObligations();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    titulo: obligation?.titulo || "",
    data: obligation?.data || "",
    valor: obligation?.valor?.toString() || "",
    categoria: obligation?.categoria || "",
    anotacoes: obligation?.anotacoes || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const valor = form.valor ? parseFloat(form.valor) : undefined;

      if (obligation) {
        await updateObligation(obligation.id, {
          titulo: form.titulo,
          data: form.data,
          valor,
          categoria: form.categoria || undefined,
          anotacoes: form.anotacoes || undefined,
        });
      } else {
        await addObligation({
          titulo: form.titulo,
          data: form.data,
          valor,
          categoria: form.categoria || undefined,
          anotacoes: form.anotacoes || undefined,
          status: "futura",
        });
      }

      onOpenChange(false);
      setForm({ titulo: "", data: "", valor: "", categoria: "", anotacoes: "" });
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{obligation ? "Editar Obrigação" : "Adicionar Obrigação"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-sm text-[#C8C9D0] mb-2 block">Título *</Label>
            <Input
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              placeholder="Ex: Consulta com contador"
              className="bg-[#141414] border border-white/10 text-white placeholder:text-[#686F6F] text-sm rounded-xl"
              required
            />
          </div>

          <div>
            <Label className="text-sm text-[#C8C9D0] mb-2 block">Data *</Label>
            <Input
              type="date"
              value={form.data}
              onChange={(e) => setForm({ ...form, data: e.target.value })}
              className="bg-[#141414] border border-white/10 text-white text-sm rounded-xl"
              required
            />
          </div>

          <div>
            <Label className="text-sm text-[#C8C9D0] mb-2 block">Valor (opcional)</Label>
            <Input
              type="number"
              step="0.01"
              value={form.valor}
              onChange={(e) => setForm({ ...form, valor: e.target.value })}
              placeholder="0,00"
              className="bg-[#141414] border border-white/10 text-white placeholder:text-[#686F6F] text-sm rounded-xl"
            />
          </div>

          <div>
            <Label className="text-sm text-[#C8C9D0] mb-2 block">Categoria</Label>
            <Input
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              placeholder="Ex: Financeiro, Pessoal"
              className="bg-[#141414] border border-white/10 text-white placeholder:text-[#686F6F] text-sm rounded-xl"
            />
          </div>

          <div>
            <Label className="text-sm text-[#C8C9D0] mb-2 block">Anotações</Label>
            <textarea
              value={form.anotacoes}
              onChange={(e) => setForm({ ...form, anotacoes: e.target.value })}
              placeholder="Informações importantes..."
              className="w-full bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder:text-[#686F6F] focus:outline-none focus:border-[#28A263]"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="flex-1 text-[#A1A1A1]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#28A263] hover:bg-[#2DDB81] text-white"
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
