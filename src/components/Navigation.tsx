import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Sun, Moon, Pencil, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/hooks/use-theme";
import { useDrawing } from "@/contexts/DrawingContext";
import { useLocation } from "wouter";
import { Z_INDEX } from '@/lib/z-index';

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

      <nav className="hidden md:flex fixed top-8 right-6 flex-col items-end space-y-2" style={{ zIndex: Z_INDEX.nav }}>
        {navItems.map((item, index) => (
          <a key={item.name} href={item.href} onClick={(e) => handleScrollTo(e, item.href)}>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18, delay: index * 0.02 }}
              className={`
                relative w-52 px-4 py-2.5 bg-paper/80 border border-ink/20 backdrop-blur-sm cursor-pointer
                font-marker text-lg transition-all rounded-xl flex items-center
                ${activeSection === item.href.substring(1)
                  ? 'text-ink border-ink/35 bg-paper shadow-paper'
                  : 'text-pencil hover:text-ink hover:bg-paper hover:border-ink/30 hover:shadow-sm'}
              `}
            >
              {activeSection === item.href.substring(1) && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-highlighter-yellow" />
              )}
              <span className="w-7 text-center mr-2 opacity-40 text-xs font-sans">0{index + 1}</span>
              {item.name}
            </motion.div>
          </a>
        ))}

        <div className="flex gap-2 mt-2 mr-2">

          <Button
            onClick={toggleDrawingMode}
            variant={isDrawingMode ? "iconSoftActive" : "iconSoft"}
            size="icon"
            className="h-10 w-10"
            title={isDrawingMode ? "stop draw" : "draw"}
            aria-label={isDrawingMode ? "stop draw mode" : "enable draw mode"}
          >
            <Pencil className="w-5 h-5 text-ink" />
          </Button>


          <Button
            onClick={toggleTheme}
            variant="iconSoft"
            size="icon"
            className="h-10 w-10"
            title={theme === 'dark' ? "light" : "dark"}
            aria-label={theme === 'dark' ? "switch to light mode" : "switch to dark mode"}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-ink" />
            ) : (
              <Moon className="w-5 h-5 text-ink" />
            )}
          </Button>
          <Button
            onClick={toggleZenMode}
            variant={isZenMode ? "iconSoftActive" : "iconSoft"}
            size="icon"
            className="h-10 w-10"
            title={isZenMode ? "exit zen mode" : "zen mode"}
            aria-label={isZenMode ? "disable zen mode" : "enable zen mode"}
          >
            <BookOpen className="w-5 h-5 text-ink" />
          </Button>
        </div>
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
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-40 bg-paper/96 backdrop-blur-md flex items-center justify-center md:hidden"
          >
            <div className="w-full max-w-sm px-5 flex flex-col gap-3">
              {navItems.map((item, index) => (
                <a key={item.name} href={item.href} onClick={(e) => handleScrollTo(e, item.href)}>
                  <div className={`
                    w-full px-4 py-3 rounded-xl border font-marker text-2xl flex items-center gap-3
                    ${activeSection === item.href.substring(1)
                      ? 'bg-paper border-ink/40 text-ink shadow-paper'
                      : 'bg-paper/75 border-ink/20 text-pencil'}
                  `}>
                    <span className="text-xs opacity-40 font-sans">0{index + 1}</span>
                    <span>{item.name}</span>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
