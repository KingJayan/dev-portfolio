export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  image: string;
  gallery?: string[];
  technologies: string[];
  category: 'web' | 'mobile' | 'api';
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  status: 'completed' | 'in-progress' | 'planned';
  startDate: string;
  endDate?: string;
  challenges?: string[];
  learnings?: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

export interface Skill {
  name: string;
  level: number;
  color: string;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isZenMode: boolean;
  toggleZenMode: () => void;
}

export interface AchievementItem {
  title: string;
  organization: string;
  date: string;
  description: string;
  icon: string;
}

export interface AchievementCategory {
  category: string;
  icon: string;
  items: AchievementItem[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}
