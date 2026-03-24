import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Star, GitFork, ExternalLink } from 'lucide-react';
import PaperCard from '@/components/ui/PaperCard';
import { Surface } from '@/components/ui/surface';
import ScribbleText from '@/components/ScribbleText';
import { Spiral, Arrow } from '@/components/Doodles';

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
  TypeScript: 'bg-highlighter-yellow',
  JavaScript: 'bg-highlighter-yellow',
  Python: 'bg-highlighter-yellow',
  Java: 'bg-highlighter-yellow',
  HTML: 'bg-highlighter-yellow',
  CSS: 'bg-highlighter-yellow',
  R: 'bg-highlighter-yellow',
};

function repoInitials(name: string) {
  const clean = name.replace(/[-_]/g, ' ').trim();
  if (!clean) return 'RP';
  const words = clean.split(/\s+/).slice(0, 2);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return `${words[0][0] ?? ''}${words[1][0] ?? ''}`.toUpperCase();
}

function repoGradient(language: string | null) {
  switch (language) {
    case 'TypeScript':
      return 'from-highlighter-blue/45 via-paper to-highlighter-yellow/30';
    case 'JavaScript':
      return 'from-highlighter-yellow/45 via-paper to-highlighter-pink/20';
    case 'Python':
      return 'from-highlighter-blue/35 via-paper to-highlighter-yellow/25';
    case 'Java':
      return 'from-highlighter-pink/35 via-paper to-highlighter-yellow/25';
    default:
      return 'from-paper via-highlighter-blue/15 to-highlighter-yellow/20';
  }
}

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
      <div className="pointer-events-none absolute inset-0 opacity-[0.16]">
        <Spiral className="absolute -top-8 right-8 w-28 h-28 text-pencil/40" />
        <Arrow className="absolute top-44 left-8 w-28 h-14 text-pencil/30 -rotate-6" />
      </div>

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
              className="h-full cursor-pointer border border-pencil/35 rounded-xl paper-texture shadow-[0_10px_26px_-18px_rgba(32,26,22,0.45)] hover:shadow-[0_18px_30px_-20px_rgba(32,26,22,0.5)]"
            >
              <div className={`relative mb-4 overflow-hidden rounded-lg border border-pencil/25 bg-gradient-to-br ${repoGradient(repo.language)} h-24`}>
                <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(0,0,0,0.12) 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
                <div className="absolute left-3 top-3 px-2 py-0.5 rounded-md border border-pencil/25 bg-paper/65 font-marker text-xs text-pencil/80">
                  {repo.language ?? 'code'}
                </div>
                <div className="absolute right-3 bottom-2 font-marker text-3xl text-ink/70 tracking-tight">
                  {repoInitials(repo.name)}
                </div>
              </div>

              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-marker text-xl text-ink leading-tight truncate">
                  {repo.name}
                </h3>
                <ExternalLink className="w-4 h-4 text-pencil shrink-0 mt-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
              </div>

              <p className="font-hand text-lg text-pencil leading-snug line-clamp-3 min-h-[4rem]">
                {repo.description || 'No description provided.'}
              </p>

              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-pencil/20 font-hand text-base text-pencil">
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
              </div>
            </PaperCard>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
