import { useState, useEffect, useCallback, useMemo } from "react";

const WORDS = [
  "about","above","abuse","actor","acute","admit","adopt","adult","after","again",
  "agent","agree","ahead","alarm","album","alert","alike","align","alive","alley",
  "allow","alone","along","alter","angel","anger","angle","angry","anime","annex",
  "apple","apply","arena","arise","armed","array","arrow","asset","atlas","audio",
  "audit","avoid","awake","award","aware","awful","basic","basis","batch","beach",
  "begin","being","below","bench","berry","birth","black","blade","blame","bland",
  "blast","blaze","bleed","blend","bless","blind","block","blood","bloom","blown",
  "blues","blunt","board","bonus","boost","bound","brain","brand","brave","bread",
  "break","breed","brick","bride","brief","bring","broad","broke","brook","brown",
  "build","built","buyer","cabin","cache","camel","candy","carry","catch","cause",
  "chain","chair","chaos","charm","chart","chase","cheap","check","cheek","chess",
  "chest","chief","child","chill","civic","civil","claim","class","clean","clear",
  "clerk","click","cliff","climb","cling","clock","clone","close","cloud","coach",
  "coast","cobra","cold","color","comes","comic","coral","could","count","court",
  "cover","craft","crane","crash","crazy","cream","creek","crime","crisp","cross",
  "cruel","crush","curve","cycle","daily","dance","debug","depth","derby","dirty",
  "disco","dolor","doubt","dover","draft","drain","drake","drama","drawn","dream",
  "dress","drink","drive","drone","drove","drums","drunk","ducal","dusky",
];

type LetterState = "correct" | "present" | "absent" | "empty";
type Row = { letter: string; state: LetterState }[];

function newBoard(): Row[] {
  return Array.from({ length: 6 }, () =>
    Array.from({ length: 5 }, () => ({ letter: "", state: "empty" as LetterState }))
  );
}

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

const KEY_ROWS = [
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l"],
  ["Enter","z","x","c","v","b","n","m","⌫"],
];

const STATE_CLS: Record<LetterState, string> = {
  correct: "bg-highlighter-yellow/80 border-ink text-ink",
  present: "bg-highlighter-pink/60 border-ink text-ink",
  absent:  "bg-secondary/60 border-pencil/30 text-pencil",
  empty:   "bg-paper border-pencil/30 text-ink",
};

// keyboard uses solid opaque colors (CSS-variable rgba doesn't support /opacity modifier)
const KEY_CLS: Record<LetterState, string> = {
  correct: "bg-ink text-paper border-ink",
  present: "bg-pencil/60 text-paper border-pencil",
  absent:  "bg-paper text-ink/25 border-ink/10",
  empty:   "bg-secondary/50 border-pencil/30 text-ink",
};

