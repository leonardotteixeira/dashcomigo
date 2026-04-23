import jsPDF from "jspdf";

export interface ProposalPDFData {
  tipo: "contrato" | "orcamento";
  template: "basico" | "detalhado" | "premium";
  nomeCliente: string;
  emailCliente: string;
  nomeServico: string;
  descricao: string;
  valor: number;
  prazo: string;
  condicoesPagamento: string;
  validade: number;
}

function fmtBRL(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

function getValidityDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getPagamentoText(cond: string, val: number): string {
  if (cond === "integral") return `À vista: ${fmtBRL(val)}`;
  if (cond === "50-50")
    return `50% entrada + 50% na entrega: ${fmtBRL(val / 2)} + ${fmtBRL(val / 2)}`;
  if (cond === "30-70")
    return `30% entrada + 70% na entrega: ${fmtBRL(val * 0.3)} + ${fmtBRL(val * 0.7)}`;
  return `3x de ${fmtBRL(val / 3)}`;
}

export function generateProposalPDF(data: ProposalPDFData): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageW = 210;
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = 0;

  // ── Header ──────────────────────────────────────────────────
  if (data.template === "premium") {
    doc.setFillColor(14, 59, 46);
    doc.rect(0, 0, pageW, 46, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(244, 239, 230);
    doc.text("Proposta Comercial", margin, 22);

    const tipoLabel = data.tipo === "contrato" ? "CONTRATO" : "ORÇAMENTO";
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(127, 209, 159);
    const dateStr = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    doc.text(dateStr, margin, 33);
    doc.text(tipoLabel, pageW - margin, 33, { align: "right" });

    y = 58;
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(30, 41, 59);
    doc.text("Proposta Comercial", pageW / 2, 26, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    const dateStr = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    doc.text(dateStr, pageW / 2, 34, { align: "center" });

    if (data.template === "detalhado") {
      doc.setDrawColor(59, 130, 246);
    } else {
      doc.setDrawColor(203, 213, 225);
    }
    doc.setLineWidth(0.8);
    doc.line(margin, 39, pageW - margin, 39);

    y = 52;
  }

  // ── Client section ──────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("CLIENTE", margin, y);
  y += 4;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentW, 22, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59);
  doc.text(data.nomeCliente || "[Nome do Cliente]", margin + 5, y + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(data.emailCliente || "[email@cliente.com]", margin + 5, y + 17);

  y += 30;

  // ── Service section ─────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("PROJETO", margin, y);
  y += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text(data.nomeServico || "[Nome do Serviço]", margin, y);
  y += 7;

  if (data.descricao) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    const lines = doc.splitTextToSize(data.descricao, contentW) as string[];
    doc.text(lines, margin, y);
    y += lines.length * 5 + 4;
  } else {
    y += 4;
  }

  // ── Scope (detalhado + premium) ─────────────────────────────
  if (data.template === "detalhado" || data.template === "premium") {
    y += 3;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("ESCOPO", margin, y);
    y += 5;

    const scopeItems = [
      "Levantamento de requisitos",
      "Desenvolvimento e implementação",
      "Revisões e ajustes (até 2 rodadas)",
      "Entrega final e suporte",
    ];
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    scopeItems.forEach((item) => {
      doc.setFillColor(34, 197, 94);
      doc.circle(margin + 1.5, y - 1.5, 1.2, "F");
      doc.text(item, margin + 5, y);
      y += 6;
    });
    y += 2;
  }

  // ── Divider ─────────────────────────────────────────────────
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // ── Value section ───────────────────────────────────────────
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(134, 239, 172);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentW, 32, 4, 4, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("Valor Total", pageW / 2, y + 9, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59);
  doc.text(fmtBRL(data.valor), pageW / 2, y + 21, { align: "center" });

  if (data.condicoesPagamento !== "integral") {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    const pagText = getPagamentoText(data.condicoesPagamento, data.valor);
    doc.text(pagText, pageW / 2, y + 29, { align: "center" });
  }
  y += 40;

  // ── Deadline + Validity ─────────────────────────────────────
  const halfW = (contentW - 5) / 2;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);

  doc.roundedRect(margin, y, halfW, 18, 2, 2, "FD");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Prazo", margin + 4, y + 7);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text(data.prazo || "—", margin + 4, y + 14);

  doc.roundedRect(margin + halfW + 5, y, halfW, 18, 2, 2, "FD");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Válida até", margin + halfW + 9, y + 7);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text(getValidityDate(data.validade), margin + halfW + 9, y + 14);

  y += 26;

  // ── Terms (premium only) ────────────────────────────────────
  if (data.template === "premium") {
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageW - margin, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("TERMOS", margin, y);
    y += 5;

    const terms = [
      "Início após pagamento da entrada",
      "Até 2 rodadas de revisão",
      "Direitos transferidos após pagamento",
      "Alterações extras orçadas separadamente",
    ];
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    terms.forEach((t) => {
      doc.text(`• ${t}`, margin, y);
      y += 6;
    });
  }

  // ── Footer ──────────────────────────────────────────────────
  const footerY = 282;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 4, pageW - margin, footerY - 4);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Estamos à disposição para esclarecer dúvidas.",
    pageW / 2,
    footerY + 2,
    { align: "center" }
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(14, 59, 46);
  doc.text("DashComigo", pageW / 2, footerY + 9, { align: "center" });

  const safeName = (data.nomeCliente || "cliente")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
  const today = new Date().toISOString().split("T")[0];
  doc.save(`proposta-${safeName}-${today}.pdf`);
}
