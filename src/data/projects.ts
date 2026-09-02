import { portfolioConfig } from "@/portfolio.config";
import generated from "./github-projects.json";
import type { GeneratedProject, Project } from "./project-types";

const normalizeRepoUrl = (url?: string) =>
  url?.toLowerCase().replace(/\.git$/, "").replace(/\/+$/, "") ?? "";

function isSameProject(manual: Record<string, unknown>, synced: GeneratedProject) {
  if (manual.id === synced.id) return true;
  const manualUrl = normalizeRepoUrl(manual.githubUrl as string | undefined);
  return manualUrl !== "" && manualUrl === normalizeRepoUrl(synced.githubUrl);
}

function definedFields(source: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(source)) {
    if (value === undefined || value === null) continue;
    if (typeof value === "string" && value.trim() === "" && key !== "endDate") continue;
    if (Array.isArray(value) && value.length === 0) continue;
    out[key] = Array.isArray(value) ? [...value] : value;
  }
  return out;
}

function buildProjects(): Project[] {
  const syncedProjects = generated.projects as GeneratedProject[];
  const manualItems = portfolioConfig.projects.items as ReadonlyArray<Record<string, unknown>>;

  const merged: Project[] = syncedProjects.map((synced) => {
    const override = manualItems.find((item) => isSameProject(item, synced));
    if (!override) return { ...synced };
    return { ...synced, ...definedFields(override), source: "manual" } as Project;
  });

  for (const item of manualItems) {
    if (syncedProjects.some((synced) => isSameProject(item, synced))) continue;
    merged.push({
      technologies: [],
      description: "",
      endDate: "",
      ...definedFields(item),
      source: "manual",
    } as unknown as Project);
  }

  const rank = (project: Project) =>
    project.lastUpdated ? Date.parse(project.lastUpdated) : monthIndex(project.endDate || project.startDate);

  return merged.sort((a, b) => rank(b) - rank(a));
}

function monthIndex(value: string): number {
  const match = /^(\d{1,2})\/(\d{2})$/.exec(value.trim());
  if (!match) return 0;
  return Date.UTC(2000 + Number(match[2]), Number(match[1]) - 1, 1);
}

export const allProjects: Project[] = buildProjects();

export const projectsLastSynced: string = generated.generatedAt;

export type { Project } from "./project-types";
