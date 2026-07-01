import { useCallback, useEffect, useRef, useState } from 'react';
import type { StatsPayload } from '../../../api/github-stats';
import type { Repo } from './types';
import { sortAndFilter } from './utils';

export interface GithubDataError {
  message: string;
  status: number;
}

export interface GithubData {
  repos: Repo[];
  stats: StatsPayload | null;
  loading: boolean;
  error: GithubDataError | null;
  refetch: () => void;
}

export function useGithubData(): GithubData {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [stats, setStats] = useState<StatsPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<GithubDataError | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const run = useCallback((showError: boolean) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const { signal } = controller;

    setLoading(true);
    setError(null);

    Promise.all([
      fetch('/api/github', { signal }).then(async (r) => {
        if (!r.ok) {
          const b = (await r.json().catch(() => ({}))) as { error?: string };
          throw Object.assign(new Error(b.error ?? `error ${r.status}`), { status: r.status });
        }
        return r.json() as Promise<Repo[]>;
      }),
      fetch('/api/github-stats', { signal })
        .then((r) => (r.ok ? (r.json() as Promise<StatsPayload>) : null))
        .catch(() => null),
    ])
      .then(([repoData, statsData]) => {
        if (signal.aborted) return;
        setRepos(sortAndFilter(repoData));
        if (statsData) setStats(statsData);
        setLoading(false);
      })
      .catch((err: Error & { status?: number }) => {
        if (signal.aborted || err.name === 'AbortError') return;
        if (showError) setError({ message: err.message, status: err.status ?? 0 });
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    run(false);
    return () => controllerRef.current?.abort();
  }, [run]);

  const refetch = useCallback(() => run(true), [run]);

  return { repos, stats, loading, error, refetch };
}
