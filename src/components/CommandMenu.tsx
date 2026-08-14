import { Command } from "cmdk";
import { useEffect, useState, useCallback } from "react";
import { m } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { portfolioConfig } from "@/portfolio.config";
import {
    Search, Command as CommandIcon, FileCode, User, Home, Trophy,
    Smile, Mail, ArrowUpRight, Sun, Moon, BookOpen, Pencil, Copy,
    Shuffle, Share2, ArrowUp, Terminal,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useDrawing } from "@/contexts/DrawingContext";
import { toast } from "@/hooks/use-toast";
import { MOTION_EASE, useMotionTiming } from "@/lib/motion";
import { Z_INDEX } from "@/lib/z-index";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

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
    const [, navigate] = useLocation();
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
            toast({ description: "Email copied" });
        } catch {
            toast({ description: "Could not copy" });
        }
    }), [run]);

    const shareSite = useCallback(() => run(async () => {
        const url = portfolioConfig.personal.website;
        if (navigator.share) {
            await navigator.share({ title: portfolioConfig.personal.name, url }).catch(() => null);
        } else {
            await navigator.clipboard.writeText(url).catch(() => null);
            toast({ description: "Link copied" });
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
            label: theme === "dark" ? "Light" : "Dark",
            onSelect: () => run(toggleTheme),
        },
        {
            icon: <BookOpen className="w-4 h-4" />,
            label: "Zen",
            active: isZenMode,
            onSelect: () => run(toggleZenMode),
        },
        {
            icon: <Pencil className="w-4 h-4" />,
            label: "Draw",
            active: isDrawingMode,
            onSelect: () => run(toggleDrawingMode),
        },
        {
            icon: <Copy className="w-4 h-4" />,
            label: "Email",
            onSelect: copyEmail,
        },
        {
            icon: <Share2 className="w-4 h-4" />,
            label: "Share",
            onSelect: shareSite,
        },
    ];

    // command groups

    const groups: CommandGroup[] = [
        {
            heading: "Go",
            items: [
                { id: "home", label: "Home", icon: <Home className="w-4 h-4" />, onSelect: () => scrollTo("home") },
                { id: "projects", label: "Projects", icon: <FileCode className="w-4 h-4" />, onSelect: () => scrollTo("projects") },
                { id: "about", label: "About", icon: <User className="w-4 h-4" />, onSelect: () => scrollTo("about") },
                { id: "achievements", label: "Extras", icon: <Trophy className="w-4 h-4" />, onSelect: () => scrollTo("achievements") },
                { id: "outside", label: "Life", icon: <Smile className="w-4 h-4" />, onSelect: () => scrollTo("outside") },
                { id: "contact", label: "Contact", icon: <Mail className="w-4 h-4" />, onSelect: () => scrollTo("contact") },
            ],
        },
        {
            heading: "Work",
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
            heading: "Power",
            items: [
                { id: "surprise", label: "Surprise Me", icon: <Shuffle className="w-4 h-4" />, onSelect: surpriseMe },
                { id: "top", label: "Scroll to Top", icon: <ArrowUp className="w-4 h-4" />, onSelect: () => scrollTo("home") },
                { id: "share", label: "Share This Site", icon: <Share2 className="w-4 h-4" />, onSelect: shareSite },
                { id: "terminal", label: "> Open Terminal", icon: <Terminal className="w-4 h-4" />, onSelect: () => { setOpen(false); navigate("/terminal"); } },
            ],
        },
        {
            heading: "Connect",
            items: [
                { id: "github", label: "GitHub", icon: <ArrowUpRight className="w-4 h-4" />, onSelect: () => run(() => window.open(portfolioConfig.social.github, "_blank")) },
                { id: "linkedin", label: "LinkedIn", icon: <ArrowUpRight className="w-4 h-4" />, onSelect: () => run(() => window.open(portfolioConfig.social.linkedin, "_blank")) },
            ],
        },
    ];

    return (
        <>
                <Button
                    onClick={() => setOpen(true)}
                    variant="soft"
                    className="fixed bottom-8 left-8 hidden md:flex items-center gap-2 px-4 py-2 rounded-lg font-hand text-lg group"
                    style={{ zIndex: Z_INDEX.floating }}
                    asChild
                >
                    <m.button
                        whileHover={{ y: -2, rotate: -0.2 }}
                        transition={{ duration: MOTION_TIMING.micro, ease: MOTION_EASE.standard }}
                    >
                        <CommandIcon className="w-4 h-4 text-pencil group-hover:text-highlighter-pink transition-colors" />
                        <span className="text-ink/80 group-hover:text-ink">Menu</span>
                        <span className="ml-2 text-xs bg-black/5 px-2 py-0.5 rounded text-ink/50 font-sans">shift+p</span>
                    </m.button>
                </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTitle className="sr-only">Command Menu</DialogTitle>
                <DialogContent className="p-0 overflow-hidden bg-transparent border-none shadow-none max-w-2xl w-full">
                    <m.div
                        initial={{ opacity: 0, y: 14, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: MOTION_TIMING.normal, ease: MOTION_EASE.smooth }}
                        className="glass-modal relative w-full rounded-2xl overflow-hidden shadow-glass-lg"
                    >
                        {/* top accent strip */}
                        <div className="h-[2px] w-full bg-gradient-to-r from-highlighter-pink/70 via-pencil/30 to-transparent" />

                        {/* quick actions bar */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-pencil/12">
                            {quickActions.map((a) => (
                                <button
                                    key={a.label}
                                    onClick={a.onSelect}
                                    title={a.label}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-hand transition-all duration-150 border",
                                        a.active
                                            ? "bg-ink/10 text-ink border-ink/18"
                                            : "text-ink/50 hover:text-ink hover:bg-ink/6 border-transparent hover:border-pencil/20"
                                    )}
                                >
                                    {a.icon}
                                    <span className="text-[13px]">{a.label}</span>
                                    {a.active !== undefined && (
                                        <span className={cn("w-1.5 h-1.5 rounded-full", a.active ? "bg-green-400" : "bg-ink/15")} />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* search + list */}
                        <Command className="w-full bg-transparent">
                            <div className="flex items-center px-5 border-b border-pencil/12" cmdk-input-wrapper="">
                                <Search className="mr-3 h-5 w-5 shrink-0 opacity-30 text-ink" />
                                <Command.Input
                                    className="flex h-16 w-full bg-transparent text-[22px] outline-none placeholder:text-ink/25 font-hand text-ink"
                                    placeholder="Type a command..."
                                    autoFocus
                                />
                            </div>

                            <Command.List className="max-h-[400px] overflow-y-auto overflow-x-hidden px-2 py-2">
                                <Command.Empty className="py-12 text-center text-ink/35 font-hand text-xl">
                                    Nothing found.
                                </Command.Empty>

                                {groups.map((group, i) => (
                                    <div key={group.heading}>
                                        {i > 0 && <Command.Separator className="h-px bg-pencil/10 my-1.5 mx-2" />}
                                        <Command.Group
                                            heading={group.heading}
                                            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pt-2.5 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:text-ink/40 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:font-sans"
                                        >
                                            {group.heading === "go" ? (
                                                <div className="grid grid-cols-3 gap-1 px-1 pb-1">
                                                    {group.items.map((item) => (
                                                        <Command.Item
                                                            key={item.id}
                                                            onSelect={item.onSelect}
                                                            className="cmd-item gap-2.5 aria-selected:bg-ink/8 aria-selected:text-ink group"
                                                        >
                                                            <span className="text-ink/45 group-aria-selected:text-ink transition-colors shrink-0">{item.icon}</span>
                                                            <span className="text-[15px]">{item.label}</span>
                                                        </Command.Item>
                                                    ))}
                                                </div>
                                            ) : (
                                                group.items.map((item) => (
                                                    <Command.Item
                                                        key={item.id}
                                                        onSelect={item.onSelect}
                                                        className="cmd-item relative aria-selected:bg-ink/8 aria-selected:text-ink data-[disabled]:pointer-events-none data-[disabled]:opacity-50 group"
                                                    >
                                                        <span className="mr-3 text-ink/45 group-aria-selected:text-ink transition-colors shrink-0">{item.icon}</span>
                                                        <span className="text-[15px]">{item.label}</span>
                                                        {item.badge && (
                                                            <span className="ml-auto text-[11px] text-ink/30 font-sans bg-ink/6 px-2 py-0.5 rounded-full">{item.badge}</span>
                                                        )}
                                                    </Command.Item>
                                                ))
                                            )}
                                        </Command.Group>
                                    </div>
                                ))}
                            </Command.List>

                            {/* footer */}
                            <div className="flex items-center justify-between px-4 py-2.5 border-t border-pencil/12 bg-ink/[0.018]">
                                <div className="flex items-center gap-3 text-[10px] text-ink/35 font-sans">
                                    {[["↑↓", "navigate"], ["↵", "select"], ["esc", "close"]].map(([key, label]) => (
                                        <span key={key} className="flex items-center gap-1.5">
                                            <kbd className="px-1.5 py-0.5 rounded-md bg-ink/8 text-[9px] font-sans">{key}</kbd>
                                            {label}
                                        </span>
                                    ))}
                                </div>
                                <span className="text-[10px] text-ink/25 font-sans tracking-wide">shift+p</span>
                            </div>
                        </Command>
                    </m.div>
                </DialogContent>
            </Dialog>
        </>
    );
}
