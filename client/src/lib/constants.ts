import { Project, Skill, SocialLink } from './types';

// Projects are now configured in portfolio.config.ts

export const skills: Skill[] = [
  { name: "React / Next.js", level: 90, color: "from-blue-400 to-blue-600" },
  { name: "Node.js / Express", level: 85, color: "from-green-400 to-green-600" },
  { name: "TypeScript", level: 80, color: "from-indigo-400 to-indigo-600" },
  { name: "Python / Django", level: 75, color: "from-yellow-400 to-yellow-600" },
  { name: "React Native", level: 70, color: "from-purple-400 to-purple-600" },
  { name: "PostgreSQL", level: 80, color: "from-cyan-400 to-cyan-600" }
];

export const socialLinks: SocialLink[] = [
  { platform: "GitHub", url: "https://github.com", icon: "github" },
  { platform: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
  { platform: "Twitter", url: "https://twitter.com", icon: "twitter" },
  { platform: "Email", url: "mailto:alex@alexmorgan.dev", icon: "mail" }
];

export const typingPhrases = [
  "Full Stack Developer",
  "React & Node.js Expert",
  "UI/UX Enthusiast",
  "Problem Solver",
  "Tech Innovator"
];
