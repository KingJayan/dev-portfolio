import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "@/hooks/use-theme";

const W = 800, H = 500;
const PAD_W = 10, PAD_H = 80;
const BALL_SIZE = 12;
const BOT_SPEED = 3.5;
const WIN_SCORE = 5;
const TRAIL_LEN = 10;
const MIN_VY = 1.5;    // prevents boring horizontal shots
const MAX_ANGLE = 1.1; // ≈63° max reflection angle
const SPIN_FACTOR = 0.35; // paddle velocity transferred to ball

type State = {
  playerY: number;
  botY: number;
  prevPlayerY: number;
  prevBotY: number;
  ballX: number;
  ballY: number;
  ballVX: number;
  ballVY: number;
  playerScore: number;
  botScore: number;
  over: boolean;
  winner: "player" | "bot" | null;
};

function serve(towardPlayer: boolean): Pick<State, "ballX" | "ballY" | "ballVX" | "ballVY"> {
  const vy = (Math.random() * 2 + MIN_VY) * (Math.random() > 0.5 ? 1 : -1);
  return {
    ballX: W / 2 - BALL_SIZE / 2,
    ballY: H / 2 - BALL_SIZE / 2,
    ballVX: (towardPlayer ? -1 : 1) * 5,
    ballVY: vy,
  };
}

function initState(): State {
  const mid = H / 2 - PAD_H / 2;
  return {
    playerY: mid, botY: mid,
    prevPlayerY: mid, prevBotY: mid,
    ...serve(Math.random() > 0.5),
    playerScore: 0, botScore: 0,
    over: false, winner: null,
  };
}

// reflect off paddle: maps hit position to angle, applies spin, clamps speed
function reflectBall(
  ballY: number,
  padY: number,
  currentVX: number,
  currentVY: number,
  padDeltaY: number,
  toRight: boolean,
): [number, number] {
  const relY = (ballY + BALL_SIZE / 2 - padY) / PAD_H;
  const angle = (relY - 0.5) * 2 * MAX_ANGLE;
  const speed = Math.min(Math.hypot(currentVX, currentVY) * 1.03, 15);
  let vx = Math.abs(Math.cos(angle)) * speed * (toRight ? 1 : -1);
  let vy = Math.sin(angle) * speed + padDeltaY * SPIN_FACTOR;
  // enforce min vertical component
  if (Math.abs(vy) < MIN_VY) vy = MIN_VY * (vy >= 0 ? 1 : -1);
  // clamp total speed after spin
  const s = Math.hypot(vx, vy);
  if (s > 15) { vx = (vx / s) * 15; vy = (vy / s) * 15; }
  return [vx, vy];
}

