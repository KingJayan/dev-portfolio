/**
 * Portfolio Configuration
 *
 * This file contains all the customizable settings for your portfolio website.
 * You can modify these values to personalize your portfolio without touching the code.
 */

export const portfolioConfig = {
  // Personal Information
  personal: {
    name: "Jayan Patel",
    title: "Full Stack Developer",
    email: "jayanp0202@gmail.com",
    phone: "+1 (618) 737-2186",
    location: "Austin, TX",
    website: "https://jayanpatel.dev",
    avatar: "/api/placeholder/150/150",
  },

  // Contact Settings
  contact: {
    // Email where contact form submissions will be sent
    recipientEmail: "jayanp0202@gmail.com",
    // Email that appears as the sender (must be verified in Mailjet)
    senderEmail: "jayanp0202@gmail.com",
    // Auto-reply settings
    autoReply: {
      enabled: true,
      subject: "Thank you for your message!",
      message:
        "Hi there! Thanks for reaching out. I'll get back to you as soon as possible, usually within 24 hours.",
    },
  },

  // Social Media Links
  social: {
    github: "https://github.com/KingJayan",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    instagram: "",
    youtube: "",
    discord: "",
  },

  // SEO Settings
  seo: {
    title: "Jayan Patel - Portfolio",
    description:
      "Full Stack Developer specializing in React, Node.js, and modern web technologies. Creating exceptional digital experiences with clean code and innovative solutions.",
    keywords: [
      "Full Stack Developer",
      "React",
      "Node.js",
      "Web Development",
      "JavaScript",
      "TypeScript",
    ],
    ogImage: "/api/placeholder/1200/630",
  },

  // Theme Settings
  theme: {
    defaultTheme: "dark", // "light" | "dark" | "system"
    colors: {
      primary: {
        light: "#3b82f6",
        dark: "#60a5fa",
      },
      secondary: {
        light: "#8b5cf6",
        dark: "#a78bfa",
      },
      accent: {
        light: "#06b6d4",
        dark: "#22d3ee",
      },
    },
  },

  // Typing Animation Settings
  typing: {
    phrases: [
      "Full Stack Developer",
      "HTML & JS Expert",
      "Student",
      "Problem Solver",
      "Tech Innovator",
    ],
    typingSpeed: 100,
    deletingSpeed: 50,
    delayBetweenPhrases: 2000,
  },

  // Navigation Settings
  navigation: {
    showLogo: true,
    showThemeToggle: true,
    stickyHeader: true,
    items: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Projects", href: "/projects" },
      { name: "Contact", href: "/contact" },
    ],
  },

  // About Page Settings
  about: {
    yearsOfExperience: 5,
    projectsCompleted: 10,
    skills: [
      { name: "HTML/CSS/JS", level: 90, color: "from-blue-400 to-blue-600" },
      { name: "SQL", level: 65, color: "from-green-400 to-green-600" },
      { name: "TypeScript", level: 60, color: "from-indigo-400 to-indigo-600" },
      { name: "R", level: 45, color: "from-yellow-400 to-yellow-600" },
      {
        name: "React Native",
        level: 70,
        color: "from-purple-400 to-purple-600",
      },
      { name: "Python", level: 80, color: "from-cyan-400 to-cyan-600" },
    ],
    softSkills: [
      "Problem Solving",
      "Team Building",
      "UI Design",
      "Clean Development",
    ],
  },

  // Projects Settings
  projects: {
    showFilter: true,
    categories: ["all", "web", "mobile", "api"],
    projectsPerPage: 6,
    showSourceCode: true,
    showLiveDemo: true,
  },

  // Animation Settings
  animations: {
    enablePageTransitions: true,
    enableHoverEffects: true,
    enableScrollAnimations: true,
    animationDuration: 300,
    staggerDelay: 100,
  },

  // Footer Settings
  footer: {
    showCopyright: true,
    showLinks: true,
    links: [
      { name: "Contact Me", href: "/contact" },
      { name: "Sitemap", href: "/sitemap" },
    ],
  },

  // Performance Settings
  performance: {
    enableImageOptimization: true,
    enableLazyLoading: true,
    enablePreloading: true,
    enableCaching: true,
  },

  // Analytics Settings (optional)
  analytics: {
    googleAnalyticsId: "",
    enableTracking: false,
    enableHeatmaps: false,
  },

  // Development Settings
  development: {
    showDevBanner: true,
    enableDebugMode: false,
    enablePerformanceMonitoring: false,
  },
} as const;

export type PortfolioConfig = typeof portfolioConfig;
