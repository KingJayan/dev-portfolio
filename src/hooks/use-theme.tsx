import { createContext, useContext, useEffect, useState } from "react";
import { ThemeContextType } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isZenMode, setIsZenMode] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
    const savedZenMode = localStorage.getItem('zenMode') === 'true';
    if (savedZenMode) {
      setIsZenMode(savedZenMode);
      toast({
        title: "focus mode is on",
        description: "distractions stayed hidden from your last visit — toggle the focus icon in the nav to exit.",
      });
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isZenMode) {
      root.classList.add('zen-mode');
    } else {
      root.classList.remove('zen-mode');
    }
    localStorage.setItem('zenMode', String(isZenMode));
  }, [isZenMode]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleZenMode = () => {
    setIsZenMode((prev) => {
      const next = !prev;
      toast({
        title: next ? "focus mode on" : "focus mode off",
        description: next
          ? "distractions hidden and motion reduced — toggle the focus icon again to exit."
          : "back to the full experience.",
      });
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isZenMode, toggleZenMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
