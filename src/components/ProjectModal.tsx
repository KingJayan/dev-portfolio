import { motion, AnimatePresence } from "framer-motion";
import { X, Github, ExternalLink } from "lucide-react";
import { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";

interface ProjectModalProps {
    project: Project | null;
    onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
    return createPortal(
        <AnimatePresence>
            {project && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, rotate: -2, y: 50 }}
                        animate={{ scale: 1, rotate: 0, y: 0 }}
                        exit={{ scale: 0.9, rotate: 2, y: 50 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-paper w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl relative border border-ink/15 paper-texture"
                    >

                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 rotate-1 masking-tape z-20" />


                        <Button
                            variant="iconSoft"
                            size="icon"
                            onClick={onClose}
                            className="absolute top-4 right-4 z-50 h-10 w-10 bg-highlighter-pink/20 hover:bg-highlighter-pink/40"
                        >
                            <X className="w-6 h-6 text-ink" />
                        </Button>

                        <div className="grid grid-cols-1 md:grid-cols-2">

                            <div className="p-8 bg-secondary/20 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-ink/10 relative">
                                <div className="relative w-full aspect-video bg-paper/60 border border-paper/80 shadow-lg rotate-1 transform hover:rotate-0 transition-transform duration-500 overflow-hidden">
                                    <img
                                        src={`/images/projects/preview-${project.id}.png`}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.parentElement!.style.backgroundColor = 'var(--color-paper)';
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                    <div className="absolute inset-0 hidden flex items-center justify-center text-pencil/60 font-marker text-2xl bg-paper text-center p-4">
                                        no preview image
                                    </div>
                                </div>
                                <div className="mt-8 flex gap-4">
                                    {project.githubUrl && (
                                        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-hand text-lg hover:text-highlighter-pink transition-colors">
                                            <Github className="w-5 h-5" /> source
                                        </a>
                                    )}
                                    {project.liveUrl && (
                                        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-hand text-lg hover:text-highlighter-yellow transition-colors">
                                            <ExternalLink className="w-5 h-5" /> live
                                        </a>
                                    )}
                                </div>
                            </div>


                            <div className="p-8 md:p-12 prose prose-zinc dark:prose-invert max-w-none">
                                <h2 className="font-marker text-4xl mb-2 text-ink">{project.title}</h2>
                                <p className="font-hand text-xl text-pencil mb-6">{project.startDate} - {project.endDate || "Present"}</p>

                                <div className="space-y-4 font-sans text-lg leading-relaxed">
                                    <p>{project.description}</p>
                                    <p>
                                        this project explores {project.category}.
                                        built with <strong className="text-highlighter-blue/80 px-1">{project.technologies.join(", ")}</strong>.
                                    </p>

                                    <h3 className="font-marker text-2xl mt-8">challenge</h3>
                                    <p>
                                        every project has tradeoffs. for {project.title}, the focus was smooth ux and solid performance.
                                    </p>
                                </div>

                                <div className="mt-8 pt-8 border-t border-dashed border-ink/10">
                                    <span className="font-hand text-sm text-pencil/60 uppercase tracking-widest">stack</span>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {project.technologies.map(tech => (
                                            <span key={tech} className="px-3 py-1 bg-paper border border-ink/20 rounded-full text-sm font-bold shadow-sm">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
