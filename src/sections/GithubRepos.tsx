import { m, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Star, GitFork, ExternalLink, RefreshCw, WifiOff, Zap, Code2, BookOpen } from 'lucide-react';
import PaperCard from '@/components/ui/PaperCard';
import { Surface } from '@/components/ui/surface';
import ScribbleText from '@/components/ScribbleText';
import { Arrow } from '@/components/Doodles';
import DrawText from '@/components/DrawText';
import type { StatsPayload, ContribDay, GithubEvent } from '../../api/github-stats';

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

const CONTRIB_COLORS = [
  'bg-ink/10',
  'bg-[rgb(35,58,47)]',
  'bg-[rgb(52,90,68)]',
  'bg-[rgb(75,125,95)]',
  'bg-[rgb(120,185,148)]',
];

function sortAndFilter(data: Repo[]): Repo[] {
  return data
    .filter((r) => !r.name.includes('.github.io'))
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 6);
}

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

interface FeedGroup {
  key: string;
  type: string;
  repo: string;
  events: GithubEvent[];
  createdAt: string;
}

function groupEvents(events: GithubEvent[]): FeedGroup[] {
  const groups: FeedGroup[] = [];
  for (const e of events) {
    const ageSec = (Date.now() - new Date(e.createdAt).getTime()) / 1000;
    const windowSec = ageSec < 3600 ? 900 : ageSec < 86400 ? 7200 : 43200;
    const last = groups[groups.length - 1];
    if (last && last.type === e.type && last.repo === e.repo) {
      const lastAge = (Date.now() - new Date(last.createdAt).getTime()) / 1000;
      if (Math.abs(ageSec - lastAge) < windowSec) {
        last.events.push(e);
        continue;
      }
    }
    groups.push({ key: e.id, type: e.type, repo: e.repo, events: [e], createdAt: e.createdAt });
  }
  return groups.slice(0, 10);
}

function groupLabel(g: FeedGroup): { icon: string; text: string } {
  const repo = (g.repo ?? '').replace('KingJayan/', '');
  const n = g.events.length;
  switch (g.type) {
    case 'PushEvent': {
      const commits = g.events.reduce((sum, e) => sum + ((e.payload.commits as unknown[])?.length ?? 1), 0);
      return { icon: '↑', text: `pushed ${commits} commit${commits !== 1 ? 's' : ''} to ${repo}` };
    }
    case 'CreateEvent':
      return { icon: '✦', text: `created ${g.events[0].payload.ref_type as string} in ${repo}${n > 1 ? ` ×${n}` : ''}` };
    case 'WatchEvent':
      return { icon: '★', text: `starred ${repo}${n > 1 ? ` ×${n}` : ''}` };
    case 'ForkEvent':
      return { icon: '⑂', text: `forked ${repo}` };
    case 'IssuesEvent':
      return { icon: '◎', text: `${g.events[0].payload.action as string} issue in ${repo}${n > 1 ? ` ×${n}` : ''}` };
    case 'PullRequestEvent':
      return { icon: '⤷', text: `${g.events[0].payload.action as string} PR in ${repo}${n > 1 ? ` ×${n}` : ''}` };
    case 'DeleteEvent':
      return { icon: '✕', text: `deleted ${g.events[0].payload.ref_type as string} in ${repo}` };
    case 'ReleaseEvent':
      return { icon: '◆', text: `released in ${repo}` };
    case 'PublicEvent':
      return { icon: '◉', text: `made ${repo} public` };
    default:
      return { icon: '·', text: `activity in ${repo}` };
  }
}

