import { portfolioConfig } from "@/portfolio.config";
import { getNode, listDir, resolveAbsPath, getProjectUrl } from "./terminalFs";
import type { Command, CommandResult, OutputNode } from "./types";

function t(content: string, color?: "fg" | "dim" | "muted" | "accent" | "green" | "amber" | "red"): OutputNode {
  return { type: "text", content, color };
}
function err(content: string): OutputNode {
  return { type: "error", content };
}
function ok(output: OutputNode[], newCwd: string | null = null, special: CommandResult["special"] = null): CommandResult {
  return { output, newCwd, special };
}

function parseArgs(raw: string[]): { args: string[]; flags: Record<string, boolean | string> } {
  const args: string[] = [];
  const flags: Record<string, boolean | string> = {};
  for (const tok of raw) {
    if (tok.startsWith("--")) flags[tok.slice(2)] = true;
    else if (tok.startsWith("-") && tok.length > 1) flags[tok.slice(1)] = true;
    else args.push(tok);
  }
  return { args, flags };
}

const COMMANDS: Command[] = [
  {
    name: "help",
    description: "list available commands",
    run() {
      const visible = COMMANDS.filter((c) => !c.hidden);
      return ok([
        t("─── commands ───────────────────────────────────────", "dim"),
        ...visible.map((c) => t(`  ${c.name.padEnd(12)} ${c.description}`, "fg")),
        t(""),
        t('type "help <cmd>" for details', "muted"),
      ]);
    },
  },
  {
    name: "ls",
    aliases: ["dir"],
    description: "list directory contents",
    run({ args, state }) {
      const path = args[0] ? resolveAbsPath(state.cwd, args[0]) : state.cwd;
      const node = getNode(path);
      if (!node) return ok([err(`ls: ${args[0]}: no such file or directory`)]);
      if (node.kind === "file") return ok([t(node.name, "green")]);
      const entries = listDir(path);
      if (entries.length === 0) return ok([t("(empty)", "dim")]);
      return ok([t(entries.join("  "), "green")]);
    },
  },
  {
    name: "cd",
    description: "change directory",
    run({ args, state }) {
      const target = args[0] ?? "/";
      const abs = resolveAbsPath(state.cwd, target);
      const node = getNode(abs);
      if (!node) return ok([err(`cd: ${target}: no such file or directory`)]);
      if (node.kind === "file") return ok([err(`cd: ${target}: not a directory`)]);
      return ok([], abs);
    },
  },
  {
    name: "pwd",
    description: "print working directory",
    run({ state }) {
      return ok([t(state.cwd, "accent")]);
    },
  },
  {
    name: "cat",
    description: "read file contents  [--pretty for card view]",
    run({ args, flags, state }) {
      if (args.length === 0) return ok([err("cat: missing operand")]);
      const output: OutputNode[] = [];
      for (const arg of args) {
        const abs = resolveAbsPath(state.cwd, arg);
        const node = getNode(abs);
        if (!node) { output.push(err(`cat: ${arg}: no such file or directory`)); continue; }
        if (node.kind === "dir") { output.push(err(`cat: ${arg}: is a directory`)); continue; }
        const content = node.content();
        if (flags["pretty"]) {
          const lines = content
            .filter((n) => n.type === "text")
            .map((n) => (n as { content: string }).content)
            .filter(Boolean);
          output.push({
            type: "pretty-card",
            title: node.name,
            body: lines,
          });
        } else {
          output.push(...content);
          if (args.length > 1) output.push(t(""));
        }
      }
      return ok(output);
    },
  },
  {
    name: "clear",
    description: "clear the terminal",
    run() {
      return ok([], null, "clear");
    },
  },
  {
    name: "whoami",
    description: "print current user",
    run() {
      return ok([t("visitor", "green")]);
    },
  },
  {
    name: "contact",
    description: "show contact information",
    run() {
      const node = getNode("/contact");
      if (!node || node.kind !== "file") return ok([err("contact: not found")]);
      return ok(node.content());
    },
  },
  {
    name: "open",
    description: "open a project in the browser",
    run({ args }) {
      if (!args[0]) return ok([err("open: usage: open <project-id>")]);
      const url = getProjectUrl(args[0]);
      if (!url) return ok([err(`open: ${args[0]}: project not found`)]);
      window.open(url, "_blank", "noopener,noreferrer");
      return ok([t(`opening ${url}`, "green")]);
    },
  },
  {
    name: "exit",
    description: "return to portfolio",
    run() {
      return ok([t("goodbye.", "dim")], null, "exit");
    },
  },
  {
    name: "sudo",
    hidden: true,
    description: "",
    run() {
      return ok([
        t(`${portfolioConfig.personal.name.split(" ")[0].toLowerCase()} is not in the sudoers file. This incident will be reported.`, "red"),
      ]);
    },
  },
  {
    name: "rm",
    hidden: true,
    description: "",
    run({ args }) {
      if (args.includes("/") || args.some((a) => a === "-rf" || a === "-r")) {
        const lines: OutputNode[] = [
          t("rm: descending into /", "red"),
          t("rm: removing system files...", "red"),
          t("rm: removing portfolio...", "red"),
          t("rm: removing memories...", "red"),
          t("rm: removing dreams...", "red"),
          t(""),
          t("(phew) permission denied: you cannot delete what was never yours", "amber"),
        ];
        return ok(lines);
      }
      return ok([err("rm: missing operand")]);
    },
  },
  {
    name: "neofetch",
    hidden: true,
    description: "",
    run() {
      const cfg = portfolioConfig;
      return ok([
        t("  ___        _  __       _    _         _  ", "accent"),
        t(" |_  |      | |/ /      | |  | |       | | ", "accent"),
        t("   | | __ _ | ' / _   _ | |  | | _ __  | | ", "accent"),
        t("   | |/ _` ||  < | | | || |/\\| || '_ \\ | | ", "accent"),
        t("/\\__/ / (_| || . \\| |_| |\\  /\\  /| | | ||_| ", "accent"),
        t("\\____/ \\__,_||_|\\_\\\\__,_| \\/  \\/ |_| |_|(_) ", "accent"),
        t(""),
        { type: "table", headers: ["key", "value"], rows: [
          ["os",       "Portfolio OS v1.0"],
          ["host",     cfg.personal.name],
          ["location", cfg.personal.location],
          ["role",     cfg.personal.title],
          ["projects", String(cfg.projects.items.length)],
          ["skills",   String(cfg.about.skills.length)],
          ["status",   cfg.hero.status],
          ["uptime",   "always"],
        ]},
      ]);
    },
  },
  {
    name: "cowsay",
    hidden: true,
    description: "",
    run({ args }) {
      const msg = args.join(" ") || "moo";
      const len = msg.length;
      const top = " " + "_".repeat(len + 2);
      const mid = `< ${msg} >`;
      const bot = " " + "-".repeat(len + 2);
      return ok([
        t(top, "green"),
        t(mid, "fg"),
        t(bot, "green"),
        t("        \\   ^__^", "green"),
        t("         \\  (oo)\\_______", "green"),
        t("            (__)\\       )\\/\\", "green"),
        t("                ||----w |", "green"),
        t("                ||     ||", "green"),
      ]);
    },
  },
  {
    name: "hack",
    hidden: true,
    description: "",
    run() {
      const lines = [
        "initiating breach sequence...",
        "bypassing firewall 192.168.0.1...",
        "injecting payload...",
        "0xdeadbeef 0xcafebabe 0x1337c0de",
        "syncing quantum entanglement layer...",
        "overriding root permissions...",
        "access granted to mainframe...",
        "",
        "just kidding. access denied. nice try though.",
      ];
      return ok(lines.map((l, i) => t(l, i === lines.length - 1 ? "amber" : "green")));
    },
  },
];

const COMMAND_MAP = new Map<string, Command>();
for (const cmd of COMMANDS) {
  COMMAND_MAP.set(cmd.name, cmd);
  for (const alias of cmd.aliases ?? []) COMMAND_MAP.set(alias, cmd);
}

export { COMMANDS, COMMAND_MAP };

export function runCommand(line: string, state: { cwd: string; output: OutputNode[]; inputHistory: string[]; historyIndex: number; input: string }): CommandResult {
  const tokens = line.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return { output: [], newCwd: null, special: null };

  const cmdName = tokens[0].toLowerCase();
  const { args, flags } = parseArgs(tokens.slice(1));

  const cmd = COMMAND_MAP.get(cmdName);
  if (!cmd) {
    return {
      output: [err(`command not found: ${cmdName}  (type 'help' for available commands)`)],
      newCwd: null,
      special: null,
    };
  }

  return cmd.run({ args, flags, state });
}
