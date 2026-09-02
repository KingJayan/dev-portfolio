import { m, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from "react";
import { useReveal } from '@/lib/motion';
import { portfolioConfig, type PortfolioConfig } from "@/portfolio.config";
import ProjectModal from "@/components/ProjectModal";
import { Surface } from '@/components/ui/surface';
import ScribbleText from '@/components/ScribbleText';
import { Arrow, Underline } from '@/components/Doodles';
import DrawText from '@/components/DrawText';
import { cn } from '@/lib/utils';
import { Library, ArrowUpRight, Sparkles, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPortal } from 'react-dom';
import { Z_INDEX } from '@/lib/z-index';

type ProjectItem = PortfolioConfig["projects"]["items"][number];

export default function Projects() {
  const { projects } = portfolioConfig;
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [librarySelectionIndex, setLibrarySelectionIndex] = useState<number | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [libraryQuery, setLibraryQuery] = useState('');
  const [activeTechFilter, setActiveTechFilter] = useState('All');
  const [showAllTechFilters, setShowAllTechFilters] = useState(false);
  const [sortMode, setSortMode] = useState<'recent' | 'alpha'>('recent');
  const libraryProjects = projects.items;
  const hasProjects = libraryProjects.length > 0;
  const reveal = useReveal({ opacity: 0, y: 50 }, { opacity: 1, y: 0 }, { viewport: { once: true, margin: "-100px" } });

  const parseMonthYear = (value: string) => {
    const match = /^(\d{1,2})\/(\d{2})$/.exec(value.trim());
    if (!match) {
      return null;
    }

    const month = Number(match[1]);
    const year = 2000 + Number(match[2]);
    if (month < 1 || month > 12) {
      return null;
    }

    return { year, month };
  };

  const isRecentProject = (project: ProjectItem) => {
    const parsed = parseMonthYear(project.startDate);
    if (!parsed) {
      return false;
    }

    const now = new Date();
    const nowMonthIndex = now.getFullYear() * 12 + (now.getMonth() + 1);
    const projectMonthIndex = parsed.year * 12 + parsed.month;
    const deltaMonths = nowMonthIndex - projectMonthIndex;
    return deltaMonths >= 0 && deltaMonths <= 6;
  };

  const getProjectStatus = (project: ProjectItem) => {
    const explicitStatus = 'status' in project ? project.status : undefined;

    if (explicitStatus === 'planned') {
      return { label: 'Planned', dot: 'bg-highlighter-pink/70' };
    }
    if (explicitStatus === 'in-progress') {
      return { label: 'In Progress', dot: 'bg-highlighter-yellow/90' };
    }
    if (explicitStatus === 'completed') {
      return { label: 'Completed', dot: 'bg-highlighter-blue/80' };
    }
    if (project.endDate) {
      return { label: 'Completed', dot: 'bg-highlighter-blue/80' };
    }
    return { label: 'In Progress', dot: 'bg-highlighter-yellow/90' };
  };

  const toMonthIndex = (value: string) => {
    const parsed = parseMonthYear(value);
    if (!parsed) {
      return -1;
    }
    return parsed.year * 12 + parsed.month;
  };

  const TOP_TECH_COUNT = 5;

  const libraryTechOptions = useMemo(() => {
    const counts = new Map<string, number>();
    libraryProjects.forEach((project) => {
      project.technologies.forEach((tech) => {
        counts.set(tech, (counts.get(tech) ?? 0) + 1);
      });
    });

    const ranked = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tech]) => tech);

    return {
      top: ['All', ...ranked.slice(0, TOP_TECH_COUNT)],
      rest: ranked.slice(TOP_TECH_COUNT),
    };
  }, [libraryProjects]);

  const visibleLibraryProjects = useMemo(() => {
    const query = libraryQuery.trim().toLowerCase();

    const filtered = libraryProjects.filter((project) => {
      const matchesTech = activeTechFilter === 'All' || (project.technologies as readonly string[]).includes(activeTechFilter);
      if (!matchesTech) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        project.title.toLowerCase().includes(query)
        || project.description.toLowerCase().includes(query)
        || project.technologies.some((tech) => tech.toLowerCase().includes(query))
      );
    });

    return filtered.sort((a, b) => {
      if (sortMode === 'alpha') {
        return a.title.localeCompare(b.title);
      }
      return toMonthIndex(b.startDate) - toMonthIndex(a.startDate);
    });
  }, [libraryProjects, libraryQuery, activeTechFilter, sortMode]);

  const openLibraryProject = (project: ProjectItem) => {
    const overflowIndex = libraryProjects.findIndex((item) => item.id === project.id);
    setLibrarySelectionIndex(overflowIndex >= 0 ? overflowIndex : null);
    setSelectedProject(project);
    setIsLibraryOpen(false);
  };

  const openPreviousLibraryProject = () => {
    if (librarySelectionIndex === null || libraryProjects.length < 2) {
      return;
    }

    const nextIndex = (librarySelectionIndex - 1 + libraryProjects.length) % libraryProjects.length;
    setLibrarySelectionIndex(nextIndex);
    setSelectedProject(libraryProjects[nextIndex]);
  };

  const openNextLibraryProject = () => {
    if (librarySelectionIndex === null || libraryProjects.length < 2) {
      return;
    }

    const nextIndex = (librarySelectionIndex + 1) % libraryProjects.length;
    setLibrarySelectionIndex(nextIndex);
    setSelectedProject(libraryProjects[nextIndex]);
  };

  const closeModal = () => {
    setSelectedProject(null);
    setLibrarySelectionIndex(null);
  };

  const openProjectLibrary = () => {
    if (!hasProjects) {
      return;
    }

    setIsLibraryOpen(true);
  };

  return (
    <m.div
      {...reveal}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
    >
      <div className="flex flex-col items-center mb-16 relative">
        <h2 className="text-5xl md:text-6xl font-marker text-center relative">
          <ScribbleText color="text-highlighter-yellow">
            <DrawText text="My Work" fontUrl="/fonts/PermanentMarker.woff" />
          </ScribbleText>
        </h2>
        <Arrow className="absolute -right-12 -bottom-4 w-16 h-8 text-pencil/30 rotate-12" />
      </div>
      <div className="flex justify-center">
        {hasProjects && (
          <div className="w-full max-w-md">
            <Surface
              variant="elevated"
              onClick={openProjectLibrary}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProjectLibrary(); }
              }}
              tabIndex={0}
              role="button"
              aria-label="open project library"
              className={cn(
                'cursor-pointer p-4 pb-8 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-paper-hover',
                'relative group h-full focus:outline-none focus:ring-4 focus:ring-ink/20 border-dashed border-pencil/35 hover:border-highlighter-yellow/70'
              )}
            >
              <Surface variant="default" className="w-full aspect-video mb-4 border-pencil/25 overflow-hidden relative bg-[radial-gradient(circle_at_15%_20%,rgb(var(--color-highlighter-yellow-ch)/0.25),transparent_48%),radial-gradient(circle_at_85%_80%,rgb(var(--color-highlighter-blue-ch)/0.18),transparent_44%),rgb(var(--color-paper-ch)/0.82)]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative rounded-full border border-pencil/25 bg-paper/80 p-5 shadow-paper">
                    <Library className="h-12 w-12 text-ink/75 transition-transform duration-300 group-hover:scale-110" />
                    <Sparkles className="absolute -right-2 -top-2 h-4 w-4 text-highlighter-yellow" />
                  </div>
                </div>
              </Surface>

              <h3 className="text-2xl font-amatic font-bold text-ink mb-3 relative pb-2">
                Project Library
                <Underline className="absolute bottom-0 left-0 w-full h-2 text-pencil/30" />
              </h3>
              <div className="text-sm font-hand text-pencil/60 mb-2">
                {libraryProjects.length} projects in the archive
              </div>
              <p className="font-hand text-pencil mb-4 text-lg leading-tight">Browse everything I have built, shipped, and experimented with.</p>

              <div className="mt-auto inline-flex items-center gap-2 font-marker text-base text-ink/80 transition-colors group-hover:text-ink">
                Open Library <ArrowUpRight className="h-4 w-4" />
              </div>
            </Surface>
          </div>
        )}
      </div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isLibraryOpen && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-overlay"
              style={{ zIndex: Z_INDEX.modal }}
              onClick={() => setIsLibraryOpen(false)}
            >
              <m.div
                initial={{ scale: 0.92, y: 96, rotate: 1.5 }}
                animate={{ scale: 1, y: 0, rotate: 0 }}
                exit={{ scale: 0.92, y: 96, rotate: -1 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-6xl max-h-[92vh] overflow-hidden relative flex flex-col min-h-0"
              >
                <Surface variant="modal" className="h-full flex flex-col border-pencil/20 min-h-0">
                  <div className="p-6 md:p-8 pb-5 border-b border-dashed border-pencil/10 relative shrink-0">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 rotate-1 masking-tape z-20" />
                    <Button
                      variant="iconSoft"
                      size="icon"
                      onClick={() => setIsLibraryOpen(false)}
                      className="absolute top-4 right-4 z-50 h-10 w-10 hover:bg-highlighter-yellow/20"
                      aria-label="Close project library"
                    >
                      <X className="w-5 h-5 text-pencil" />
                    </Button>

                    <div className="flex flex-col items-center text-center">
                      <h2 className="text-4xl md:text-5xl font-marker text-ink">Project Library</h2>
                      <p className="font-hand text-lg text-pencil/65 mt-1 leading-tight">Deep cuts, side quests, and extra builds from the same notebook.</p>
                    </div>

                    <div className="mt-5 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto_auto] gap-3 items-center">
                      <label className="relative block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pencil/45" />
                        <input
                          value={libraryQuery}
                          onChange={(e) => setLibraryQuery(e.target.value)}
                          placeholder="Search title, tech, or description"
                          className="w-full rounded-lg border border-pencil/20 bg-paper/75 pl-9 pr-3 py-2 font-hand text-sm text-ink placeholder:text-pencil/45 focus:outline-none focus:ring-2 focus:ring-highlighter-yellow/55"
                        />
                      </label>

                      <div className="inline-flex rounded-lg border border-pencil/20 overflow-hidden bg-paper/65">
                        <Button
                          type="button"
                          variant={sortMode === 'recent' ? 'iconSoftActive' : 'ghost'}
                          size="sm"
                          onClick={() => setSortMode('recent')}
                          className="rounded-none px-3 font-hand text-xs"
                        >
                          Newest
                        </Button>
                        <Button
                          type="button"
                          variant={sortMode === 'alpha' ? 'iconSoftActive' : 'ghost'}
                          size="sm"
                          onClick={() => setSortMode('alpha')}
                          className="rounded-none px-3 font-hand text-xs"
                        >
                          A-Z
                        </Button>
                      </div>

                      <div className="font-hand text-xs text-pencil/60 text-right">
                        {visibleLibraryProjects.length} shown
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {[
                        ...libraryTechOptions.top,
                        ...(showAllTechFilters ? libraryTechOptions.rest : []),
                      ].map((tech) => (
                        <Button
                          key={tech}
                          type="button"
                          variant={activeTechFilter === tech ? 'iconSoftActive' : 'ghost'}
                          size="sm"
                          onClick={() => setActiveTechFilter(tech)}
                          className="h-7 rounded-full px-3 font-hand text-xs"
                        >
                          {tech}
                        </Button>
                      ))}

                      {libraryTechOptions.rest.length > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAllTechFilters((open) => !open)}
                          className="h-7 rounded-full px-3 font-hand text-xs text-pencil/70"
                          aria-expanded={showAllTechFilters}
                        >
                          {showAllTechFilters ? 'Show less' : `+${libraryTechOptions.rest.length} more`}
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-h-0 overflow-y-auto p-5 md:p-7 custom-scrollbar">
                    {visibleLibraryProjects.length === 0 ? (
                      <div className="h-full min-h-[260px] flex items-center justify-center">
                        <Surface variant="default" className="max-w-md text-center p-6 border-pencil/20 bg-paper/70">
                          <p className="font-marker text-2xl text-ink">No matches</p>
                          <p className="font-hand text-pencil/70 mt-2">Try a different filter or clear your search.</p>
                        </Surface>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {visibleLibraryProjects.map((project) => {
                          const recent = isRecentProject(project);
                          const status = getProjectStatus(project);

                          return (
                            <Surface key={project.id} variant="elevated" className="p-4 border-pencil/20 bg-paper/75 flex flex-col gap-3">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h3 className="font-marker text-2xl text-ink leading-tight">{project.title}</h3>
                                  <p className="font-hand text-xs text-pencil/65 mt-1">{project.startDate} - {project.endDate || 'present'}</p>
                                </div>
                                {recent && (
                                  <span className="rounded-full border border-highlighter-pink/40 bg-highlighter-pink/20 px-2 py-0.5 font-marker text-[10px] uppercase tracking-wide text-ink/80">New</span>
                                )}
                              </div>

                              <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-pencil/20 bg-paper/75 px-2 py-0.5">
                                <span className={cn('inline-block h-2 w-2 rounded-full', status.dot)} />
                                <span className="font-hand text-[11px] text-pencil/75">{status.label}</span>
                              </div>

                              <p className="font-hand text-sm text-ink/75 leading-relaxed line-clamp-3">{project.description}</p>

                              <div className="flex flex-wrap gap-1.5">
                                {project.technologies.map((tech) => (
                                  <span key={tech} className="rounded-sm border border-pencil/20 bg-paper/75 px-1.5 py-0.5 font-hand text-[10px] text-pencil/80">
                                    {tech}
                                  </span>
                                ))}
                              </div>

                              <div className="mt-auto pt-1 flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="paper"
                                  size="sm"
                                  onClick={() => openLibraryProject(project)}
                                  className="h-8 px-2.5 font-marker text-xs"
                                >
                                  Open
                                  <ArrowUpRight className="h-3.5 w-3.5" />
                                </Button>
                                {'githubUrl' in project && project.githubUrl && (
                                  <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-hand text-xs text-pencil/80 hover:text-ink transition-colors"
                                  >
                                    Source
                                  </a>
                                )}
                                {'liveUrl' in project && project.liveUrl && (
                                  <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-hand text-xs text-pencil/80 hover:text-ink transition-colors"
                                  >
                                    Live
                                  </a>
                                )}
                              </div>
                            </Surface>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </Surface>
              </m.div>
            </m.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <ProjectModal
        project={selectedProject}
        onClose={closeModal}
        showNavigation={librarySelectionIndex !== null && libraryProjects.length > 1}
        onPrevious={openPreviousLibraryProject}
        onNext={openNextLibraryProject}
        navigationLabel={librarySelectionIndex !== null ? `${librarySelectionIndex + 1} / ${libraryProjects.length}` : undefined}
      />
    </m.div>
  );
}
