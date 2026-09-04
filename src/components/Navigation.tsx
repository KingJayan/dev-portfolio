import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Sun, Moon, Pencil, BookOpen, Home, FolderOpen, GitBranch, User, Trophy, Coffee, Mail } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { useTheme } from "@/hooks/use-theme";
import { useDrawing } from "@/contexts/DrawingContext";
import { useLocation } from "wouter";
import { Z_INDEX } from '@/lib/z-index';
import { MOTION_EASE, useMotionTiming } from '@/lib/motion';
import { cn } from '@/lib/utils';

const COLLAPSE_THRESHOLD = 1024;

const SECTION_ICONS = {
  home: Home,
  projects: FolderOpen,
  github: GitBranch,
  about: User,
  achievements: Trophy,
  outside: Coffee,
  contact: Mail,
} as const;

const NAV_ITEMS = [
  { name: 'Home', href: '#home', id: 'home' },
  { name: 'Projects', href: '#projects', id: 'projects' },
  { name: 'GitHub', href: '#github', id: 'github' },
  { name: 'About', href: '#about', id: 'about' },
  { name: 'Extras', href: '#achievements', id: 'achievements' },
  // { name: 'Life', href: '#outside', id: 'outside' }, // temporarily disabled with the outside/Life section
  { name: 'Contact', href: '#contact', id: 'contact' },
] as const;

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.048, delayChildren: 0.04 } },
  exit: { opacity: 0, transition: { staggerChildren: 0.025, staggerDirection: -1 } },
};

const rowVariants = {
  hidden: { opacity: 0, x: 16, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.18, ease: MOTION_EASE.smooth } },
  exit: { opacity: 0, x: 10, scale: 0.97, transition: { duration: 0.1 } },
};

const dotVariants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.16, ease: MOTION_EASE.smooth } },
  exit: { opacity: 0, scale: 0.6, transition: { duration: 0.1 } },
};

