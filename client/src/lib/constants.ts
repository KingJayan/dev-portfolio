import { Project, Skill, SocialLink } from './types';

export const projects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A full-featured e-commerce platform with React, Node.js, and Stripe integration. Features include real-time inventory, admin dashboard, and mobile-responsive design.",
    image: "/api/placeholder/400/300",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    category: "web",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example",
    featured: true
  },
  {
    id: 2,
    title: "Fitness Tracker App",
    description: "A React Native fitness tracking app with workout logging, progress tracking, and social features. Includes offline support and health kit integration.",
    image: "/api/placeholder/400/300",
    technologies: ["React Native", "Firebase", "Redux", "HealthKit"],
    category: "mobile",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example",
    featured: true
  },
  {
    id: 3,
    title: "API Management Platform",
    description: "A comprehensive API management platform with authentication, rate limiting, analytics, and developer portal. Built with microservices architecture.",
    image: "/api/placeholder/400/300",
    technologies: ["Express.js", "Redis", "PostgreSQL", "Docker"],
    category: "api",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example",
    featured: true
  },
  {
    id: 4,
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates, team collaboration features, and advanced filtering. Built with modern web technologies.",
    image: "/api/placeholder/400/300",
    technologies: ["Next.js", "Socket.io", "Prisma", "Tailwind"],
    category: "web",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example"
  },
  {
    id: 5,
    title: "Social Media Dashboard",
    description: "A comprehensive social media analytics dashboard with real-time data visualization, content scheduling, and performance tracking across multiple platforms.",
    image: "/api/placeholder/400/300",
    technologies: ["Vue.js", "D3.js", "Laravel", "MySQL"],
    category: "web",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example"
  },
  {
    id: 6,
    title: "Weather Forecast App",
    description: "A beautiful weather app with detailed forecasts, radar maps, and location-based weather alerts. Features smooth animations and offline support.",
    image: "/api/placeholder/400/300",
    technologies: ["Flutter", "Dart", "OpenWeather", "SQLite"],
    category: "mobile",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example"
  }
];

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
