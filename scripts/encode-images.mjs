#!/usr/bin/env node
// One-off script: generate AVIF variants for hero + logo, and shrink icon-512.
// Run: node scripts/encode-images.mjs
import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

const targets = [
  {
    src: path.join(publicDir, "images", "tow-truck-hero.webp"),
    out: path.join(publicDir, "images", "tow-truck-hero.avif"),
    format: "avif",
    options: { quality: 55, effort: 6 },
  },
  {
    src: path.join(publicDir, "images", "logo.webp"),
    out: path.join(publicDir, "images", "logo.avif"),
    format: "avif",
    options: { quality: 70, effort: 6 },
  },
  {
    src: path.join(publicDir, "icon-512.png"),
    out: path.join(publicDir, "icon-512.png"),
    format: "png",
    options: { compressionLevel: 9, palette: true, effort: 10 },
  },
  {
    src: path.join(publicDir, "icon-512.png"),
    out: path.join(publicDir, "icon-512.webp"),
    format: "webp",
    options: { quality: 85, effort: 6 },
  },
];

async function run() {
  for (const t of targets) {
    try {
      const statBefore = await fs.stat(t.src).catch(() => null);
      const pipeline = sharp(t.src);
      if (t.format === "avif") await pipeline.avif(t.options).toFile(t.out);
      else if (t.format === "webp") await pipeline.webp(t.options).toFile(t.out);
      else if (t.format === "png") await pipeline.png(t.options).toFile(t.out + ".tmp");
      if (t.format === "png") {
        await fs.rename(t.out + ".tmp", t.out);
      }
      const statAfter = await fs.stat(t.out);
      const fmtKB = (b) => (b / 1024).toFixed(1) + " KB";
      const label = `${path.relative(process.cwd(), t.src)} → ${path.relative(process.cwd(), t.out)}`;
      if (statBefore && statBefore.size !== statAfter.size) {
        console.log(`${label}: ${fmtKB(statBefore.size)} → ${fmtKB(statAfter.size)}`);
      } else {
        console.log(`${label}: ${fmtKB(statAfter.size)}`);
      }
    } catch (err) {
      console.error(`Failed ${t.src}:`, err instanceof Error ? err.message : err);
      process.exitCode = 1;
    }
  }
}

run();
