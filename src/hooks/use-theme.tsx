import { createContext, useContext, useEffect, useState } from "react";
import { ThemeContextType } from "@/lib/types";

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
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleZenMode = () => {
    setIsZenMode(!isZenMode);
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
