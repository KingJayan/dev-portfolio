import { useState, useEffect, useCallback } from "react";

type Board = number[][];

const SIZE = 4;

function empty(): Board {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function addTile(b: Board): Board {
  const empties: [number, number][] = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (b[r][c] === 0) empties.push([r, c]);
  if (!empties.length) return b;
  const [r, c] = empties[Math.floor(Math.random() * empties.length)];
  const next = b.map(row => [...row]);
  next[r][c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function slideRow(row: number[]): { row: number[]; score: number } {
  const nonzero = row.filter(n => n !== 0);
  let score = 0;
  const merged: number[] = [];
  let i = 0;
  while (i < nonzero.length) {
    if (i + 1 < nonzero.length && nonzero[i] === nonzero[i + 1]) {
      merged.push(nonzero[i] * 2);
      score += nonzero[i] * 2;
      i += 2;
    } else {
      merged.push(nonzero[i]);
      i++;
    }
  }
  while (merged.length < SIZE) merged.push(0);
  return { row: merged, score };
}

type Direction = "left" | "right" | "up" | "down";

function move(board: Board, dir: Direction): { board: Board; score: number; moved: boolean } {
  let b = board.map(row => [...row]);
  let totalScore = 0;
  let moved = false;

  const slide = (row: number[]) => slideRow(row);

  if (dir === "left") {
    for (let r = 0; r < SIZE; r++) {
      const { row, score } = slide(b[r]);
      if (row.join() !== b[r].join()) moved = true;
      b[r] = row; totalScore += score;
    }
  } else if (dir === "right") {
    for (let r = 0; r < SIZE; r++) {
      const { row, score } = slide([...b[r]].reverse());
      const rr = row.slice().reverse();
      if (rr.join() !== b[r].join()) moved = true;
      b[r] = rr; totalScore += score;
    }
  } else if (dir === "up") {
    for (let c = 0; c < SIZE; c++) {
      const col = b.map(row => row[c]);
      const { row, score } = slide(col);
      if (row.join() !== col.join()) moved = true;
      for (let r = 0; r < SIZE; r++) b[r][c] = row[r];
      totalScore += score;
    }
  } else {
    for (let c = 0; c < SIZE; c++) {
      const col = b.map(row => row[c]);
      const { row, score } = slide([...col].reverse());
      const rev = row.slice().reverse();
      if (rev.join() !== col.join()) moved = true;
      for (let r = 0; r < SIZE; r++) b[r][c] = rev[r];
      totalScore += score;
    }
  }

  return { board: b, score: totalScore, moved };
}

function hasValidMove(b: Board): boolean {
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      if (b[r][c] === 0) return true;
      if (c + 1 < SIZE && b[r][c] === b[r][c + 1]) return true;
      if (r + 1 < SIZE && b[r][c] === b[r + 1][c]) return true;
    }
  return false;
}

const TILE_CLS: Record<number, string> = {
  0:    "bg-paper/30 border-pencil/10",
  2:    "bg-paper border-pencil/30 text-ink",
  4:    "bg-secondary/60 border-pencil/30 text-ink",
  8:    "bg-highlighter-yellow/70 border-ink/30 text-ink",
  16:   "bg-highlighter-yellow border-ink/40 text-ink",
  32:   "bg-highlighter-pink/60 border-ink/30 text-ink",
  64:   "bg-highlighter-pink border-ink/40 text-ink",
  128:  "bg-ink/80 border-ink text-paper",
  256:  "bg-ink/90 border-ink text-paper",
  512:  "bg-ink border-ink text-paper",
  1024: "bg-ink border-ink text-paper",
  2048: "bg-ink border-highlighter-yellow text-highlighter-yellow",
};

function tileClass(n: number): string {
  const cls = TILE_CLS[n] ?? "bg-ink text-paper border-ink";
  return `border-2 rounded-lg flex items-center justify-center font-marker select-none transition-all duration-150 ${cls}`;
}

function initBoard(): Board {
  return addTile(addTile(empty()));
}

export default function Game2048({ onClose }: { onClose: () => void }) {
  const [board, setBoard] = useState<Board>(initBoard);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [won, setWon] = useState(false);
  const [over, setOver] = useState(false);
  const [continued, setContinued] = useState(false);

  const reset = useCallback(() => {
    setBoard(initBoard());
    setScore(0);
    setWon(false);
    setOver(false);
    setContinued(false);
  }, []);

  const handleDir = useCallback((dir: Direction) => {
    if (over) return;
    setBoard(prev => {
      const { board: next, score: delta, moved } = move(prev, dir);
      if (!moved) return prev;
      const withTile = addTile(next);
      setScore(s => {
        const ns = s + delta;
        setBest(b => Math.max(b, ns));
        return ns;
      });
      if (!won && withTile.some(row => row.some(n => n === 2048))) setWon(true);
      if (!hasValidMove(withTile)) setOver(true);
      return withTile;
    });
  }, [over, won]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "r" || e.key === "R") { reset(); return; }
      const map: Record<string, Direction> = {
        ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down",
        a: "left", d: "right", w: "up", s: "down",
        A: "left", D: "right", W: "up", S: "down",
      };
      if (map[e.key]) { e.preventDefault(); handleDir(map[e.key]); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, reset, handleDir]);

  const fontSize = (n: number) => n >= 1024 ? "text-lg" : n >= 128 ? "text-xl" : "text-2xl";

  return (
    <div className="game-overlay fixed inset-0 z-[9500] bg-paper flex flex-col items-center justify-center gap-6">
      {/* header */}
      <div className="flex items-center gap-8">
        <h2 className="font-marker text-5xl text-ink">2048</h2>
        <div className="flex gap-4">
          <div className="text-center">
            <p className="font-hand text-xs text-pencil/50 uppercase tracking-wide">score</p>
            <p className="font-marker text-2xl text-ink">{score}</p>
          </div>
          <div className="text-center">
            <p className="font-hand text-xs text-pencil/50 uppercase tracking-wide">best</p>
            <p className="font-marker text-2xl text-ink">{best}</p>
          </div>
        </div>
        <button onClick={reset} className="font-hand text-sm text-pencil/60 border border-pencil/30 px-3 py-1 rounded hover:bg-secondary/40 transition-colors">
          new game
        </button>
      </div>

      {/* board */}
      <div className="bg-secondary/30 border border-pencil/20 rounded-xl p-3 grid grid-cols-4 gap-2">
        {board.flat().map((n, i) => (
          <div key={i} className={`w-20 h-20 ${tileClass(n)} ${fontSize(n)}`}>
            {n !== 0 ? n : ""}
          </div>
        ))}
      </div>

      {/* overlays */}
      {won && !continued && (
        <div className="text-center">
          <p className="font-marker text-3xl text-highlighter-yellow mb-1">you reached 2048!</p>
          <div className="flex gap-4 justify-center font-hand text-sm text-pencil/60">
            <button onClick={() => setContinued(true)} className="underline decoration-dashed hover:text-ink">keep going</button>
            <span>·</span>
            <button onClick={reset} className="underline decoration-dashed hover:text-ink">new game</button>
          </div>
        </div>
      )}
      {over && (
        <div className="text-center">
          <p className="font-marker text-3xl mb-1">game over</p>
          <p className="font-hand text-sm text-pencil/60">r to restart · esc to exit</p>
        </div>
      )}
      {!over && (continued || !won) && (
        <p className="font-hand text-xs text-pencil/40">arrow keys to move · r to restart</p>
      )}

      <button onClick={onClose} className="absolute top-4 right-6 font-hand text-2xl text-ink/40 hover:text-ink">×</button>
    </div>
  );
}
