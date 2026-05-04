import PrettyCard from "./PrettyCard";
import type { OutputNode } from "../types";

const COLOR_MAP: Record<string, string> = {
  fg:     "#c8c8cc",
  dim:    "#4a4a55",
  muted:  "#7a7a88",
  accent: "#8b8fa8",
  green:  "#6aab6a",
  amber:  "#a89060",
  red:    "#a06060",
};

function PromptEcho({ cwd, input }: { cwd: string; input: string }) {
  const home = cwd === "/" ? "~" : cwd;
  return (
    <div style={{ lineHeight: 1.6, display: "flex", alignItems: "baseline", gap: 0, opacity: 0.85 }}>
      <span style={{ color: "#6aab6a" }}>visitor</span>
      <span style={{ color: "#4a4a55" }}>@</span>
      <span style={{ color: "#6aab6a" }}>portfolio</span>
      <span style={{ color: "#4a4a55" }}>:</span>
      <span style={{ color: "#8b8fa8" }}>{home}</span>
      <span style={{ color: "#c8c8cc", marginLeft: 4 }}>$</span>
      {input && <span style={{ color: "#c8c8cc", marginLeft: 8 }}>{input}</span>}
    </div>
  );
}

export default function OutputLine({ node }: { node: OutputNode }) {
  if (node.type === "command") return <PromptEcho cwd={node.cwd} input={node.input} />;

  if (node.type === "pretty-card") return <PrettyCard node={node} />;

  if (node.type === "error") {
    return (
      <div style={{ color: "#a06060", lineHeight: 1.6 }}>{node.content}</div>
    );
  }

  if (node.type === "table") {
    const colWidths = node.headers.map((h, i) =>
      Math.max(h.length, ...node.rows.map((r) => (r[i] ?? "").length)) + 2
    );
    return (
      <div style={{ color: "#c8c8cc", lineHeight: 1.6 }}>
        <div style={{ color: "#4a4a55" }}>
          {node.headers.map((h, i) => h.padEnd(colWidths[i])).join("")}
        </div>
        {node.rows.map((row, ri) => (
          <div key={ri}>
            {row.map((cell, ci) => (
              <span
                key={ci}
                style={{ color: ci === 0 ? "#7a7a88" : "#c8c8cc" }}
              >
                {cell.padEnd(colWidths[ci])}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  }

  const color = COLOR_MAP[(node as { color?: string }).color ?? "fg"] ?? COLOR_MAP.fg;
  return (
    <div style={{ color, lineHeight: 1.6, whiteSpace: "pre" }}>
      {node.content || " "}
    </div>
  );
}
