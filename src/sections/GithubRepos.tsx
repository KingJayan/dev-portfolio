import { motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { Star, GitFork, ExternalLink, RefreshCw, WifiOff } from 'lucide-react';
import PaperCard from '@/components/ui/PaperCard';
import { Surface } from '@/components/ui/surface';
import ScribbleText from '@/components/ScribbleText';

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: 'bg-highlighter-blue',
  JavaScript: 'bg-highlighter-yellow',
  Python: 'bg-[#4b8bbe]',
  Java: 'bg-highlighter-pink',
  HTML: 'bg-[#e44d26]',
  CSS: 'bg-[#264de4]',
  R: 'bg-[#198ce7]',
};

const LANGUAGE_BORDER: Record<string, string> = {
  TypeScript: 'border-t-[3px] border-t-[#3178c6]',
  JavaScript: 'border-t-[3px] border-t-[#f1e05a]',
  Python: 'border-t-[3px] border-t-[#4b8bbe]',
  Java: 'border-t-[3px] border-t-[#b07219]',
  HTML: 'border-t-[3px] border-t-[#e44d26]',
  CSS: 'border-t-[3px] border-t-[#264de4]',
  R: 'border-t-[3px] border-t-[#198ce7]',
};


export default function GithubRepos() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchRepos = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch('/api/github')
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({})) as { error?: string };
          throw Object.assign(new Error(body.error ?? `error ${res.status}`), { status: res.status });
        }
        return res.json() as Promise<Repo[]>;
      })
      .then((data) => {
        const sorted = data
          .filter((r) => !r.name.includes('.github.io'))
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          .slice(0, 6);
        setRepos(sorted);
        setLoading(false);
      })
      .catch((err: Error & { status?: number }) => {
        setError(JSON.stringify({ message: err.message, status: err.status ?? 0 }));
        setLoading(false);
      });
  }, []);

  useEffect(() => { fetchRepos(); }, [retryCount]);

  /*loading*/
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
      >
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-5xl md:text-6xl font-marker text-center">
            <ScribbleText color="text-highlighter-yellow">repos</ScribbleText>
          </h2>
          <p className="font-hand text-xl text-pencil mt-4">recent stuff</p>
        </div>
        <div className="flex flex-wrap justify-center gap-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`w-full md:w-[calc(50%-20px)] lg:w-[calc(33.333%-28px)] ${i % 2 === 0 ? 'rotate-[-0.4deg]' : 'rotate-[0.4deg]'}`}
            >
              <Surface
                variant="elevated"
                className="h-full border border-pencil/25 rounded-xl p-5 flex flex-col gap-3"
              >
                {/* title */}
                <div className="h-5 w-2/3 rounded bg-ink/10 animate-pulse" />
                {/* description lines */}
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-4 w-full rounded bg-ink/8 animate-pulse" style={{ animationDelay: '80ms' }} />
                  <div className="h-4 w-5/6 rounded bg-ink/8 animate-pulse" style={{ animationDelay: '120ms' }} />
                  <div className="h-4 w-3/4 rounded bg-ink/8 animate-pulse" style={{ animationDelay: '160ms' }} />
                </div>
                {/* footer */}
                <div className="flex items-center gap-3 pt-3 border-t border-pencil/15">
                  <div className="w-3 h-3 rounded-full bg-ink/15 animate-pulse" style={{ animationDelay: '200ms' }} />
                  <div className="h-3.5 w-16 rounded bg-ink/10 animate-pulse" style={{ animationDelay: '200ms' }} />
                  <div className="h-3.5 w-10 rounded bg-ink/10 animate-pulse ml-2" style={{ animationDelay: '240ms' }} />
                  <div className="h-3 w-14 rounded bg-ink/8 animate-pulse ml-auto" style={{ animationDelay: '280ms' }} />
                </div>
              </Surface>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  const errorInfo = (() => {
    try { return JSON.parse(error ?? '{}') as { message: string; status: number }; }
    catch { return { message: error ?? '', status: 0 }; }
  })();
  const isRateLimit = errorInfo.status === 403 || errorInfo.status === 429;
  const errorBody = isRateLimit
    ? "github rate limit hit — the repos will load again in a few minutes."
    : errorInfo.status >= 500
      ? "github is having issues on their end — worth a retry."
      : "couldn't reach github — check your connection or try again.";

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
      >
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-5xl md:text-6xl font-marker text-center">
            <ScribbleText color="text-highlighter-yellow">repos</ScribbleText>
          </h2>
        </div>
        <div className="relative flex flex-wrap justify-center gap-10">
          {[...Array(6)].map((_, i) => (
            <Surface
              variant="elevated"
              key={i}
              className={`w-full md:w-[calc(50%-20px)] lg:w-[calc(33.333%-28px)] h-48 border-ink/10 opacity-30 ${i % 2 === 0 ? 'rotate-[-1deg]' : 'rotate-[1deg]'}`}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
            >
              <PaperCard rotate={-1.5} className="text-center px-8 py-6 shadow-paper-hover">
                <WifiOff className="w-8 h-8 text-pencil/60 mx-auto mb-3" />
                <p className="font-marker text-2xl text-ink mb-1">couldn't reach github</p>
                <p className="font-hand text-base text-pencil/70 mb-4 max-w-[22ch]">
                  {errorBody}
                </p>
                <button
                  onClick={() => setRetryCount(c => c + 1)}
                  className="inline-flex items-center gap-2 font-hand text-base text-ink bg-highlighter-yellow/40 hover:bg-highlighter-yellow/70 border border-ink/20 rounded-lg px-4 py-1.5 transition-colors active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                  retry
                </button>
              </PaperCard>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative overflow-hidden"
    >
<div className="flex flex-col items-center mb-16 relative">
        <h2 className="text-5xl md:text-6xl font-marker text-center relative">
          <ScribbleText color="text-highlighter-yellow">repos</ScribbleText>
        </h2>
        <p className="font-hand text-xl text-pencil mt-4">
          recent stuff
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-10">
        {repos.map((repo, index) => (
          <motion.a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -4, rotate: index % 2 === 0 ? -0.35 : 0.35 }}
            transition={{ type: 'spring', stiffness: 160, damping: 22 }}
            className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.333%-28px)] no-underline group"
          >
            <PaperCard
              rotate={index % 2 === 0 ? -0.4 : 0.4}
              delay={index * 0.1}
              showTape={false}
              className={`h-full cursor-pointer bg-paper/85 backdrop-blur-sm border border-pencil/25 rounded-xl shadow-paper hover:shadow-paper-hover ${repo.language ? (LANGUAGE_BORDER[repo.language] ?? '') : ''}`}
            >
              <div className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-marker text-xl text-ink leading-tight truncate">
                    {repo.name}
                  </h3>
                  <ExternalLink className="w-4 h-4 text-pencil shrink-0 mt-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                </div>

                <p className="font-hand text-lg text-pencil leading-snug line-clamp-3 min-h-[3.2rem]">
                  {repo.description || 'No description yet.'}
                </p>

                <div className="flex items-center gap-4 mt-auto pt-3 border-t border-pencil/20 font-hand text-base text-pencil">
                  {repo.language && (
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`w-3 h-3 rounded-full ${LANGUAGE_COLORS[repo.language] ?? 'bg-pencil'
                          }`}
                      />
                      {repo.language}
                    </span>
                  )}

                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {repo.stargazers_count}
                  </span>

                  {repo.forks_count > 0 && (
                    <span className="flex items-center gap-1">
                      <GitFork className="w-4 h-4" />
                      {repo.forks_count}
                    </span>
                  )}

                  <span className="ml-auto font-hand text-xs text-pencil/50 italic">
                    {new Date(repo.updated_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </PaperCard>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
