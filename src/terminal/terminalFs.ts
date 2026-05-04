import { portfolioConfig } from "@/portfolio.config";
import type { VFSNode, VirtualDir, OutputNode } from "./types";

function text(content: string, color?: "fg" | "dim" | "muted" | "accent" | "green" | "amber" | "red"): OutputNode {
  return { type: "text", content, color };
}

const cfg = portfolioConfig;

const aboutFile = (): OutputNode[] => [
  text("─── about ─────────────────────────────────────────", "dim"),
  text(`name      ${cfg.personal.name}`, "fg"),
  text(`title     ${cfg.personal.title}`, "muted"),
  text(`location  ${cfg.personal.location}`, "muted"),
  text(`website   ${cfg.personal.website}`, "accent"),
  text(""),
  text("bio", "amber"),
  ...cfg.about.bio.map((b) => text(`  ${b}`, "fg")),
  text(""),
  text("skills", "amber"),
  ...cfg.about.skills.map((s) => text(`  ${s.name.padEnd(18)} ${s.level}%`, "fg")),
  text(""),
  text("tools", "amber"),
  text(`  ${cfg.about.tools.map((t) => t.name).join(", ")}`, "muted"),
];

const contactFile = (): OutputNode[] => [
  text("─── contact ────────────────────────────────────────", "dim"),
  text(`email     ${cfg.personal.email}`, "green"),
  text(`phone     ${cfg.personal.phone}`, "muted"),
  text(""),
  text("social", "amber"),
  ...Object.entries(cfg.social)
    .filter(([, v]) => v)
    .map(([k, v]) => text(`  ${k.padEnd(12)} ${v}`, "accent")),
];

const socialFile = (): OutputNode[] => [
  text("─── social links ───────────────────────────────────", "dim"),
  ...Object.entries(cfg.social)
    .filter(([, v]) => v)
    .map(([k, v]) => text(`  ${k.padEnd(12)} ${v}`, "accent")),
];

function projectFile(id: string): () => OutputNode[] {
  const p = cfg.projects.items.find((item) => item.id === id)! as {
    id: string; title: string; description: string;
    technologies: readonly string[]; liveUrl?: string; githubUrl?: string;
    startDate: string; endDate: string;
  };
  return () => [
    text(`─── ${p.title} ${"─".repeat(Math.max(0, 46 - p.title.length))}`, "dim"),
    text(p.description, "fg"),
    text(""),
    text(`tech      ${p.technologies.join(", ")}`, "muted"),
    p.liveUrl ? text(`live      ${p.liveUrl}`, "accent") : null,
    p.githubUrl ? text(`github    ${p.githubUrl}`, "accent") : null,
    text(`dates     ${p.startDate} → ${p.endDate}`, "muted"),
  ].filter((x): x is OutputNode => x !== null);
}

function achievementFile(slug: string): () => OutputNode[] {
  for (const cat of cfg.achievements) {
    for (const item of cat.items) {
      const s = item.title.toLowerCase().replace(/\s+/g, "-");
      if (s === slug) {
        return () => [
          text(`─── ${item.title} ${"─".repeat(Math.max(0, 46 - item.title.length))}`, "dim"),
          text(`category  ${cat.category}`, "amber"),
          text(`org       ${item.organization}`, "muted"),
          text(`date      ${item.date}`, "muted"),
          item.description ? text(item.description, "fg") : text("no description", "dim"),
        ];
      }
    }
  }
  return () => [{ type: "error", content: "not found" }];
}

export function buildVFS(): VirtualDir {
  const projectsDir: VirtualDir = {
    kind: "dir",
    name: "projects",
    children: Object.fromEntries(
      cfg.projects.items.map((p) => [
        p.id,
        { kind: "file", name: p.id, content: projectFile(p.id) },
      ])
    ),
  };

  const achievementsDir: VirtualDir = {
    kind: "dir",
    name: "achievements",
    children: Object.fromEntries(
      cfg.achievements.flatMap((cat) =>
        cat.items.map((item) => {
          const slug = item.title.toLowerCase().replace(/\s+/g, "-");
          return [slug, { kind: "file", name: slug, content: achievementFile(slug) }];
        })
      )
    ),
  };

  return {
    kind: "dir",
    name: "/",
    children: {
      projects: projectsDir,
      achievements: achievementsDir,
      about: { kind: "file", name: "about", content: aboutFile },
      contact: { kind: "file", name: "contact", content: contactFile },
      social: { kind: "file", name: "social", content: socialFile },
    },
  };
}

export const vfs = buildVFS();

export function resolveAbsPath(cwd: string, input: string): string {
  if (input.startsWith("/")) {
    const parts = input.split("/").filter(Boolean);
    return parts.length === 0 ? "/" : "/" + parts.join("/");
  }
  const base = cwd === "/" ? [] : cwd.split("/").filter(Boolean);
  for (const seg of input.split("/")) {
    if (seg === "" || seg === ".") continue;
    if (seg === "..") base.pop();
    else base.push(seg);
  }
  return base.length === 0 ? "/" : "/" + base.join("/");
}

export function getNode(path: string): VFSNode | null {
  if (path === "/") return vfs;
  const parts = path.split("/").filter(Boolean);
  let cur: VFSNode = vfs;
  for (const part of parts) {
    if (cur.kind !== "dir") return null;
    const next: VFSNode | undefined = cur.children[part];
    if (!next) return null;
    cur = next;
  }
  return cur;
}

export function listDir(path: string): string[] {
  const node = getNode(path);
  if (!node || node.kind !== "dir") return [];
  return Object.keys(node.children);
}

export function getProjectUrl(id: string): string | null {
  const p = cfg.projects.items.find((item) => item.id === id) as
    | { liveUrl?: string; githubUrl?: string }
    | undefined;
  return p?.liveUrl ?? p?.githubUrl ?? null;
}
