import { useState, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { runCommand } from "./commands";
import { listDir, resolveAbsPath, getNode } from "./terminalFs";
import { COMMANDS } from "./commands";
import type { OutputNode, TerminalState } from "./types";

const BANNER: OutputNode[] = [
  { type: "text", content: "" },
  { type: "text", content: "     ██╗ █████╗ ██╗   ██╗ █████╗ ███╗   ██╗", color: "accent" },
  { type: "text", content: "     ██║██╔══██╗╚██╗ ██╔╝██╔══██╗████╗  ██║", color: "accent" },
  { type: "text", content: "     ██║███████║ ╚████╔╝ ███████║██╔██╗ ██║", color: "accent" },
  { type: "text", content: "██   ██║██╔══██║  ╚██╔╝  ██╔══██║██║╚██╗██║", color: "accent" },
  { type: "text", content: "╚█████╔╝██║  ██║   ██║   ██║  ██║██║ ╚████║", color: "accent" },
  { type: "text", content: " ╚════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝", color: "accent" },
  { type: "text", content: "" },
  { type: "text", content: "  KingJayan/dev-portfolio ─────────────────", color: "muted" },
  { type: "text", content: "  role      full-stack developer", color: "fg" },
  { type: "text", content: "  stack     react • typescript • node.js", color: "green" },
  { type: "text", content: "  tools     git • vscode • ml", color: "green" },
  { type: "text", content: "  status    open to work", color: "amber" },
  { type: "text", content: "" },
  { type: "text", content: "  type 'help' to see available commands", color: "dim" },
  { type: "text", content: "" },
];

export function useTerminal() {
  const [, setLocation] = useLocation();
  const [cwd, setCwd] = useState("/");
  const [output, setOutput] = useState<OutputNode[]>(BANNER);
  const [input, setInput] = useState("");
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const pendingInput = useRef(input);
  pendingInput.current = input;

  const submit = useCallback(
    (line: string) => {
      const trimmed = line.trim();
      const promptNode: OutputNode = {
        type: "command",
        cwd,
        input: trimmed,
      };

      if (!trimmed) {
        setOutput((prev) => [...prev, { type: "command", cwd, input: "" } as OutputNode]);
        setInput("");
        return;
      }

      const state: TerminalState = {
        cwd,
        output,
        inputHistory,
        historyIndex,
        input: trimmed,
      };

      const result = runCommand(trimmed, state);

      setInputHistory((prev) => [trimmed, ...prev]);
      setHistoryIndex(-1);
      setInput("");

      if (result.special === "clear") {
        setOutput([]);
        return;
      }

      setOutput((prev) => [...prev, promptNode, ...result.output]);

      if (result.newCwd) setCwd(result.newCwd);

      if (result.special === "exit") {
        setTimeout(() => setLocation("/"), 400);
      }
    },
    [cwd, output, inputHistory, historyIndex, setLocation]
  );

  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        submit(input);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHistoryIndex((prev) => {
          const next = Math.min(prev + 1, inputHistory.length - 1);
          setInput(inputHistory[next] ?? "");
          return next;
        });
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHistoryIndex((prev) => {
          const next = Math.max(prev - 1, -1);
          setInput(next === -1 ? "" : inputHistory[next] ?? "");
          return next;
        });
      } else if (e.key === "Tab") {
        e.preventDefault();
        const tokens = input.split(/\s+/);
        if (tokens.length === 1) {
          const partial = tokens[0].toLowerCase();
          const match = COMMANDS.filter((c) => !c.hidden && c.name.startsWith(partial));
          if (match.length === 1) setInput(match[0].name + " ");
        } else {
          const partial = tokens[tokens.length - 1];
          const entries = listDir(cwd);
          const matches = entries.filter((e) => e.startsWith(partial));
          if (matches.length === 1) {
            tokens[tokens.length - 1] = matches[0];
            setInput(tokens.join(" "));
          }
        }
      } else if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        setOutput([]);
      }
    },
    [input, inputHistory, cwd, submit]
  );

  return { cwd, output, input, setInput, handleKey };
}
