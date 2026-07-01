import type { GithubEvent } from '../../../api/github-stats';

export interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}

export interface FeedGroup {
  key: string;
  type: string;
  repo: string;
  events: GithubEvent[];
  createdAt: string;
}