export default function Wordle({ onClose }: { onClose: () => void }) {
  const [word, setWord] = useState(randomWord);
  const [board, setBoard] = useState<Row[]>(newBoard);
  const [currentRow, setCurrentRow] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [keyStates, setKeyStates] = useState<Record<string, LetterState>>({});
  const [shake, setShake] = useState(false);
  const [flippedRow, setFlippedRow] = useState<number | null>(null);

  const reset = useCallback(() => {
    setWord(randomWord());
    setBoard(newBoard());
    setCurrentRow(0);
    setCurrentInput("");
    setStatus("playing");
    setKeyStates({});
    setFlippedRow(null);
  }, []);

  const submitGuess = useCallback(() => {
    if (currentInput.length !== 5) { setShake(true); setTimeout(() => setShake(false), 500); return; }
    const guess = currentInput.toLowerCase();
    const target = word.toLowerCase();

    // compute letter states
    const result: LetterState[] = Array(5).fill("absent");
    const targetLeft = [...target];
    // first pass: correct
    for (let i = 0; i < 5; i++) {
      if (guess[i] === targetLeft[i]) { result[i] = "correct"; targetLeft[i] = "·"; }
    }
    // second pass: present
    for (let i = 0; i < 5; i++) {
      if (result[i] === "correct") continue;
      const j = targetLeft.indexOf(guess[i]);
      if (j !== -1) { result[i] = "present"; targetLeft[j] = "·"; }
    }

    const newBoard = board.map((r, ri) =>
      ri === currentRow
        ? r.map((_, ci) => ({ letter: guess[ci], state: result[ci] }))
        : r
    );
    setBoard(newBoard);

    // update key states (best state wins)
    const priority: Record<LetterState, number> = { correct: 3, present: 2, absent: 1, empty: 0 };
    const newKeys = { ...keyStates };
    for (let i = 0; i < 5; i++) {
      const l = guess[i];
      if (!newKeys[l] || priority[result[i]] > priority[newKeys[l]]) newKeys[l] = result[i];
    }
    setKeyStates(newKeys);
    setCurrentInput("");
    setFlippedRow(currentRow);
    setTimeout(() => setFlippedRow(null), 450);

    if (guess === target) {
      setStatus("won");
    } else if (currentRow === 5) {
      setStatus("lost");
    } else {
      setCurrentRow(r => r + 1);
    }
  }, [currentInput, word, board, currentRow, keyStates]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (status !== "playing") {
        if (e.key === "r" || e.key === "R") reset();
        return;
      }
      if (e.metaKey || e.ctrlKey) return;
      if (e.key === "Enter") { submitGuess(); return; }
      if (e.key === "Backspace") { setCurrentInput(s => s.slice(0, -1)); return; }
      if (/^[a-zA-Z]$/.test(e.key) && currentInput.length < 5)
        setCurrentInput(s => s + e.key.toLowerCase());
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, reset, submitGuess, status, currentInput]);

  const handleKey = (k: string) => {
    if (status !== "playing") return;
    if (k === "Enter") { submitGuess(); return; }
    if (k === "⌫") { setCurrentInput(s => s.slice(0, -1)); return; }
    if (currentInput.length < 5) setCurrentInput(s => s + k);
  };

  const displayBoard = useMemo(() => board.map((row, ri) => {
    if (ri === currentRow && status === "playing")
      return row.map((_, ci) => ({ letter: currentInput[ci] ?? "", state: "empty" as LetterState }));
    return row;
  }), [board, currentRow, currentInput, status]);

  return (
    <div className="game-overlay fixed inset-0 z-[9500] bg-paper flex flex-col items-center justify-center gap-6 p-4">
      <h2 className="font-marker text-4xl text-ink">wordle</h2>

      {/* board */}
      <div className="flex flex-col gap-1.5">
        {displayBoard.map((row, ri) => (
          <div key={ri} className={`flex gap-1.5 ${ri === currentRow && shake ? "animate-shake" : ""}`}>
            {row.map((cell, ci) => (
              <div
                key={ci}
                className={`w-14 h-14 border-2 flex items-center justify-center font-marker text-2xl uppercase transition-colors ${STATE_CLS[cell.state]}${flippedRow === ri ? ` tile-flip-${ci}` : ""}`}
              >
                {cell.letter}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* result */}
      {status !== "playing" && (
        <div className="text-center">
          <p className="font-marker text-2xl mb-1">
            {status === "won" ? "nice!" : `the word was "${word}"`}
          </p>
          <p className="font-hand text-sm text-pencil/60">r to restart · esc to exit</p>
        </div>
      )}

      {/* keyboard */}
      <div className="flex flex-col items-center gap-1">
        {KEY_ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1">
            {row.map(k => {
              const st = keyStates[k] ?? "empty";
              const wide = k === "Enter" || k === "⌫";
              return (
                <button
                  key={k}
                  onClick={() => handleKey(k)}
                  className={`${wide ? "px-3 text-xs" : "w-9"} h-10 border rounded font-hand text-sm transition-colors ${k.length === 1 ? KEY_CLS[st] : "bg-secondary/50 border-pencil/30 text-ink"}`}
                >
                  {k}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <button onClick={onClose} className="absolute top-4 right-6 font-hand text-2xl text-ink/40 hover:text-ink">×</button>
    </div>
  );
}
