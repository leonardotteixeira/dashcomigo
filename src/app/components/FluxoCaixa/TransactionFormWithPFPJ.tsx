import { useState } from 'react';
import { User, Building2, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { PFPJType } from '../../types/pfpj';
import { TransactionTypeIcon } from './TransactionTypeIcon';

interface TransactionFormWithPFPJProps {
  titulo: string;
  onSubmit: (data: {
    valor: number;
    tipo: 'entrada' | 'saida';
    categoria: string;
    data: string;
    descricao?: string;
    pf_pj_type: PFPJType;
  }) => Promise<void>;
  onCancel: () => void;
  transactionType: 'entrada' | 'saida';
  categorias: string[];
  loading?: boolean;
  suggestedPFPJType?: PFPJType;
}

export function TransactionFormWithPFPJ({
  titulo,
  onSubmit,
  onCancel,
  transactionType,
  categorias,
  loading = false,
  suggestedPFPJType = 'pf',
}: TransactionFormWithPFPJProps) {
  const [formValor, setFormValor] = useState('');
  const [formCategoria, setFormCategoria] = useState('');
  const [formData, setFormData] = useState(new Date().toISOString().split('T')[0]);
  const [formDescricao, setFormDescricao] = useState('');
  const [formPFPJType, setFormPFPJType] = useState<PFPJType>(suggestedPFPJType);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!formValor || !formCategoria) {
      setError('Valor e categoria são obrigatórios');
      return;
    }

    if (parseFloat(formValor) <= 0) {
      setError('Valor deve ser maior que 0');
      return;
    }

    try {
      await onSubmit({
        valor: parseFloat(formValor),
        tipo: transactionType,
        categoria: formCategoria,
        data: formData,
        descricao: formDescricao || undefined,
        pf_pj_type: formPFPJType,
      });

      // Reset form
      setFormValor('');
      setFormCategoria('');
      setFormData(new Date().toISOString().split('T')[0]);
      setFormDescricao('');
      setFormPFPJType('pf');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao adicionar transação';
      setError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Valor */}
      <div>
        <Label className="text-white text-sm mb-2 block">Valor *</Label>
        <div className="flex items-center gap-2">
          <span className="text-[#A1A1A1]">R$</span>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={formValor}
            onChange={(e) => setFormValor(e.target.value)}
            placeholder="0,00"
            className="bg-[#0F0F0F] border-white/10 text-white"
            disabled={loading}
          />
        </div>
      </div>

      {/* Categoria */}
      <div>
        <Label className="text-white text-sm mb-2 block">Categoria *</Label>
        <Select value={formCategoria} onValueChange={setFormCategoria} disabled={loading}>
          <SelectTrigger className="bg-[#0F0F0F] border-white/10 text-white">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent className="bg-[#1B1B1B] border-white/10">
            {categorias.map((cat) => (
              <SelectItem key={cat} value={cat} className="text-white hover:bg-white/10">
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Data */}
      <div>
        <Label className="text-white text-sm mb-2 block">Data</Label>
        <Input
          type="date"
          value={formData}
          onChange={(e) => setFormData(e.target.value)}
          className="bg-[#0F0F0F] border-white/10 text-white"
          disabled={loading}
        />
      </div>

      {/* Descrição */}
      <div>
        <Label className="text-white text-sm mb-2 block">Descrição (opcional)</Label>
        <Input
          type="text"
          value={formDescricao}
          onChange={(e) => setFormDescricao(e.target.value)}
          placeholder="Ex: Descrição da transação"
          className="bg-[#0F0F0F] border-white/10 text-white"
          disabled={loading}
        />
      </div>

      {/* PF vs PJ */}
      <div>
        <Label className="text-white text-sm mb-2 block">Tipo de Transação</Label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setFormPFPJType('pf')}
            disabled={loading}
            className={`p-3 rounded-lg border transition-all ${
              formPFPJType === 'pf'
                ? 'bg-[#5B5FFF]/20 border-[#5B5FFF] text-[#5B5FFF]'
                : 'bg-[#0F0F0F] border-white/10 text-[#A1A1A1] hover:border-white/20'
            }`}
          >
            <User className="w-5 h-5 mb-1 mx-auto" />
            <div className="text-xs font-medium">Pessoal</div>
          </button>

          <button
            type="button"
            onClick={() => setFormPFPJType('pj')}
            disabled={loading}
            className={`p-3 rounded-lg border transition-all ${
              formPFPJType === 'pj'
                ? 'bg-[#28A263]/20 border-[#28A263] text-[#28A263]'
                : 'bg-[#0F0F0F] border-white/10 text-[#A1A1A1] hover:border-white/20'
            }`}
          >
            <Building2 className="w-5 h-5 mb-1 mx-auto" />
            <div className="text-xs font-medium">Empresa</div>
          </button>

          <button
            type="button"
            onClick={() => setFormPFPJType('misto')}
            disabled={loading}
            className={`p-3 rounded-lg border transition-all ${
              formPFPJType === 'misto'
                ? 'bg-[#F4B23C]/20 border-[#F4B23C] text-[#F4B23C]'
                : 'bg-[#0F0F0F] border-white/10 text-[#A1A1A1] hover:border-white/20'
            }`}
          >
            <Zap className="w-5 h-5 mb-1 mx-auto" />
            <div className="text-xs font-medium">Misto</div>
          </button>
        </div>
      </div>

      {/* Error Message */}
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
          {loading ? 'Adicionando...' : `Adicionar ${titulo}`}
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