function NavItem({ name, href, id, isActive, onClick }: {
  name: string; href: string; id: string; isActive: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  const Icon = SECTION_ICONS[id as keyof typeof SECTION_ICONS];
  return (
    <m.div variants={rowVariants}>
      <a href={href} onClick={(e) => onClick(e, href)} className="block">
        <m.div
          whileHover={{ y: -2.2, rotate: -0.24, scale: 1.008 }}
          transition={{ duration: 0.12, ease: MOTION_EASE.standard }}
          className={cn(
            'group relative min-h-[52px] px-4 py-2.5 rounded-2xl border flex items-center gap-2.5 overflow-hidden transition-all backdrop-blur-sm',
            isActive
              ? 'bg-paper/60 border-pencil/35 text-ink shadow-paper shadow-rim'
              : 'bg-paper/28 border-pencil/15 text-pencil hover:bg-paper/44 hover:border-pencil/28 hover:shadow-paper'
          )}
        >
          {!isActive && <>
            <div className="absolute inset-y-1 left-9 right-3 rounded-md bg-highlighter-yellow/18 opacity-0 -rotate-[0.7deg] transition-opacity duration-100 group-hover:opacity-100" />
            <div className="absolute inset-y-1 -left-20 w-24 bg-paper/45 -skew-x-12 opacity-0 transition-all duration-150 group-hover:left-[calc(100%-2rem)] group-hover:opacity-100" />
          </>}
          {isActive && <div className="absolute inset-y-1 left-9 right-3 rounded-md bg-highlighter-yellow/22 -rotate-[0.7deg]" />}

          {Icon && <Icon className="relative z-10 w-4 h-4 shrink-0 opacity-55" />}
          <span className="relative z-10 font-marker text-xl leading-none">{name}</span>

          {isActive && (
            <m.span
              className="relative z-10 ml-auto h-1.5 w-1.5 rounded-full bg-highlighter-yellow"
              animate={{ scale: [1, 1.16, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: MOTION_EASE.smooth }}
            />
          )}
        </m.div>
      </a>
    </m.div>
  );
}

function useNavTools() {
  const { theme, toggleTheme, isZenMode, toggleZenMode } = useTheme();
  const { isDrawingMode, toggleDrawingMode } = useDrawing();

  return [
    { id: 'draw',  icon: Pencil,                        onClick: toggleDrawingMode, active: isDrawingMode, label: 'draw',                             verboseLabel: isDrawingMode ? 'stop draw' : 'draw' },
    { id: 'theme', icon: theme === 'dark' ? Sun : Moon, onClick: toggleTheme,       active: false,         label: theme === 'dark' ? 'light' : 'dark', verboseLabel: theme === 'dark' ? 'light mode' : 'dark mode' },
    { id: 'focus', icon: BookOpen,                      onClick: toggleZenMode,     active: isZenMode,     label: 'focus',                            verboseLabel: isZenMode ? 'exit focus' : 'focus mode' },
  ];
}

const TOOL_TILTS = ['-rotate-[3deg]', 'rotate-[2deg]', '-rotate-[2deg]'];
const TOOL_RADIUS = '60% 40% 55% 45% / 45% 55% 40% 60%';

function NavTools({ compact = false }: { compact?: boolean }) {
  const tools = useNavTools();
  const btnCls = cn('h-9 w-9', !compact && 'border-[1.5px]');

  return (
    <div className={cn('pt-3 border-t border-dashed border-pencil/30', compact ? 'mt-4 border-pencil/25' : 'mt-4')}>
      <p className={cn('px-1 mb-2.5 text-[10px] uppercase font-sans text-pencil/60', compact ? 'tracking-[0.14em] mb-2 text-pencil/55' : 'tracking-[0.18em]')}>
        Tools
      </p>
      <div className="flex items-center justify-center gap-3">
        {tools.map(({ id, icon: Icon, onClick, active, label }, idx) => (
          <div key={id} className="relative flex flex-col items-center gap-1">
            <Button onClick={onClick} variant={active ? 'iconSoftActive' : 'iconSoft'}
              size="icon" className={cn(btnCls, TOOL_TILTS[idx % TOOL_TILTS.length], 'hover:rotate-0 transition-transform')}
              style={{ borderRadius: TOOL_RADIUS }}
              title={label} aria-label={label}>
              <Icon className="w-4 h-4 text-ink" />
            </Button>
            {!compact && (
              <span className="text-[9px] font-sans text-pencil/50 leading-none">{label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const PANEL_CLS = 'glass-panel shadow-glass-sm';

export default function Navigation() {
  const MOTION_TIMING = useMotionTiming();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const userExpandedRef = useRef(false);
  const [, setLocation] = useLocation();

  const handleToggle = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      userExpandedRef.current = !next;
      return next;
    });
  }, []);

  useEffect(() => {
    const check = () => {
      const tooNarrow = window.innerWidth < COLLAPSE_THRESHOLD;
      if (tooNarrow) {
        userExpandedRef.current = false;
        setIsCollapsed(true);
      } else if (!userExpandedRef.current) {
        setIsCollapsed(false);
      }
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const observers = SECTION_IDS.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry?.isIntersecting) setActiveSection(id); },
        { rootMargin: '-25% 0px -60% 0px', threshold: 0 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.substring(1);
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
    } else {
      setLocation('/');
      setTimeout(() => {
        const el2 = document.getElementById(id);
        if (el2) window.scrollTo({ top: el2.offsetTop, behavior: 'smooth' });
      }, 100);
    }
    setIsMenuOpen(false);
  };

  const navTools = useNavTools();

  return (
    <>
      <nav className="hidden md:flex items-start fixed top-8 right-8" style={{ zIndex: Z_INDEX.nav }}>
        <m.div
          layout
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            layout: { type: 'spring', stiffness: 400, damping: 32 },
            opacity: { duration: MOTION_TIMING.normal, ease: MOTION_EASE.smooth },
            x: { duration: MOTION_TIMING.normal, ease: MOTION_EASE.smooth },
          }}
          className={cn('rounded-3xl overflow-hidden', PANEL_CLS, isCollapsed ? 'px-2 py-3' : 'w-[272px] px-4 py-4')}
        >
          <AnimatePresence initial={false} mode="wait">
            {isCollapsed ? (
              <m.div
                key="collapsed"
                variants={listVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col items-center gap-2"
              >
                <m.div variants={dotVariants}>
                  <button
                    onClick={handleToggle}
                    aria-label="expand navigation"
                    title="expand"
                    className="icon-btn hover:bg-paper/40"
                  >
                    <span className="text-[9px] font-sans text-pencil/30 tracking-[0.18em] uppercase leading-none">nav</span>
                  </button>
                </m.div>

                <m.div variants={dotVariants} className="w-4 border-t border-dashed border-pencil/20" />

                {NAV_ITEMS.map((item) => {
                  const Icon = SECTION_ICONS[item.id as keyof typeof SECTION_ICONS];
                  return (
                    <m.div key={item.id} variants={dotVariants}>
                      <a
                        href={item.href}
                        onClick={(e) => handleScrollTo(e, item.href)}
                        title={item.name}
                        aria-label={item.name}
                        className={cn('icon-btn', activeSection === item.id ? 'bg-paper/60' : 'hover:bg-paper/40')}
                      >
                        {Icon && <Icon className={cn(
                          'w-4 h-4 transition-colors',
                          activeSection === item.id ? 'text-highlighter-yellow' : 'text-pencil/30'
                        )} />}
                      </a>
                    </m.div>
                  );
                })}

                <m.div variants={dotVariants} className="w-4 border-t border-dashed border-pencil/20" />

                {navTools.map(({ id, icon: Icon, onClick, active, verboseLabel }) => (
                  <m.div key={id} variants={dotVariants}>
                    <button
                      onClick={onClick}
                      title={verboseLabel}
                      aria-label={verboseLabel}
                      className={cn('icon-btn', active ? 'bg-paper/60' : 'hover:bg-paper/40')}
                    >
                      <Icon className={cn('w-4 h-4 transition-colors', active ? 'text-highlighter-yellow' : 'text-pencil/30')} />
                    </button>
                  </m.div>
                ))}
              </m.div>
            ) : (
              <m.div
                key="expanded"
                variants={listVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <m.div variants={rowVariants} className="flex items-center justify-between mb-3.5">
                  <span className="px-1 text-[10px] uppercase font-sans text-pencil/50 tracking-[0.18em]">Nav</span>
                  <button
                    onClick={handleToggle}
                    aria-label="collapse navigation"
                    className="icon-btn-sm hover:bg-paper/60 text-pencil/40 hover:text-pencil/70 text-[10px] font-sans"
                    title="collapse"
                  >
                    &#x2715;
                  </button>
                </m.div>
                <div className="flex flex-col gap-3.5">
                  {NAV_ITEMS.map((item) => (
                    <NavItem key={item.id} {...item} isActive={activeSection === item.id} onClick={handleScrollTo} />
                  ))}
                </div>
                <NavTools />
              </m.div>
            )}
          </AnimatePresence>
        </m.div>
      </nav>

      <div className="md:hidden fixed top-4 right-4" style={{ zIndex: Z_INDEX.nav }}>
        <Button variant="soft" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="h-11 w-11">
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <m.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: MOTION_TIMING.normal, ease: MOTION_EASE.smooth }}
            className="fixed inset-0 glass-nav border-none flex items-center justify-center md:hidden"
            style={{ zIndex: Z_INDEX.floating }}
          >
            <m.div
              initial={{ y: 16, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 10, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18, ease: MOTION_EASE.standard }}
              className={cn('w-full max-w-sm mx-5 p-4 rounded-2xl', PANEL_CLS, 'bg-paper/52')}
            >
              <div className="flex flex-col gap-2.5">
                {NAV_ITEMS.map((item) => (
                  <NavItem key={item.id} {...item} isActive={activeSection === item.id} onClick={handleScrollTo} />
                ))}
              </div>
              <NavTools compact />
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
