import { mkdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, "public", "logo.png");
const OUTPUT_DIR = path.join(ROOT, "public", "icons");

const BRAND = { r: 79, g: 70, b: 229, alpha: 1 };
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

async function renderIcon(size, name, { background, logoScale, radiusRatio = 0 }) {
  const logo = await sharp(SOURCE)
    .trim({ threshold: 1 })
    .resize(Math.round(size * logoScale), Math.round(size * logoScale), {
      fit: "contain",
      background: { ...background, alpha: 0 },
    })
    .png()
    .toBuffer();

  const radius = Math.round(size * radiusRatio);
  const backgroundSvg = Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">` +
      `<rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" ` +
      `fill="rgb(${background.r},${background.g},${background.b})" />` +
      `</svg>`,
  );

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: backgroundSvg },
      { input: logo, gravity: "center" },
    ])
    .png()
    .toFile(path.join(OUTPUT_DIR, name));
}

async function renderAppleIcon() {
  const size = 180;
  const logo = await sharp(SOURCE)
    .trim({ threshold: 1 })
    .resize(Math.round(size * 0.8), Math.round(size * 0.8), {
      fit: "contain",
      background: { ...WHITE, alpha: 0 },
    })
    .png()
    .toBuffer();

  await sharp({
    create: { width: size, height: size, channels: 4, background: WHITE },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(path.join(OUTPUT_DIR, "apple-touch-icon.png"));
}

mkdirSync(OUTPUT_DIR, { recursive: true });

await renderIcon(192, "icon-192.png", {
  background: WHITE,
  logoScale: 0.82,
  radiusRatio: 0.2,
});
await renderIcon(512, "icon-512.png", {
  background: WHITE,
  logoScale: 0.82,
  radiusRatio: 0.2,
});
await renderIcon(192, "maskable-192.png", {
  background: BRAND,
  logoScale: 0.62,
});
await renderIcon(512, "maskable-512.png", {
  background: BRAND,
  logoScale: 0.62,
});
await renderAppleIcon();

console.log(`PWA icons generated in ${path.relative(ROOT, OUTPUT_DIR)}`);
