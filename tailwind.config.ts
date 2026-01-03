import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        marker: ['"Permanent Marker"', "cursive"],
        hand: ['"Patrick Hand"', "cursive"],
        amatic: ['"Amatic SC"', "cursive"],
        sans: ['"Patrick Hand"', "cursive"], // Default to hand font
      },
      colors: {
        paper: "var(--color-paper)",
        ink: "var(--color-ink)",
        pencil: "var(--color-pencil)",
        "pencil-light": "var(--color-pencil-light)",
        highlighter: {
          yellow: "var(--color-highlight-yellow)",
          pink: "var(--color-highlight-pink)",
          blue: "var(--color-highlight-blue)",
        },
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
        "paper": "4px 4px 0px 0px rgba(0,0,0,1)",
        "paper-hover": "6px 6px 0px 0px rgba(0,0,0,1)",
      },
      animation: {
        "wiggle": "wiggle 1s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
