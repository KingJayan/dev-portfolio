import { useState, useEffect, useCallback, useRef } from "react";

const ROWS = 9, COLS = 9, MINES = 10;
const ADJ_COLORS = ["", "#2563eb", "#16a34a", "#dc2626", "#7c3aed", "#b91c1c", "#0891b2", "#374151", "#6b7280"];

type Cell = { mine: boolean; revealed: boolean; flagged: boolean; adj: number };
type Grid = Cell[][];
type Status = "idle" | "playing" | "won" | "lost";

const emptyGrid = (): Grid =>
  Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ mine: false, revealed: false, flagged: false, adj: 0 }))
  );

function placeMines(grid: Grid, safeR: number, safeC: number): Grid {
  const g = grid.map(row => row.map(c => ({ ...c })));
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!g[r][c].mine && !(r === safeR && c === safeC)) { g[r][c].mine = true; placed++; }
  }
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      if (g[r][c].mine) continue;
      let n = 0;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && g[nr][nc].mine) n++;
        }
      g[r][c].adj = n;
    }
  return g;
}

function revealBFS(grid: Grid, sr: number, sc: number): Grid {
  const g = grid.map(row => row.map(c => ({ ...c })));
  const q = [[sr, sc]];
  while (q.length) {
    const [r, c] = q.shift()!;
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS || g[r][c].revealed || g[r][c].flagged) continue;
    g[r][c].revealed = true;
    if (g[r][c].adj === 0 && !g[r][c].mine)
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++)
          if (dr !== 0 || dc !== 0) q.push([r + dr, c + dc]);
  }
  return g;
}

const checkWin = (g: Grid) => g.every(row => row.every(c => c.mine || c.revealed));

export default function Minesweeper({ onClose }: { onClose: () => void }) {
  const [grid, setGrid] = useState<Grid>(emptyGrid);
  const [status, setStatus] = useState<Status>("idle");
  const [flags, setFlags] = useState(0);
  const [time, setTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const firstRef = useRef(false);

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    setGrid(emptyGrid());
    setStatus("idle");
    setFlags(0);
    setTime(0);
    firstRef.current = false;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "r" || e.key === "R") reset();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, reset]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const handleClick = (r: number, c: number) => {
    if (status === "won" || status === "lost" || grid[r][c].flagged || grid[r][c].revealed) return;
    let g = grid;
    if (!firstRef.current) {
      firstRef.current = true;
      g = placeMines(grid, r, c);
      setStatus("playing");
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    }
    if (g[r][c].mine) {
      const lost = g.map(row => row.map(cell => cell.mine ? { ...cell, revealed: true } : cell));
      setGrid(lost);
      setStatus("lost");
      clearInterval(timerRef.current);
      return;
    }
    const revealed = revealBFS(g, r, c);
    setGrid(revealed);
    if (checkWin(revealed)) { setStatus("won"); clearInterval(timerRef.current); }
  };

  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (status === "won" || status === "lost" || grid[r][c].revealed) return;
    const g = grid.map(row => row.map(c => ({ ...c })));
    g[r][c].flagged = !g[r][c].flagged;
    setGrid(g);
    setFlags(f => f + (g[r][c].flagged ? 1 : -1));
  };

  const cellLabel = (cell: Cell) => {
    if (!cell.revealed) return cell.flagged ? "⚑" : "";
    if (cell.mine) return "💥";
    return cell.adj > 0 ? String(cell.adj) : "";
  };

  const cellCls = (cell: Cell) => {
    const base = "w-8 h-8 flex items-center justify-center text-sm font-bold border select-none cursor-pointer transition-colors";
    if (!cell.revealed) return `${base} ${cell.flagged ? "bg-highlighter-yellow/30" : "bg-secondary/40 hover:bg-secondary/60"} border-pencil/30`;
    if (cell.mine) return `${base} bg-red-200/60 border-pencil/20`;
    return `${base} bg-paper/60 border-pencil/20`;
  };

  return (
    <div className="game-overlay fixed inset-0 z-[9500] bg-paper flex flex-col items-center justify-center">
      <div className="flex items-center gap-6 mb-6 px-5 py-3 bg-secondary/30 rounded-lg border border-pencil/20">
        <span className="font-hand text-lg">⚑ {MINES - flags}</span>
        <button onClick={reset} className="font-hand text-2xl hover:scale-110 transition-transform" title="restart">
          {status === "won" ? "😎" : status === "lost" ? "😵" : "🙂"}
        </button>
        <span className="font-hand text-lg">⏱ {time}s</span>
      </div>

      <div className="border border-pencil/30 rounded-lg overflow-hidden shadow-paper">
        {grid.map((row, r) => (
          <div key={r} className="flex">
            {row.map((cell, c) => (
              <div
                key={`${c}-${cell.revealed ? 1 : 0}`}
                className={`${cellCls(cell)}${cell.revealed && !cell.mine ? " cell-pop" : ""}`}
                style={{ color: cell.revealed && !cell.mine && cell.adj > 0 ? ADJ_COLORS[cell.adj] : undefined }}
                onClick={() => handleClick(r, c)}
                onContextMenu={(e) => handleRightClick(e, r, c)}
              >
                {cellLabel(cell)}
              </div>
            ))}
          </div>
        ))}
      </div>

      {(status === "won" || status === "lost") && (
        <div className="mt-6 text-center">
          <p className="font-marker text-3xl mb-2">{status === "won" ? "you win!" : "boom."}</p>
          <p className="font-hand text-pencil/60">r to restart · esc to exit</p>
        </div>
      )}
      <button onClick={onClose} className="absolute top-4 right-6 font-hand text-2xl text-ink/40 hover:text-ink">×</button>
    </div>
  );
}
