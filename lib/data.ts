// Mission Control Data Store — file-based JSON persistence
// In production, swap for Supabase. For now, localStorage + initial seed.

export type Priority = 'high' | 'medium' | 'low';
export type Status = 'not_started' | 'in_progress' | 'waiting' | 'completed';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  assignee?: string;
  dueDate?: string;
  priority: Priority;
  createdAt: string;
  completedAt?: string;
}

export interface Note {
  id: string;
  content: string;
  type: 'update' | 'decision' | 'blocker' | 'action';
  author: string;
  createdAt: string;
}

export interface FileLink {
  id: string;
  name: string;
  url: string;
  type: 'link' | 'file' | 'repo';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  goal: string;
  status: Status;
  priority: Priority;
  deadline?: string;
  owner?: string;
  tasks: Task[];
  notes: Note[];
  files: FileLink[];
  blockers: string[];
  createdAt: string;
  updatedAt: string;
}

// Seed data — Maria's actual projects
export const SEED_PROJECTS: Project[] = [
  {
    id: 'fastrak-command',
    name: 'FasTrak Command',
    description: 'Agency Management System replacing Record Guardian',
    goal: 'Production-ready AMS for both FasTrak Insurance and Better Help Insurance',
    status: 'in_progress',
    priority: 'high',
    deadline: '2026-04-01',
    owner: 'FT (AI Assistant)',
    tasks: [
      { id: 'ft-1', title: 'Phase 1: Stability Sprint', status: 'done', priority: 'high', createdAt: '2026-02-22', completedAt: '2026-02-23' },
      { id: 'ft-2', title: 'Phase 2: Multi-tenant architecture', status: 'todo', priority: 'high', dueDate: '2026-03-07', createdAt: '2026-02-23' },
      { id: 'ft-3', title: 'Phase 3: Backend buildout (auth/RBAC/audit)', status: 'todo', priority: 'high', dueDate: '2026-03-21', createdAt: '2026-02-23' },
      { id: 'ft-4', title: 'Phase 4: Go-live readiness', status: 'todo', priority: 'high', dueDate: '2026-04-01', createdAt: '2026-02-23' },
      { id: 'ft-5', title: 'Get Better Help company info from Maria', status: 'todo', priority: 'medium', assignee: 'Maria', createdAt: '2026-02-23' },
      { id: 'ft-6', title: 'P2 bug fixes (pagination, empty states, favicon)', status: 'todo', priority: 'low', createdAt: '2026-02-23' },
    ],
    notes: [
      { id: 'fn-1', content: 'All 3 SQL migrations run. RLS enforced. Route protection live.', type: 'update', author: 'FT', createdAt: '2026-02-23T17:00:00' },
      { id: 'fn-2', content: 'Decision: Use public schema functions for RLS (auth schema restricted even on Pro).', type: 'decision', author: 'FT', createdAt: '2026-02-23T17:30:00' },
      { id: 'fn-3', content: 'QA Audit complete: 35 bugs found (5 P0, 18 P1, 12 P2). All P0/P1 resolved.', type: 'update', author: 'FT', createdAt: '2026-02-23T18:00:00' },
    ],
    files: [
      { id: 'ff-1', name: 'Live App', url: 'https://fastrak-command.vercel.app', type: 'link' },
      { id: 'ff-2', name: 'GitHub Repo', url: 'https://github.com/mgassistant/fastrak-command', type: 'repo' },
      { id: 'ff-3', name: 'QA Report', url: 'https://github.com/mgassistant/fastrak-command/blob/main/QA-REPORT.md', type: 'file' },
    ],
    blockers: ['Need Better Help company info (offices, staff, tiers) for Phase 2'],
    createdAt: '2026-02-22',
    updatedAt: '2026-02-23',
  },
  {
    id: 'dui-help',
    name: 'DUI Help Business',
    description: 'DUI assistance and SR-22 filing services',
    goal: 'Streamline DUI client intake and SR-22 processing',
    status: 'not_started',
    priority: 'medium',
    owner: 'Maria',
    tasks: [],
    notes: [],
    files: [],
    blockers: [],
    createdAt: '2026-02-23',
    updatedAt: '2026-02-23',
  },
  {
    id: 'roadside-kits',
    name: 'FasTrak Roadside Kits',
    description: 'E-commerce brand — roadside emergency kits via Shopify',
    goal: 'Increase online sales and optimize fulfillment',
    status: 'not_started',
    priority: 'low',
    owner: 'Maria',
    tasks: [],
    notes: [],
    files: [],
    blockers: [],
    createdAt: '2026-02-23',
    updatedAt: '2026-02-23',
  },
  {
    id: 'speed-to-lead',
    name: 'Speed-to-Lead Automation',
    description: 'Gmail inbox monitor → DYL intake → SMS/Email → Call → TurboRater',
    goal: 'Automated lead response under 2 minutes',
    status: 'in_progress',
    priority: 'medium',
    owner: 'FT (AI Assistant)',
    tasks: [
      { id: 'sl-1', title: 'Gmail inbox monitor (cron every 3 min)', status: 'done', priority: 'high', createdAt: '2026-02-20', completedAt: '2026-02-20' },
      { id: 'sl-2', title: 'DYL lead intake integration', status: 'in_progress', priority: 'high', createdAt: '2026-02-20' },
      { id: 'sl-3', title: 'TurboRater auto-quote', status: 'todo', priority: 'medium', createdAt: '2026-02-20' },
    ],
    notes: [
      { id: 'sn-1', content: 'Cron job running (ID: 0215aa7e). Silent delivery mode.', type: 'update', author: 'FT', createdAt: '2026-02-20T10:00:00' },
    ],
    files: [],
    blockers: [],
    createdAt: '2026-02-20',
    updatedAt: '2026-02-23',
  },
  {
    id: 'bd-prospecting',
    name: 'BD Prospecting — Used Car Dealers',
    description: 'Build list of 100 used car dealers for insurance partnerships',
    goal: '100 dealer contacts with phone, email, address',
    status: 'waiting',
    priority: 'low',
    owner: 'FT (AI Assistant)',
    tasks: [
      { id: 'bd-1', title: 'Compile dealer list (20/100 done)', status: 'in_progress', priority: 'medium', createdAt: '2026-02-18' },
    ],
    notes: [
      { id: 'bn-1', content: 'Paused at 20/100 — needs Brave Search API key to continue.', type: 'blocker', author: 'FT', createdAt: '2026-02-20T10:00:00' },
    ],
    files: [],
    blockers: ['Needs Brave Search API key'],
    createdAt: '2026-02-18',
    updatedAt: '2026-02-20',
  },
];

// Helper functions
export function uid() { return Math.random().toString(36).slice(2, 10); }

export function getProgress(project: Project): number {
  if (project.tasks.length === 0) return 0;
  const done = project.tasks.filter(t => t.status === 'done').length;
  return Math.round((done / project.tasks.length) * 100);
}

export function isOverdue(dateStr?: string): boolean {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date(new Date().toDateString());
}

export function isAtRisk(project: Project): boolean {
  if (project.status === 'completed') return false;
  if (project.blockers.length > 0) return true;
  if (project.deadline && isOverdue(project.deadline)) return true;
  const overdueTasks = project.tasks.filter(t => t.status !== 'done' && t.dueDate && isOverdue(t.dueDate));
  return overdueTasks.length > 0;
}

export function daysUntil(dateStr?: string): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
