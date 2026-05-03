import type { VercelRequest, VercelResponse } from '@vercel/node';

const CACHE_TTL_MS = 5 * 60 * 1000;
let cachedRepos: unknown[] | null = null;
let cacheTimestamp = 0;

export default async function handler(_req: VercelRequest, res: VercelResponse) {
    if (Date.now() - cacheTimestamp < CACHE_TTL_MS && cachedRepos) {
        res.setHeader('X-Cache', 'HIT');
        return res.status(200).json(cachedRepos);
    }

    const headers: Record<string, string> = {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
    };
    if (process.env.GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const upstream = await fetch(
        'https://api.github.com/users/KingJayan/repos?sort=updated&per_page=20',
        { headers }
    );

    if (!upstream.ok) {
        return res.status(upstream.status).json({ error: `GitHub API error: ${upstream.status}` });
    }

    const data: unknown[] = await upstream.json();
    cachedRepos = data;
    cacheTimestamp = Date.now();

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json(data);
}
