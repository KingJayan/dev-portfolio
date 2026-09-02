export const portfolioConfig = {
  personal: {
    name: "Jayan Patel",
    title: "Full Stack Developer",
    email: "jayanp0202@gmail.com",
    phone: "+1 (618) 737-2186",
    location: "Austin, TX",
    website: "https://jayanpatel.dev",
    avatar: "/images/profile.png",
  },

  contact: {
    recipientEmail: "jayanp0202@gmail.com",
    senderEmail: "jayanp0202@gmail.com",
    autoReply: {
      enabled: true,
      subject: "Thank you for your message!",
      message:
        "Thanks for reaching out — I'll get back to you as soon as possible, usually within 48 hours.",
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
      "Full Stack Developer building expressive, high-performance web experiences with React, TypeScript, and Node.js.",
    keywords: [
      "Full Stack Developer",
      "React",
      "Node.js",
      "Web Development",
      "JavaScript",
      "TypeScript",
    ],
    ogImage: "/images/og-image.png",
  },

  fonts: {
    marker: '"Permanent Marker", cursive',
    hand: '"Patrick Hand", sans-serif',
    amatic: '"Caveat", cursive',
  },

  hero: {
    tagline: "Building interfaces that feel alive.",
    status: "Open to Work",
  },

  navigation: {
    showLogo: true,
    items: [
      { name: "Home", href: "#home" },
      { name: "Projects", href: "#projects" },
      { name: "About", href: "#about" },
      { name: "Extras", href: "#achievements" },
      { name: "Life", href: "#outside" },
      { name: "Contact", href: "#contact" },
    ],
  },

  about: {
    bio: [
      "I like shipping things that are playful on the surface and disciplined under the hood.",
      "Most of my work lives at the intersection of interaction design, frontend engineering, and product thinking.",
      "Based in Austin, I enjoy collaborating with people who care about craft and clear outcomes."
    ],
    skills: [
      { name: "HTML/CSS/JS", level: 95, color: "from-blue-400 to-blue-600" },
      { name: "React & TS", level: 80, color: "from-indigo-400 to-indigo-600" },
      { name: "UX/UI Design", level: 65, color: "from-orange-400 to-orange-600" },
      { name: "PostgreSQL", level: 60, color: "from-orange-400 to-orange-600" },
      { name: "Java", level: 45, color: "from-green-400 to-green-600" },
      { name: "R", level: 40, color: "from-black-400 to-black-600" },
      { name: "Python", level: 35, color: "from-red-400 to-red-600" },
    ],
    tools: [
      { name: "GitHub", icon: "github" },
      { name: "Git", icon: "git" },
      { name: "npm", icon: "npm" },
      { name: "Vercel", icon: "vercel" },
      { name: "Firebase", icon: "firebase" },
      { name: "WordPress", icon: "wordpress" },
      { name: "Replit", icon: "replit" },
      { name: "VS Code", icon: "vscode" },
      { name: "Framer Motion", icon: "framer-motion" },
      { name: "Tailwind", icon: "tailwind" },
    ],
  },

  achievements: [
    {
      category: "Robotics",
      icon: "trophy",
      items: [
        {
          title: "VEX Robotics",
          organization: "VEX Robotics Team 70709X",
          date: "2023-2025",
          description: "Two-time Texas Region 4 champion; earned the Create Award in our division at VEX Worlds.",
          icon: "trophy"
        },
        {
          title: "FTC Robotics",
          organization: "WWHS FTC Team #18886 AtlAtl",
          date: "2025-2026",
          description: "Competitor, lead software developer, presenter, and driver in FiT-Central GEMS League meets.",
          icon: "award"
        }
      ]
    },
    {
      category: "Debate",
      icon: "comments",
      items: [
        {
          title: "LD Novice Debate",
          organization: "WWHS LD Novice Debate",
          date: "2025-2026",
          description: "LD competitor focused on argument structure, refutation, and clean delivery.",
          icon: "comments"
        }
      ]
    },
    {
      category: "Choir",
      icon: "music",
      items: [
        {
          title: "WWHS Choir",
          organization: "WWHS Choir",
          date: "2024-2026",
          description: "",
          icon: "music"
        },
        {
          title: "TMEA",
          organization: "Texas Music Educators Association",
          date: "2024-2025",
          description: "Selected for TMEA All-Region Choir and advanced as a regional qualifier.",
          icon: "music"
        },
        {
          title: "UIL Concert & Soloist",
          organization: "University Interscholastic League",
          date: "2024-2025",
          description: "First Division ratings in UIL Concert & Sightreading plus Solo & Ensemble performances.",
          icon: "music"
        }
      ]
    },
    {
      category: "Piano",
      icon: "piano",
      items: [
        {
          title: "Trinity College London",
          organization: "Trinity College London",
          date: "2019-2023",
          description: "Earned Distinction three times across graded exams.",
        },
        {
          title: "Texas Federation of Music Clubs (All-State Festival)",
          organization: "Texas Federation of Music Clubs",
          date: "2023",
          description: "Received an Outstanding rating at the All-State Festival.",
        },
        {
          title: "National Federation of Music Clubs (Festival)",
          organization: "National Federation of Music Clubs",
          date: "2017-2023",
          description: "Awarded Superior ratings across four festival cycles.",
        },
        {
          title: "Piano",
          organization: "",
          date: "2015-present",
          description: "Ten-plus years of lessons, recitals, and ensemble performances.",
          icon: "piano"
        }
      ]
    }
  ],

  outsideProgramming: {
    title: "When I'm Not Coding...",
    hobbies: [
      {
        name: "School Robotics",
        description: "I build, test, and iterate bots for FTC after previously qualifying for VEX Worlds twice.",
        image: "/images/life/robotics.png"
      },
      {
        name: "Gaming",
        description: "I play mostly strategy and co-op titles, and I nerd out over game systems.",
        image: "/images/life/gaming.png"
      },
      {
        name: "Baking",
        description: "I use baking as a reset: precise, creative, and surprisingly technical.",
        image: "/images/life/baking.png"
      },
      {
        name: "Debate",
        description: "Debate keeps my thinking sharp and my communication clear under pressure.",
        image: "/images/life/debate.png"
      }
    ]
  },

  projects: {
    showFilter: false,

    github: {
      username: "KingJayan",

      exclude: ["KingJayan"] as string[],
      excludeForks: true,
      excludeArchived: false,
      burstSize: 4,
      burstWindowDays: 2,
      activeWithinDays: 45,
      maxLanguages: 3,
      maxTechnologies: 6,
    },

    // manual entries.
    // conflicting `id` or `githubUrl` will override sync
    items: [
      {
        id: "portfolio-website",
        title: "Portfolio Website",
        description: "My personal site built with React and TypeScript, with a sketchbook aesthetic, parallax motion, and serverless APIs.",
        technologies: ["React", "TypeScript", "Tailwind", "Framer Motion", "Vercel"],
        liveUrl: "https://jayanpatel.dev",
        githubUrl: "https://github.com/KingJayan/dev-portfolio",
        startDate: "05/25",
        endDate: "01/26",
      },
      {
        id: "snippet-manager",
        title: "Snips - Code Snippet Manager",
        description: "A snippet workspace for collecting, tagging, and reusing code across projects with AI-assisted search.",
        technologies: ["Next.js", "Supabase", "Shadcn", "Shiki"],
        liveUrl: "https://snips0.vercel.app",
        image: "/images/projects/snippet-manager.png",
        githubUrl: "https://github.com/KingJayan/snips",
        startDate: "01/26",
        endDate: "03/26",
      },
      {
        id: "flagon",
        title: "Flagon",
        description: "Run unmodified desktop Java/LWJGL applications directly in the browser.",
        technologies: ["Java", "TeaVM", "LWJGL"],
        githubUrl: "https://github.com/KingJayan/flagon/",
        startDate: "08/26",
        endDate: "",
      },
      {
        id: "desmos-ide",
        title: "Desmos IDE",
        description: "An IDE + DSL for the Desmos graphing calculator scripts with a live preview, custom lexing, and syntax highlighting.",
        technologies: ["Electrobun", "TypeScript", "Desmos", "Desktop App"],
        liveUrl: "https://desmos-ide.vercel.app",
        githubUrl: "https://github.com/KingJayan/desmos-ide",
        startDate: "04/26",
        endDate: "",
      },
    ],
  },

  footer: {
    showCopyright: true,
    showLinks: true,
    links: [
      { name: "Scroll Top", href: "#home" },
      { name: "Email Me", href: "mailto:jayanp0202@gmail.com" },
    ],
  },
} as const;

export type PortfolioConfig = typeof portfolioConfig;
