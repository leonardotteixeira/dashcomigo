import sharp from "sharp";

const SOURCE = "public/logo.png";

// Opção A: logo completo (arara + "Bubuya")
await sharp(SOURCE)
  .resize(160, 160, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .extend({ top: 10, bottom: 10, left: 10, right: 10, background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .png()
  .toFile("public/preview-full-logo.png");

// Opção B: só a arara — crop da metade direita da imagem
const meta = await sharp(SOURCE).metadata();
const araraLeft = Math.round(meta.width * 0.54); // arara começa ~54% da largura
await sharp(SOURCE)
  .extract({ left: araraLeft, top: 0, width: meta.width - araraLeft, height: meta.height })
  .resize(160, 160, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .extend({ top: 10, bottom: 10, left: 10, right: 10, background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .png()
  .toFile("public/preview-arara-only.png");

console.log("Previews gerados!");
