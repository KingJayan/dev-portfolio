import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import * as opentype from "opentype.js";

interface GlyphPath {
  d: string;
}

interface DrawTextProps {
  text: string;
  fontUrl: string;
  fontSize?: number;
  className?: string;
  strokeWidth?: number;
  glyphDelay?: number;
  duration?: number;
  initialDelay?: number;
}

// module-level cache — avoids re-fetching
const fontCache = new Map<string, opentype.Font>();
const fontLoadPromises = new Map<string, Promise<opentype.Font>>();

function loadFont(url: string): Promise<opentype.Font> {
  if (fontCache.has(url)) return Promise.resolve(fontCache.get(url)!);
  if (fontLoadPromises.has(url)) return fontLoadPromises.get(url)!;

  const promise = fetch(url)
    .then((res) => res.arrayBuffer())
    .then((buffer) => {
      const font = opentype.parse(buffer);
      fontCache.set(url, font);
      fontLoadPromises.delete(url);
      return font;
    });

  fontLoadPromises.set(url, promise);
  return promise;
}

//sm shi from stackoverflow idk
export default function DrawText({
  text,
  fontUrl,
  fontSize = 72,
  className = "",
  strokeWidth = 2,
  glyphDelay = 0.06,
  duration = 0.5,
  initialDelay = 0,
}: DrawTextProps) {
  const reduced = usePrefersReducedMotion();
  const [glyphs, setGlyphs] = useState<GlyphPath[] | null>(null);
  const [viewBox, setViewBox] = useState({ width: 0, height: 0 });

  useEffect(() => {
    let cancelled = false;

    loadFont(fontUrl)
      .then((font) => {
        if (cancelled) return;

        const scale = fontSize / font.unitsPerEm;
        const ascender = font.ascender * scale;
        const descender = Math.abs(font.descender * scale);
        const height = ascender + descender;

        let x = 0;
        const paths: GlyphPath[] = [];

        for (const char of text) {
          const glyph = font.charToGlyph(char);
          const path = glyph.getPath(x, ascender, fontSize);
          const d = path.toPathData(2);
          if (d) paths.push({ d });
          x += (glyph.advanceWidth ?? 0) * scale;
        }

        if (!cancelled) {
          setGlyphs(paths);
          setViewBox({ width: x, height });
        }
      })
      .catch((err) => {
        console.error("[DrawText] failed to load font:", fontUrl, err);
      });

    return () => {
      cancelled = true;
    };
  }, [text, fontUrl, fontSize]);

  if (reduced || glyphs === null) {
    return <span className={className}>{text}</span>;
  }

  const aspectRatio = viewBox.height > 0 ? viewBox.width / viewBox.height : 1;

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block align-middle ${className}`}
      style={{ height: "1.3em", width: `${aspectRatio * 1.3}em` }}
    >
      {glyphs.map((g, i) => (
        <motion.path
          key={i}
          d={g.d}
          fill="currentColor"
          initial={{ pathLength: 0, opacity: 0, fillOpacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1, fillOpacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            pathLength: { duration, delay: initialDelay + i * glyphDelay, ease: "easeInOut" },
            opacity: { duration: 0.01, delay: initialDelay + i * glyphDelay },
            fillOpacity: { duration: 0.25, delay: initialDelay + i * glyphDelay + duration },
          }}
        />
      ))}
    </svg>
  );
}
