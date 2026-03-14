import { createContext, useContext, useEffect, useState } from "react";
import { ThemeContextType } from "@/lib/types";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [isTerminalMode, setIsTerminalMode] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
    const savedZenMode = localStorage.getItem('zenMode') === 'true';
    if (savedZenMode) {
      setIsZenMode(savedZenMode);
    }
    const savedTerminalMode = localStorage.getItem('terminalMode') === 'true';
    if (savedTerminalMode) {
      setIsTerminalMode(savedTerminalMode);
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

  useEffect(() => {
    const root = window.document.documentElement;
    if (isTerminalMode) {
      root.classList.add('terminal-mode');
    } else {
      root.classList.remove('terminal-mode');
    }
    localStorage.setItem('terminalMode', String(isTerminalMode));
  }, [isTerminalMode]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleZenMode = () => {
    setIsZenMode((prev) => !prev);
  };

  const toggleTerminalMode = () => {
    setIsTerminalMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isZenMode, toggleZenMode, isTerminalMode, toggleTerminalMode }}>
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
