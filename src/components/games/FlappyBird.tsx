import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "@/hooks/use-theme";

const GRAV   = 0.4;
const FLAP   = -7;
const PIPE_W = 60;
const GAP    = 160;
const SPEED  = 2.5;
const SPAWN  = 1800; // ms between pipes
const FLOOR  = 60;
const BIRD_SIZE = 20;

type Pipe = { x: number; top: number };

export default function FlappyBird({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isTerminalMode, theme } = useTheme();
  const [score, setScore] = useState(0);
  const [dead, setDead] = useState(false);

  // game state via refs (no re-render overhead in loop)
  const birdY    = useRef(0);
  const birdVY   = useRef(0);
  const pipes    = useRef<Pipe[]>([]);
  const scoreRef = useRef(0);
  const deadRef  = useRef(false);
  const startedRef = useRef(false);
  const lastSpawn = useRef(0);
  const rafId    = useRef(0);

  const cols = useCallback(() => {
    const c = canvasRef.current;
    return c ? { w: c.width, h: c.height } : { w: 0, h: 0 };
  }, []);

  const initGame = useCallback(() => {
    const { h } = cols();
    birdY.current   = h / 2;
    birdVY.current  = 0;
    pipes.current   = [];
    scoreRef.current = 0;
    deadRef.current  = false;
    startedRef.current = false;
    lastSpawn.current  = 0;
    setScore(0);
    setDead(false);
  }, [cols]);

  const flap = useCallback(() => {
    if (deadRef.current) { initGame(); return; }
    startedRef.current = true;
    birdVY.current = FLAP;
  }, [initGame]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        flap();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, flap]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      initGame();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [initGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dark = theme === "dark";
    const col = isTerminalMode ? {
      bg:     "#0d1117",
      bird:   "#39ff14",
      pipe:   "#00cc00",
      floor:  "#1a2e1a",
      text:   "#39ff14",
      overlay:"rgba(13,17,23,0.85)",
      font:   "'Courier New', monospace",
    } : {
      bg:     dark ? "#15181d" : "#f6f3ec",
      bird:   dark ? "#e8edf3" : "#25221f",
      pipe:   dark ? "#5a6477" : "#8b7355",
      floor:  dark ? "#1c2028" : "#e0d8c8",
      text:   dark ? "#e8edf3" : "#25221f",
      overlay:dark ? "rgba(21,24,29,0.85)" : "rgba(246,243,236,0.85)",
      font:   "Kalam, cursive",
    };

    const loop = (ts: number) => {
      rafId.current = requestAnimationFrame(loop);
      const { w, h } = { w: canvas.width, h: canvas.height };
      const floorY = h - FLOOR;

      // spawn pipes
      if (startedRef.current && !deadRef.current) {
        if (ts - lastSpawn.current > SPAWN || lastSpawn.current === 0) {
          lastSpawn.current = ts;
          const maxTop = floorY - GAP - 40;
          const top = 40 + Math.random() * (maxTop - 40);
          pipes.current.push({ x: w, top });
        }
      }

      // update
      if (startedRef.current && !deadRef.current) {
        birdVY.current += GRAV;
        birdY.current  += birdVY.current;

        // move + score pipes
        pipes.current = pipes.current.filter(p => p.x + PIPE_W > -10);
        for (const p of pipes.current) {
          const wasLeft = p.x + PIPE_W / 2 > w / 3;
          p.x -= SPEED;
          const nowLeft = p.x + PIPE_W / 2 <= w / 3;
          if (wasLeft && nowLeft) {
            scoreRef.current++;
            setScore(scoreRef.current);
          }
        }

        // bird bounds
        const birdX = w / 3;
        const birdTop = birdY.current;

        // collisions
        const hitFloor = birdTop + BIRD_SIZE >= floorY;
        const hitCeil  = birdTop <= 0;
        let hitPipe = false;
        for (const p of pipes.current) {
          if (birdX + BIRD_SIZE - 4 > p.x && birdX + 4 < p.x + PIPE_W) {
            if (birdTop + 4 < p.top || birdTop + BIRD_SIZE - 4 > p.top + GAP) {
              hitPipe = true; break;
            }
          }
        }

        if (hitFloor || hitCeil || hitPipe) {
          deadRef.current = true;
          setDead(true);
        }
      }

      // draw bg
      ctx.fillStyle = col.bg;
      ctx.fillRect(0, 0, w, h);

      // draw pipes
      ctx.fillStyle = col.pipe;
      for (const p of pipes.current) {
        ctx.fillRect(p.x, 0, PIPE_W, p.top);
        ctx.fillRect(p.x, p.top + GAP, PIPE_W, floorY - (p.top + GAP));
      }

      // draw floor
      ctx.fillStyle = col.floor;
      ctx.fillRect(0, floorY, w, FLOOR);

      // draw bird with tilt based on vertical velocity
      const rot = Math.max(-0.5, Math.min(1.2, birdVY.current * 0.06));
      ctx.save();
      ctx.translate(w / 3, birdY.current + BIRD_SIZE / 2);
      ctx.rotate(rot);
      ctx.fillStyle = col.bird;
      ctx.fillRect(-BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
      ctx.restore();

      // idle hint
      if (!startedRef.current && !deadRef.current) {
        ctx.fillStyle = col.text;
        ctx.textAlign = "center";
        ctx.font = `18px ${col.font}`;
        ctx.fillText("space or click to flap", w / 2, h / 2 + 60);
      }

      // game over overlay
      if (deadRef.current) {
        ctx.fillStyle = col.overlay;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = col.text;
        ctx.textAlign = "center";
        ctx.font = `bold 32px ${col.font}`;
        ctx.fillText("game over", w / 2, h / 2 - 24);
        ctx.font = `20px ${col.font}`;
        ctx.fillText(`score: ${scoreRef.current}`, w / 2, h / 2 + 16);
        ctx.fillText("space to retry · esc to exit", w / 2, h / 2 + 52);
      }

      // score HUD
      if (!deadRef.current) {
        ctx.fillStyle = col.text;
        ctx.textAlign = "center";
        ctx.font = `bold 28px ${col.font}`;
        ctx.fillText(String(scoreRef.current), w / 2, 48);
      }

    };

    rafId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId.current);
  }, [isTerminalMode, theme]);

  const terminal = isTerminalMode;
  return (
    <div className="game-overlay fixed inset-0 z-[9500]" onClick={flap}>
      <canvas ref={canvasRef} className="block w-full h-full" />
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className={`absolute top-3 right-5 text-2xl leading-none ${terminal ? "font-mono text-[#39ff14] opacity-70 hover:opacity-100" : "font-hand text-ink/40 hover:text-ink"}`}
      >×</button>
    </div>
  );
}
