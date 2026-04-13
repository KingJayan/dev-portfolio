import type { Config } from "tailwindcss";
import { portfolioConfig } from "./src/portfolio.config";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        marker: [portfolioConfig.fonts.marker],
        hand: [portfolioConfig.fonts.hand],
        amatic: [portfolioConfig.fonts.amatic],
        sans: [portfolioConfig.fonts.hand], // Default to hand font
      },
      colors: {
        paper: "rgb(var(--color-paper-ch) / <alpha-value>)",
        ink: "rgb(var(--color-ink-ch) / <alpha-value>)",
        pencil: "rgb(var(--color-pencil-ch) / <alpha-value>)",
        "pencil-light": "rgb(var(--color-pencil-light-ch) / <alpha-value>)",
        highlighter: {
          yellow: "var(--color-highlight-yellow)",
          pink: "var(--color-highlight-pink)",
          blue: "var(--color-highlight-blue)",
        },
        /* accent palette — warm amber, dusty rose, sage, slate */
        amber: "rgb(var(--color-amber-ch) / <alpha-value>)",
        rose: "rgb(var(--color-rose-ch) / <alpha-value>)",
        sage: "rgb(var(--color-sage-ch) / <alpha-value>)",
        slate: "rgb(var(--color-slate-ch) / <alpha-value>)",
        border: "var(--color-ink)",
        input: "var(--color-paper)",
        ring: "var(--color-ink)",
        background: "var(--color-paper)",
        foreground: "var(--color-ink)",
        primary: {
          DEFAULT: "var(--color-ink)",
          foreground: "var(--color-paper)",
        },
        secondary: {
          DEFAULT: "var(--color-pencil-light)",
          foreground: "var(--color-paper)",
        },
        destructive: {
          DEFAULT: "hsl(0, 84.2%, 60.2%)",
          foreground: "hsl(0, 0%, 98%)",
        },
        muted: {
          DEFAULT: "var(--color-pencil-light)",
          foreground: "var(--color-pencil)",
        },
        accent: {
          DEFAULT: "var(--color-ink)",
          foreground: "var(--color-paper)",
        },
        popover: {
          DEFAULT: "var(--color-paper)",
          foreground: "var(--color-ink)",
        },
        card: {
          DEFAULT: "var(--color-paper)",
          foreground: "var(--color-ink)",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      backgroundImage: {
        "paper-pattern": "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        "paper":       "0 2px 20px -4px rgba(36, 30, 25, 0.10), 0 1px 4px -2px rgba(36, 30, 25, 0.06)",
        "paper-hover": "0 4px 28px -4px rgba(36, 30, 25, 0.15), 0 1px 6px -2px rgba(36, 30, 25, 0.08)",
      },
      animation: {
        "wiggle": "wiggle 1s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
