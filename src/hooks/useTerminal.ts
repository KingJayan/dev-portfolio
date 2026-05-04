import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

const TARGET = "terminal";

export function useTerminal() {
  const [, setLocation] = useLocation();
  const buffer = useRef("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const el = e.target as HTMLElement;
      if (el?.isContentEditable) return;

      if (e.key.length !== 1) {
        buffer.current = "";
        return;
      }

      buffer.current = (buffer.current + e.key).slice(-TARGET.length);
      if (buffer.current === TARGET) {
        buffer.current = "";
        setLocation("/terminal");
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setLocation]);
}
