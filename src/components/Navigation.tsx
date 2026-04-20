import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Sun, Moon, Pencil, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from "@/hooks/use-theme";
import { useDrawing } from "@/contexts/DrawingContext";
import { useLocation } from "wouter";
import { Z_INDEX } from '@/lib/z-index';
import { MOTION_EASE, MOTION_SPRING, MOTION_TIMING } from '@/lib/motion';
import { cn } from '@/lib/utils';

// ── sub-components ────────────────────────────────────────────────────────────

function NavItem({ name, href, index, isActive, onClick }: {
  name: string; href: string; index: number; isActive: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  return (
    <a href={href} onClick={(e) => onClick(e, href)} className="block">
      <motion.div
        whileHover={{ y: -2.2, rotate: -0.24, scale: 1.008 }}
        transition={{ duration: 0.12, ease: MOTION_EASE.standard }}
        className={cn(
          'group relative min-h-[52px] px-4 py-2.5 rounded-2xl border flex items-center gap-2.5 overflow-hidden transition-all backdrop-blur-sm',
          isActive
            ? 'bg-paper/60 border-pencil/35 text-ink shadow-paper [box-shadow:inset_0_1px_0_hsla(0,0%,100%,0.6)]'
            : 'bg-paper/28 border-pencil/15 text-pencil hover:bg-paper/44 hover:border-pencil/28 hover:shadow-paper'
        )}
      >
        {/* hover shimmer + highlight (inactive only) */}
        {!isActive && <>
          <div className="absolute inset-y-1 left-9 right-3 rounded-md bg-highlighter-yellow/18 opacity-0 -rotate-[0.7deg] transition-opacity duration-100 group-hover:opacity-100" />
          <div className="absolute inset-y-1 -left-20 w-24 bg-paper/45 -skew-x-12 opacity-0 transition-all duration-150 group-hover:left-[calc(100%-2rem)] group-hover:opacity-100" />
        </>}
        {isActive && <div className="absolute inset-y-1 left-9 right-3 rounded-md bg-highlighter-yellow/22 -rotate-[0.7deg]" />}

        <span className="relative z-10 w-6 text-center text-[11px] tracking-wide opacity-45 font-sans">0{index + 1}</span>
        <span className="relative z-10 font-marker text-xl leading-none">{name}</span>

        {isActive && (
          <motion.span
            className="relative z-10 ml-auto h-1.5 w-1.5 rounded-full bg-highlighter-yellow"
            animate={{ scale: [1, 1.16, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: MOTION_EASE.smooth }}
          />
        )}
      </motion.div>
    </a>
  );
}

function NavTools({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme, isZenMode, toggleZenMode } = useTheme();
  const { isDrawingMode, toggleDrawingMode } = useDrawing();
  const btnCls = cn('h-9 w-9', !compact && 'border-[1.5px]');

  return (
    <div className={cn('pt-3 border-t border-dashed border-pencil/30', compact ? 'mt-4 border-pencil/25' : 'mt-4')}>
      <p className={cn('px-1 mb-2.5 text-[10px] uppercase font-sans text-pencil/60', compact ? 'tracking-[0.14em] mb-2 text-pencil/55' : 'tracking-[0.18em]')}>
        tools
      </p>
      <div className="flex items-center justify-center gap-2">
        <Button onClick={toggleDrawingMode} variant={isDrawingMode ? 'iconSoftActive' : 'iconSoft'}
          size="icon" className={btnCls} title={isDrawingMode ? 'stop draw' : 'draw'}
          aria-label={isDrawingMode ? 'stop draw mode' : 'enable draw mode'}>
          <Pencil className="w-4 h-4 text-ink" />
        </Button>

        <Button onClick={toggleTheme} variant="iconSoft" size="icon" className={btnCls}
          title={theme === 'dark' ? 'light' : 'dark'}
          aria-label={theme === 'dark' ? 'switch to light mode' : 'switch to dark mode'}>
          {theme === 'dark' ? <Sun className="w-4 h-4 text-ink" /> : <Moon className="w-4 h-4 text-ink" />}
        </Button>

        <Button onClick={toggleZenMode} variant={isZenMode ? 'iconSoftActive' : 'iconSoft'}
          size="icon" className={btnCls} title={isZenMode ? 'exit zen mode' : 'zen mode'}
          aria-label={isZenMode ? 'disable zen mode' : 'enable zen mode'}>
          <BookOpen className="w-4 h-4 text-ink" />
        </Button>
      </div>
    </div>
  );
}

// ── shell styles ──────────────────────────────────────────────────────────────
const PANEL_CLS = 'border border-pencil/20 bg-paper/48 backdrop-blur-2xl shadow-paper [box-shadow:inset_0_1px_0_hsla(0,0%,100%,0.55),0_4px_24px_-4px_rgba(36,30,25,0.12)]';

// ── main ──────────────────────────────────────────────────────────────────────
export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [, setLocation] = useLocation();
  const sectionIds = ['home', 'projects', 'github', 'about', 'achievements', 'outside', 'contact'];

  useEffect(() => {
    const observers = sectionIds.map((id) => {
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

  const navItems = [
    { name: 'home', href: '#home', id: 'home' },
    { name: 'projects', href: '#projects', id: 'projects' },
    { name: 'github', href: '#github', id: 'github' },
    { name: 'about', href: '#about', id: 'about' },
    { name: 'extras', href: '#achievements', id: 'achievements' },
    { name: 'life', href: '#outside', id: 'outside' },
    { name: 'contact', href: '#contact', id: 'contact' },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.substring(1);
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
    } else {
      // probably on 404 page — navigate home first
      setLocation('/');
      setTimeout(() => {
        const el2 = document.getElementById(id);
        if (el2) window.scrollTo({ top: el2.offsetTop, behavior: 'smooth' });
      }, 100);
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* ── desktop sidebar ── */}
      <nav className="hidden md:block fixed top-8 right-8" style={{ zIndex: Z_INDEX.nav }}>
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: MOTION_TIMING.normal, ease: MOTION_EASE.smooth }}
          className={cn('w-[272px] rounded-3xl px-4 py-4', PANEL_CLS)}
        >
          <div className="flex flex-col gap-3.5">
            {navItems.map((item, i) => (
              <NavItem key={item.id} {...item} index={i} isActive={activeSection === item.id} onClick={handleScrollTo} />
            ))}
          </div>
          <NavTools />
        </motion.div>
      </nav>

      {/* ── mobile hamburger ── */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Button variant="soft" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="h-11 w-11">
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* ── mobile overlay ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: MOTION_TIMING.normal, ease: MOTION_EASE.smooth }}
            className="fixed inset-0 z-40 bg-paper/60 backdrop-blur-2xl flex items-center justify-center md:hidden"
          >
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', ...MOTION_SPRING.subtle }}
              className={cn('w-full max-w-sm mx-5 p-4 rounded-2xl', PANEL_CLS, 'bg-paper/52')}
            >
              <div className="flex flex-col gap-2.5">
                {navItems.map((item, i) => (
                  <NavItem key={item.id} {...item} index={i} isActive={activeSection === item.id} onClick={handleScrollTo} />
                ))}
              </div>
              <NavTools compact />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
