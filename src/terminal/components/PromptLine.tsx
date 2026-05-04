import { useRef, useEffect } from "react";

interface Props {
  cwd: string;
  input: string;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function PromptLine({ cwd, input, onChange, onKeyDown }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const home = cwd === "/" ? "~" : cwd;

  return (
    <div
      style={{
        flexShrink: 0,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 16px",
          gap: 0,
        }}
      >
        <span style={{ color: "#6aab6a", userSelect: "none", fontSize: 13 }}>visitor</span>
        <span style={{ color: "#4a4a55", userSelect: "none", fontSize: 13 }}>@</span>
        <span style={{ color: "#6aab6a", userSelect: "none", fontSize: 13 }}>portfolio</span>
        <span style={{ color: "#4a4a55", userSelect: "none", fontSize: 13 }}>:</span>
        <span style={{ color: "#8b8fa8", userSelect: "none", fontSize: 13 }}>{home}</span>
        <span style={{ color: "#c8c8cc", userSelect: "none", fontSize: 13, marginLeft: 4, marginRight: 8 }}>$</span>
        <input
          ref={ref}
          value={input}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="terminal input"
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#c8c8cc",
            fontFamily: 'ui-monospace,"Cascadia Code","JetBrains Mono","Fira Code",monospace',
            fontSize: 13,
            lineHeight: 1.6,
            caretColor: "#c8c8cc",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: 20,
          padding: "4px 16px 8px",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        {[
          ["tab", "complete"],
          ["↑↓", "history"],
          ["ctrl+l", "clear"],
          ["exit", "quit"],
        ].map(([key, label]) => (
          <span key={key} style={{ fontSize: 10, color: "#4a4a55", userSelect: "none", letterSpacing: "0.02em" }}>
            <span style={{ color: "#5a5a65" }}>{key}</span>
            {" · "}
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
