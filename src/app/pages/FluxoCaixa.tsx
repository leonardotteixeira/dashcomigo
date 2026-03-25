import { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PlusCircle,
  Calendar,
  Filter,
  Trash2,
  AlertCircle,
  Crown,
  ArrowUpRight,
  ArrowDownRight,
  Zap
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useCashFlow, TransactionType, CATEGORIAS_ENTRADA, CATEGORIAS_SAIDA } from "../contexts/CashFlowContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  
  // Form state
  const [formValor, setFormValor] = useState("");
  const [formCategoria, setFormCategoria] = useState("");
  const [formData, setFormData] = useState(new Date().toISOString().split("T")[0]);
  const [formDescricao, setFormDescricao] = useState("");

  const limitStatus = getLimitStatus();
  const filteredTransactions = getTransactionsByPeriod(periodo);
  const isEmpty = transactions.length === 0;

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

      // Reset form
      setFormValor("");
      setFormCategoria("");
      setFormData(new Date().toISOString().split("T")[0]);
      setFormDescricao("");
      setDialogOpen(false);
    } catch (error) {
      // limite atingido pode ser lançado pelo context também
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Fluxo de Caixa
          </h1>
          <p className="text-slate-600">
            Controle suas entradas e saídas de forma simples
          </p>
        </div>

        {/* Limit indicator */}
        {user?.plan !== "pro" && (
          <Badge 
            variant="outline" 
            className={`${
              limitStatus.percentage > 80 
                ? "bg-red-50 text-red-700 border-red-300" 
                : "bg-blue-50 text-blue-700 border-blue-300"
            }`}
          >
            {limitStatus.used}/{limitStatus.limit} lançamentos este mês
          </Badge>
        )}
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="grid gap-4">
          {insights.map(insight => (
            <Alert 
              key={insight.id}
              className={`border-2 ${
                insight.tipo === "alerta" 
                  ? "bg-red-50 border-red-200" 
                  : insight.tipo === "sucesso"
                  ? "bg-green-50 border-green-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <AlertCircle className={`h-5 w-5 ${
                insight.tipo === "alerta" 
                  ? "text-red-600" 
                  : insight.tipo === "sucesso"
                  ? "text-green-600"
                  : "text-blue-600"
              }`} />
              <AlertDescription className={`${
                insight.tipo === "alerta" 
                  ? "text-red-900" 
                  : insight.tipo === "sucesso"
                  ? "text-green-900"
                  : "text-blue-900"
              }`}>
                <span className="mr-2">{insight.icone}</span>
                {insight.mensagem}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="flex items-start justify-between mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-1">Saldo Atual</p>
          <p className={`text-2xl font-bold ${
            summary.saldoAtual >= 0 ? "text-green-600" : "text-red-600"
          }`}>
            R$ {summary.saldoAtual.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Margem: {summary.margemLucro.toFixed(1)}%
          </p>
        </Card>

        <Card className="p-6 border-2 border-green-200 bg-green-50">
          <div className="flex items-start justify-between mb-2">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-1">Total Entradas</p>
          <p className="text-2xl font-bold text-green-600">
            R$ {summary.totalEntradas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {filteredTransactions.filter(t => t.tipo === "entrada").length} lançamentos
          </p>
        </Card>

        <Card className="p-6 border-2 border-red-200 bg-red-50">
          <div className="flex items-start justify-between mb-2">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <ArrowDownRight className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-1">Total Saídas</p>
          <p className="text-2xl font-bold text-red-600">
            R$ {summary.totalSaidas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {filteredTransactions.filter(t => t.tipo === "saida").length} lançamentos
          </p>
        </Card>

        <Card className="p-6 border-2 border-blue-200 bg-blue-50">
          <div className="flex items-start justify-between mb-2">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-1">Lucro do Período</p>
          <p className={`text-2xl font-bold ${
            summary.lucro >= 0 ? "text-blue-600" : "text-red-600"
          }`}>
            R$ {summary.lucro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {periodo === "mes" ? "Últimos 30 dias" : `Período: ${periodo}`}
          </p>
        </Card>
      </div>

      {/* Action Buttons + Filters */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-3">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => openDialog("entrada")}
              disabled={!canAddTransaction()}
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Nova Entrada
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => openDialog("saida")}
              disabled={!canAddTransaction()}
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Nova Saída
            </Button>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {transactionType === "entrada" ? "Nova Entrada" : "Nova Saída"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="valor">Valor (R$)</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    value={formValor}
                    onChange={(e) => setFormValor(e.target.value)}
                    placeholder="0,00"
                    required
                    className="text-lg h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select value={formCategoria} onValueChange={setFormCategoria} required>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(transactionType === "entrada" ? CATEGORIAS_ENTRADA : CATEGORIAS_SAIDA).map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="data">Data</Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData}
                    onChange={(e) => setFormData(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição (opcional)</Label>
                  <Input
                    id="descricao"
                    type="text"
                    value={formDescricao}
                    onChange={(e) => setFormDescricao(e.target.value)}
                    placeholder="Ex: Venda para cliente X"
                    className="h-12"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" size="lg" className="flex-1">
                    Adicionar
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="lg"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Period filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-600" />
          <Select value={periodo} onValueChange={(v: any) => setPeriodo(v)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dia">Hoje</SelectItem>
              <SelectItem value="semana">Últimos 7 dias</SelectItem>
              <SelectItem value="mes">Últimos 30 dias</SelectItem>
              <SelectItem value="ano">Último ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Empty State */}
      {isEmpty && (
        <Card className="p-12 text-center border-2 border-dashed border-slate-300">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Comece seu controle financeiro!
            </h3>
            <p className="text-slate-600 mb-6">
              Adicione sua primeira entrada ou saída para começar a ter insights sobre seu negócio.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => openDialog("entrada")}
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Adicionar Entrada
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Transactions List */}
      {!isEmpty && (
        <Card className="p-6 border-2 border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4">Lançamentos Recentes</h3>
          
          <div className="space-y-3">
            {filteredTransactions.slice(0, 10).map(transaction => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.tipo === "entrada" 
                      ? "bg-green-100 text-green-600" 
                      : "bg-red-100 text-red-600"
                  }`}>
                    {transaction.tipo === "entrada" ? (
                      <ArrowUpRight className="w-5 h-5" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5" />
                    )}
                  </div>
                  
                  <div>
                    <p className="font-medium text-slate-900">{transaction.categoria}</p>
                    <p className="text-sm text-slate-600">
                      {new Date(transaction.data).toLocaleDateString("pt-BR")}
                      {transaction.descricao && ` • ${transaction.descricao}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <p className={`font-bold text-lg ${
                    transaction.tipo === "entrada" ? "text-green-600" : "text-red-600"
                  }`}>
                    {transaction.tipo === "entrada" ? "+" : "-"}R$ {transaction.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTransaction(transaction.id)}
                    className="text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredTransactions.length > 10 && (
            <p className="text-center text-sm text-slate-500 mt-4">
              Mostrando 10 de {filteredTransactions.length} lançamentos
            </p>
          )}
        </Card>
      )}

      {/* Dialog de limite atingido */}
      <Dialog open={limitDialogOpen} onOpenChange={setLimitDialogOpen}>
        <DialogContent className="max-w-md text-center">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
                <Crown className="w-8 h-8 text-white" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-slate-900">
              Limite atingido!
            </DialogTitle>
            <DialogDescription className="text-slate-600 mt-2">
              Você usou todos os {limitStatus.limit} lançamentos do plano gratuito este mês.
              Faça upgrade para o PRO e tenha lançamentos ilimitados!
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              onClick={() => { setLimitDialogOpen(false); navigate("/pricing"); }}
            >
              <Crown className="w-4 h-4 mr-2" />
              Ver Planos PRO
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={() => setLimitDialogOpen(false)}
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upgrade CTA */}
      {user?.plan !== "pro" && limitStatus.percentage > 70 && (
        <Card className="p-8 bg-gradient-to-r from-purple-600 to-blue-600 border-0 text-white">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-6 h-6" />
                <h3 className="text-xl font-bold">Upgrade para PRO</h3>
              </div>
              <p className="text-purple-100">
                Lançamentos ilimitados + relatórios completos. Primeiro mês R$ 9,90!
              </p>
            </div>
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-slate-50"
              onClick={() => navigate("/pricing")}
            >
              Ver Planos
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}