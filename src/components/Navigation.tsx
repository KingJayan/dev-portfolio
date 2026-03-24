import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Sun, Moon, Pencil, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/hooks/use-theme";
import { useDrawing } from "@/contexts/DrawingContext";
import { useLocation } from "wouter";
import { Z_INDEX } from '@/lib/z-index';
import { MOTION_EASE, MOTION_SPRING, MOTION_TIMING } from '@/lib/motion';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const { theme, toggleTheme, isZenMode, toggleZenMode } = useTheme();
  const { isDrawingMode, toggleDrawingMode } = useDrawing();
  const sectionIds = ["home", "projects", "github", "about", "achievements", "outside", "contact"];

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry?.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          root: null,
          rootMargin: "-25% 0px -60% 0px",
          threshold: 0,
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const navItems = [
    { name: t.nav.home, href: "#home", id: "home" },
    { name: t.nav.projects, href: "#projects", id: "projects" },
    { name: t.nav.github, href: "#github", id: "github" },
    { name: t.nav.about, href: "#about", id: "about" },
    { name: t.nav.achievements, href: "#achievements", id: "achievements" },
    { name: t.nav.life, href: "#outside", id: "outside" },
    { name: t.nav.contact, href: "#contact", id: "contact" },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);

    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: "smooth",
      });
      setIsMenuOpen(false);
    } else {
      // prolly on 404
      setLocation("/");
      // browser handles scroll
      setTimeout(() => {
        const newElement = document.getElementById(targetId);
        if (newElement) {
          window.scrollTo({
            top: newElement.offsetTop,
            behavior: "smooth",
          });
        }
      }, 100);
      setIsMenuOpen(false);
    }
  };

  return (
    <>

      <nav className="hidden md:block fixed top-8 right-8" style={{ zIndex: Z_INDEX.nav }}>
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: MOTION_TIMING.normal, ease: MOTION_EASE.smooth }}
          className="w-[272px] rounded-3xl border-2 border-pencil/34 bg-paper/88 paper-texture backdrop-blur-sm px-4 py-4 shadow-paper"
        >
          <div className="flex flex-col gap-3.5">
            {navItems.map((item, index) => {
              const isActive = activeSection === item.id;
              return (
                <a key={item.name} href={item.href} onClick={(e) => handleScrollTo(e, item.href)} className="block">
                  <motion.div
                    whileHover={{ y: -2.2, rotate: -0.24, scale: 1.008 }}
                    transition={{ duration: 0.12, ease: MOTION_EASE.standard }}
                    className={`group relative min-h-[52px] px-4 py-2.5 rounded-2xl border-[1.5px] flex items-center gap-2.5 overflow-hidden transition-all ${
                      isActive
                        ? "bg-paper border-ink/40 text-ink shadow-paper"
                        : "bg-paper/72 border-pencil/40 text-pencil hover:bg-paper hover:border-pencil/55 hover:shadow-paper"
                    }`}
                  >
                    {!isActive && (
                      <>
                        <div className="absolute inset-y-1 left-9 right-3 rounded-md bg-highlighter-yellow/18 opacity-0 -rotate-[0.7deg] transition-opacity duration-100 group-hover:opacity-100" />
                        <div className="absolute inset-y-1 -left-20 w-24 bg-paper/45 -skew-x-12 opacity-0 transition-all duration-150 group-hover:left-[calc(100%-2rem)] group-hover:opacity-100" />
                      </>
                    )}
                    {isActive && <div className="absolute inset-y-1 left-9 right-3 rounded-md bg-highlighter-yellow/22 -rotate-[0.7deg]" />}
                    <span className="relative z-10 w-6 text-center text-[11px] tracking-wide opacity-45 font-sans">0{index + 1}</span>
                    <span className="relative z-10 font-marker text-xl leading-none">{item.name}</span>
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
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-dashed border-pencil/30">
            <p className="px-1 mb-2.5 text-[10px] uppercase tracking-[0.18em] text-pencil/60 font-sans">tools</p>
            <div className="flex items-center justify-center gap-2">
              <Button
                onClick={toggleDrawingMode}
                variant={isDrawingMode ? "iconSoftActive" : "iconSoft"}
                size="icon"
                className="h-9 w-9 border-[1.5px]"
                title={isDrawingMode ? "stop draw" : "draw"}
                aria-label={isDrawingMode ? "stop draw mode" : "enable draw mode"}
              >
                <Pencil className="w-4 h-4 text-ink" />
              </Button>

              <Button
                onClick={toggleTheme}
                variant="iconSoft"
                size="icon"
                className="h-9 w-9 border-[1.5px]"
                title={theme === 'dark' ? "light" : "dark"}
                aria-label={theme === 'dark' ? "switch to light mode" : "switch to dark mode"}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-ink" />
                ) : (
                  <Moon className="w-4 h-4 text-ink" />
                )}
              </Button>

              <Button
                onClick={toggleZenMode}
                variant={isZenMode ? "iconSoftActive" : "iconSoft"}
                size="icon"
                className="h-9 w-9 border-[1.5px]"
                title={isZenMode ? "exit zen mode" : "zen mode"}
                aria-label={isZenMode ? "disable zen mode" : "enable zen mode"}
              >
                <BookOpen className="w-4 h-4 text-ink" />
              </Button>
            </div>
          </div>
        </motion.div>
      </nav>


      <div className="md:hidden fixed top-4 right-4 z-50">
        <Button
          variant="soft"
          size="icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="h-11 w-11"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>


      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: MOTION_TIMING.normal, ease: MOTION_EASE.smooth }}
            className="fixed inset-0 z-40 bg-paper/96 backdrop-blur-md flex items-center justify-center md:hidden"
          >
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", ...MOTION_SPRING.subtle }}
              className="w-full max-w-sm mx-5 p-4 rounded-2xl border-2 border-pencil/30 bg-paper paper-texture shadow-paper"
            >
              <div className="flex flex-col gap-2.5">
                {navItems.map((item, index) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a key={item.name} href={item.href} onClick={(e) => handleScrollTo(e, item.href)} className="block">
                      <div className={`
                        relative w-full px-4 py-3 rounded-xl border flex items-center gap-2 overflow-hidden
                        ${isActive
                          ? 'bg-paper border-ink/35 text-ink shadow-paper'
                          : 'bg-paper/80 border-pencil/30 text-pencil'}
                      `}>
                        {isActive && <div className="absolute inset-y-1 left-9 right-3 rounded-md bg-highlighter-yellow/22 -rotate-[0.6deg]" />}
                        <span className="relative z-10 text-xs opacity-40 font-sans w-6 text-center">0{index + 1}</span>
                        <span className="relative z-10 font-marker text-2xl leading-none">{item.name}</span>
                      </div>
                    </a>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-dashed border-pencil/25">
                <p className="px-1 mb-2 text-[10px] uppercase tracking-[0.14em] text-pencil/55 font-sans">tools</p>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    onClick={toggleDrawingMode}
                    variant={isDrawingMode ? "iconSoftActive" : "iconSoft"}
                    size="icon"
                    className="h-9 w-9"
                    title={isDrawingMode ? "stop draw" : "draw"}
                    aria-label={isDrawingMode ? "stop draw mode" : "enable draw mode"}
                  >
                    <Pencil className="w-4 h-4 text-ink" />
                  </Button>

                  <Button
                    onClick={toggleTheme}
                    variant="iconSoft"
                    size="icon"
                    className="h-9 w-9"
                    title={theme === 'dark' ? "light" : "dark"}
                    aria-label={theme === 'dark' ? "switch to light mode" : "switch to dark mode"}
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-4 h-4 text-ink" />
                    ) : (
                      <Moon className="w-4 h-4 text-ink" />
                    )}
                  </Button>

                  <Button
                    onClick={toggleZenMode}
                    variant={isZenMode ? "iconSoftActive" : "iconSoft"}
                    size="icon"
                    className="h-9 w-9"
                    title={isZenMode ? "exit zen mode" : "zen mode"}
                    aria-label={isZenMode ? "disable zen mode" : "enable zen mode"}
                  >
                    <BookOpen className="w-4 h-4 text-ink" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
