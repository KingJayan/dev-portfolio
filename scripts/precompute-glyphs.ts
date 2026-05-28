import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import type { Font } from "opentype.js";
const require = createRequire(import.meta.url);
const opentype = require("../node_modules/opentype.js") as { parse: (buf: ArrayBuffer) => Font };

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, "..");

const { portfolioConfig } = await import("../src/portfolio.config.js");

const STATIC_ENTRIES: { text: string; fontUrl: string }[] = [
  { text: "my work",  fontUrl: "/fonts/PermanentMarker.woff" },
  { text: "about",    fontUrl: "/fonts/PermanentMarker.woff" },
  { text: "repos",    fontUrl: "/fonts/PermanentMarker.woff" },
  { text: "extras",   fontUrl: "/fonts/PermanentMarker.woff" },
  { text: "say hi",   fontUrl: "/fonts/PermanentMarker.woff" },
];

STATIC_ENTRIES.push(
  { text: portfolioConfig.personal.name, fontUrl: "/fonts/PermanentMarker.woff" },
  { text: portfolioConfig.outsideProgramming.title, fontUrl: "/fonts/PermanentMarker.woff" },
);
for (const project of portfolioConfig.projects.items) {
  STATIC_ENTRIES.push({ text: project.title, fontUrl: "/fonts/AmaticSC.ttf" });
}

const seen = new Set<string>();
const entries = STATIC_ENTRIES.filter(({ text, fontUrl }) => {
  const key = `${fontUrl}::${text}`;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

const fontCache = new Map<string, Font>();
function getFont(fontUrl: string): Font {
  if (fontCache.has(fontUrl)) return fontCache.get(fontUrl)!;
  const filePath = join(ROOT, "public", fontUrl);
  const buffer = readFileSync(filePath);
  const font = opentype.parse(buffer.buffer as ArrayBuffer);
  fontCache.set(fontUrl, font);
  return font;
}

interface GlyphEntry {
  glyphs: { d: string }[];
  viewBox: { width: number; height: number };
}

function computeGlyphs(text: string, fontUrl: string, fontSize = 72): GlyphEntry | null {
  const font = getFont(fontUrl);
  const scale = fontSize / font.unitsPerEm;
  const ascender = font.ascender * scale;
  const descender = Math.abs(font.descender * scale);
  const height = ascender + descender;

  let x = 0;
  const glyphs: { d: string }[] = [];

  for (const char of text) {
    const glyph = font.charToGlyph(char);
    const path = glyph.getPath(x, ascender, fontSize);
    const d = path.toPathData(2);
    if (d && /(?:\bNaN\b|\bInfinity\b|-Infinity\b)/.test(d)) return null;

    glyphs.push({ d: d ?? "" });
    const aw = glyph.advanceWidth ?? 0;
    x += aw * scale;
    if (!Number.isFinite(x)) return null;
  }

  if (glyphs.length === 0 || !Number.isFinite(x)) return null;
  return { glyphs, viewBox: { width: x, height } };
}

const result: Record<string, GlyphEntry> = {};
for (const { text, fontUrl } of entries) {
  const key = `${fontUrl}::${text}`;
  const data = computeGlyphs(text, fontUrl);
  if (data) {
    result[key] = data;
    process.stdout.write(`  ✓ ${JSON.stringify(text)} (${fontUrl.split("/").pop()})\n`);
  } else {
    process.stdout.write(`  ✗ ${JSON.stringify(text)} — skipped\n`);
  }
}

const outDir = join(ROOT, "src", "data");
mkdirSync(outDir, { recursive: true });

const outPath = join(outDir, "glyph-paths.ts");
const content = `// AUTO-GENERATED — do not edit by hand\nexport const PRECOMPUTED_GLYPHS: Record<string, { glyphs: { d: string }[]; viewBox: { width: number; height: number } }> = ${JSON.stringify(result, null, 2)} as const;\n`;

writeFileSync(outPath, content, "utf8");
console.log(`\nWrote ${Object.keys(result).length} entries → src/data/glyph-paths.ts`);
