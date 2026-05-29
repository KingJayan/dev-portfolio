import type { VercelRequest, VercelResponse } from '@vercel/node';

const USERNAME = 'KingJayan';
const CACHE_TTL_MS = 5 * 60 * 1000; //5m

let cache: { data: StatsPayload; ts: number } | null = null;

export interface ContribDay { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }
export interface GithubEvent {
  id: string;
  type: string;
  repo: string;
  payload: Record<string, unknown>;
  createdAt: string;
}
export interface StatsPayload {
  totalStars: number;
  totalForks: number;
  languages: Record<string, number>;
  repoCount: number;
  contributions: ContribDay[];
  events: GithubEvent[];
}

function authHeaders(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

function parseContribSvg(html: string): ContribDay[] {
  const days: ContribDay[] = [];
  const re = /data-date="([^"]+)"[^>]*data-level="([0-4])"/g;
  const countRe = /tooltipText="(\d+) contribution/;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const countMatch = countRe.exec(m[0]);
    days.push({
      date: m[1],
      count: countMatch ? parseInt(countMatch[1]) : 0,
      level: parseInt(m[2]) as 0 | 1 | 2 | 3 | 4,
    });
  }
  if (days.length === 0) {
    const re2 = /<td[^>]+data-date="([^"]+)"[^>]*data-level="([0-4])"[^>]*title="([^"]+)"/g;
    while ((m = re2.exec(html)) !== null) {
      const countMatch = /(\d+)\s+contribution/.exec(m[3]);
      days.push({
        date: m[1],
        count: countMatch ? parseInt(countMatch[1]) : 0,
        level: parseInt(m[2]) as 0 | 1 | 2 | 3 | 4,
      });
    }
  }
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(200).json(cache.data);
  }

  const headers = authHeaders();

  const [reposRes, eventsRes, contribRes] = await Promise.all([
    fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100`, { headers }),
    fetch(`https://api.github.com/users/${USERNAME}/events/public?per_page=30`, { headers }),
    fetch(`https://github.com/users/${USERNAME}/contributions`, {
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'text/html' },
    }),
  ]);

  if (!reposRes.ok) return res.status(reposRes.status).json({ error: 'repos fetch failed' });

  const repos = await reposRes.json() as Array<{
    stargazers_count: number; forks_count: number; language: string | null; fork: boolean;
  }>;

  const owned = repos.filter(r => !r.fork);
  const totalStars = owned.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = owned.reduce((s, r) => s + r.forks_count, 0);
  const languages: Record<string, number> = {};
  for (const r of owned) {
    if (r.language) languages[r.language] = (languages[r.language] ?? 0) + 1;
  }

  let events: GithubEvent[] = [];
  if (eventsRes.ok) {
    const raw = await eventsRes.json() as Array<{
      id: string; type: string; repo: { name: string }; payload: Record<string, unknown>; created_at: string;
    }>;
    events = raw
      .filter(e => e.repo?.name)
      .slice(0, 30)
      .map(e => ({ id: e.id, type: e.type, repo: e.repo.name, payload: e.payload, createdAt: e.created_at }));
  }

  let contributions: ContribDay[] = [];
  if (contribRes.ok) {
    const html = await contribRes.text();
    contributions = parseContribSvg(html);
  }

  const data: StatsPayload = {
    totalStars,
    totalForks,
    languages,
    repoCount: owned.length,
    contributions,
    events,
  };

  cache = { data, ts: Date.now() };
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
  res.setHeader('X-Cache', 'MISS');
  return res.status(200).json(data);
}
