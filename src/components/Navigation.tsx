import { useState, useEffect } from 'react';
import { throttle } from 'lodash';
import { Button } from '@/components/ui/button';
import { Menu, X, Sun, Moon, Pencil, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/hooks/use-theme";
import { useDrawing } from "@/contexts/DrawingContext";
import { useLocation } from "wouter";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const { theme, toggleTheme, isZenMode, toggleZenMode } = useTheme();
  const { isDrawingMode, toggleDrawingMode } = useDrawing();

  useEffect(() => {
    const handleScroll = throttle(() => {
      const sections = ["home", "projects", "github", "about", "achievements", "outside", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveSection(section);
        }
      }
    }, 100);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

      <nav className="hidden md:flex fixed top-8 right-0 z-[10000] flex-col items-end space-y-3">
        {navItems.map((item, index) => (
          <a key={item.name} href={item.href} onClick={(e) => handleScrollTo(e, item.href)}>
            <motion.div
              initial={{ x: 40 }}
              animate={{
                x: activeSection === item.href.substring(1) ? 0 : 20
              }}
              whileHover={{
                x: 0,
                transition: { type: "spring", stiffness: 200, damping: 30 }
              }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
              className={`
                w-56 px-5 py-2.5 bg-paper border-l-2 border-y-2 border-ink shadow-paper cursor-pointer
                font-marker text-xl transition-colors rounded-l-xl flex items-center
                ${activeSection === item.href.substring(1) ? 'bg-highlighter-yellow' : 'hover:bg-paper/80'}
              `}
            >
              <span className="w-7 text-center mr-2 opacity-50 text-sm font-sans">0{index + 1}</span>
              {item.name}
            </motion.div>
          </a>
        ))}

        <div className="flex gap-2 mr-4">

          <button
            onClick={toggleDrawingMode}
            className={`p-2 rounded-full border-2 border-ink transition-colors group ${isDrawingMode ? 'bg-highlighter-pink' : 'hover:bg-highlighter-yellow'}`}
            title={isDrawingMode ? "Stop Drawing" : "Free Draw Mode"}
            aria-label={isDrawingMode ? "Stop Drawing" : "Enter Free Draw Mode"}
          >
            <Pencil className={`w-5 h-5 ${isDrawingMode ? 'text-white' : 'text-ink'}`} />
          </button>


          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border-2 border-ink hover:bg-highlighter-yellow transition-colors group"
            title={theme === 'dark' ? "Switch to Paper" : "Switch to Blackboard"}
            aria-label={theme === 'dark' ? "Switch to Paper Mode" : "Switch to Blackboard Mode"}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-paper group-hover:text-ink" />
            ) : (
              <Moon className="w-5 h-5 text-ink" />
            )}
          </button>
          <button
            onClick={toggleZenMode}
            className={`p-2 rounded-full border-2 border-ink transition-colors group ${isZenMode ? 'bg-highlighter-blue' : 'hover:bg-highlighter-yellow'}`}
            title={isZenMode ? "Disable Read Mode" : "Enable Read Mode"}
            aria-label={isZenMode ? "Disable Read Mode" : "Enable Read Mode"}
          >
            <BookOpen className={`w-5 h-5 ${isZenMode ? 'text-white' : 'text-ink'}`} />
          </button>
        </div>
      </nav>


      <div className="md:hidden fixed top-4 right-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-paper border-2 border-ink shadow-paper hover:bg-muted"
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
            className="fixed inset-0 z-40 bg-paper/95 backdrop-blur-sm flex items-center justify-center md:hidden"
          >
            <div className="flex flex-col space-y-8 text-center">
              {navItems.map((item) => (
                <a key={item.name} href={item.href} onClick={(e) => handleScrollTo(e, item.href)}>
                  <span
                    className={`text-5xl font-marker cursor-pointer ${activeSection === item.href.substring(1) ? 'text-ink underline decoration-wavy decoration-highlighter-pink' : 'text-pencil'} hover:text-ink transition-colors`}
                  >
                    {item.name}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