export default function BotPong({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const stateRef  = useRef<State>(initState());
  const keysRef   = useRef<Set<string>>(new Set());
  const mouseYRef = useRef<number | null>(null);
  const trailRef  = useRef<{ x: number; y: number }[]>([]);
  const flashRef  = useRef({ player: 0, bot: 0 });
  const rafId     = useRef(0);

  const reset = useCallback(() => {
    stateRef.current = initState();
    trailRef.current = [];
    flashRef.current = { player: 0, bot: 0 };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "r" || e.key === "R") { reset(); return; }
      keysRef.current.add(e.key);
    };
    const onKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    document.addEventListener("keydown", onKey);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [onClose, reset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseYRef.current = (e.clientY - rect.top) * (H / rect.height) - PAD_H / 2;
    };
    const onLeave = () => { mouseYRef.current = null; };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = W;
    canvas.height = H;

    const dark = theme === "dark";
    const col = {
      bg:      dark ? "#15181d" : "#f6f3ec",
      pad:     dark ? "#e8edf3" : "#25221f",
      ball:    "#bd8da2",
      trail:   "#bd8da2",
      text:    dark ? "#e8edf3" : "#25221f",
      divider: dark ? "rgba(232,237,243,0.15)" : "rgba(37,34,31,0.12)",
      overlay: dark ? "rgba(21,24,29,0.88)" : "rgba(246,243,236,0.88)",
      font:    "Kalam, cursive",
    };

    const PADDLE_SPEED = 7;

    const loop = () => {
      rafId.current = requestAnimationFrame(loop);
      const s = stateRef.current;

      if (!s.over) {
        // save previous positions for spin calculation
        s.prevPlayerY = s.playerY;
        s.prevBotY    = s.botY;

        // player input (mouse takes priority)
        if (mouseYRef.current !== null) {
          s.playerY = Math.max(0, Math.min(H - PAD_H, mouseYRef.current));
        } else {
          const keys = keysRef.current;
          if (keys.has("w") || keys.has("W") || keys.has("ArrowUp"))
            s.playerY = Math.max(0, s.playerY - PADDLE_SPEED);
          if (keys.has("s") || keys.has("S") || keys.has("ArrowDown"))
            s.playerY = Math.min(H - PAD_H, s.playerY + PADDLE_SPEED);
        }

        // bot: tracks ball center with limited speed
        const botCenter  = s.botY + PAD_H / 2;
        const ballCenter = s.ballY + BALL_SIZE / 2;
        if (botCenter < ballCenter - 2)      s.botY = Math.min(H - PAD_H, s.botY + BOT_SPEED);
        else if (botCenter > ballCenter + 2) s.botY = Math.max(0, s.botY - BOT_SPEED);

        // move ball
        s.ballX += s.ballVX;
        s.ballY += s.ballVY;

        // wall bounce
        if (s.ballY <= 0)              { s.ballY = 0;              s.ballVY =  Math.abs(s.ballVY); }
        if (s.ballY + BALL_SIZE >= H)  { s.ballY = H - BALL_SIZE;  s.ballVY = -Math.abs(s.ballVY); }

        // player paddle collision (left wall)
        if (s.ballVX < 0 && s.ballX <= PAD_W + 2 &&
            s.ballY + BALL_SIZE >= s.playerY && s.ballY <= s.playerY + PAD_H) {
          s.ballX = PAD_W + 2;
          const padDY = s.playerY - s.prevPlayerY;
          [s.ballVX, s.ballVY] = reflectBall(s.ballY, s.playerY, s.ballVX, s.ballVY, padDY, true);
        }

        // bot paddle collision (right wall)
        if (s.ballVX > 0 && s.ballX + BALL_SIZE >= W - PAD_W - 2 &&
            s.ballY + BALL_SIZE >= s.botY && s.ballY <= s.botY + PAD_H) {
          s.ballX = W - PAD_W - BALL_SIZE - 2;
          const padDY = s.botY - s.prevBotY;
          [s.ballVX, s.ballVY] = reflectBall(s.ballY, s.botY, s.ballVX, s.ballVY, padDY, false);
        }

        // scoring
        if (s.ballX <= 0) {
          s.botScore++;
          flashRef.current.bot = 12;
          if (s.botScore >= WIN_SCORE) { s.over = true; s.winner = "bot"; }
          else Object.assign(s, serve(true));
          trailRef.current = [];
        }
        if (s.ballX + BALL_SIZE >= W) {
          s.playerScore++;
          flashRef.current.player = 12;
          if (s.playerScore >= WIN_SCORE) { s.over = true; s.winner = "player"; }
          else Object.assign(s, serve(false));
          trailRef.current = [];
        }

        // update trail
        trailRef.current.push({ x: s.ballX + BALL_SIZE / 2, y: s.ballY + BALL_SIZE / 2 });
        if (trailRef.current.length > TRAIL_LEN) trailRef.current.shift();
      }

      // ── draw ──────────────────────────────────────────────────
      ctx.fillStyle = col.bg;
      ctx.fillRect(0, 0, W, H);

      // center divider
      ctx.setLineDash([10, 10]);
      ctx.strokeStyle = col.divider;
      ctx.lineWidth   = 2;
      ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();
      ctx.setLineDash([]);

      // paddles
      ctx.fillStyle = col.pad;
      ctx.fillRect(4,             s.playerY, PAD_W, PAD_H);
      ctx.fillRect(W - PAD_W - 4, s.botY,    PAD_W, PAD_H);

      // ball trail
      for (let i = 0; i < trailRef.current.length; i++) {
        const t = trailRef.current[i];
        const progress = (i + 1) / (trailRef.current.length + 1);
        ctx.globalAlpha = progress * 0.45;
        const size = BALL_SIZE * (0.4 + progress * 0.6);
        ctx.fillStyle = col.trail;
        ctx.fillRect(t.x - size / 2, t.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;

      // ball
      ctx.fillStyle = col.ball;
      ctx.fillRect(s.ballX, s.ballY, BALL_SIZE, BALL_SIZE);

      // scores with flash on point
      const pFl = flashRef.current.player;
      const bFl = flashRef.current.bot;
      ctx.fillStyle = col.text;
      ctx.textAlign = "center";
      ctx.font = `bold ${pFl > 0 ? 46 : 36}px ${col.font}`;
      ctx.fillText(String(s.playerScore), W / 4, 48);
      if (pFl > 0) flashRef.current.player--;
      ctx.font = `bold ${bFl > 0 ? 46 : 36}px ${col.font}`;
      ctx.fillText(String(s.botScore), (3 * W) / 4, 48);
      if (bFl > 0) flashRef.current.bot--;
      ctx.font        = `12px ${col.font}`;
      ctx.globalAlpha = 0.4;
      ctx.fillText("you", W / 4,       68);
      ctx.fillText("bot", (3 * W) / 4, 68);
      ctx.globalAlpha = 1;

      // game over overlay
      if (s.over) {
        ctx.fillStyle = col.overlay;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle  = col.text;
        ctx.textAlign  = "center";
        ctx.font       = `bold 36px ${col.font}`;
        ctx.fillText(s.winner === "player" ? "you win!" : "bot wins.", W / 2, H / 2 - 24);
        ctx.font = `18px ${col.font}`;
        ctx.fillText("r to restart · esc to exit", W / 2, H / 2 + 20);
      }
    };

    rafId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId.current);
  }, [theme]);

  return (
    <div className="game-overlay fixed inset-0 z-[9500] bg-paper flex flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        className="rounded-xl border border-pencil/20 shadow-paper"
        style={{ maxWidth: "min(800px, 100vw - 32px)", maxHeight: "min(500px, 100vh - 80px)", aspectRatio: "8/5", width: "100%", height: "auto" }}
      />
      <p className="mt-3 text-xs select-none pointer-events-none font-hand text-pencil/40">
        mouse or w/s to move · first to {WIN_SCORE} wins
      </p>
      <button
        onClick={onClose}
        className="absolute top-4 right-6 text-2xl leading-none font-hand text-ink/40 hover:text-ink"
      >×</button>
    </div>
  );
}
