import { motion } from 'framer-motion';
import { useState } from "react";
import { portfolioConfig } from "@/portfolio.config";
import { Github, ExternalLink } from "lucide-react";
import ProjectModal from "@/components/ProjectModal";
import { Project } from "@/lib/types";

export default function Projects() {
  const { projects } = portfolioConfig;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Cast the partial items to Project type for this demo, 
  // in proper app we'd strict type the config
  const projectItems = projects.items as unknown as Project[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-5xl md:text-6xl font-marker text-center mb-16 relative inline-block left-1/2 -translate-x-1/2">
        My Work
        {/* underline doodle */}
        <svg className="absolute -bottom-4 left-0 w-full h-8 text-highlighter-pink/50" viewBox="0 0 100 10" preserveAspectRatio="none">
          <path d="M0,5 Q50,10 100,5" fill="none" stroke="currentColor" strokeWidth="6" />
        </svg>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {projectItems.map((project, index) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className={`
              cursor-pointer bg-paper p-4 pb-8 shadow-paper hover:shadow-paper-hover transition-all duration-300 transform hover:-translate-y-2 hover:rotate-1
              border border-ink
              ${index % 2 === 0 ? 'rotate-[-1deg]' : 'rotate-[1deg]'}
            `}
          >
            {/* tape logic */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 rotate-1 backdrop-blur-sm border-l border-r border-white/20 shadow-sm" />

            <div className="w-full aspect-video bg-gray-100 dark:bg-gray-800 mb-4 border-2 border-pencil/20 overflow-hidden relative group">
              <img
                src={`/images/projects/preview-${project.id}.png`}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="absolute inset-0 hidden flex items-center justify-center text-pencil/40 font-hand text-xl bg-gray-100 dark:bg-gray-800 text-center p-4">
                Add preview-{project.id}.png to public/images/projects
              </div>

              <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-paper px-4 py-2 font-marker border border-ink transform -rotate-3 hover:scale-110 transition-transform">View Details</span>
              </div>
            </div>

            <h3 className="text-3xl font-amatic font-bold text-ink dark:text-gray-100 mb-1">{project.title}</h3>

            <div className="text-sm font-hand text-pencil/60 dark:text-gray-400 mb-2">
              {project.startDate} - {project.endDate || "Present"}
            </div>

            <p className="text-center font-hand text-pencil dark:text-gray-300 mb-4 text-lg leading-tight line-clamp-3">
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
        ))}
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
