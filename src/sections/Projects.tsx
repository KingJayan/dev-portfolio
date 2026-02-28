import { motion } from 'framer-motion';
import { useState } from "react";
import { portfolioConfig } from "@/portfolio.config";
import ProjectModal from "@/components/ProjectModal";
import { Project } from "@/lib/types";
import ScribbleText from '@/components/ScribbleText';

export default function Projects() {
  const { projects } = portfolioConfig;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projectItems = projects.items as unknown as Project[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
    >
      <div className="flex flex-col items-center mb-16 relative">
        <h2 className="text-5xl md:text-6xl font-marker text-center relative">
          <ScribbleText color="text-highlighter-pink">
            My Work
          </ScribbleText>
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-12">
        {projectItems.map((project, index) => (
          <div
            key={project.id}
            className="w-full md:w-[calc(50%-24px)] lg:w-[calc(33.333%-32px)]"
          >
            <div
              onClick={() => setSelectedProject(project)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedProject(project);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View details for ${project.title}`}
              className={`
                cursor-pointer bg-paper p-4 pb-8 shadow-paper transition-all duration-300 transform hover:-translate-y-1
                border border-ink relative group h-full focus:outline-none focus:ring-4 focus:ring-ink/20
              `}
            >

              <div className="w-full aspect-video bg-paper/60 mb-4 border-2 border-pencil/20 overflow-hidden relative">
                <img
                  src={`/images/projects/preview-${project.id}.png`}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/*overlay*/}
                <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-paper px-4 py-2 font-marker border border-ink transform -rotate-3 hover:scale-110 transition-transform">View Details</span>
                </div>
              </div>

              <h3 className="text-3xl font-amatic font-bold text-ink mb-1">{project.title}</h3>

              <div className="text-sm font-hand text-pencil/60 mb-2">
                {project.startDate} - {project.endDate || "Present"}
              </div>

              <p className="text-center font-hand text-pencil mb-4 text-lg leading-tight line-clamp-3">
                {project.description}
              </p>

              <div className="flex flex-wrap justify-center gap-2 mt-auto">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider rounded-sm border border-transparent hover:border-ink/20"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="text-xs font-hand pt-1">+{project.technologies.length - 3} more</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </motion.div>
  );
}
