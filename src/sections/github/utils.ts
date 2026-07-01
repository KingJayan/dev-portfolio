import type { GithubEvent } from '../../../api/github-stats';
import type { FeedGroup, Repo } from './types';

export function sortAndFilter(data: Repo[]): Repo[] {
  return data
    .filter((r) => !r.name.includes('.github.io'))
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 6);
}

export function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function groupEvents(events: GithubEvent[]): FeedGroup[] {
  const groups: FeedGroup[] = [];
  for (const e of events) {
    const ageSec = (Date.now() - new Date(e.createdAt).getTime()) / 1000;
    const windowSec = ageSec < 3600 ? 900 : ageSec < 86400 ? 7200 : 43200;
    const last = groups[groups.length - 1];
    if (last && last.type === e.type && last.repo === e.repo) {
      const lastAge = (Date.now() - new Date(last.createdAt).getTime()) / 1000;
      if (Math.abs(ageSec - lastAge) < windowSec) {
        last.events.push(e);
        continue;
      }
    }
    groups.push({ key: e.id, type: e.type, repo: e.repo, events: [e], createdAt: e.createdAt });
  }
  return groups.slice(0, 10);
}

export function groupLabel(g: FeedGroup): { icon: string; text: string } {
  const repo = (g.repo ?? '').replace('KingJayan/', '');
  const n = g.events.length;
  switch (g.type) {
    case 'PushEvent': {
      const commits = g.events.reduce((sum, e) => sum + ((e.payload.commits as unknown[])?.length ?? 1), 0);
      return { icon: '↑', text: `pushed ${commits} commit${commits !== 1 ? 's' : ''} to ${repo}` };
    }
    case 'CreateEvent':
      return { icon: '✦', text: `created ${g.events[0].payload.ref_type as string} in ${repo}${n > 1 ? ` ×${n}` : ''}` };
    case 'WatchEvent':
      return { icon: '★', text: `starred ${repo}${n > 1 ? ` ×${n}` : ''}` };
    case 'ForkEvent':
      return { icon: '⑂', text: `forked ${repo}` };
    case 'IssuesEvent':
      return { icon: '◎', text: `${g.events[0].payload.action as string} issue in ${repo}${n > 1 ? ` ×${n}` : ''}` };
    case 'PullRequestEvent':
      return { icon: '⤷', text: `${g.events[0].payload.action as string} PR in ${repo}${n > 1 ? ` ×${n}` : ''}` };
    case 'DeleteEvent':
      return { icon: '✕', text: `deleted ${g.events[0].payload.ref_type as string} in ${repo}` };
    case 'ReleaseEvent':
      return { icon: '◆', text: `released in ${repo}` };
    case 'PublicEvent':
      return { icon: '◉', text: `made ${repo} public` };
    default:
      return { icon: '·', text: `activity in ${repo}` };
  }
}

export function describeGithubError(status: number): string {
  if (status === 403 || status === 429) return 'github rate limit hit — the repos will load again in a few minutes.';
  if (status >= 500) return 'github is having issues on their end — worth a retry.';
  return "couldn't reach github — check your connection or try again.";
}
