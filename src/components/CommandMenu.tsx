import { Command } from "cmdk";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { portfolioConfig } from "@/portfolio.config";
import { Search, Command as CommandIcon, FileCode, User, Home, Trophy, Smile, Mail, ArrowUpRight } from "lucide-react";

export default function CommandMenu() {
    const [open, setOpen] = useState(false);


    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "P" && e.shiftKey) {
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

    return (
        <>

            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-8 left-8 z-50 hidden md:flex items-center gap-2 px-4 py-2 bg-paper border-2 border-ink shadow-paper hover:-translate-y-1 hover:shadow-paper-hover transition-all rounded-lg font-hand text-lg group"
            >
                <CommandIcon className="w-4 h-4 text-pencil group-hover:text-highlighter-blue transition-colors" />
                <span className="text-ink/80 group-hover:text-ink">Menu</span>
                <span className="ml-2 text-xs bg-black/5 px-2 py-0.5 rounded text-ink/50 font-sans">Shift + P</span>
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTitle className="sr-only">Command Menu</DialogTitle>
                <DialogContent className="p-0 overflow-hidden bg-transparent border-none shadow-none max-w-2xl">
                    <div className="paper-card p-1 relative w-full bg-[#fdfbf7] border-2 border-ink rounded-xl shadow-2xl overflow-hidden">
                        <Command className="w-full bg-transparent">
                            <div className="flex items-center border-b-2 border-dashed border-pencil/20 px-3" cmdk-input-wrapper="">
                                <Search className="mr-2 h-5 w-5 shrink-0 opacity-50 text-ink" />
                                <Command.Input
                                    className="flex h-14 w-full rounded-md bg-transparent py-3 text-2xl outline-none placeholder:text-ink/30 font-hand text-ink"
                                    placeholder="Where to next?"
                                    autoFocus
                                />
                            </div>

                            <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
                                <Command.Empty className="py-6 text-center text-sm text-ink/50 font-hand text-xl">
                                    No results found. Try "Projects" or "About".
                                </Command.Empty>

                                <Command.Group heading="Navigation" className="px-2 py-2 text-xs font-bold text-ink/40 uppercase tracking-widest font-sans mb-1">
                                    <CommandItem onSelect={() => scrollToSection("home")}>
                                        <Home className="mr-2 h-4 w-4" />
                                        <span>Home</span>
                                    </CommandItem>
                                    <CommandItem onSelect={() => scrollToSection("projects")}>
                                        <FileCode className="mr-2 h-4 w-4" />
                                        <span>Projects</span>
                                    </CommandItem>
                                    <CommandItem onSelect={() => scrollToSection("about")}>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>About Me</span>
                                    </CommandItem>
                                    <CommandItem onSelect={() => scrollToSection("achievements")}>
                                        <Trophy className="mr-2 h-4 w-4" />
                                        <span>Achievements</span>
                                    </CommandItem>
                                    <CommandItem onSelect={() => scrollToSection("outside")}>
                                        <Smile className="mr-2 h-4 w-4" />
                                        <span>Life Outside Code</span>
                                    </CommandItem>
                                    <CommandItem onSelect={() => scrollToSection("contact")}>
                                        <Mail className="mr-2 h-4 w-4" />
                                        <span>Contact</span>
                                    </CommandItem>
                                </Command.Group>

                                <Command.Separator className="h-px bg-pencil/10 my-2" />

                                <Command.Group heading="Projects" className="px-2 py-2 text-xs font-bold text-ink/40 uppercase tracking-widest font-sans mb-1">
                                    {portfolioConfig.projects.items.map((project) => (
                                        <CommandItem
                                            key={project.id}
                                            onSelect={() => {
                                                const p = project as any;
                                                if (p.liveUrl) window.open(p.liveUrl, "_blank");
                                                else if (p.githubUrl) window.open(p.githubUrl, "_blank");
                                            }}
                                        >
                                            <ArrowUpRight className="mr-2 h-4 w-4 text-highlighter-blue" />
                                            <span>{project.title}</span>
                                            <span className="ml-auto text-xs text-ink/40 font-sans">{project.technologies[0]}</span>
                                        </CommandItem>
                                    ))}
                                </Command.Group>
                            </Command.List>
                        </Command>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

function CommandItem({ children, onSelect }: { children: React.ReactNode, onSelect: () => void }) {
    return (
        <Command.Item
            onSelect={onSelect}
            className="relative flex cursor-default select-none items-center rounded-lg px-3 py-3 text-xl outline-none aria-selected:bg-ink/5 aria-selected:text-ink data-[disabled]:pointer-events-none data-[disabled]:opacity-50 font-hand hover:bg-highlighter-yellow/20 transition-colors group"
        >
            {children}
        </Command.Item>
    );
}
