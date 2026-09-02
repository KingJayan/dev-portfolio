export type ProjectStatus = "planned" | "in-progress" | "completed";

export interface GeneratedProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  startDate: string;
  endDate: string;
  lastUpdated?: string;
  stars?: number;
  commitCount?: number;
  source: "github";
}

export interface Project extends Omit<GeneratedProject, "source"> {
  status?: ProjectStatus;
  source: "github" | "manual";
}
