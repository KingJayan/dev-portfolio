import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "@/hooks/use-theme";

const CELL = 20;
const TICK = 120;

type Dir = { x: number; y: number };
type Pt  = { x: number; y: number };

function rndFood(cols: number, rows: number): Pt {
  return { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
}

export default function Snake({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  const snakeRef   = useRef<Pt[]>([]);
  const dirRef     = useRef<Dir>({ x: 1, y: 0 });
  const nextDirRef = useRef<Dir>({ x: 1, y: 0 });
  const foodRef    = useRef<Pt>({ x: 0, y: 0 });
  const gameOverRef = useRef(false);
  const colsRef    = useRef(0);
  const rowsRef    = useRef(0);
  const scoreRef   = useRef(0);
  const [score, setScore] = useState(0);

  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cols = Math.floor(canvas.width / CELL);
    const rows = Math.floor(canvas.height / CELL);
    colsRef.current = cols;
    rowsRef.current = rows;
    const mid = { x: Math.floor(cols / 2), y: Math.floor(rows / 2) };
    snakeRef.current   = [mid, { x: mid.x - 1, y: mid.y }, { x: mid.x - 2, y: mid.y }];
    dirRef.current     = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    foodRef.current    = rndFood(cols, rows);
    gameOverRef.current = false;
    scoreRef.current   = 0;
    setScore(0);
  }, []);

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
    const dirMap: Record<string, Dir> = {
      ArrowUp:    { x: 0,  y: -1 }, w: { x: 0,  y: -1 }, W: { x: 0,  y: -1 },
      ArrowDown:  { x: 0,  y:  1 }, s: { x: 0,  y:  1 }, S: { x: 0,  y:  1 },
      ArrowLeft:  { x: -1, y:  0 }, a: { x: -1, y:  0 }, A: { x: -1, y:  0 },
      ArrowRight: { x:  1, y:  0 }, d: { x:  1, y:  0 }, D: { x:  1, y:  0 },
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")              { onClose();  return; }
      if (e.key === "r" || e.key === "R") { initGame(); return; }
      const next = dirMap[e.key];
      const cur  = dirRef.current;
      if (next && !(next.x === -cur.x && next.y === -cur.y)) nextDirRef.current = next;
      if (e.key.startsWith("Arrow")) e.preventDefault();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, initGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dark = theme === "dark";
    const col = {
      bg:      dark ? "#15181d" : "#f6f3ec",
      grid:    dark ? "rgba(232,237,243,0.05)" : "rgba(37,34,31,0.05)",
      snake:   dark ? "#e8edf3" : "#25221f",
      tail:    dark ? "#e8edf399" : "#25221f99",
      food:    "#bd8da2",
      text:    dark ? "#e8edf3" : "#25221f",
      overlay: dark ? "rgba(21,24,29,0.88)" : "rgba(246,243,236,0.88)",
      font:    "Kalam, cursive",
    };

    const draw = () => {
      const cols = colsRef.current;
      const rows = rowsRef.current;
      ctx.fillStyle = col.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // draw grid as lines (O(cols+rows)) instead of per-cell rects (O(cols*rows))
      ctx.strokeStyle = col.grid;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let x = 0; x <= cols; x++) { ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, rows * CELL); }
      for (let y = 0; y <= rows; y++) { ctx.moveTo(0, y * CELL); ctx.lineTo(cols * CELL, y * CELL); }
      ctx.stroke();
      ctx.fillStyle = col.food;
      const pulse = Math.sin(Date.now() / 300) * 1.5;
      ctx.fillRect(
        foodRef.current.x * CELL + 3 - pulse / 2,
        foodRef.current.y * CELL + 3 - pulse / 2,
        CELL - 6 + pulse,
        CELL - 6 + pulse,
      );
      snakeRef.current.forEach((pt, i) => {
        ctx.fillStyle = i === 0 ? col.snake : col.tail;
        ctx.fillRect(pt.x * CELL + 1, pt.y * CELL + 1, CELL - 2, CELL - 2);
      });
      if (gameOverRef.current) {
        ctx.fillStyle = col.overlay;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = col.text;
        ctx.textAlign = "center";
        ctx.font = `bold 32px ${col.font}`;
        ctx.fillText("game over", canvas.width / 2, canvas.height / 2 - 24);
        ctx.font = `20px ${col.font}`;
        ctx.fillText(`score: ${scoreRef.current}`, canvas.width / 2, canvas.height / 2 + 16);
        ctx.fillText("r to restart · esc to exit", canvas.width / 2, canvas.height / 2 + 52);
      }
    };

    const tick = () => {
      if (gameOverRef.current) { draw(); return; }
      dirRef.current = nextDirRef.current;
      const head = snakeRef.current[0];
      const next = {
        x: (head.x + dirRef.current.x + colsRef.current) % colsRef.current,
        y: (head.y + dirRef.current.y + rowsRef.current) % rowsRef.current,
      };
      if (snakeRef.current.some(pt => pt.x === next.x && pt.y === next.y)) {
        gameOverRef.current = true;
        draw();
        return;
      }
      snakeRef.current = [next, ...snakeRef.current];
      if (next.x === foodRef.current.x && next.y === foodRef.current.y) {
        scoreRef.current++;
        setScore(scoreRef.current);
        foodRef.current = rndFood(colsRef.current, rowsRef.current);
      } else {
        snakeRef.current.pop();
      }
      draw();
    };

    const id = setInterval(tick, TICK);
    return () => clearInterval(id);
  }, [theme]);

  return (
    <div className="game-overlay fixed inset-0 z-[9500]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 select-none pointer-events-none font-hand text-base text-ink/50">
        score: {score} · esc to exit
      </div>
      <button onClick={onClose} className="absolute top-3 right-5 text-2xl leading-none font-hand text-ink/40 hover:text-ink">×</button>
    </div>
  );
}
