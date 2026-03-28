import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// ========================
// FLUXO DE CAIXA
// ========================

export interface CashFlowTransaction {
  date: string;
  description: string;
  category: string;
  type: "entrada" | "saida";
  amount: number;
}

export function exportCashFlowToExcel(
  transactions: CashFlowTransaction[],
  period?: string
) {
  const periodText = period ?? "completo";

  const data = transactions.map((t) => ({
    Data: t.date,
    Descrição: t.description || "-",
    Categoria: t.category,
    Tipo: t.type === "entrada" ? "Entrada" : "Saída",
    Valor: t.amount,
  }));

  const ws = XLSX.utils.json_to_sheet(data);

  ws["!cols"] = [
    { wch: 12 },
    { wch: 30 },
    { wch: 20 },
    { wch: 10 },
    { wch: 15 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Fluxo de Caixa");

  // Use blob approach for better browser compatibility
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `hub_fluxo-caixa_${periodText}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportCashFlowToCSV(
  transactions: CashFlowTransaction[],
  period?: string
) {
  const periodText = period ?? "completo";

  const data = transactions.map((t) => ({
    Data: t.date,
    Descrição: t.description || "-",
    Categoria: t.category,
    Tipo: t.type === "entrada" ? "Entrada" : "Saída",
    Valor: t.amount,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws);

  // BOM para Excel no Windows abrir com encoding correto
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `hub_fluxo-caixa_${periodText}.csv`;
  link.click();
}

// ========================
// DASHBOARD - RELATÓRIO FINANCEIRO
// ========================

export interface DashboardReportData {
  userName: string;
  totalEntradas: number;
  totalSaidas: number;
  lucro: number;
  margemLucro: number;
  saudeScore: number;
  insights: string[];
  projections: { month: string; value: number }[];
}

export function exportDashboardToPDF(data: DashboardReportData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Header verde Hub
  doc.setFillColor(40, 162, 99); // #28A263
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("Meu Fluxo", 15, 20);
  doc.setFontSize(11);
  doc.text("Relatório Financeiro Completo", 15, 30);

  // Data do relatório
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  const dateText = format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  doc.text(dateText, pageWidth - 15, 50, { align: "right" });

  // Resumo
  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text(`Olá, ${data.userName}`, 15, 60);

  doc.setFont(undefined, "normal");
  doc.setFontSize(11);
  doc.text(`Total de Entradas: R$ ${data.totalEntradas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, 15, 72);
  doc.text(`Total de Saídas: R$ ${data.totalSaidas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, 15, 80);
  doc.text(`Lucro: R$ ${data.lucro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, 15, 88);
  doc.text(`Margem de Lucro: ${data.margemLucro.toFixed(1)}%`, 15, 96);

  // Score destaque
  doc.setFillColor(192, 244, 151); // #C0F497
  doc.roundedRect(15, 105, pageWidth - 30, 22, 3, 3, "F");
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.setTextColor(40, 162, 99);
  doc.text(`Score de Saúde Financeira: ${data.saudeScore}/100`, 20, 118);

  // Projeções
  if (data.projections.length > 0) {
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Projeções Financeiras", 15, 142);

    autoTable(doc, {
      startY: 147,
      head: [["Mês", "Valor Projetado"]],
      body: data.projections.map((p) => [
        p.month,
        `R$ ${p.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      ]),
      theme: "striped",
      headStyles: { fillColor: [40, 162, 99] },
    });
  }

  // Insights
  const finalY = (doc as any).lastAutoTable?.finalY || 165;
  doc.setFontSize(13);
  doc.setFont(undefined, "bold");
  doc.text("Insights e Recomendações", 15, finalY + 15);

  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  let yPos = finalY + 25;
  data.insights.forEach((insight, index) => {
    doc.text(`${index + 1}. ${insight}`, 20, yPos);
    yPos += 7;
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(
    "Relatório gerado pelo Meu Fluxo",
    pageWidth / 2,
    doc.internal.pageSize.height - 10,
    { align: "center" }
  );

  const filename = `hub_relatorio-financeiro_${format(new Date(), "dd-MM-yyyy")}.pdf`;
  doc.save(filename);
}
