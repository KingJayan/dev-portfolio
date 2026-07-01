import { m } from 'framer-motion';
import { Star, GitFork, Code2, BookOpen } from 'lucide-react';
import type { StatsPayload } from '../../../api/github-stats';
import { useReveal } from './useReveal';

export function StatsBar({ stats }: { stats: StatsPayload }) {
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

  const barReveal = useReveal({ opacity: 0, y: 20 }, { opacity: 1, y: 0 });
  const itemReveal = useReveal({ opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1 });

  return (
    <m.div
      {...barReveal}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-wrap justify-center gap-3 mb-10"
    >
      {items.map((item, i) => (
        <m.div
          key={item.label}
          {...itemReveal}
          transition={{ delay: 0.15 + i * 0.07 }}
          className="flex items-center gap-2 px-4 py-2 glass-nav rounded-xl shadow-paper"
        >
          <span className="text-pencil/60">{item.icon}</span>
          <span className="font-marker text-lg text-ink">{item.value}</span>
          <span className="font-hand text-sm text-pencil/50">{item.label}</span>
        </m.div>
      ))}
    </m.div>
  );
}
