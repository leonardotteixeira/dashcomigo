// Script para gerar ícones PWA a partir do logo.png
// Execute: node generate-pwa-icons.mjs
import sharp from "sharp";
import { mkdir } from "fs/promises";

const SOURCE = "public/logo.png";
const OUTPUT = "public/icons";

await mkdir(OUTPUT, { recursive: true });

// Fundo branco — o logo Bubuya foi desenhado para fundo branco
const BG = { r: 255, g: 255, b: 255, alpha: 1 };

const sizes = [
  // PWA padrão (manifest.webmanifest)
  { name: "icon-72x72.png",   size: 72 },
  { name: "icon-96x96.png",   size: 96 },
  { name: "icon-128x128.png", size: 128 },
  { name: "icon-144x144.png", size: 144 },
  { name: "icon-152x152.png", size: 152 },
  { name: "icon-192x192.png", size: 192 },
  { name: "icon-384x384.png", size: 384 },
  { name: "icon-512x512.png", size: 512 },
  // Apple Touch Icons (iOS usa estes)
  { name: "apple-touch-icon-57x57.png",   size: 57 },
  { name: "apple-touch-icon-60x60.png",   size: 60 },
  { name: "apple-touch-icon-72x72.png",   size: 72 },
  { name: "apple-touch-icon-76x76.png",   size: 76 },
  { name: "apple-touch-icon-114x114.png", size: 114 },
  { name: "apple-touch-icon-120x120.png", size: 120 },
  { name: "apple-touch-icon-144x144.png", size: 144 },
  { name: "apple-touch-icon-152x152.png", size: 152 },
  { name: "apple-touch-icon-180x180.png", size: 180 },
  // Favicon
  { name: "../favicon-32x32.png", size: 32 },
  { name: "../favicon-16x16.png", size: 16 },
];

for (const { name, size } of sizes) {
  // Padding de 10% para o logo não encostar nas bordas
  const pad = Math.round(size * 0.10);
  const inner = size - pad * 2;
  await sharp(SOURCE)
    .resize(inner, inner, { fit: "contain", background: BG })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: BG })
    .png()
    .toFile(`${OUTPUT}/${name}`);
  console.log(`✅ ${OUTPUT}/${name}`);
}

// apple-touch-icon.png na raiz — iOS procura aqui automaticamente
await sharp(SOURCE)
  .resize(152, 152, { fit: "contain", background: BG })
  .extend({ top: 14, bottom: 14, left: 14, right: 14, background: BG })
  .png()
  .toFile("public/apple-touch-icon.png");
console.log("✅ public/apple-touch-icon.png (root — descoberta automática iOS)");

console.log("\n🎉 Ícones gerados com sucesso!");
