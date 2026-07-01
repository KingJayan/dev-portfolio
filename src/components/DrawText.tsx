import { m, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import type { Font } from "opentype.js";
import { PRECOMPUTED_GLYPHS } from "@/data/glyph-paths";

interface GlyphPath {
  d: string;
}

function hasInvalidPathData(pathData: string): boolean {
  return /(?:\bNaN\b|\bInfinity\b|-Infinity\b)/.test(pathData);
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
  animateOnMount?: boolean;
}

const fontCache = new Map<string, Font>();
const fontLoadPromises = new Map<string, Promise<Font>>();

function loadFont(url: string): Promise<Font> {
  if (fontCache.has(url)) return Promise.resolve(fontCache.get(url)!);
  if (fontLoadPromises.has(url)) return fontLoadPromises.get(url)!;

  const promise = fetch(url)
    .then((res) => res.arrayBuffer())
    .then(async (buffer) => {
      const opentype = await import("opentype.js");
      const font = opentype.parse(buffer);
      fontCache.set(url, font);
      return font;
    })
    .finally(() => {
      fontLoadPromises.delete(url);
    });

  fontLoadPromises.set(url, promise);
  return promise;
}

export default function DrawText({
  text,
  fontUrl,
  fontSize = 72,
  className = "",
  strokeWidth = 2,
  glyphDelay = 0.06,
  duration = 0.5,
  initialDelay = 0,
  animateOnMount = false,
}: DrawTextProps) {
  const osReducedMotion = usePrefersReducedMotion();
  const forcedReducedMotion = useReducedMotion();
  const reduced = osReducedMotion || !!forcedReducedMotion;

  const precomputed = PRECOMPUTED_GLYPHS[`${fontUrl}::${text}`];
  const [glyphs, setGlyphs] = useState<GlyphPath[] | null>(precomputed?.glyphs ?? null);
  const [viewBox, setViewBox] = useState(precomputed?.viewBox ?? { width: 0, height: 0 });

  useEffect(() => {
    if (precomputed) return;

    let cancelled = false;

    loadFont(fontUrl)
      .then((font) => {
        if (cancelled) return;

        const scale = fontSize / font.unitsPerEm;
        const ascender = font.ascender * scale;
        const descender = Math.abs(font.descender * scale);
        const height = ascender + descender;

        if (![scale, ascender, descender, height].every(Number.isFinite)) {
          throw new Error("[DrawText] invalid font metrics");
        }

        let x = 0;
        const paths: GlyphPath[] = [];
        let invalidPath = false;

        for (const char of text) {
          const glyph = font.charToGlyph(char);
          const path = glyph.getPath(x, ascender, fontSize);
          const d = path.toPathData(2);
          if (!d || hasInvalidPathData(d)) {
            invalidPath = true;
            break;
          }

          paths.push({ d });

          const advanceWidth = glyph.advanceWidth ?? 0;
          if (!Number.isFinite(advanceWidth)) {
            invalidPath = true;
            break;
          }

          x += advanceWidth * scale;

          if (!Number.isFinite(x)) {
            invalidPath = true;
            break;
          }
        }

        if (!cancelled) {
          if (invalidPath || paths.length === 0 || !Number.isFinite(x)) {
            setGlyphs(null);
            setViewBox({ width: 0, height: 0 });
            return;
          }

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
    <>
    <span className="sr-only">{text}</span>
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`draw-text-svg inline-block align-middle ${className}`}
      style={{ height: "1.3em", width: `${aspectRatio * 1.3}em` }}
    >
      {glyphs.map((g, i) => (
        <m.path
          key={i}
          d={g.d || undefined}
          fill="currentColor"
          initial={{ pathLength: 0, opacity: 0, fillOpacity: 0 }}
          {...(animateOnMount
            ? { animate: { pathLength: 1, opacity: 1, fillOpacity: 1 } }
            : { whileInView: { pathLength: 1, opacity: 1, fillOpacity: 1 }, viewport: { once: true, margin: "-50px" } })}
          transition={{
            pathLength: { duration, delay: initialDelay + i * glyphDelay, ease: "easeInOut" },
            opacity: { duration: 0.01, delay: initialDelay + i * glyphDelay },
            fillOpacity: { duration: 0.25, delay: initialDelay + i * glyphDelay + duration },
          }}
        />
      ))}
    </svg>
    </>
  );
}
