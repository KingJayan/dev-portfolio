import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Sun, Moon, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/hooks/use-theme";
import { useDrawing } from "@/contexts/DrawingContext";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { isDrawingMode, toggleDrawingMode } = useDrawing();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "projects", "about", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: t.nav.home, href: "#home", id: "home" },
    { name: t.nav.projects, href: "#projects", id: "projects" },
    { name: t.nav.about, href: "#about", id: "about" },
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
    }
  };

  return (
    <>
      {/* Desktop Bookmark Nav - STICKY */}
      <nav className="hidden md:flex fixed top-8 right-0 z-[10000] flex-col items-end space-y-4">
        {navItems.map((item, index) => (
          <a key={item.name} href={item.href} onClick={(e) => handleScrollTo(e, item.href)}>
            <motion.div
              initial={{ x: 20 }}
              animate={{ x: activeSection === item.href.substring(1) ? -10 : 10 }}
              whileHover={{ x: -15, transition: { type: "spring", stiffness: 300 } }}
              className={`
                px-8 py-3 bg-paper border-l-2 border-y-2 border-ink shadow-sm cursor-pointer
                font-marker text-xl transition-colors rounded-l-md
                ${activeSection === item.href.substring(1) ? 'bg-highlighter-yellow shadow-md' : 'hover:bg-muted'}
              `}
              style={{
                transformOrigin: "right center",
              }}
            >
              {item.name}
            </motion.div>
          </a>
        ))}

        <div className="flex gap-2 mr-4">
          {/* Drawing Mode Toggle */}
          <button
            onClick={toggleDrawingMode}
            className={`p-2 rounded-full border-2 border-ink transition-colors group ${isDrawingMode ? 'bg-highlighter-pink' : 'hover:bg-highlighter-yellow'}`}
            title={isDrawingMode ? "Stop Drawing" : "Free Draw Mode"}
          >
            <Pencil className={`w-5 h-5 ${isDrawingMode ? 'text-white' : 'text-ink'}`} />
          </button>

          {/* dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border-2 border-ink hover:bg-highlighter-yellow transition-colors group"
            title={theme === 'dark' ? "Switch to Paper" : "Switch to Blackboard"}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-paper group-hover:text-ink" />
            ) : (
              <Moon className="w-5 h-5 text-ink" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Toggle */}
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

      {/* Mobile Menu Overlay */}
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
