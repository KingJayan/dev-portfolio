import { Command } from "cmdk";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { portfolioConfig } from "@/portfolio.config";
import {
    Search, Command as CommandIcon, FileCode, User, Home, Trophy,
    Smile, Mail, ArrowUpRight, Sun, Moon, BookOpen, Pencil, Copy,
    Shuffle, Share2, ArrowUp,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useDrawing } from "@/contexts/DrawingContext";
import { toast } from "@/hooks/use-toast";
import { MOTION_EASE, useMotionTiming } from "@/lib/motion";
import { cn } from "@/lib/utils";

// types

type QuickAction = {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onSelect: () => void;
};

type CommandEntry = {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    onSelect: () => void;
};

type CommandGroup = {
    heading: string;
    items: CommandEntry[];
};


export default function CommandMenu() {
    const MOTION_TIMING = useMotionTiming();
    const [open, setOpen] = useState(false);
    const { theme, toggleTheme, isZenMode, toggleZenMode } = useTheme();
    const { isDrawingMode, toggleDrawingMode } = useDrawing();

    const run = useCallback((fn: () => void) => { fn(); }, []);

    // keyboard trigger
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.repeat) return;
            const t = e.target as HTMLElement;
            const typing = t.tagName === "INPUT" || t.tagName === "TEXTAREA" ||
                t.tagName === "SELECT" || t.isContentEditable || t.getAttribute("role") === "textbox";
            if (!typing && e.shiftKey && e.key.toLowerCase() === "p") {
                e.preventDefault();
                setOpen(o => !o);
            }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    const scrollTo = useCallback((id: string) => run(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }), [run]);

    const copyEmail = useCallback(() => run(async () => {
        try {
            await navigator.clipboard.writeText(portfolioConfig.personal.email);
            toast({ description: "email copied" });
        } catch {
            toast({ description: "could not copy" });
        }
    }), [run]);

    const shareSite = useCallback(() => run(async () => {
        const url = portfolioConfig.personal.website;
        if (navigator.share) {
            await navigator.share({ title: portfolioConfig.personal.name, url }).catch(() => null);
        } else {
            await navigator.clipboard.writeText(url).catch(() => null);
            toast({ description: "link copied" });
        }
    }), [run]);

    const surpriseMe = useCallback(() => {
        const sections = ["home", "projects", "about", "achievements", "outside", "contact"];
        const id = sections[Math.floor(Math.random() * sections.length)];
        scrollTo(id);
    }, [scrollTo]);

    // quick actions

    const quickActions: QuickAction[] = [
        {
            icon: theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />,
            label: theme === "dark" ? "light" : "dark",
            onSelect: () => run(toggleTheme),
        },
        {
            icon: <BookOpen className="w-4 h-4" />,
            label: "zen",
            active: isZenMode,
            onSelect: () => run(toggleZenMode),
        },
        {
            icon: <Pencil className="w-4 h-4" />,
            label: "draw",
            active: isDrawingMode,
            onSelect: () => run(toggleDrawingMode),
        },
        {
            icon: <Copy className="w-4 h-4" />,
            label: "email",
            onSelect: copyEmail,
        },
        {
            icon: <Share2 className="w-4 h-4" />,
            label: "share",
            onSelect: shareSite,
        },
    ];

    // command groups

    const groups: CommandGroup[] = [
        {
            heading: "go",
            items: [
                { id: "home", label: "home", icon: <Home className="w-4 h-4" />, onSelect: () => scrollTo("home") },
                { id: "projects", label: "projects", icon: <FileCode className="w-4 h-4" />, onSelect: () => scrollTo("projects") },
                { id: "about", label: "about", icon: <User className="w-4 h-4" />, onSelect: () => scrollTo("about") },
                { id: "achievements", label: "extras", icon: <Trophy className="w-4 h-4" />, onSelect: () => scrollTo("achievements") },
                { id: "outside", label: "life", icon: <Smile className="w-4 h-4" />, onSelect: () => scrollTo("outside") },
                { id: "contact", label: "contact", icon: <Mail className="w-4 h-4" />, onSelect: () => scrollTo("contact") },
            ],
        },
        {
            heading: "work",
            items: portfolioConfig.projects.items.map(p => ({
                id: p.id,
                label: p.title,
                icon: <ArrowUpRight className="w-4 h-4 text-highlighter-pink" />,
                badge: p.technologies[0],
                onSelect: () => run(() => {
                    const url = (p as Record<string, unknown>)["liveUrl"] ?? (p as Record<string, unknown>)["githubUrl"];
                    if (url) window.open(url as string, "_blank");
                }),
            })),
        },
        {
            heading: "power",
            items: [
                { id: "surprise", label: "surprise me", icon: <Shuffle className="w-4 h-4" />, onSelect: surpriseMe },
                { id: "top", label: "scroll to top", icon: <ArrowUp className="w-4 h-4" />, onSelect: () => scrollTo("home") },
                { id: "share", label: "share this site", icon: <Share2 className="w-4 h-4" />, onSelect: shareSite },
            ],
        },
        {
            heading: "connect",
            items: [
                { id: "github", label: "github", icon: <ArrowUpRight className="w-4 h-4" />, onSelect: () => run(() => window.open(portfolioConfig.social.github, "_blank")) },
                { id: "linkedin", label: "linkedin", icon: <ArrowUpRight className="w-4 h-4" />, onSelect: () => run(() => window.open(portfolioConfig.social.linkedin, "_blank")) },
            ],
        },
    ];

    return (
        <>
                <Button
                    onClick={() => setOpen(true)}
                    variant="soft"
                    className="fixed bottom-8 left-8 z-50 hidden md:flex items-center gap-2 px-4 py-2 rounded-lg font-hand text-lg group"
                    asChild
                >
                    <motion.button
                        whileHover={{ y: -2, rotate: -0.2 }}
                        transition={{ duration: MOTION_TIMING.micro, ease: MOTION_EASE.standard }}
                    >
                        <CommandIcon className="w-4 h-4 text-pencil group-hover:text-highlighter-pink transition-colors" />
                        <span className="text-ink/80 group-hover:text-ink">menu</span>
                        <span className="ml-2 text-xs bg-black/5 px-2 py-0.5 rounded text-ink/50 font-sans">shift+p</span>
                    </motion.button>
                </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTitle className="sr-only">Command Menu</DialogTitle>
                <DialogContent className="p-0 overflow-hidden bg-transparent border-none shadow-none max-w-xl">
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: MOTION_TIMING.normal, ease: MOTION_EASE.smooth }}
                        className="relative w-full bg-paper/70 backdrop-blur-2xl border border-pencil/20 rounded-xl shadow-paper overflow-hidden [box-shadow:inset_0_1px_0_hsla(0,0%,100%,0.35),0_4px_16px_-4px_rgba(36,30,25,0.10)]"
                    >
                        {/* quick actions bar */}
                        <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-dashed border-pencil/15">
                            {quickActions.map((a) => (
                                <button
                                    key={a.label}
                                    onClick={a.onSelect}
                                    title={a.label}
                                    className={cn(
                                        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-hand transition-all duration-150",
                                        a.active ? "bg-ink/10 text-ink" : "text-ink/50 hover:text-ink hover:bg-ink/5"
                                    )}
                                >
                                    {a.icon}
                                    <span className="text-xs">{a.label}</span>
                                    {a.active !== undefined && (
                                        <span className={cn("w-1.5 h-1.5 rounded-full", a.active ? "bg-green-400" : "bg-ink/20")} />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* search + list */}
                        <Command className="w-full bg-transparent">
                            <div className="flex items-center border-b border-dashed border-pencil/15 px-3" cmdk-input-wrapper="">
                                <Search className="mr-2 h-4 w-4 shrink-0 opacity-40 text-ink" />
                                <Command.Input
                                    className="flex h-12 w-full bg-transparent py-3 text-xl outline-none placeholder:text-ink/30 font-hand text-ink"
                                    placeholder="type a command..."
                                    autoFocus
                                />
                            </div>

                            <Command.List className="max-h-[320px] overflow-y-auto overflow-x-hidden p-1.5">
                                <Command.Empty className="py-8 text-center text-ink/40 font-hand text-lg">
                                    nothing found.
                                </Command.Empty>

                                {groups.map((group, i) => (
                                    <div key={group.heading}>
                                        {i > 0 && <Command.Separator className="h-px bg-pencil/10 my-1" />}
                                        <Command.Group
                                            heading={group.heading}
                                            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:text-ink/35 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:font-sans"
                                        >
                                            {group.items.map((item) => (
                                                <Command.Item
                                                    key={item.id}
                                                    onSelect={item.onSelect}
                                                    className="relative flex cursor-default select-none items-center rounded-lg px-3 py-2.5 text-lg outline-none aria-selected:bg-ink/8 aria-selected:text-ink data-[disabled]:pointer-events-none data-[disabled]:opacity-50 font-hand hover:bg-ink/5 transition-colors duration-100 group"
                                                >
                                                    <span className="mr-2.5 text-ink/50 group-aria-selected:text-ink transition-colors">{item.icon}</span>
                                                    <span>{item.label}</span>
                                                    {item.badge && (
                                                        <span className="ml-auto text-xs text-ink/35 font-sans">{item.badge}</span>
                                                    )}
                                                </Command.Item>
                                            ))}
                                        </Command.Group>
                                    </div>
                                ))}
                            </Command.List>

                            {/* footer hint */}
                            <div className="flex items-center justify-between px-3 py-2 border-t border-dashed border-pencil/15 text-[10px] text-ink/30 font-sans">
                                <span>↑↓ navigate · enter select · esc close</span>
                                <span>shift+p</span>
                            </div>
                        </Command>
                    </motion.div>
                </DialogContent>
            </Dialog>
        </>
    );
}
