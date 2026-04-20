import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, ExternalLink } from "lucide-react";

const GitHubIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
);
import { type PortfolioConfig } from "@/portfolio.config";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";
import { Z_INDEX } from "@/lib/z-index";
import { MOTION_EASE, MOTION_TIMING, MOTION_SPRING } from "@/lib/motion";

type ProjectItem = PortfolioConfig["projects"]["items"][number];

interface ProjectModalProps {
    project: ProjectItem | null;
    onClose: () => void;
}

function hasUrl<K extends string>(obj: object, key: K): obj is Record<K, string> {
    return key in obj && typeof (obj as Record<string, unknown>)[key] === "string";
}

function PreviewImage({ project }: { project: ProjectItem }) {
    const [failed, setFailed] = useState(false);
    if (failed) return null;
    return (
        <div className="p-8 bg-secondary/20 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-ink/10">
            <div className="relative w-full aspect-video bg-paper/60 border border-paper/80 shadow-lg rotate-1 hover:rotate-0 transition-transform duration-500 overflow-hidden">
                <img
                    src={`/images/projects/preview-${project.id}.png`}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    onError={() => setFailed(true)}
                />
            </div>
        </div>
    );
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
    return createPortal(
        <AnimatePresence>
            {project && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: MOTION_TIMING.normal, ease: MOTION_EASE.smooth }}
                    onClick={onClose}
                    className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
                    style={{ zIndex: Z_INDEX.modal }}
                >
                    <motion.div
                        initial={{ scale: 0.94, rotate: -1, y: 28 }}
                        animate={{ scale: 1, rotate: 0, y: 0 }}
                        exit={{ scale: 0.96, rotate: 0.6, y: 24 }}
                        transition={{ type: "spring", ...MOTION_SPRING.subtle }}
                        onClick={(e) => e.stopPropagation()}
                        className="surface-modal backdrop-blur-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-paper-hover relative border border-pencil/20 [box-shadow:inset_0_1px_0_hsla(0,0%,100%,0.65),0_8px_40px_-4px_rgba(36,30,25,0.18)]"
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
                            <PreviewImage project={project} />

                            <div className="p-8 md:p-12 flex flex-col gap-6">
                                <div>
                                    <h2 className="font-marker text-4xl text-ink">{project.title}</h2>
                                    <p className="font-hand text-base text-pencil/60 mt-1">{project.startDate} — {project.endDate || "present"}</p>
                                </div>

                                <p className="font-hand text-lg text-ink/80 leading-relaxed">{project.description}</p>

                                <div className="pt-6 border-t border-dashed border-ink/10">
                                    <span className="font-hand text-sm text-pencil/60 uppercase tracking-widest">stack</span>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {project.technologies.map(tech => (
                                            <span key={tech} className="px-3 py-1 bg-paper border border-ink/20 rounded-full font-hand text-sm shadow-sm">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-auto">
                                    {hasUrl(project, "githubUrl") && project.githubUrl && (
                                        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-hand text-lg hover:text-highlighter-pink transition-colors">
                                            <GitHubIcon /> source
                                        </a>
                                    )}
                                    {hasUrl(project, "liveUrl") && project.liveUrl && (
                                        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-hand text-lg hover:text-highlighter-yellow transition-colors">
                                            <ExternalLink className="w-5 h-5" /> live
                                        </a>
                                    )}
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
