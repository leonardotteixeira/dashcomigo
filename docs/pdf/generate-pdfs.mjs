/**
 * Dashcomigo — PDF Generator
 * Uses Puppeteer + marked to convert branded Markdown → PDF
 */

import puppeteer from 'puppeteer';
import { marked } from 'marked';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR  = path.join(__dirname, '..');
const OUT_DIR   = __dirname;

// ── Brand SVG logo (inline) ──────────────────────────────────────────────────
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="54" viewBox="0 0 520 108" fill="none">
  <circle cx="54" cy="54" r="34" stroke="#ffffff" stroke-width="10" fill="none"/>
  <circle cx="90" cy="54" r="12" fill="#7FD19F"/>
  <text x="128" y="72" font-family="Inter,Helvetica,Arial,sans-serif" font-weight="700" font-size="46" letter-spacing="-1.6" fill="#ffffff">Dashcomigo</text>
</svg>`;

const LOGO_DARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="42" viewBox="0 0 520 108" fill="none">
  <circle cx="54" cy="54" r="34" stroke="#0E3B2E" stroke-width="10" fill="none"/>
  <circle cx="90" cy="54" r="12" fill="#7FD19F"/>
  <text x="128" y="72" font-family="Inter,Helvetica,Arial,sans-serif" font-weight="700" font-size="46" letter-spacing="-1.6" fill="#0E3B2E">Dashcomigo</text>
</svg>`;

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = fs.readFileSync(path.join(__dirname, 'template.css'), 'utf-8');

// ── Documents to generate ────────────────────────────────────────────────────
const DOCS = [
  {
    input:    'investor-deck.md',
    output:   'dashcomigo-investor-deck.pdf',
    title:    'Investor Deck',
    subtitle: 'Q2 2026 · Pre-Seed',
    badge:    'Investor Confidential',
  },
  {
    input:    'pitch.md',
    output:   'dashcomigo-pitch.pdf',
    title:    'Investor Pitch',
    subtitle: 'Financial Intelligence for Brazilian Entrepreneurs',
    badge:    'Executive Summary',
  },
  {
    input:    'vision.md',
    output:   'dashcomigo-vision.pdf',
    title:    'Vision & Mission',
    subtitle: 'Who We Are and Where We\'re Going',
    badge:    'Company Overview',
  },
  {
    input:    'product.md',
    output:   'dashcomigo-product.pdf',
    title:    'Product Overview',
    subtitle: 'Platform Features & Open Finance Roadmap',
    badge:    'Product',
  },
  {
    input:    'business-model.md',
    output:   'dashcomigo-business-model.pdf',
    title:    'Business Model',
    subtitle: 'Revenue Strategy & Market Projections',
    badge:    'Financial',
  },
  {
    input:    'roadmap.md',
    output:   'dashcomigo-roadmap.pdf',
    title:    'Product Roadmap',
    subtitle: 'Foundation → Intelligence → Platform → Ecosystem',
    badge:    'Roadmap',
  },
];

// ── HTML wrapper ──────────────────────────────────────────────────────────────
function buildHTML(doc, markdownContent) {
  const htmlBody = marked.parse(markdownContent);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashcomigo — ${doc.title}</title>
  <style>
    ${CSS}
  </style>
</head>
<body>

  <!-- ── COVER PAGE ──────────────────────────────────────────── -->
  <div class="cover">
    <div class="cover-logo">
      ${LOGO_SVG}
    </div>

    <div class="cover-main">
      <div class="cover-badge">${doc.badge}</div>
      <div class="cover-title">${doc.title}</div>
      <div class="cover-subtitle">${doc.subtitle}</div>
    </div>

    <div class="cover-footer">
      <div class="cover-footer-left">
        <strong>Leonardo Teixeira</strong>
        Founder & CEO · Dashcomigo<br>
        contato@dashcomigo.com.br
      </div>
      <div class="cover-footer-right">
        Confidential · Q2 2026<br>
        dashcomigo.com.br
      </div>
    </div>
  </div>

  <!-- ── CONTENT ────────────────────────────────────────────── -->
  <div class="page" style="padding-top: 56px;">
    ${htmlBody}
  </div>

</body>
</html>`;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🚀 Dashcomigo PDF Generator\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Users\\Leonardo\\.cache\\puppeteer\\chrome\\win64-147.0.7727.57\\chrome-win64\\chrome.exe',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
    timeout: 60000,
  });

  for (const doc of DOCS) {
    const inputPath  = path.join(DOCS_DIR, doc.input);
    const outputPath = path.join(OUT_DIR, doc.output);

    if (!fs.existsSync(inputPath)) {
      console.warn(`⚠️  Skipping ${doc.input} — file not found`);
      continue;
    }

    const markdown = fs.readFileSync(inputPath, 'utf-8');
    const html     = buildHTML(doc, markdown);

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top:    '0mm',
        bottom: '16mm',
        left:   '0mm',
        right:  '0mm',
      },
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="width:100%; padding: 0 40px; font-size:10px; color:#0E3B2E99;
                    font-family:Inter,sans-serif; display:flex; justify-content:space-between;
                    align-items:center; border-top: 1px solid rgba(14,59,46,0.1); padding-top:8px;">
          <span>Dashcomigo · ${doc.title}</span>
          <span style="color:#0E3B2E44;">Confidential · Q2 2026</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>`,
    });

    await page.close();
    console.log(`  ✅ ${doc.output}`);
  }

  await browser.close();
  console.log(`\n📁 All PDFs saved to: docs/pdf/\n`);
}

main().catch(err => {
  console.error('❌ PDF generation failed:', err.message);
  process.exit(1);
});
