import { m } from 'framer-motion';
import { Star, GitFork, ExternalLink } from 'lucide-react';
import PaperCard from '@/components/ui/PaperCard';
import type { Repo } from './types';
import { LANGUAGE_BORDER, LANGUAGE_COLORS } from './constants';

export function RepoCard({ repo, index }: { repo: Repo; index: number }) {
  const even = index % 2 === 0;
  return (
    <m.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -4, rotate: even ? -0.35 : 0.35 }}
      transition={{ type: 'spring', stiffness: 160, damping: 22 }}
      className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.333%-28px)] no-underline group"
    >
      <PaperCard
        rotate={even ? -0.4 : 0.4}
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
  );
}
