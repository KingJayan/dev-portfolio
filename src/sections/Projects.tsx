import { motion } from 'framer-motion';
import { useState } from "react";
import { portfolioConfig } from "@/portfolio.config";
import ProjectModal from "@/components/ProjectModal";
import { Project } from "@/lib/types";

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
        <h2 className="text-5xl md:text-6xl font-marker text-center relative inline-block">
          My Work
          <svg className="absolute -bottom-4 left-0 w-full h-8 text-highlighter-pink/50" viewBox="0 0 100 10" preserveAspectRatio="none">
            <path d="M0,5 Q50,10 100,5" fill="none" stroke="currentColor" strokeWidth="6" />
          </svg>
        </h2>

        {/* click me hint */}
        <motion.div
          initial={{ opacity: 0, x: 20, rotate: 5 }}
          whileInView={{ opacity: 1, x: 0, rotate: 2 }}
          animate={{ y: [0, -10, 0] }}
          transition={{
            opacity: { duration: 0.5 },
            y: { repeat: Infinity, duration: 3, ease: "easeInOut" }
          }}
          className="absolute -right-4 md:right-1/4 top-0 z-20 hidden sm:block"
        >
          <div className="bg-highlighter-yellow/80 backdrop-blur-sm p-4 shadow-paper border-l border-ink/10 rotate-2 relative">
            {/* pin head */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-highlighter-pink shadow-inner" />

            <p className="font-hand text-xl text-ink leading-tight text-center">
              Psst...<br />
              <span className="font-bold underline decoration-ink/30">Tap the cards</span><br />
              for more!
            </p>

            {/* arrow svg */}
            <svg className="absolute -bottom-10 -left-8 w-12 h-12 text-ink/40 -rotate-12" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M40,10 Q25,10 10,40" />
              <path d="M5,35 L10,40 L15,35" />
            </svg>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-wrap justify-center gap-12">
        {projectItems.map((project, index) => (
          <div
            key={project.id}
            className="w-full md:w-[calc(50%-24px)] lg:w-[calc(33.333%-32px)]"
          >
            <div
              onClick={() => setSelectedProject(project)}
              className={`
                cursor-pointer bg-paper p-4 pb-8 shadow-paper hover:shadow-paper-hover transition-all duration-300 transform hover:-translate-y-2 hover:rotate-1
                border border-ink relative group h-full
                ${index % 2 === 0 ? 'rotate-[-1deg]' : 'rotate-[1deg]'}
              `}
            >
              {/* tape logic */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 rotate-1 backdrop-blur-sm border-l border-r border-white/20 shadow-sm z-10" />

              <div className="w-full aspect-video bg-gray-100 dark:bg-gray-800 mb-4 border-2 border-pencil/20 overflow-hidden relative">
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

                {/* hover overlay */}
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
          </div>
        ))}
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </motion.div>
  );
}
