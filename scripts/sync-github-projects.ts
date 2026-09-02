/**
 * pulls all public repos for a gh user
 * run with: bun run sync:projects   (GITHUB_TOKEN strongly recommended)
 */
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { portfolioConfig } from "../src/portfolio.config";
import type { GeneratedProject } from "../src/data/project-types";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_FILE = resolve(ROOT, "src/data/github-projects.json");

const gh = portfolioConfig.projects.github;
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_COMMIT_PAGES = 10; // 1000 commits

const headers: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "dev-portfolio-sync",
};
if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
} else {
  console.warn("! No GITHUB_TOKEN set — you will likely hit the 60 req/hr anonymous rate limit.");
}

async function api<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) {
    throw new Error(`GitHub ${res.status} ${res.statusText} for ${path}`);
  }
  return (await res.json()) as T;
}

interface Repo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  fork: boolean;
  archived: boolean;
  private: boolean;
  stargazers_count: number;
  pushed_at: string;
  topics?: string[];
}

async function fetchRepos(user: string): Promise<Repo[]> {
  const all: Repo[] = [];
  for (let page = 1; page <= 5; page++) {
    const batch = await api<Repo[]>(`/users/${user}/repos?per_page=100&type=owner&sort=updated&page=${page}`);
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all;
}

interface CommitRef {
  sha: string;
  date: number;
}

async function fetchCommits(fullName: string): Promise<CommitRef[]> {
  const commits: CommitRef[] = [];
  for (let page = 1; page <= MAX_COMMIT_PAGES; page++) {
    const batch = await api<Array<{ sha: string; commit: { author?: { date?: string }; committer?: { date?: string } } }>>(
      `/repos/${fullName}/commits?per_page=100&page=${page}`
    );
    for (const c of batch) {
      const iso = c.commit.author?.date ?? c.commit.committer?.date;
      if (iso) commits.push({ sha: c.sha, date: new Date(iso).getTime() });
    }
    if (batch.length < 100) break;
  }
  return commits.sort((a, b) => a.date - b.date);
}

const monthYear = (ms: number) => {
  const d = new Date(ms);
  return `${String(d.getUTCMonth() + 1).padStart(2, "0")}/${String(d.getUTCFullYear() % 100).padStart(2, "0")}`;
};

interface Session {
  start: number;
  end: number;
  shas: string[];
}

function buildSessions(commits: readonly CommitRef[], gapMs: number): Session[] {
  const sessions: Session[] = [];
  for (const c of commits) {
    const current = sessions[sessions.length - 1];
    if (current && c.date - current.end <= gapMs) {
      current.end = c.date;
      current.shas.push(c.sha);
    } else {
      sessions.push({ start: c.date, end: c.date, shas: [c.sha] });
    }
  }
  return sessions;
}

const TRIVIAL_FILE_PATTERNS = [
  /^readme(\.[a-z0-9]+)?$/i,
  /^license(\.[a-z0-9]+)?$/i,
  /^changelog(\.[a-z0-9]+)?$/i,
  /^\.gitignore$/i,
  /package-lock\.json$/i,
  /^yarn\.lock$/i,
  /^bun\.lock(b)?$/i,
  /^\.gitattributes$/i,
];

interface SessionStats {
  changedLines: number;
  allTrivialFiles: boolean;
}

async function fetchSessionStats(fullName: string, session: Session): Promise<SessionStats> {
  const sha = session.shas[session.shas.length - 1];
  const detail = await api<{
    stats?: { additions?: number; deletions?: number };
    files?: Array<{ filename: string }>;
  }>(`/repos/${fullName}/commits/${sha}`).catch(() => ({}) as { stats?: never; files?: never });

  const changedLines = (detail.stats?.additions ?? 0) + (detail.stats?.deletions ?? 0);
  const files = detail.files ?? [];
  const allTrivialFiles =
    files.length > 0 && files.every((f) => TRIVIAL_FILE_PATTERNS.some((re) => re.test(f.filename)));

  return { changedLines, allTrivialFiles };
}

function isTrivialSession(stats: SessionStats): boolean {
  return stats.allTrivialFiles || stats.changedLines < gh.minSessionChangeLines;
}

function median(nums: readonly number[]): number | undefined {
  if (nums.length === 0) return undefined;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

interface ContinuationResult {
  endDate: number;
  isActive: boolean;
}

async function resolveContinuation(fullName: string, sessions: readonly Session[]): Promise<ContinuationResult> {
  const realSessions: Session[] = [];
  for (const session of sessions) {
    const stats = await fetchSessionStats(fullName, session);
    if (!isTrivialSession(stats)) realSessions.push(session);
  }

  const effective = realSessions.length > 0 ? realSessions : [...sessions];
  const lastReal = effective[effective.length - 1];

  const gaps: number[] = [];
  for (let i = 1; i < effective.length; i++) gaps.push(effective[i].start - effective[i - 1].end);
  const medianGap = median(gaps);

  const floor = gh.activeWithinDays * DAY_MS;
  const threshold = medianGap !== undefined ? Math.max(floor, medianGap * gh.activeMultiplier) : floor;
  const isActive = Date.now() - lastReal.end <= threshold;

  return { endDate: lastReal.end, isActive };
}

function titleize(name: string): string {
  return name
    .replace(/[-_.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((w) => (/^[A-Z0-9]{2,}$/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

const TOPIC_LABELS: Record<string, string> = {
  nextjs: "Next.js", "next-js": "Next.js", nodejs: "Node.js", typescript: "TypeScript",
  javascript: "JavaScript", tailwindcss: "Tailwind", tailwind: "Tailwind", postgresql: "PostgreSQL",
  reactjs: "React", react: "React", api: "API", cli: "CLI", css: "CSS", html: "HTML",
  "framer-motion": "Framer Motion", ai: "AI", llm: "LLM", ml: "ML", ui: "UI", ux: "UX",
};
const labelTopic = (t: string) => TOPIC_LABELS[t.toLowerCase()] ?? titleize(t);

/**
 * Supports exact names, `*` wildcards (e.g. "*-test"), and a `\s` prefix for a
 * substring match anywhere in the name (e.g. "\stest" matches "lemlibtest").
 */
function matchesExclude(name: string, patterns: readonly string[]): boolean {
  const lower = name.toLowerCase();
  return patterns.some((p) => {
    if (p.startsWith("\\s")) return lower.includes(p.slice(2).toLowerCase());
    if (!p.includes("*")) return p.toLowerCase() === lower;
    const re = new RegExp(`^${p.toLowerCase().split("*").map(escapeRegExp).join(".*")}$`);
    return re.test(lower);
  });
}
function escapeRegExp(s: string): string {
  return s.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
}

async function main() {
  const repos = (await fetchRepos(gh.username)).filter((repo) => {
    if (repo.private) return false;
    if (gh.excludeForks && repo.fork) return false;
    if (gh.excludeArchived && repo.archived) return false;
    if (matchesExclude(repo.name, gh.exclude as readonly string[])) return false;
    return true;
  });

  console.log(`Syncing ${repos.length} repo(s) for @${gh.username}...`);

  const projects: GeneratedProject[] = [];
  for (const repo of repos) {
    let commits: CommitRef[] = [];
    try {
      commits = await fetchCommits(repo.full_name);
    } catch (err) {
      console.warn(`  ~ ${repo.name}: could not read commits (${(err as Error).message})`);
    }
    if (commits.length === 0) {
      console.warn(`  - ${repo.name}: skipped (no commits)`);
      continue;
    }

    const languages = await api<Record<string, number>>(`/repos/${repo.full_name}/languages`)
      .catch(() => ({} as Record<string, number>));

    const topLanguages = Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, gh.maxLanguages)
      .map(([name]) => name);

    const technologies = Array.from(
      new Set([...(repo.topics ?? []).map(labelTopic), ...topLanguages])
    ).slice(0, gh.maxTechnologies);

    const lastCommit = commits[commits.length - 1].date;
    const sessions = buildSessions(commits, gh.sessionGapHours * 60 * 60 * 1000);
    const { endDate: continuationEnd, isActive } = await resolveContinuation(repo.full_name, sessions);

    projects.push({
      id: repo.name.toLowerCase(),
      title: titleize(repo.name),
      description: repo.description ?? "",
      technologies,
      githubUrl: repo.html_url,
      liveUrl: repo.homepage?.trim() ? repo.homepage.trim() : undefined,
      startDate: monthYear(commits[0].date),
      endDate: isActive ? "" : monthYear(continuationEnd),
      lastUpdated: new Date(lastCommit).toISOString(),
      stars: repo.stargazers_count,
      commitCount: commits.length,
      source: "github",
    });

    console.log(
      `  + ${repo.name}: ${monthYear(commits[0].date)} → ${isActive ? "present" : monthYear(continuationEnd)} (${commits.length} commits, ${sessions.length} sessions)`
    );
  }

  projects.sort((a, b) => (b.lastUpdated ?? "").localeCompare(a.lastUpdated ?? ""));

  const payload = {
    generatedAt: new Date().toISOString(),
    username: gh.username,
    projects,
  };

  const next = `${JSON.stringify(payload, null, 2)}\n`;
  if (existsSync(OUT_FILE)) {
    const prev = readFileSync(OUT_FILE, "utf8");
    const strip = (s: string) => s.replace(/"generatedAt": "[^"]*",\n/, "");
    if (strip(prev) === strip(next)) {
      console.log("No project changes.");
      return;
    }
  }

  writeFileSync(OUT_FILE, next);
  console.log(`Wrote ${projects.length} project(s) to src/data/github-projects.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
