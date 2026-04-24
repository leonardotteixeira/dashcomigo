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
  nomeEmpresa?: string;
  aiText?: string; // Texto completo gerado pela IA
}

// ── Formatters ────────────────────────────────────────────────────────────────

function fmtBRL(value: number) {
  if (!value || value === 0) return null;
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

function fmtDate() {
  return new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function fmtValidityDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + (days || 7));
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function fmtCondicoes(cond: string, valor: number): string {
  const v = valor || 0;
  if (cond === "integral") return `À vista`;
  if (cond === "50-50") return `50% na assinatura + 50% na entrega`;
  if (cond === "30-70") return `30% na assinatura + 70% na entrega`;
  if (cond === "3x") return `3x sem juros`;
  return cond || "A combinar";
}

// ── Constants ─────────────────────────────────────────────────────────────────
const DARK_GREEN = [14, 59, 46] as const;
const MID_GREEN  = [31, 90, 58] as const;
const ACCENT     = [127, 209, 159] as const;
const WHITE      = [255, 255, 255] as const;
const GRAY_900   = [30, 41, 59] as const;
const GRAY_600   = [71, 85, 105] as const;
const GRAY_400   = [148, 163, 184] as const;
const GRAY_100   = [241, 245, 249] as const;
const GRAY_50    = [248, 250, 252] as const;
const GREEN_50   = [240, 253, 244] as const;
const GREEN_200  = [134, 239, 172] as const;
const PAGE_W     = 210;
const MARGIN     = 18;
const CONTENT_W  = PAGE_W - MARGIN * 2;

// ── Helper renderers ──────────────────────────────────────────────────────────

function setRGB(doc: jsPDF, color: readonly [number, number, number], type: "fill" | "draw" | "text") {
  if (type === "fill") doc.setFillColor(color[0], color[1], color[2]);
  else if (type === "draw") doc.setDrawColor(color[0], color[1], color[2]);
  else doc.setTextColor(color[0], color[1], color[2]);
}

function sectionLabel(doc: jsPDF, text: string, y: number) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  setRGB(doc, GRAY_400, "text");
  doc.text(text.toUpperCase(), MARGIN, y);
  return y + 5;
}

function divider(doc: jsPDF, y: number) {
  setRGB(doc, GRAY_100, "draw");
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  return y + 6;
}

function checkPage(doc: jsPDF, y: number, needed = 30): number {
  if (y + needed > 270) {
    doc.addPage();
    return 20;
  }
  return y;
}

// ── Parse AI text into sections ───────────────────────────────────────────────

function parseAIText(text: string): { title: string; lines: string[] }[] {
  const sections: { title: string; lines: string[] }[] = [];
  const parts = text.split(/━+/g).map(s => s.trim()).filter(Boolean);

  for (const part of parts) {
    const lineArr = part.split("\n").map(l => l.trim()).filter(Boolean);
    if (!lineArr.length) continue;
    const title = lineArr[0];
    const lines = lineArr.slice(1);
    if (lines.length > 0 || title) {
      sections.push({ title, lines });
    }
  }
  return sections;
}

// ── Main export ───────────────────────────────────────────────────────────────

