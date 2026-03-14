export const portfolioConfig = {
  personal: {
    name: "Jayan Patel",
    title: "full stack developer",
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
      subject: "thank you for your message!",
      message:
        "thanks for reaching out, I'll get back to you as soon as possible, usually within 48 hours",
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
    ogImage: "/images/og-image.png",
  },

  fonts: {
    marker: '"Permanent Marker", cursive',
    hand: '"Kalam", cursive',
    amatic: '"Caveat", cursive',
  },

  hero: {
    tagline: "shaping the web, one component at a time.",
    status: "open to work",
  },

  navigation: {
    showLogo: true,
    items: [
      { name: "home", href: "#home" },
      { name: "projects", href: "#projects" },
      { name: "about", href: "#about" },
      { name: "extras", href: "#achievements" },
      { name: "life", href: "#outside" },
      { name: "contact", href: "#contact" },
    ],
  },

  about: {
    bio: [
      "i'm a passionate solo dev who loves making creative and interactive web experiences",
      "to me, code isn't just logic, it's a form of expression, a way to bring ideas to life",
      "currently based in austin, tx, i'm always excited to collaborate and push the boundaries of what the web can do"
    ],
    skills: [
      { name: "HTML/CSS/JS", level: 95, color: "from-blue-400 to-blue-600" },
      { name: "React & TS", level: 80, color: "from-indigo-400 to-indigo-600" },
      { name: "UX/UI Design", level: 65, color: "from-orange-400 to-orange-600" },
      { name: "SQL & Postgres", level: 60, color: "from-orange-400 to-orange-600" },
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
          description: "texas region 4 champions(x2), create award for our division @ VEX Worlds",
          icon: "trophy"
        },
        {
          title: "FTC Robotics",
          organization: "WWHS FTC Team #18886 AtlAtl",
          date: "2025-2026",
          description: "competitor, lead software, pres team & driver in the FiT-Central GEMS League Meets",
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
          description: "competitor in the WWHS LD Novice Debate team",
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
          description: "TMEA All-Region Choir(2024-5), TMEA Region Qualifier(2025-6)",
          icon: "music"
        },
        {
          title: "UIL Concert & Soloist",
          organization: "University Interscholastic League",
          date: "2024-2025",
          description: "UIL Concert & Sightreading 1st division(2024-26), Solo & Ensemble 1st Division(2025,26)",
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
          description: "Distinction(x3)",
        },
        {
          title: "Texas Federation of Music Clubes(All-State Festival)",
          organization: "Texas Federation of Music Clubs",
          date: "2023",
          description: "Outstanding(x1)",
        },
        {
          title: "National Federation of Music Clubs(Festival)",
          organization: "National Federation of Music Clubs",
          date: "2017-2023",
          description: "Superior(x4)",
        },
        {
          title: "Piano",
          organization: "",
          date: "2015-present",
          description: "10+ years of piano lessons and performances",
          icon: "piano"
        }
      ]
    }
  ],

  outsideProgramming: {
    title: "when i'm not coding...",
    hobbies: [
      {
        name: "School Robotics",
        description: "high school FTC competitor and former VEX Worlds 2-time qualifier",
        image: "/images/life/robotics.png"
      },
      {
        name: "Gaming",
        description: "playing video games and enjoying the fun",
        image: "/images/life/gaming.png"
      },
      {
        name: "Baking",
        description: "trying new recipes in the kitchen",
        image: "/images/life/baking.png"
      },
      {
        name: "Debate",
        description: "participaating in debate club and learning new arguments",
        image: "/images/life/debate.png"
      }
    ]
  },

  projects: {
    showFilter: false,
    items: [
      {
        id: "portfolio-website",
        title: "Portfolio Website",
        description: "A modern full-stack portfolio built with React & TypeScript. Features a sketchbook design, 3D parallax, and Vercel serverless functions.",
        technologies: ["React", "TypeScript", "Tailwind", "Framer Motion", "Vercel"],
        liveUrl: "https://jayanpatel.dev",
        githubUrl: "https://github.com/KingJayan/dev-portfolio",
        startDate: "05/25",
        endDate: "01/26",
      },
      {
        id: "snippet-manager",
        title: "snips - code snippet manager",
        description: "A tool for managing and organizing code snippets across different projects and languages, AI integrated",
        technologies: ["Next.js", "Supabase", "Shadcn", "Shiki"],
        liveUrl: "https://snips0.vercel.app",
        image: "/images/projects/snippet-manager.png",
        githubUrl: "https://github.com/KingJayan/code-snippet-library",
        startDate: "01/26",
        endDate: "03/26",
      },
      {
        id: "weather-app",
        title: "Weather App",
        description: "Mobile weather forecast application with beautiful visualizations.",
        technologies: ["React Native", "Weather API"],
        liveUrl: "https://play.google.com/store",
        startDate: "08/23",
        endDate: "09/23",
      },
    ],
  },

  footer: {
    showCopyright: true,
    showLinks: true,
    links: [
      { name: "scroll top", href: "#home" },
      { name: "email me", href: "mailto:jayanp0202@gmail.com" },
    ],
  },
} as const;

export type PortfolioConfig = typeof portfolioConfig;
