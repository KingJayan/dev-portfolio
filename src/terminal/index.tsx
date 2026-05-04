import { useEffect, useRef } from "react";
import { useTerminal } from "./useTerminal";
import OutputLine from "./components/OutputLine";
import PromptLine from "./components/PromptLine";
import Scanlines from "./components/Scanlines";

const MONO = 'ui-monospace,"Cascadia Code","JetBrains Mono","Fira Code",monospace';

function TitleBar() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 38,
        padding: "0 14px",
        background: "rgba(255,255,255,0.03)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 11,
          color: "#4a4a55",
          fontFamily: MONO,
          letterSpacing: "0.05em",
        }}
      >
        visitor@portfolio — terminal
      </div>
    </div>
  );
}

export default function TerminalPage() {
  const { cwd, output, input, setInput, handleKey } = useTerminal();
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        background: "#0c0c0e",
        fontFamily: MONO,
        fontSize: 13,
      }}
      onClick={() => {
        const sel = window.getSelection();
        if (sel && sel.toString().length > 0) return;
        containerRef.current?.querySelector("input")?.focus();
      }}
    >
      <Scanlines />
      <TitleBar />

      <div
        ref={containerRef}
        role="log"
        aria-live="polite"
        aria-label="terminal output"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 20px 8px",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.08) transparent",
        }}
      >
        {output.map((node, i) => (
          <OutputLine key={i} node={node} />
        ))}
        <div ref={bottomRef} />
      </div>

      <PromptLine
        cwd={cwd}
        input={input}
        onChange={setInput}
        onKeyDown={handleKey}
      />
    </div>
  );
}
