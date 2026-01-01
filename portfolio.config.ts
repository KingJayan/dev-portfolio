export const portfolioConfig = {
  personal: {
    name: "Jayan Patel",
    title: "Full Stack Developer",
    email: "jayanp0202@gmail.com",
    phone: "+1 (618) 737-2186",
    location: "Austin, TX",
    website: "https://jayanpatel.dev",
    avatar: "/api/placeholder/150/150",
  },

  contact: {
    // contact form submissions sent from:
    recipientEmail: "jayanp0202@gmail.com",
    //sender(mailjet):
    senderEmail: "jayanp0202@gmail.com",
    autoReply: {
      enabled: true,
      subject: "Thank you for your message!",
      message:
        "Hi! Thanks for reaching out. I'll get back to you as soon as possible, usually within 24 hours.",
    },
  },

  social: {
    github: "https://github.com/KingJayan",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    instagram: "",
    youtube: "",
    discord: "",
  },

  seo: {
    title: "Jayan Patel - Portfolio",
    description:
      "Full Stack Developer specializing in React, Node.js, and modern web technologies. I focus on writing clean code and building digital UX thats functional and engaging.",
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
      { name: "Python", level: 35, color: "from-cyan-400 to-cyan-600" },
    ],
    softSkills: [
      "Problem Solving",
      "Team Building",
      "UI Design",
      "Clean Development",
    ],
  },

  projects: {
    showFilter: true,
    categories: ["all", "web", "mobile", "api"],
    projectsPerPage: 6,
    showSourceCode: true,
    showLiveDemo: true,
    items: [
      {
        id: "portfolio-website",
        title: "Portfolio Website",
        description: "A modern full-stack portfolio built by Jayan Patel using React, TypeScript, and Express.js, featuring a sleek dark theme, interactive animations, and a working contact form.",
        fullDescription: "This portfolio website showcases my skills as a full-stack developer. Built with modern technologies including React 18, TypeScript, Express.js, and PostgreSQL. The site features a responsive design, dark theme with gradient accents, particle animations, and a fully functional contact form with email integration.",
        image: "/api/placeholder/600/400",
        gallery: ["/api/placeholder/600/400", "/api/placeholder/600/400"],
        technologies: ["React", "TypeScript", "Express.js", "PostgreSQL", "Tailwind CSS", "Framer Motion"],
        category: "web" as const,
        liveUrl: "https://jayanpatel.dev",
        githubUrl: "https://github.com/KingJayan/dev-portfolio",
        featured: true,
        status: "completed" as const,
        startDate: "2025-05",
        endDate: "2025-09",
        challenges: ["Implementing smooth animations without sacrificing performance", "Accessibility accross devices"],
        learnings: ["Advanced TypeScript patterns", "Modern React development with hooks", "Full-stack architecture", "Framer Motion introductory"],
      },
      {
        id: "task-management-app",
        title: "Task Management System",
        description: "A collaborative task management application with real-time updates, team collaboration features, and advanced filtering capabilities.",
        fullDescription: "A comprehensive task management system designed for teams to collaborate effectively. Features real-time updates using WebSockets, drag-and-drop task organization, team member assignment, due date tracking, and advanced filtering options.",
        image: "/api/placeholder/600/400",
        technologies: ["Next.js", "Socket.io", "Prisma", "Tailwind CSS", "PostgreSQL"],
        category: "web" as const,
        githubUrl: "https://github.com/KingJayan/task-manager",
        featured: true,
        status: "completed" as const,
        startDate: "2023-10",
        endDate: "2023-12",
        challenges: ["Implementing real-time synchronization across multiple users", "Designing an intuitive drag-and-drop interface"],
        learnings: ["WebSocket implementation", "Complex state management", "Database optimization for real-time applications"],
      },
      {
        id: "weather-app",
        title: "Weather Forecast App",
        description: "A beautiful weather application with detailed forecasts, interactive maps, and location-based alerts built with modern mobile technologies.",
        image: "/api/placeholder/600/400",
        technologies: ["React Native", "TypeScript", "Weather API", "Maps Integration"],
        category: "mobile" as const,
        liveUrl: "https://play.google.com/store/apps/details?id=com.weatherapp",
        githubUrl: "https://github.com/KingJayan/weather-app",
        featured: true,
        status: "completed" as const,
        startDate: "2023-08",
        endDate: "2023-09",
        challenges: ["Integrating multiple weather APIs for accurate data", "Creating smooth animations for weather transitions"],
        learnings: ["React Native development", "API integration patterns", "Mobile UX design principles"],
      },
      {
        id: "api-management-platform",
        title: "API Management Platform",
        description: "A comprehensive API management solution with authentication, rate limiting, analytics, and a developer portal for API documentation.",
        image: "/api/placeholder/600/400",
        technologies: ["Express.js", "Redis", "PostgreSQL", "Docker", "JWT"],
        category: "api" as const,
        githubUrl: "https://github.com/KingJayan/api-platform",
        featured: false,
        status: "completed" as const,
        startDate: "2023-06",
        endDate: "2023-07",
        challenges: ["Implementing scalable rate limiting", "Creating comprehensive API documentation"],
        learnings: ["Microservices architecture", "API security best practices", "Docker containerization"],
      }
    ]
  },

  animations: {
    enablePageTransitions: true,
    enableHoverEffects: true,
    enableScrollAnimations: true,
    animationDuration: 300,
    staggerDelay: 100,
  },

  footer: {
    showCopyright: true,
    showLinks: true,
    links: [
      { name: "Contact Me", href: "/contact" },
      { name: "Sitemap", href: "/sitemap" },
    ],
  },

  performance: {
    enableImageOptimization: true,
    enableLazyLoading: true,
    enablePreloading: true,
    enableCaching: true,
  },

  analytics: {
    googleAnalyticsId: "",
    enableTracking: false,
    enableHeatmaps: false,
  },

  development: {
    showDevBanner: true,
    enableDebugMode: false,
    enablePerformanceMonitoring: false,
  },
} as const;

export type PortfolioConfig = typeof portfolioConfig;
