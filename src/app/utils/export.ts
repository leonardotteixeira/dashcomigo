import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Insight, Recommendation } from "./reportCalculations";

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
    name: string;
    receitas: number;
    despesas: number;
    fluxo: number;
  }>;
  expensesByCategory: Record<string, number>;
  payablesTotal?: number;
  payablesPending?: number;
  payablesPaid?: number;
  // Smart analysis (optional — included when available)
  insights?: Insight[];
  recommendations?: Recommendation[];
  liquidez?: number;
  pontoEquilibrio?: number;
  valorNegocio?: number;
  projecao30dias?: { receitas: number; despesas: number; fluxo: number };
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
  const monthlyDataForSheet = data.monthlyData
    .filter((m) => m.receitas > 0 || m.despesas > 0)
    .map((m) => ({
      Mês: m.name,
      Receitas: m.receitas,
      Despesas: m.despesas,
      "Fluxo de Caixa": m.fluxo,
      "Margem (%)": m.receitas > 0 ? ((m.fluxo / m.receitas) * 100).toFixed(1) : "—",
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

  const fmtBRL = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });

  const addFooter = () => {
    doc.setFontSize(8);
    doc.setTextColor(161, 161, 161);
    doc.text(
      `Relatório gerado pelo Bubuya em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );
    // thin bottom line
    doc.setDrawColor(220, 220, 220);
    doc.line(15, pageHeight - 13, pageWidth - 15, pageHeight - 13);
  };

  // ── HEADER ──────────────────────────────────────────────────────────
  doc.setFillColor(20, 20, 20); // dark #141414
  doc.rect(0, 0, pageWidth, 36, "F");

  // Green accent bar on left
  doc.setFillColor(45, 219, 129); // #2DDB81
  doc.rect(0, 0, 4, 36, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont(undefined, "bold");
  doc.text("Relatórios Financeiros", 12, 16);

  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(161, 161, 161);
  const dateRangeText = `${format(data.dateRange[0], "dd/MM/yyyy", { locale: ptBR })} a ${format(data.dateRange[1], "dd/MM/yyyy", { locale: ptBR })}`;
  doc.text(`Período: ${dateRangeText}`, 12, 26);
  doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, pageWidth - 15, 26, { align: "right" });

  let yPos = 46;

  // ── HERO RESULT CARD ────────────────────────────────────────────────
  const isLucro = data.fluxoCaixa >= 0 && data.totalReceitas > 0;
  const isPrejuizo = data.fluxoCaixa < 0;
  const heroR = isPrejuizo ? 247 : 45;
  const heroG = isPrejuizo ? 76 : 219;
  const heroB = isPrejuizo ? 76 : 129;

  doc.setFillColor(heroR, heroG, heroB);
  doc.setDrawColor(heroR, heroG, heroB);
  // light tinted background
  doc.setFillColor(heroR, heroG, heroB, 0.08);
  doc.roundedRect(15, yPos, pageWidth - 30, 28, 3, 3, "F");
  doc.setDrawColor(heroR, heroG, heroB);
  doc.setLineWidth(0.5);
  doc.roundedRect(15, yPos, pageWidth - 30, 28, 3, 3, "S");

  // Result label
  doc.setTextColor(heroR, heroG, heroB);
  doc.setFontSize(8);
  doc.setFont(undefined, "normal");
  doc.text(
    data.totalReceitas === 0
      ? "SEM DADOS NO PERÍODO"
      : isPrejuizo
      ? "RESULTADO NEGATIVO"
      : "RESULTADO POSITIVO",
    20,
    yPos + 8
  );

  // Big value
  doc.setFontSize(20);
  doc.setFont(undefined, "bold");
  doc.text(fmtBRL(Math.abs(data.fluxoCaixa)), 20, yPos + 20);

  // Sub info on right
  if (data.totalReceitas > 0) {
    doc.setFontSize(8);
    doc.setFont(undefined, "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Receitas: ${fmtBRL(data.totalReceitas)}`, pageWidth - 20, yPos + 10, { align: "right" });
    doc.text(`Despesas: ${fmtBRL(data.totalDespesas)}`, pageWidth - 20, yPos + 17, { align: "right" });
    doc.text(`Margem: ${data.margemLiquida.toFixed(1)}%`, pageWidth - 20, yPos + 24, { align: "right" });
  }

  yPos += 36;

  // ── KPI BOXES ───────────────────────────────────────────────────────
  const kpis = [
    { label: "Receitas",       value: fmtBRL(data.totalReceitas),   r: 45,  g: 219, b: 129 },
    { label: "Despesas",       value: fmtBRL(data.totalDespesas),   r: 247, g: 76,  b: 76  },
    { label: "Fluxo de Caixa", value: fmtBRL(data.fluxoCaixa),      r: 91,  g: 95,  b: 255 },
    { label: "Margem Líquida", value: `${data.margemLiquida.toFixed(1)}%`, r: 244, g: 178, b: 60 },
  ];

  const boxW = (pageWidth - 34) / 4;
  const boxH = 18;
  kpis.forEach((kpi, i) => {
    const x = 15 + i * (boxW + 1.3);
    doc.setFillColor(kpi.r, kpi.g, kpi.b);
    doc.roundedRect(x, yPos, boxW, boxH, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont(undefined, "bold");
    doc.text(kpi.label, x + 3, yPos + 6);
    doc.setFontSize(8.5);
    doc.setFont(undefined, "bold");
    doc.text(kpi.value, x + 3, yPos + 14);
  });

  yPos += boxH + 10;

  // ── ADVANCED INDICATORS ─────────────────────────────────────────────
  if (data.liquidez !== undefined || data.pontoEquilibrio !== undefined || data.valorNegocio !== undefined || data.projecao30dias !== undefined) {
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("Indicadores Avançados", 15, yPos);
    yPos += 5;

    const indW = (pageWidth - 34) / 4;
    const indH = 20;

    const indicators = [
      {
        label: "Índice de Cobertura",
        value: data.liquidez === undefined || data.liquidez === 0 ? "—"
               : data.liquidez >= 99 ? "∞"
               : `${data.liquidez.toFixed(2)}×`,
        sub: data.liquidez !== undefined && data.liquidez > 0
             ? (data.liquidez >= 1 ? "Cobre as dívidas" : "Atenção: insuficiente")
             : "Sem contas a pagar",
      },
      {
        label: "Ponto de Equilíbrio",
        value: data.pontoEquilibrio && data.pontoEquilibrio > 0 ? fmtBRL(data.pontoEquilibrio) : "—",
        sub: data.pontoEquilibrio && data.totalReceitas >= data.pontoEquilibrio ? "Receita cobre ✓" : "Meta de receita",
      },
      {
        label: "Valor Est. Negócio",
        value: data.valorNegocio && data.valorNegocio > 0 ? fmtBRL(data.valorNegocio) : "—",
        sub: "Múltiplo 12× lucro médio",
      },
      {
        label: "Projeção 30 Dias",
        value: data.projecao30dias && data.projecao30dias.receitas > 0 ? fmtBRL(data.projecao30dias.fluxo) : "—",
        sub: "Média últimos 3 meses",
      },
    ];

    indicators.forEach((ind, i) => {
      const x = 15 + i * (indW + 1.3);
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(x, yPos, indW, indH, 2, 2, "F");
      doc.setDrawColor(220, 220, 220);
      doc.roundedRect(x, yPos, indW, indH, 2, 2, "S");

      doc.setFontSize(6.5);
      doc.setFont(undefined, "normal");
      doc.setTextColor(120, 120, 120);
      doc.text(ind.label, x + 3, yPos + 6);

      doc.setFontSize(8.5);
      doc.setFont(undefined, "bold");
      doc.setTextColor(30, 30, 30);
      doc.text(ind.value, x + 3, yPos + 13);

      doc.setFontSize(6);
      doc.setFont(undefined, "normal");
      doc.setTextColor(140, 140, 140);
      doc.text(ind.sub, x + 3, yPos + 19);
    });

    yPos += indH + 10;
  }

  // ── INSIGHTS ────────────────────────────────────────────────────────
  if (data.insights && data.insights.length > 0) {
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("Análise do Período", 15, yPos);
    yPos += 5;

    data.insights.forEach((ins) => {
      const icon = ins.type === "warning" ? "⚠" : ins.type === "success" ? "✓" : "i";
      const [r, g, b] =
        ins.type === "warning" ? [244, 178, 60]
        : ins.type === "success" ? [45, 219, 129]
        : [100, 100, 100];

      // colored left border box
      doc.setFillColor(r, g, b, 0.07);
      doc.roundedRect(15, yPos, pageWidth - 30, 10, 1.5, 1.5, "F");
      doc.setFillColor(r, g, b);
      doc.rect(15, yPos, 2, 10, "F");

      doc.setFontSize(7);
      doc.setFont(undefined, "bold");
      doc.setTextColor(r, g, b);
      doc.text(icon, 20, yPos + 6.5);

      doc.setFont(undefined, "normal");
      doc.setTextColor(50, 50, 50);
      const lines = doc.splitTextToSize(ins.message, pageWidth - 46) as string[];
      doc.text(lines[0], 25, yPos + 6.5);

      yPos += 13;
    });

    yPos += 2;
  }

  // ── RECOMMENDATIONS ─────────────────────────────────────────────────
  if (data.recommendations && data.recommendations.length > 0) {
    // Check if we need a new page
    if (yPos > pageHeight - 80) {
      addFooter();
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("Recomendações", 15, yPos);
    yPos += 5;

    const priorityColors: Record<string, [number, number, number]> = {
      alta:  [247, 76, 76],
      media: [244, 178, 60],
      baixa: [45, 219, 129],
    };
    const priorityLabel: Record<string, string> = {
      alta: "ALTA", media: "MÉDIA", baixa: "BAIXA"
    };

    data.recommendations.forEach((rec) => {
      const [r, g, b] = priorityColors[rec.priority] ?? [100, 100, 100];

      doc.setFillColor(248, 248, 248);
      doc.roundedRect(15, yPos, pageWidth - 30, 11, 1.5, 1.5, "F");

      // priority badge
      doc.setFillColor(r, g, b);
      doc.roundedRect(17, yPos + 3, 12, 5, 1, 1, "F");
      doc.setFontSize(5.5);
      doc.setFont(undefined, "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(priorityLabel[rec.priority], 23, yPos + 6.8, { align: "center" });

      doc.setFontSize(7.5);
      doc.setFont(undefined, "normal");
      doc.setTextColor(50, 50, 50);
      const lines = doc.splitTextToSize(rec.action, pageWidth - 50) as string[];
      doc.text(lines[0], 32, yPos + 7);

      yPos += 14;
    });

    yPos += 2;
  }

  // ── MONTHLY FLOW TABLE ──────────────────────────────────────────────
  const activeMonths = data.monthlyData.filter((m) => m.receitas > 0 || m.despesas > 0);

  if (activeMonths.length > 0) {
    if (yPos > pageHeight - 70) {
      addFooter();
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("Fluxo de Caixa Mensal", 15, yPos);
    yPos += 4;

    autoTable(doc, {
      startY: yPos,
      head: [["Mês", "Receitas", "Despesas", "Fluxo de Caixa", "Margem"]],
      body: activeMonths.map((m) => [
        m.name,
        fmtBRL(m.receitas),
        fmtBRL(m.despesas),
        fmtBRL(m.fluxo),
        m.receitas > 0 ? `${((m.fluxo / m.receitas) * 100).toFixed(1)}%` : "—",
      ]),
      theme: "striped",
      headStyles: { fillColor: [20, 20, 20], textColor: [255, 255, 255], fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      columnStyles: {
        1: { halign: "right" },
        2: { halign: "right" },
        3: { halign: "right" },
        4: { halign: "right" },
      },
      didParseCell: (hookData) => {
        if (hookData.section === "body" && hookData.column.index === 3) {
          const raw = activeMonths[hookData.row.index];
          if (raw && raw.fluxo < 0) {
            hookData.cell.styles.textColor = [247, 76, 76];
          } else if (raw && raw.fluxo > 0) {
            hookData.cell.styles.textColor = [45, 162, 99];
          }
        }
      },
      margin: { left: 15, right: 15 },
    });

    yPos = (doc as any).lastAutoTable?.finalY + 12;
  }

  // ── EXPENSE CATEGORIES ──────────────────────────────────────────────
  const categories = Object.entries(data.expensesByCategory);
  if (categories.length > 0) {
    if (yPos > pageHeight - 60) {
      addFooter();
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("Despesas por Categoria", 15, yPos);
    yPos += 4;

    const totalDespesas = categories.reduce((s, [, v]) => s + v, 0);

    autoTable(doc, {
      startY: yPos,
      head: [["Categoria", "Valor", "% do Total"]],
      body: categories
        .sort((a, b) => b[1] - a[1])
        .map(([cat, valor]) => [
          cat,
          fmtBRL(valor),
          totalDespesas > 0 ? `${((valor / totalDespesas) * 100).toFixed(1)}%` : "—",
        ]),
      theme: "striped",
      headStyles: { fillColor: [20, 20, 20], textColor: [255, 255, 255], fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      columnStyles: { 1: { halign: "right" }, 2: { halign: "right" } },
      margin: { left: 15, right: 15 },
    });
  }

  addFooter();

  const filename = `bubuya_relatorio_${format(new Date(), "dd-MM-yyyy", { locale: ptBR })}.pdf`;
  doc.save(filename);
}
