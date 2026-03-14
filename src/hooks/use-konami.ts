import { useEffect, useRef } from "react";

const SEQ = [
  "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
  "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight",
  "b","a",
];

export function useKonami(onSuccess: () => void) {
  const cbRef = useRef(onSuccess);
  cbRef.current = onSuccess;

  useEffect(() => {
    let idx = 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === SEQ[idx]) {
        idx++;
        if (idx === SEQ.length) { cbRef.current(); idx = 0; }
      } else {
        idx = e.key === SEQ[0] ? 1 : 0;
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
}
