import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Star, GitFork, ExternalLink } from 'lucide-react';
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

  useEffect(() => {
    fetch('https://api.github.com/users/KingJayan/repos?sort=updated&per_page=6')
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        return res.json();
      })
      .then((data: Repo[]) => {
        const sorted = data
          .filter((r) => !r.name.includes('.github.io'))
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          .slice(0, 6);
        setRepos(sorted);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

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
        </div>
        <div className="flex flex-wrap justify-center gap-10">
          {[...Array(6)].map((_, i) => (
            <Surface
              variant="elevated"
              key={i}
              className={`w-full md:w-[calc(50%-20px)] lg:w-[calc(33.333%-28px)] h-48 border-ink/15 animate-pulse ${i % 2 === 0 ? 'rotate-[-1deg]' : 'rotate-[1deg]'
                }`}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  /*error*/
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
            <ScribbleText color="text-highlighter-yellow">github</ScribbleText>
          </h2>
        </div>
        <PaperCard rotate={-1} className="max-w-md mx-auto text-center">
          <p className="font-hand text-xl text-ink/70">
            unable to load repos at the moment, please try again later.
          </p>
          <p className="font-hand text-lg text-pencil mt-2">{error}</p>
        </PaperCard>
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
