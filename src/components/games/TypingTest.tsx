import { useState, useEffect, useRef, useCallback } from "react";

const PASSAGES = [
  "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. Always code as if the person maintaining your code is a violent psychopath.",
  "The best way to predict the future is to invent it. The only way to do great work is to love what you do. If you haven't found it yet, keep looking.",
  "In the beginning was the code, and the code was with the developer, and the developer said let there be tabs, and there were spaces, and the developer wept.",
  "Programs must be written for people to read, and only incidentally for machines to execute. Simplicity is the soul of efficiency. Make it work, make it right, make it fast.",
];

export default function TypingTest({ onClose }: { onClose: () => void }) {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * PASSAGES.length));
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "done">("idle");
  const [startMs, setStartMs] = useState(0);
  const [endMs, setEndMs] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const passage = PASSAGES[idx];

  const reset = useCallback((newIdx?: number) => {
    setIdx(newIdx ?? idx);
    setTyped("");
    setStatus("idle");
    setStartMs(0);
    setEndMs(0);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [idx]);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (status === "done") {
        if (e.key === "r" || e.key === "R") { reset(); return; }
        if (e.key === "n" || e.key === "N") { reset((idx + 1) % PASSAGES.length); return; }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, status, reset, idx]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === "done") return;
    const val = e.target.value;
    if (status === "idle" && val.length > 0) {
      setStatus("running");
      setStartMs(Date.now());
    }
    setTyped(val);
    if (val === passage) {
      setStatus("done");
      setEndMs(Date.now());
    }
  };

  const elapsedSec = status === "done" ? (endMs - startMs) / 1000
    : status === "running" ? (Date.now() - startMs) / 1000 : 0;

  const correctChars = [...typed].filter((ch, i) => ch === passage[i]).length;
  const wpm = elapsedSec > 0 ? Math.round((correctChars / 5) / (elapsedSec / 60)) : 0;
  const accuracy = typed.length > 0 ? Math.round((correctChars / typed.length) * 100) : 100;

  return (
    <div className="game-overlay fixed inset-0 z-[9500] bg-paper flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        <div className="font-hand text-xl leading-relaxed mb-6 p-6 bg-secondary/20 rounded-lg border border-pencil/20 select-none">
          {[...passage].map((ch, i) => {
            let cls = "text-ink/30";
            if (i < typed.length) cls = typed[i] === ch ? "text-ink" : "text-highlighter-pink";
            return <span key={i} className={cls}>{ch}</span>;
          })}
        </div>

        <input
          ref={inputRef}
          value={typed}
          onChange={handleChange}
          disabled={status === "done"}
          className="w-full p-4 bg-paper border-2 border-pencil/40 rounded-lg font-hand text-lg focus:outline-none focus:border-ink/60 disabled:opacity-60"
          placeholder="start typing..."
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
        />

        {status === "done" && (
          <div className="mt-8 text-center">
            <div className="flex justify-center gap-12 mb-4">
              <div><p className="font-marker text-4xl text-ink">{wpm}</p><p className="font-hand text-sm text-pencil/60">wpm</p></div>
              <div><p className="font-marker text-4xl text-ink">{accuracy}%</p><p className="font-hand text-sm text-pencil/60">accuracy</p></div>
              <div><p className="font-marker text-4xl text-ink">{elapsedSec.toFixed(1)}s</p><p className="font-hand text-sm text-pencil/60">time</p></div>
            </div>
            <p className="font-hand text-pencil/50 text-sm">r to retry · n for next passage · esc to exit</p>
          </div>
        )}
      </div>
      <button onClick={onClose} className="absolute top-4 right-6 font-hand text-2xl text-ink/40 hover:text-ink">×</button>
    </div>
  );
}
