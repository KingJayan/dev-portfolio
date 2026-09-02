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

async function fetchCommitDates(fullName: string): Promise<number[] > {
  const dates: number[] = [];
  for (let page = 1; page <= MAX_COMMIT_PAGES; page++) {
    const batch = await api<Array<{ commit: { author?: { date?: string }; committer?: { date?: string } } }>>(
      `/repos/${fullName}/commits?per_page=100&page=${page}`
    );
    for (const c of batch) {
      const iso = c.commit.author?.date ?? c.commit.committer?.date;
      if (iso) dates.push(new Date(iso).getTime());
    }
    if (batch.length < 100) break;
  }
  return dates.sort((a, b) => a - b);
}

const monthYear = (ms: number) => {
  const d = new Date(ms);
  return `${String(d.getUTCMonth() + 1).padStart(2, "0")}/${String(d.getUTCFullYear() % 100).padStart(2, "0")}`;
};

function findBurstEnd(dates: number[]): number {
  const n = gh.burstSize;
  const window = gh.burstWindowDays * DAY_MS;
  let end = dates[dates.length - 1];
  for (let i = n - 1; i < dates.length; i++) {
    if (dates[i] - dates[i - n + 1] <= window) end = dates[i];
  }
  return end;
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

async function main() {
  const repos = (await fetchRepos(gh.username)).filter((repo) => {
    if (repo.private) return false;
    if (gh.excludeForks && repo.fork) return false;
    if (gh.excludeArchived && repo.archived) return false;
    if ((gh.exclude as readonly string[]).includes(repo.name)) return false;
    return true;
  });

  console.log(`Syncing ${repos.length} repo(s) for @${gh.username}...`);

  const projects: GeneratedProject[] = [];
  for (const repo of repos) {
    let dates: number[] = [];
    try {
      dates = await fetchCommitDates(repo.full_name);
    } catch (err) {
      console.warn(`  ~ ${repo.name}: could not read commits (${(err as Error).message})`);
    }
    if (dates.length === 0) {
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

    const lastCommit = dates[dates.length - 1];
    const burstEnd = findBurstEnd(dates);
    const isActive =
      burstEnd === lastCommit && Date.now() - lastCommit <= gh.activeWithinDays * DAY_MS;

    projects.push({
      id: repo.name.toLowerCase(),
      title: titleize(repo.name),
      description: repo.description ?? "",
      technologies,
      githubUrl: repo.html_url,
      liveUrl: repo.homepage?.trim() ? repo.homepage.trim() : undefined,
      startDate: monthYear(dates[0]),
      endDate: isActive ? "" : monthYear(burstEnd),
      lastUpdated: new Date(lastCommit).toISOString(),
      stars: repo.stargazers_count,
      commitCount: dates.length,
      source: "github",
    });

    console.log(
      `  + ${repo.name}: ${monthYear(dates[0])} → ${isActive ? "present" : monthYear(burstEnd)} (${dates.length} commits)`
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
