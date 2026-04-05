// Script para gerar ícones PWA a partir do logo.png
// Execute: node generate-pwa-icons.mjs
import sharp from "sharp";
import { mkdir } from "fs/promises";

const SOURCE = "public/logo.png";
const OUTPUT = "public/icons";

await mkdir(OUTPUT, { recursive: true });

const sizes = [
  // PWA padrão
  { name: "icon-72x72.png",   size: 72 },
  { name: "icon-96x96.png",   size: 96 },
  { name: "icon-128x128.png", size: 128 },
  { name: "icon-144x144.png", size: 144 },
  { name: "icon-152x152.png", size: 152 },
  { name: "icon-192x192.png", size: 192 },
  { name: "icon-384x384.png", size: 384 },
  { name: "icon-512x512.png", size: 512 },
  // Apple Touch Icons
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
  await sharp(SOURCE)
    .resize(size, size, { fit: "contain", background: { r: 20, g: 20, b: 20, alpha: 1 } })
    .png()
    .toFile(`${OUTPUT}/${name}`);
  console.log(`✅ ${OUTPUT}/${name}`);
}

console.log("\n🎉 Ícones gerados com sucesso!");
