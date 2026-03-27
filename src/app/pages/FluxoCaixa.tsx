import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PlusCircle,
  Filter,
  Trash2,
  AlertCircle,
  CheckCircle,
  Crown,
  ArrowUpRight,
  ArrowDownRight,
  Zap
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useCashFlow, TransactionType, CATEGORIAS_ENTRADA, CATEGORIAS_SAIDA } from "../contexts/CashFlowContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export function FluxoCaixa() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    transactions,
    summary,
    insights,
    addTransaction,
    deleteTransaction,
    getTransactionsByPeriod,
    getLimitStatus,
    canAddTransaction
  } = useCashFlow();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [limitDialogOpen, setLimitDialogOpen] = useState(false);
  const [periodo, setPeriodo] = useState<"dia" | "semana" | "mes" | "ano">("mes");
  const [transactionType, setTransactionType] = useState<TransactionType>("entrada");

  const [formValor, setFormValor] = useState("");
  const [formCategoria, setFormCategoria] = useState("");
  const [formData, setFormData] = useState(new Date().toISOString().split("T")[0]);
  const [formDescricao, setFormDescricao] = useState("");

  const limitStatus = getLimitStatus();
  const filteredTransactions = getTransactionsByPeriod(periodo);
  const isEmpty = transactions.length === 0;

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canAddTransaction()) {
      setDialogOpen(false);
      setLimitDialogOpen(true);
      return;
    }

    try {
      await addTransaction({
        valor: parseFloat(formValor),
        tipo: transactionType,
        categoria: formCategoria,
        data: formData,
        descricao: formDescricao
      });

      setFormValor("");
      setFormCategoria("");
      setFormData(new Date().toISOString().split("T")[0]);
      setFormDescricao("");
      setDialogOpen(false);
    } catch {
      setDialogOpen(false);
      setLimitDialogOpen(true);
    }
  };

  const openDialog = (tipo: TransactionType) => {
    if (!canAddTransaction()) {
      setLimitDialogOpen(true);
      return;
    }
    setTransactionType(tipo);
    setDialogOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Fluxo de Caixa</h1>
          <p className="text-[#A1A1A1]">Controle suas entradas e saídas de forma simples</p>
        </div>

        {user?.plan !== "pro" && (
          <span className={`text-xs px-3 py-1.5 rounded-full border font-medium ${
            limitStatus.percentage > 80
              ? "bg-red-500/10 text-red-400 border-red-500/20"
              : "bg-[#28A263]/10 text-[#2DDB81] border-[#28A263]/20"
          }`}>
            {limitStatus.used}/{limitStatus.limit} lançamentos este mês
          </span>
        )}
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="grid gap-3">
          {insights.map(insight => (
            <div
              key={insight.id}
              className={`flex items-start gap-3 p-4 rounded-2xl border ${
                insight.tipo === "alerta"
                  ? "bg-red-500/10 border-red-500/20"
                  : insight.tipo === "sucesso"
                  ? "bg-[#28A263]/10 border-[#28A263]/20"
                  : "bg-blue-500/10 border-blue-500/20"
              }`}
            >
              {insight.tipo === "sucesso" ? (
                <CheckCircle className="h-5 w-5 text-[#2DDB81] flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                  insight.tipo === "alerta" ? "text-red-400" : "text-blue-400"
                }`} />
              )}
              <p className={`text-sm ${
                insight.tipo === "alerta" ? "text-red-300" :
                insight.tipo === "sucesso" ? "text-[#C0F497]" : "text-blue-300"
              }`}>
                <span className="mr-2">{insight.icone}</span>
                {insight.mensagem}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="p-6 bg-[#1B1B1B] rounded-2xl border border-white/5">
          <div className="w-11 h-11 bg-[#28A263]/20 rounded-xl flex items-center justify-center mb-4">
            <DollarSign className="w-5 h-5 text-[#2DDB81]" />
          </div>
          <p className="text-sm text-[#A1A1A1] mb-1">Saldo Atual</p>
          <p className={`text-2xl font-bold ${summary.saldoAtual >= 0 ? "text-[#2DDB81]" : "text-[#FF4F3D]"}`}>
            {fmt(summary.saldoAtual)}
          </p>
          <p className="text-xs text-[#686F6F] mt-2">Margem: {summary.margemLucro.toFixed(1)}%</p>
        </div>

        <div className="p-6 bg-[#1B1B1B] rounded-2xl border border-white/5">
          <div className="w-11 h-11 bg-[#28A263]/20 rounded-xl flex items-center justify-center mb-4">
            <ArrowUpRight className="w-5 h-5 text-[#2DDB81]" />
          </div>
          <p className="text-sm text-[#A1A1A1] mb-1">Total Entradas</p>
          <p className="text-2xl font-bold text-[#2DDB81]">{fmt(summary.totalEntradas)}</p>
          <p className="text-xs text-[#686F6F] mt-2">
            {filteredTransactions.filter(t => t.tipo === "entrada").length} lançamentos
          </p>
        </div>

        <div className="p-6 bg-[#1B1B1B] rounded-2xl border border-white/5">
          <div className="w-11 h-11 bg-[#FF4F3D]/20 rounded-xl flex items-center justify-center mb-4">
            <ArrowDownRight className="w-5 h-5 text-[#FF4F3D]" />
          </div>
          <p className="text-sm text-[#A1A1A1] mb-1">Total Saídas</p>
          <p className="text-2xl font-bold text-[#FF4F3D]">{fmt(summary.totalSaidas)}</p>
          <p className="text-xs text-[#686F6F] mt-2">
            {filteredTransactions.filter(t => t.tipo === "saida").length} lançamentos
          </p>
        </div>

        <div className="p-6 bg-[#1B1B1B] rounded-2xl border border-white/5">
          <div className="w-11 h-11 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-sm text-[#A1A1A1] mb-1">Lucro do Período</p>
          <p className={`text-2xl font-bold ${summary.lucro >= 0 ? "text-[#2DDB81]" : "text-[#FF4F3D]"}`}>
            {fmt(summary.lucro)}
          </p>
          <p className="text-xs text-[#686F6F] mt-2">
            {periodo === "mes" ? "Últimos 30 dias" : `Período: ${periodo}`}
          </p>
        </div>
      </div>

      {/* Action Buttons + Filters */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-3">
          <Button
            size="lg"
            className="bg-[#28A263] hover:bg-[#2DDB81] text-white rounded-xl"
            onClick={() => openDialog("entrada")}
            disabled={!canAddTransaction()}
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Nova Entrada
          </Button>

          <Button
            size="lg"
            className="bg-[#FF4F3D]/10 hover:bg-[#FF4F3D]/20 text-[#FF4F3D] border border-[#FF4F3D]/30 rounded-xl"
            onClick={() => openDialog("saida")}
            disabled={!canAddTransaction()}
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Nova Saída
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#A1A1A1]" />
          <Select value={periodo} onValueChange={(v: any) => setPeriodo(v)}>
            <SelectTrigger className="w-44 bg-[#1B1B1B] border-white/10 text-white rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1B1B1B] border-white/10 text-white">
              <SelectItem value="dia">Hoje</SelectItem>
              <SelectItem value="semana">Últimos 7 dias</SelectItem>
              <SelectItem value="mes">Últimos 30 dias</SelectItem>
              <SelectItem value="ano">Último ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dialog - Add transaction */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md bg-[#1B1B1B] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              {transactionType === "entrada" ? "Nova Entrada" : "Nova Saída"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="valor" className="text-[#A1A1A1]">Valor (R$)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={formValor}
                onChange={(e) => setFormValor(e.target.value)}
                placeholder="0,00"
                required
                className="mt-2 bg-[#141414] border-white/10 text-white placeholder:text-[#686F6F] h-12 text-lg rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="categoria" className="text-[#A1A1A1]">Categoria</Label>
              <Select value={formCategoria} onValueChange={setFormCategoria} required>
                <SelectTrigger className="mt-2 h-12 bg-[#141414] border-white/10 text-white rounded-xl">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="bg-[#1B1B1B] border-white/10 text-white">
                  {(transactionType === "entrada" ? CATEGORIAS_ENTRADA : CATEGORIAS_SAIDA).map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="data" className="text-[#A1A1A1]">Data</Label>
              <Input
                id="data"
                type="date"
                value={formData}
                onChange={(e) => setFormData(e.target.value)}
                required
                className="mt-2 h-12 bg-[#141414] border-white/10 text-white rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="descricao" className="text-[#A1A1A1]">Descrição (opcional)</Label>
              <Input
                id="descricao"
                type="text"
                value={formDescricao}
                onChange={(e) => setFormDescricao(e.target.value)}
                placeholder="Ex: Venda para cliente X"
                className="mt-2 h-12 bg-[#141414] border-white/10 text-white placeholder:text-[#686F6F] rounded-xl"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                size="lg"
                className="flex-1 bg-[#28A263] hover:bg-[#2DDB81] text-white rounded-xl"
              >
                Adicionar
              </Button>
              <Button
                type="button"
                size="lg"
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {isEmpty && (
        <div className="p-12 text-center bg-[#1B1B1B] rounded-2xl border border-dashed border-white/10">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-[#28A263]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-[#2DDB81]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Comece seu controle financeiro!</h3>
            <p className="text-[#A1A1A1] mb-6">
              Adicione sua primeira entrada ou saída para começar a ter insights sobre seu negócio.
            </p>
            <Button
              size="lg"
              className="bg-[#28A263] hover:bg-[#2DDB81] text-white rounded-xl"
              onClick={() => openDialog("entrada")}
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Adicionar Entrada
            </Button>
          </div>
        </div>
      )}

      {/* Transactions List */}
      {!isEmpty && (
        <div className="p-6 bg-[#1B1B1B] rounded-2xl border border-white/5">
          <h3 className="font-bold text-white mb-4">Lançamentos Recentes</h3>

          <div className="space-y-2">
            {filteredTransactions.slice(0, 10).map(transaction => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-[#141414] rounded-xl hover:bg-[#1D1D1D] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.tipo === "entrada"
                      ? "bg-[#28A263]/20 text-[#2DDB81]"
                      : "bg-[#FF4F3D]/20 text-[#FF4F3D]"
                  }`}>
                    {transaction.tipo === "entrada" ? (
                      <ArrowUpRight className="w-5 h-5" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <p className="font-medium text-white">{transaction.categoria}</p>
                    <p className="text-sm text-[#686F6F]">
                      {new Date(transaction.data).toLocaleDateString("pt-BR")}
                      {transaction.descricao && ` • ${transaction.descricao}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <p className={`font-bold text-lg ${
                    transaction.tipo === "entrada" ? "text-[#2DDB81]" : "text-[#FF4F3D]"
                  }`}>
                    {transaction.tipo === "entrada" ? "+" : "-"}{fmt(transaction.valor)}
                  </p>

                  <button
                    onClick={() => deleteTransaction(transaction.id)}
                    className="text-[#686F6F] hover:text-[#FF4F3D] transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTransactions.length > 10 && (
            <p className="text-center text-sm text-[#686F6F] mt-4">
              Mostrando 10 de {filteredTransactions.length} lançamentos
            </p>
          )}
        </div>
      )}

      {/* Dialog - Limit reached */}
      <Dialog open={limitDialogOpen} onOpenChange={setLimitDialogOpen}>
        <DialogContent className="max-w-md text-center bg-[#1B1B1B] border-white/10">
          <div className="flex justify-center mb-4 mt-2">
            <div className="w-16 h-16 bg-[#28A263]/20 rounded-2xl flex items-center justify-center">
              <Crown className="w-8 h-8 text-[#2DDB81]" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Limite atingido!</h2>
          <p className="text-[#A1A1A1] mb-6">
            Você usou todos os {limitStatus.limit} lançamentos do plano gratuito este mês.
            Faça upgrade para o PRO e tenha lançamentos ilimitados!
          </p>
          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              className="w-full bg-[#28A263] hover:bg-[#2DDB81] text-white rounded-xl"
              onClick={() => { setLimitDialogOpen(false); navigate("/checkout"); }}
            >
              <Crown className="w-4 h-4 mr-2" />
              Ver Planos PRO
            </Button>
            <Button
              size="lg"
              className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl"
              onClick={() => setLimitDialogOpen(false)}
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upgrade CTA */}
      {user?.plan !== "pro" && limitStatus.percentage > 70 && (
        <div className="p-8 bg-[#28A263]/10 rounded-2xl border border-[#28A263]/20">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-[#2DDB81]" />
                <h3 className="text-xl font-bold text-white">Upgrade para PRO</h3>
              </div>
              <p className="text-[#A1A1A1]">
                Lançamentos ilimitados + relatórios completos. Primeiro mês R$ 9,90!
              </p>
            </div>
            <Button
              size="lg"
              className="bg-[#28A263] hover:bg-[#2DDB81] text-white rounded-xl"
              onClick={() => navigate("/checkout")}
            >
              Ver Planos
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
