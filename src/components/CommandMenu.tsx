import { Command } from "cmdk";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { portfolioConfig } from "@/portfolio.config";
import { Search, Command as CommandIcon, FileCode, User, Home, Trophy, Smile, Mail, ArrowUpRight, Sun, Moon, BookOpen, Pencil, Copy, Github, Linkedin } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useDrawing } from "@/contexts/DrawingContext";
import { toast } from "@/hooks/use-toast";
import { MOTION_EASE, MOTION_TIMING } from "@/lib/motion";

export default function CommandMenu() {
    const [open, setOpen] = useState(false);
    const { theme, toggleTheme, isZenMode, toggleZenMode } = useTheme();
    const { isDrawingMode, toggleDrawingMode } = useDrawing();


    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement | null;
            const isTypingTarget = !!target && (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.tagName === "SELECT" ||
                target.isContentEditable ||
                target.getAttribute("role") === "textbox"
            );

            if (isTypingTarget || e.repeat) return;

            if (e.shiftKey && e.key.toLowerCase() === "p") {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    const scrollToSection = (id: string) => {
        runCommand(() => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        });
    };

    const copyEmail = async () => {
        runCommand(async () => {
            try {
                await navigator.clipboard.writeText(portfolioConfig.personal.email);
                toast({ description: "email copied" });
            } catch {
                toast({ description: "could not copy email" });
            }
        });
    };

    return (
        <>

            <motion.div
                whileHover={{ y: -2, rotate: -0.2 }}
                transition={{ duration: MOTION_TIMING.micro, ease: MOTION_EASE.standard }}
            >
                <Button
                    onClick={() => setOpen(true)}
                    variant="soft"
                    className="fixed bottom-8 left-8 z-50 hidden md:flex items-center gap-2 px-4 py-2 rounded-lg font-hand text-lg group"
                >
                    <CommandIcon className="w-4 h-4 text-pencil group-hover:text-highlighter-pink transition-colors" />
                    <span className="text-ink/80 group-hover:text-ink">menu</span>
                    <span className="ml-2 text-xs bg-black/5 px-2 py-0.5 rounded text-ink/50 font-sans">shift + p</span>
                </Button>
            </motion.div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTitle className="sr-only">Command Menu</DialogTitle>
                <DialogContent className="p-0 overflow-hidden bg-transparent border-none shadow-none max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: MOTION_TIMING.normal, ease: MOTION_EASE.smooth }}
                        className="paper-card p-1 relative w-full bg-paper border border-ink/35 rounded-xl shadow-paper-hover overflow-hidden"
                    >
                        <Command className="w-full bg-transparent">
                            <div className="flex items-center border-b border-dashed border-pencil/20 px-3" cmdk-input-wrapper="">
                                <Search className="mr-2 h-5 w-5 shrink-0 opacity-50 text-ink" />
                                <Command.Input
                                    className="flex h-14 w-full rounded-md bg-transparent py-3 text-2xl outline-none placeholder:text-ink/30 font-hand text-ink"
                                    placeholder="go to..."
                                    autoFocus
                                />
                            </div>

                            <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
                                <Command.Empty className="py-6 text-center text-sm text-ink/50 font-hand text-xl">
                                    nothing here. try "projects" or "about".
                                </Command.Empty>

                                <Command.Group heading="go" className="px-2 py-2 text-xs font-bold text-ink/40 uppercase tracking-widest font-sans mb-1">
                                    <CommandItem onSelect={() => scrollToSection("home")}>
                                        <Home className="mr-2 h-4 w-4" />
                                        <span>home</span>
                                    </CommandItem>
                                    <CommandItem onSelect={() => scrollToSection("projects")}>
                                        <FileCode className="mr-2 h-4 w-4" />
                                        <span>projects</span>
                                    </CommandItem>
                                    <CommandItem onSelect={() => scrollToSection("about")}>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>about</span>
                                    </CommandItem>
                                    <CommandItem onSelect={() => scrollToSection("achievements")}>
                                        <Trophy className="mr-2 h-4 w-4" />
                                        <span>extras</span>
                                    </CommandItem>
                                    <CommandItem onSelect={() => scrollToSection("outside")}>
                                        <Smile className="mr-2 h-4 w-4" />
                                        <span>life</span>
                                    </CommandItem>
                                    <CommandItem onSelect={() => scrollToSection("contact")}>
                                        <Mail className="mr-2 h-4 w-4" />
                                        <span>contact</span>
                                    </CommandItem>
                                </Command.Group>

                                <Command.Separator className="h-px bg-pencil/10 my-2" />

                                <Command.Group heading="work" className="px-2 py-2 text-xs font-bold text-ink/40 uppercase tracking-widest font-sans mb-1">
                                    {portfolioConfig.projects.items.map((project) => (
                                        <CommandItem
                                            key={project.id}
                                            onSelect={() => {
                                                if ('liveUrl' in project && project.liveUrl) {
                                                    window.open(project.liveUrl, "_blank");
                                                } else if ('githubUrl' in project && project.githubUrl) {
                                                    window.open(project.githubUrl, "_blank");
                                                }
                                            }}
                                        >
                                            <ArrowUpRight className="mr-2 h-4 w-4 text-highlighter-pink" />
                                            <span>{project.title}</span>
                                            <span className="ml-auto text-xs text-ink/40 font-sans">{project.technologies[0]}</span>
                                        </CommandItem>
                                    ))}
                                </Command.Group>

                                <Command.Separator className="h-px bg-pencil/10 my-2" />

                                <Command.Group heading="tools" className="px-2 py-2 text-xs font-bold text-ink/40 uppercase tracking-widest font-sans mb-1">
                                    <CommandItem onSelect={() => runCommand(toggleTheme)}>
                                        {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                                        <span>{theme === "dark" ? "switch to light" : "switch to dark"}</span>
                                    </CommandItem>
                                    <CommandItem onSelect={() => runCommand(toggleZenMode)}>
                                        <BookOpen className="mr-2 h-4 w-4" />
                                        <span>{isZenMode ? "disable zen mode" : "enable zen mode"}</span>
                                        <span className="ml-auto text-xs text-ink/40 font-sans">{isZenMode ? "on" : "off"}</span>
                                    </CommandItem>
                                    <CommandItem onSelect={() => runCommand(toggleDrawingMode)}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        <span>{isDrawingMode ? "disable draw mode" : "enable draw mode"}</span>
                                        <span className="ml-auto text-xs text-ink/40 font-sans">{isDrawingMode ? "on" : "off"}</span>
                                    </CommandItem>
                                    <CommandItem onSelect={copyEmail}>
                                        <Copy className="mr-2 h-4 w-4" />
                                        <span>copy email</span>
                                    </CommandItem>
                                    <CommandItem onSelect={() => runCommand(() => window.open(portfolioConfig.social.github, "_blank"))}>
                                        <Github className="mr-2 h-4 w-4" />
                                        <span>open github</span>
                                    </CommandItem>
                                    <CommandItem onSelect={() => runCommand(() => window.open(portfolioConfig.social.linkedin, "_blank"))}>
                                        <Linkedin className="mr-2 h-4 w-4" />
                                        <span>open linkedin</span>
                                    </CommandItem>
                                </Command.Group>
                            </Command.List>
                        </Command>
                    </motion.div>
                </DialogContent>
            </Dialog>
        </>
    );
}

function CommandItem({ children, onSelect }: { children: React.ReactNode, onSelect: () => void }) {
    return (
        <Command.Item
            onSelect={onSelect}
            className="relative flex cursor-default select-none items-center rounded-lg px-3 py-3 text-xl outline-none aria-selected:bg-ink/5 aria-selected:text-ink data-[disabled]:pointer-events-none data-[disabled]:opacity-50 font-hand hover:bg-highlighter-yellow/20 transition-all duration-200 group"
        >
            {children}
        </Command.Item>
    );
}