export function generateProposalPDF(data: ProposalPDFData): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const isContrato = data.tipo === "contrato";
  const valorFmt   = fmtBRL(data.valor);
  const empresa    = data.nomeEmpresa || "DashComigo";
  const hoje       = fmtDate();
  const validade   = fmtValidityDate(data.validade);

  let y = 0;

  // ── HEADER ────────────────────────────────────────────────────────────────

  // Background block
  setRGB(doc, DARK_GREEN, "fill");
  doc.rect(0, 0, PAGE_W, 52, "F");

  // Accent bar bottom
  setRGB(doc, ACCENT, "fill");
  doc.rect(0, 49, PAGE_W, 3, "F");

  // Company name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setRGB(doc, ACCENT, "text");
  doc.text(empresa.toUpperCase(), MARGIN, 14);

  // Document title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  setRGB(doc, WHITE, "text");
  const docTitle = isContrato ? "Contrato de Prestação de Serviços" : "Proposta Comercial";
  doc.text(docTitle, MARGIN, 30);

  // Date right side
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setRGB(doc, ACCENT, "text");
  doc.text(hoje, PAGE_W - MARGIN, 14, { align: "right" });

  // Tipo badge
  const tipoBadge = isContrato ? "CONTRATO" : "ORÇAMENTO";
  setRGB(doc, ACCENT, "fill");
  doc.roundedRect(PAGE_W - MARGIN - 30, 22, 30, 8, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  setRGB(doc, DARK_GREEN, "text");
  doc.text(tipoBadge, PAGE_W - MARGIN - 15, 27.2, { align: "center" });

  y = 64;

  // ── CLIENTE ───────────────────────────────────────────────────────────────

  if (data.nomeCliente) {
    y = sectionLabel(doc, "Para", y);

    setRGB(doc, GRAY_50, "fill");
    setRGB(doc, GRAY_100, "draw");
    doc.setLineWidth(0.3);
    doc.roundedRect(MARGIN, y, CONTENT_W, data.emailCliente ? 22 : 14, 3, 3, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    setRGB(doc, GRAY_900, "text");
    doc.text(data.nomeCliente, MARGIN + 5, y + 9);

    if (data.emailCliente) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      setRGB(doc, GRAY_600, "text");
      doc.text(data.emailCliente, MARGIN + 5, y + 17);
    }

    y += (data.emailCliente ? 22 : 14) + 10;
  }

  // ── PROJETO ───────────────────────────────────────────────────────────────

  if (data.nomeServico) {
    y = sectionLabel(doc, "Projeto", y);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    setRGB(doc, GRAY_900, "text");
    doc.text(data.nomeServico, MARGIN, y);
    y += 7;

    if (data.descricao && !data.aiText) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      setRGB(doc, GRAY_600, "text");
      const lines = doc.splitTextToSize(data.descricao, CONTENT_W) as string[];
      doc.text(lines, MARGIN, y);
      y += lines.length * 5 + 4;
    }

    y += 4;
    y = divider(doc, y);
  }

  // ── CONTEÚDO PRINCIPAL (IA ou template) ───────────────────────────────────

  if (data.aiText) {
    const sections = parseAIText(data.aiText);

    // Skip header sections (já exibidas acima) — começar do "SOBRE O PROJETO" em diante
    const skipTitles = new Set(["PARA", "PROPOSTA COMERCIAL", "CONTRATO DE PRESTAÇÃO DE SERVIÇOS"]);
    // Also skip the financial summary — rendered separately below
    const financialTitles = new Set(["INVESTIMENTO", "PRAZO", "VALIDADE"]);

    for (const section of sections) {
      const upperTitle = section.title.toUpperCase();
      if (skipTitles.has(upperTitle)) continue;
      if (financialTitles.has(upperTitle)) continue;

      y = checkPage(doc, y, 20);

      // Section title
      if (section.title) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        setRGB(doc, GRAY_400, "text");
        doc.text(section.title.toUpperCase(), MARGIN, y);
        y += 6;
      }

      // Section content
      for (const line of section.lines) {
        y = checkPage(doc, y, 10);
        const isBullet = line.startsWith("•") || line.startsWith("-");
        const isNumbered = /^\d+\./.test(line);
        const isClause = /^CLÁUSULA/i.test(line);

        if (isClause) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          setRGB(doc, GRAY_900, "text");
          const wrapped = doc.splitTextToSize(line, CONTENT_W) as string[];
          doc.text(wrapped, MARGIN, y);
          y += wrapped.length * 5.5 + 2;
        } else if (isBullet || isNumbered) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9.5);
          setRGB(doc, GRAY_600, "text");
          const indent = isBullet ? MARGIN + 3 : MARGIN + 4;
          const wrapped = doc.splitTextToSize(line, CONTENT_W - 6) as string[];
          doc.text(wrapped, indent, y);
          y += wrapped.length * 5 + 1;
        } else if (line.trim() === "") {
          y += 3;
        } else {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          setRGB(doc, GRAY_600, "text");
          const wrapped = doc.splitTextToSize(line, CONTENT_W) as string[];
          doc.text(wrapped, MARGIN, y);
          y += wrapped.length * 5.5 + 1;
        }
      }
      y += 6;
      y = divider(doc, y);
    }

  } else {
    // Template estático quando não há texto da IA
    if (data.template !== "basico" && data.descricao) {
      y = sectionLabel(doc, "Escopo de Entrega", y);
      const escopoItems = [
        "Levantamento de requisitos e planejamento",
        "Desenvolvimento e implementação",
        "Revisões e ajustes (até 2 rodadas)",
        "Entrega final e suporte inicial",
      ];
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      setRGB(doc, GRAY_600, "text");
      escopoItems.forEach(item => {
        setRGB(doc, ACCENT, "fill");
        doc.circle(MARGIN + 1.5, y - 1.5, 1.2, "F");
        doc.text(item, MARGIN + 5, y);
        y += 6;
      });
      y += 4;
      y = divider(doc, y);
    }
  }

  // ── RESUMO FINANCEIRO ─────────────────────────────────────────────────────

  y = checkPage(doc, y, 50);

  y = sectionLabel(doc, "Resumo Financeiro", y);

  // Valor box
  if (valorFmt) {
    setRGB(doc, GREEN_50, "fill");
    setRGB(doc, GREEN_200, "draw");
    doc.setLineWidth(0.5);
    doc.roundedRect(MARGIN, y, CONTENT_W, 34, 4, 4, "FD");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setRGB(doc, GRAY_600, "text");
    doc.text("Valor Total", PAGE_W / 2, y + 10, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    setRGB(doc, GRAY_900, "text");
    doc.text(valorFmt, PAGE_W / 2, y + 22, { align: "center" });

    const condText = fmtCondicoes(data.condicoesPagamento, data.valor);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    setRGB(doc, GRAY_600, "text");
    doc.text(condText, PAGE_W / 2, y + 30, { align: "center" });

    y += 40;
  }

  // Prazo + Validade
  const halfW = (CONTENT_W - 5) / 2;

  setRGB(doc, GRAY_50, "fill");
  setRGB(doc, GRAY_100, "draw");
  doc.setLineWidth(0.3);

  if (data.prazo) {
    doc.roundedRect(MARGIN, y, halfW, 18, 3, 3, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setRGB(doc, GRAY_400, "text");
    doc.text("PRAZO", MARGIN + 5, y + 7);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setRGB(doc, GRAY_900, "text");
    doc.text(data.prazo, MARGIN + 5, y + 14);
  }

  doc.roundedRect(MARGIN + halfW + 5, y, halfW, 18, 3, 3, "FD");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setRGB(doc, GRAY_400, "text");
  doc.text("VÁLIDA ATÉ", MARGIN + halfW + 10, y + 7);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  setRGB(doc, GRAY_900, "text");
  doc.text(validade, MARGIN + halfW + 10, y + 14);

  y += 26;

  // ── ASSINATURA (se contrato) ───────────────────────────────────────────────

  if (isContrato) {
    y = checkPage(doc, y, 50);
    y = divider(doc, y);
    y = sectionLabel(doc, "Assinaturas", y);

    const sigW = (CONTENT_W - 10) / 2;

    // Contratante
    setRGB(doc, GRAY_100, "draw");
    doc.setLineWidth(0.3);
    doc.line(MARGIN, y + 20, MARGIN + sigW, y + 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    setRGB(doc, GRAY_600, "text");
    doc.text("Contratante", MARGIN, y + 26);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    setRGB(doc, GRAY_900, "text");
    doc.text(data.nomeCliente || "", MARGIN, y + 32);

    // Contratado
    const sigX2 = MARGIN + sigW + 10;
    doc.line(sigX2, y + 20, sigX2 + sigW, y + 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    setRGB(doc, GRAY_600, "text");
    doc.text("Contratado", sigX2, y + 26);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    setRGB(doc, GRAY_900, "text");
    doc.text(empresa, sigX2, y + 32);

    // Data
    y += 38;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setRGB(doc, GRAY_600, "text");
    doc.text(`Data: ${hoje}`, MARGIN, y);

    y += 10;
  }

  // ── FOOTER ────────────────────────────────────────────────────────────────

  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    const footerY = 284;
    setRGB(doc, GRAY_100, "draw");
    doc.setLineWidth(0.3);
    doc.line(MARGIN, footerY - 3, PAGE_W - MARGIN, footerY - 3);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setRGB(doc, GRAY_400, "text");

    const footerMsg = isContrato
      ? "Este contrato é válido mediante assinatura das partes."
      : "Este documento foi gerado digitalmente e é válido sem assinatura física.";

    doc.text(footerMsg, PAGE_W / 2, footerY + 3, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    setRGB(doc, DARK_GREEN, "text");
    doc.text(empresa, MARGIN, footerY + 3);

    if (totalPages > 1) {
      setRGB(doc, GRAY_400, "text");
      doc.text(`${i} / ${totalPages}`, PAGE_W - MARGIN, footerY + 3, { align: "right" });
    }
  }

  // ── Save ──────────────────────────────────────────────────────────────────

  const safeName = (data.nomeCliente || "proposta")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const today = new Date().toISOString().split("T")[0];
  const prefix = isContrato ? "contrato" : "proposta";
  doc.save(`${prefix}-${safeName}-${today}.pdf`);
}
