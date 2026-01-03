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
}