function ContribGraph({ days }: { days: ContribDay[] }) {
  const last365 = days.slice(-365);
  const weeks: ContribDay[][] = [];
  let week: ContribDay[] = [];

  const firstDay = last365[0] ? new Date(last365[0].date).getDay() : 0;
  for (let i = 0; i < firstDay; i++) week.push({ date: '', count: 0, level: 0 });

  for (const day of last365) {
    week.push(day);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length > 0) weeks.push(week);

  const months: { label: string; col: number }[] = [];
  weeks.forEach((w, wi) => {
    const first = w.find(d => d.date);
    if (!first) return;
    const d = new Date(first.date);
    if (wi === 0 || d.getDate() <= 7) {
      const label = d.toLocaleString('default', { month: 'short' });
      if (!months.length || months[months.length - 1].label !== label)
        months.push({ label, col: wi });
    }
  });

  return (
    <div className="w-full overflow-x-auto pb-1">
      <div className="min-w-[520px]">
        <div className="flex gap-0.5 mb-1 ml-8 relative h-4">
          {months.map((m) => (
            <span
              key={m.label + m.col}
              className="absolute font-hand text-[10px] text-pencil/50"
              style={{ left: `${(m.col / weeks.length) * 100}%` }}
            >
              {m.label}
            </span>
          ))}
        </div>
        <div className="flex gap-0.5">
          <div className="flex flex-col gap-0.5 mr-1 justify-around">
            {['Mon', 'Wed', 'Fri'].map(d => (
              <span key={d} className="font-hand text-[9px] text-pencil/40 leading-none h-[9px]">{d}</span>
            ))}
          </div>
          {weeks.map((w, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {w.map((day, di) => (
                <m.div
                  key={di}
                  title={day.date ? `${day.count} contributions on ${day.date}` : ''}
                  className={`w-[10px] h-[10px] rounded-[2px] ${day.date ? CONTRIB_COLORS[day.level] : 'bg-transparent'}`}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: wi * 0.003 + di * 0.001, duration: 0.2 }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 mt-2 justify-end">
          <span className="font-hand text-[10px] text-pencil/40">less</span>
          {CONTRIB_COLORS.map((c, i) => (
            <div key={i} className={`w-[10px] h-[10px] rounded-[2px] ${c}`} />
          ))}
          <span className="font-hand text-[10px] text-pencil/40">more</span>
        </div>
      </div>
    </div>
  );
}

function StatsBar({ stats }: { stats: StatsPayload }) {
  const topLangs = Object.entries(stats.languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([lang]) => lang);

  const items = [
    { icon: <Star className="w-4 h-4" />, value: stats.totalStars, label: 'stars' },
    { icon: <GitFork className="w-4 h-4" />, value: stats.totalForks, label: 'forks' },
    { icon: <BookOpen className="w-4 h-4" />, value: stats.repoCount, label: 'repos' },
    { icon: <Code2 className="w-4 h-4" />, value: topLangs.join(' · '), label: 'top langs' },
  ];

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-wrap justify-center gap-3 mb-10"
    >
      {items.map((item, i) => (
        <m.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 + i * 0.07 }}
          className="flex items-center gap-2 px-4 py-2 bg-paper/60 border border-pencil/20 rounded-xl shadow-paper backdrop-blur-sm"
        >
          <span className="text-pencil/60">{item.icon}</span>
          <span className="font-marker text-lg text-ink">{item.value}</span>
          <span className="font-hand text-sm text-pencil/50">{item.label}</span>
        </m.div>
      ))}
    </m.div>
  );
}

function ActivityFeed({ events }: { events: GithubEvent[] }) {
  const feedRef = useRef<HTMLDivElement>(null);
  const grouped = groupEvents(events);
  const [visible, setVisible] = useState<FeedGroup[]>([]);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!grouped.length) return;
    setVisible([grouped[0]]);
    indexRef.current = 1;

    const interval = setInterval(() => {
      if (indexRef.current >= grouped.length) { clearInterval(interval); return; }
      const next = grouped[indexRef.current];
      if (next) setVisible(prev => [...prev, next]);
      indexRef.current++;
      setTimeout(() => {
        feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' });
      }, 50);
    }, 700);

    return () => clearInterval(interval);
  }, [events]);

  if (!grouped.length) return null;

  return (
    <Surface
      variant="elevated"
      className="relative flex flex-col h-64 border border-pencil/20 rounded-xl overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-pencil/15 bg-paper/40 shrink-0">
        <span className="font-hand text-sm text-pencil/70">live activity</span>
        <Zap className="w-3 h-3 text-highlighter-yellow ml-auto" />
      </div>

      <div
        ref={feedRef}
        className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5"
        style={{ scrollbarWidth: 'none' }}
      >
        <AnimatePresence initial={false}>
          {visible.filter((g): g is FeedGroup => !!g).map((g) => {
            const { icon, text } = groupLabel(g);
            return (
              <m.div
                key={g.key}
                initial={{ opacity: 0, x: -12, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                className="flex items-start gap-2.5"
              >
                <span className="font-marker text-base text-sage/80 mt-0.5 w-4 shrink-0 text-center">
                  {icon}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="font-hand text-sm text-ink leading-snug">{text}</span>
                </div>
                <span className="font-hand text-[11px] text-pencil/35 shrink-0 mt-0.5">
                  {timeAgo(g.createdAt)}
                </span>
              </m.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-paper/80 to-transparent pointer-events-none" />
    </Surface>
  );
}

export default function GithubRepos() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [stats, setStats] = useState<StatsPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchAll = useCallback((showError: boolean) => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetch('/api/github').then(async r => {
        if (!r.ok) { const b = await r.json().catch(() => ({})) as { error?: string }; throw Object.assign(new Error(b.error ?? `error ${r.status}`), { status: r.status }); }
        return r.json() as Promise<Repo[]>;
      }),
      fetch('/api/github-stats').then(r => r.ok ? r.json() as Promise<StatsPayload> : null).catch(() => null),
    ])
      .then(([repoData, statsData]) => {
        setRepos(sortAndFilter(repoData));
        if (statsData) setStats(statsData);
        setLoading(false);
      })
      .catch((err: Error & { status?: number }) => {
        if (showError) setError(JSON.stringify({ message: err.message, status: err.status ?? 0 }));
        setLoading(false);
      });
  }, []);

  useEffect(() => { fetchAll(false); }, []);
  useEffect(() => { if (retryCount > 0) fetchAll(true); }, [retryCount]);

  if (loading && repos.length === 0) {
    return (
      <m.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
      >
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-5xl md:text-6xl font-marker text-center">
            <ScribbleText color="text-highlighter-yellow">
              <DrawText text="repos" fontUrl="/fonts/PermanentMarker.woff" />
            </ScribbleText>
          </h2>
          <p className="font-hand text-xl text-pencil mt-4">recent stuff</p>
        </div>
        <div className="flex flex-wrap justify-center gap-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`w-full md:w-[calc(50%-20px)] lg:w-[calc(33.333%-28px)] ${i % 2 === 0 ? 'rotate-[-0.4deg]' : 'rotate-[0.4deg]'}`}>
              <Surface variant="elevated" className="h-full border border-pencil/25 rounded-xl p-5 flex flex-col gap-3">
                <div className="h-5 w-2/3 rounded bg-ink/10 animate-pulse" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-4 w-full rounded bg-ink/8 animate-pulse" style={{ animationDelay: '80ms' }} />
                  <div className="h-4 w-5/6 rounded bg-ink/8 animate-pulse" style={{ animationDelay: '120ms' }} />
                  <div className="h-4 w-3/4 rounded bg-ink/8 animate-pulse" style={{ animationDelay: '160ms' }} />
                </div>
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
      </m.div>
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

  if (error && repos.length === 0) {
    return (
      <m.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
      >
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-5xl md:text-6xl font-marker text-center">
            <ScribbleText color="text-highlighter-yellow">
              <DrawText text="repos" fontUrl="/fonts/PermanentMarker.woff" />
            </ScribbleText>
          </h2>
        </div>
        <div className="relative flex flex-wrap justify-center gap-10">
          {[...Array(6)].map((_, i) => (
            <Surface variant="elevated" key={i} className={`w-full md:w-[calc(50%-20px)] lg:w-[calc(33.333%-28px)] h-48 border-ink/10 opacity-30 ${i % 2 === 0 ? 'rotate-[-1deg]' : 'rotate-[1deg]'}`} />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <m.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}>
              <PaperCard rotate={-1.5} className="text-center px-8 py-6 shadow-paper-hover">
                <WifiOff className="w-8 h-8 text-pencil/60 mx-auto mb-3" />
                <p className="font-marker text-2xl text-ink mb-1">couldn't reach github</p>
                <p className="font-hand text-base text-pencil/70 mb-4 max-w-[22ch]">{errorBody}</p>
                <button
                  onClick={() => setRetryCount(c => c + 1)}
                  className="inline-flex items-center gap-2 font-hand text-base text-ink bg-highlighter-yellow/40 hover:bg-highlighter-yellow/70 border border-ink/20 rounded-lg px-4 py-1.5 transition-colors active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                  retry
                </button>
              </PaperCard>
            </m.div>
          </div>
        </div>
      </m.div>
    );
  }

  return (
    <m.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative overflow-hidden"
    >
      <div className="flex flex-col items-center mb-10 relative">
        <h2 className="text-5xl md:text-6xl font-marker text-center relative">
          <ScribbleText color="text-highlighter-yellow">
            <DrawText text="repos" fontUrl="/fonts/PermanentMarker.woff" />
          </ScribbleText>
        </h2>
        <Arrow className="absolute -left-12 -bottom-2 w-16 h-8 text-pencil/30 -rotate-12 scale-x-[-1]" />
        <p className="font-hand text-xl text-pencil mt-4">recent stuff</p>
      </div>

      {stats && <StatsBar stats={stats} />}

      <div className="flex flex-wrap justify-center gap-10 mb-12">
        {repos.map((repo, index) => (
          <m.a
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
                  <h3 className="font-marker text-xl text-ink leading-tight truncate">{repo.name}</h3>
                  <ExternalLink className="w-4 h-4 text-pencil shrink-0 mt-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                </div>
                <p className="font-hand text-lg text-pencil leading-snug line-clamp-3 min-h-[3.2rem]">
                  {repo.description || 'No description yet.'}
                </p>
                <div className="flex items-center gap-4 mt-auto pt-3 border-t border-pencil/20 font-hand text-base text-pencil">
                  {repo.language && (
                    <span className="flex items-center gap-1.5">
                      <span className={`w-3 h-3 rounded-full ${LANGUAGE_COLORS[repo.language] ?? 'bg-pencil'}`} />
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
          </m.a>
        ))}
      </div>

      {(stats?.contributions.length || stats?.events.length) ? (
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6"
        >
          {stats.contributions.length > 0 && (
            <Surface variant="elevated" className="p-5 border border-pencil/20 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-hand text-sm text-pencil/70">contribution activity</span>
                <span className="font-hand text-xs text-pencil/40 ml-auto">past year</span>
              </div>
              <ContribGraph days={stats.contributions} />
            </Surface>
          )}

          {stats.events.length > 0 && <ActivityFeed events={stats.events} />}
        </m.div>
      ) : null}
    </m.div>
  );
}
