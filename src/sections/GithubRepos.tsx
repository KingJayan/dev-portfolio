import { m } from 'framer-motion';
import { Surface } from '@/components/ui/surface';
import { useGithubData } from './github/useGithubData';
import { useReveal } from '@/lib/motion';
import { describeGithubError } from './github/utils';
import { RepoSectionHeader } from './github/RepoSectionHeader';
import { RepoGridSkeleton } from './github/RepoGridSkeleton';
import { RepoErrorState } from './github/RepoErrorState';
import { RepoCard } from './github/RepoCard';
import { StatsBar } from './github/StatsBar';
import { ContribGraph } from './github/ContribGraph';
import { ActivityFeed } from './github/ActivityFeed';

const SECTION_CLASS = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24';

export default function GithubRepos() {
  const { repos, stats, loading, error, refetch } = useGithubData();
  const sectionReveal = useReveal({ opacity: 0, y: 50 }, { opacity: 1, y: 0 }, { viewport: { once: true, margin: '-100px' } });
  const activityReveal = useReveal({ opacity: 0, y: 30 }, { opacity: 1, y: 0 });

  if (loading && repos.length === 0) {
    return (
      <m.div {...sectionReveal} className={SECTION_CLASS}>
        <RepoSectionHeader subtitle="recent stuff" />
        <RepoGridSkeleton />
      </m.div>
    );
  }

  if (error && repos.length === 0) {
    return (
      <m.div {...sectionReveal} className={SECTION_CLASS}>
        <RepoSectionHeader />
        <RepoErrorState message={describeGithubError(error.status)} onRetry={refetch} />
      </m.div>
    );
  }

  const hasActivity = (stats?.contributions.length ?? 0) > 0 || (stats?.events.length ?? 0) > 0;

  return (
    <m.div
      {...sectionReveal}
      className={`${SECTION_CLASS} relative overflow-hidden`}
    >
      <RepoSectionHeader subtitle="recent stuff" withArrow className="mb-10" />

      {stats && <StatsBar stats={stats} />}

      <div className="flex flex-wrap justify-center gap-10 mb-12">
        {repos.map((repo, index) => (
          <RepoCard key={repo.id} repo={repo} index={index} />
        ))}
      </div>

      {hasActivity && stats && (
        <m.div
          {...activityReveal}
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
      )}
    </m.div>
  );
}
