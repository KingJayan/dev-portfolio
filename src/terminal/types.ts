export type TextNode = {
  type: "text";
  content: string;
  color?: "fg" | "dim" | "muted" | "accent" | "green" | "amber" | "red";
};
export type ErrorNode = { type: "error"; content: string };
export type PrettyCardNode = {
  type: "pretty-card";
  title: string;
  subtitle?: string;
  body: string[];
  tags?: string[];
  url?: string;
};
export type TableNode = { type: "table"; headers: string[]; rows: string[][] };
export type CommandNode = { type: "command"; cwd: string; input: string };
export type OutputNode = TextNode | ErrorNode | PrettyCardNode | TableNode | CommandNode;

export type VirtualFile = {
  kind: "file";
  name: string;
  content: () => OutputNode[];
};
export type VirtualDir = {
  kind: "dir";
  name: string;
  children: Record<string, VFSNode>;
};
export type VFSNode = VirtualFile | VirtualDir;

export type TerminalState = {
  cwd: string;
  output: OutputNode[];
  inputHistory: string[];
  historyIndex: number;
  input: string;
};

export type CommandContext = {
  args: string[];
  flags: Record<string, boolean | string>;
  state: TerminalState;
};

export type CommandResult = {
  output: OutputNode[];
  newCwd: string | null;
  special: "clear" | "exit" | null;
};

export type Command = {
  name: string;
  aliases?: string[];
  description: string;
  hidden?: boolean;
  run: (ctx: CommandContext) => CommandResult;
};
