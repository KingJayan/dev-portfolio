import { useState, lazy, Suspense } from "react";
import { useLocation } from "wouter";
import { Surface } from "@/components/ui/surface";

const Snake      = lazy(() => import("@/components/games/Snake"));
const Minesweeper = lazy(() => import("@/components/games/Minesweeper"));
const TypingTest = lazy(() => import("@/components/games/TypingTest"));
const FlappyBird = lazy(() => import("@/components/games/FlappyBird"));
const Game2048   = lazy(() => import("@/components/games/Game2048"));
const BotPong    = lazy(() => import("@/components/games/BotPong"));

const GAMES = [
  {
    id: "snake",
    name: "snake",
    desc: "classic snake. eat the food, don't bite yourself.",
    controls: "arrows / wasd · r restart · esc exit",
  },
  {
    id: "minesweeper",
    name: "minesweeper",
    desc: "9×9 grid, 10 mines. first click is always safe.",
    controls: "left click reveal · right click flag · r restart",
  },
  {
    id: "typing",
    name: "typing test",
    desc: "see how fast you can type. wpm + accuracy tracked.",
    controls: "just type · r retry · n next passage · esc exit",
  },
  {
    id: "flappy",
    name: "flappy bird",
    desc: "tap to flap through gaps. how long can you last?",
    controls: "space / click to flap · esc exit",
  },
  {
    id: "2048",
    name: "2048",
    desc: "slide tiles and merge to reach the 2048 tile.",
    controls: "arrow keys to slide · r restart · esc exit",
  },
  {
    id: "pong",
    name: "bot pong",
    desc: "pong vs a bot. first to 5 wins.",
    controls: "mouse or w/s to move · esc exit",
  },
] as const;

type GameId = typeof GAMES[number]["id"];

const GAME_COMPONENTS: Record<GameId, React.ComponentType<{ onClose: () => void }>> = {
  snake:       Snake as React.ComponentType<{ onClose: () => void }>,
  minesweeper: Minesweeper as React.ComponentType<{ onClose: () => void }>,
  typing:      TypingTest as React.ComponentType<{ onClose: () => void }>,
  flappy:      FlappyBird as React.ComponentType<{ onClose: () => void }>,
  "2048":      Game2048 as React.ComponentType<{ onClose: () => void }>,
  pong:        BotPong as React.ComponentType<{ onClose: () => void }>,
};

const Spinner = () => (
  <div className="fixed inset-0 z-[9500] bg-paper flex items-center justify-center">
    <p className="font-hand text-2xl text-pencil/60 animate-pulse">loading...</p>
  </div>
);

export default function Arcade() {
  const [, setLocation] = useLocation();
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  const ActiveComp = activeGame ? GAME_COMPONENTS[activeGame] : null;

  return (
    <>
      {/* launcher */}
      <div className="min-h-screen bg-paper px-4 pt-24 pb-16 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-3 duration-300">
        <div className="mb-12">
          <button
            onClick={() => setLocation("/")}
            className="font-hand text-pencil/60 hover:text-ink transition-colors mb-6 block"
          >
            ← back to portfolio
          </button>
          <h1 className="font-marker text-6xl text-ink">arcade</h1>
          <p className="font-hand text-lg text-pencil/60 mt-2">pick a game</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {GAMES.map((game, i) => (
            <Surface
              key={game.id}
              variant="elevated"
              className="card-in p-6 cursor-pointer hover:-translate-y-2 hover:shadow-paper transition-all duration-150 select-none"
              style={{ animationDelay: `${i * 45}ms` }}
              onClick={() => setActiveGame(game.id)}
            >
              <h2 className="font-amatic font-bold text-2xl text-ink mb-2">{game.name}</h2>
              <p className="font-hand text-sm text-ink/70 mb-4 leading-snug">{game.desc}</p>
              <p className="font-hand text-xs text-pencil/50">{game.controls}</p>
            </Surface>
          ))}
        </div>
      </div>

      {/* active game overlay */}
      {activeGame && ActiveComp && (
        <Suspense fallback={<Spinner />}>
          <ActiveComp onClose={() => setActiveGame(null)} />
        </Suspense>
      )}
    </>
  );
}
