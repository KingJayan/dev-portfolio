import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, "..");
const OUT = join(ROOT, "src", "data", "github-repos.json");

const headers: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};
if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

let res: Response;
try {
  res = await fetch(
    "https://api.github.com/users/KingJayan/repos?sort=updated&per_page=20",
    { headers, signal: AbortSignal.timeout(8000) }
  );
} catch (err) {
  console.warn("fetch-github: network error, keeping existing data:", err instanceof Error ? err.message : err);
  process.exit(0);
}

if (!res.ok) {
  console.warn(`fetch-github: GitHub returned ${res.status}, keeping existing data`);
  process.exit(0);
}

const data = await res.json();
mkdirSync(join(ROOT, "src", "data"), { recursive: true });
writeFileSync(OUT, JSON.stringify(data, null, 2), "utf8");
console.log(`fetch-github: wrote ${(data as unknown[]).length} repos → src/data/github-repos.json`);
