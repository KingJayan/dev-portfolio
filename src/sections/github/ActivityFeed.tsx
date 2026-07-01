import { m, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Zap } from 'lucide-react';
import { Surface } from '@/components/ui/surface';
import type { GithubEvent } from '../../../api/github-stats';
import type { FeedGroup } from './types';
import { groupEvents, groupLabel, timeAgo } from './utils';

export function ActivityFeed({ events }: { events: GithubEvent[] }) {
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
