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

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function exportCashFlowToExcel(
  transactions: CashFlowTransaction[],
  period?: string
) {
  const periodText = period ?? "completo";

  const data = transactions.map((t) => ({
    Data: t.date,
    "Descrição": t.description || "-",
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

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  triggerDownload(blob, `bubuya_fluxo-caixa_${periodText}.xlsx`);
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
  triggerDownload(blob, `bubuya_fluxo-caixa_${periodText}.csv`);
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

// ========================
// RELATÓRIOS FINANCEIROS
// ========================

export interface ReportExportData {
  period: string;
  dateRange: [Date, Date];
  totalReceitas: number;
  totalDespesas: number;
  fluxoCaixa: number;
  margemLiquida: number;
  transactions: Array<{
    data: string;
    descricao: string;
    categoria: string;
    tipo: string;
    valor: number;
  }>;
  monthlyData: Array<{
    mes: string;
    receitas: number;
    despesas: number;
    fluxo: number;
  }>;
  expensesByCategory: Record<string, number>;
  payablesTotal?: number;
  payablesPending?: number;
  payablesPaid?: number;
}

/**
 * Exportar relatório financeiro para Excel
 */
export function exportReportToExcel(data: ReportExportData) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Resumo
  const summaryData = [
    ["RELATÓRIO FINANCEIRO", ""],
    ["Período", `${format(data.dateRange[0], "dd/MM/yyyy", { locale: ptBR })} a ${format(data.dateRange[1], "dd/MM/yyyy", { locale: ptBR })}`],
    [""],
    ["RESUMO EXECUTIVO", ""],
    ["Total de Receitas", data.totalReceitas],
    ["Total de Despesas", data.totalDespesas],
    ["Fluxo de Caixa", data.fluxoCaixa],
    ["Margem Líquida (%)", data.margemLiquida.toFixed(2)],
    ...(data.payablesTotal !== undefined ? [
      [""],
      ["CONTAS A PAGAR", ""],
      ["Total a Pagar", data.payablesTotal],
      ["Pendentes", data.payablesPending],
      ["Pagas", data.payablesPaid],
    ] : []),
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  summarySheet["!cols"] = [{ wch: 25 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, summarySheet, "Resumo");

  // Sheet 2: Fluxo Mensal
  const monthlyDataForSheet = data.monthlyData.map((m) => ({
    Mês: m.mes,
    Receitas: m.receitas,
    Despesas: m.despesas,
    "Fluxo de Caixa": m.fluxo,
  }));

  const monthlySheet = XLSX.utils.json_to_sheet(monthlyDataForSheet);
  monthlySheet["!cols"] = [
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
  ];
  XLSX.utils.book_append_sheet(wb, monthlySheet, "Fluxo Mensal");

  // Sheet 3: Despesas por Categoria
  const categoryData = Object.entries(data.expensesByCategory).map(([categoria, valor]) => ({
    Categoria: categoria,
    Valor: valor,
  }));

  if (categoryData.length > 0) {
    const categorySheet = XLSX.utils.json_to_sheet(categoryData);
    categorySheet["!cols"] = [{ wch: 25 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, categorySheet, "Despesas por Categoria");
  }

  // Sheet 4: Transações Detalhadas
  const transactionsData = data.transactions.map((t) => ({
    Data: t.data,
    Descrição: t.descricao,
    Categoria: t.categoria,
    Tipo: t.tipo,
    Valor: t.valor,
  }));

  const transactionsSheet = XLSX.utils.json_to_sheet(transactionsData);
  transactionsSheet["!cols"] = [
    { wch: 12 },
    { wch: 30 },
    { wch: 20 },
    { wch: 10 },
    { wch: 15 },
  ];
  XLSX.utils.book_append_sheet(wb, transactionsSheet, "Transações");

  // Download
  const filename = `bubuya_relatorio_${format(new Date(), "dd-MM-yyyy", { locale: ptBR })}.xlsx`;
  XLSX.writeFile(wb, filename);
}

/**
 * Exportar relatório financeiro para PDF
 */
export function exportReportToPDF(data: ReportExportData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  let yPos = 20;

  // Header verde
  doc.setFillColor(40, 162, 99); // #28A263
  doc.rect(0, 0, pageWidth, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text("Relatório Financeiro", 15, 18);

  // Período
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  const dateRangeText = `${format(data.dateRange[0], "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} a ${format(data.dateRange[1], "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`;
  doc.text(`Período: ${dateRangeText}`, 15, 45);
  doc.text(`Data de geração: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, pageWidth - 15, 45, { align: "right" });

  yPos = 55;

  // KPIs - 4 boxes
  const boxWidth = (pageWidth - 30) / 4;
  const boxHeight = 20;
  const kpis = [
    { label: "Receitas", value: data.totalReceitas, color: [40, 162, 99] },
    { label: "Despesas", value: data.totalDespesas, color: [247, 76, 76] },
    { label: "Fluxo de Caixa", value: data.fluxoCaixa, color: [91, 95, 255] },
    { label: "Margem Líquida", value: `${data.margemLiquida.toFixed(1)}%`, color: [244, 178, 60] },
  ];

  kpis.forEach((kpi, index) => {
    const x = 15 + index * (boxWidth + 2);
    doc.setFillColor(...kpi.color);
    doc.rect(x, yPos, boxWidth, boxHeight, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text(kpi.label, x + 3, yPos + 6);
    doc.setFontSize(10);
    doc.text(
      typeof kpi.value === "number"
        ? `R$ ${kpi.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
        : kpi.value,
      x + 3,
      yPos + 15
    );
  });

  yPos += 35;

  // Tabela de Fluxo Mensal
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text("Fluxo de Caixa Mensal", 15, yPos);

  yPos += 7;

  autoTable(doc, {
    startY: yPos,
    head: [["Mês", "Receitas", "Despesas", "Fluxo de Caixa"]],
    body: data.monthlyData.map((m) => [
      m.mes,
      `R$ ${m.receitas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      `R$ ${m.despesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      `R$ ${m.fluxo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    ]),
    theme: "striped",
    headStyles: { fillColor: [40, 162, 99], textColor: [255, 255, 255] },
    margin: { left: 15, right: 15 },
  });

  yPos = (doc as any).lastAutoTable?.finalY + 15;

  // Despesas por Categoria (se houver espaço)
  if (yPos < pageHeight - 40 && Object.keys(data.expensesByCategory).length > 0) {
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Despesas por Categoria", 15, yPos);

    yPos += 7;

    autoTable(doc, {
      startY: yPos,
      head: [["Categoria", "Valor"]],
      body: Object.entries(data.expensesByCategory).map(([cat, valor]) => [
        cat,
        `R$ ${valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      ]),
      theme: "striped",
      headStyles: { fillColor: [40, 162, 99], textColor: [255, 255, 255] },
      margin: { left: 15, right: 15 },
    });
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(
    "Relatório gerado pelo Bubuya",
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

  // Download
  const filename = `bubuya_relatorio_${format(new Date(), "dd-MM-yyyy", { locale: ptBR })}.pdf`;
  doc.save(filename);
}
