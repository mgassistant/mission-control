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

// Seed data — Maria's actual projects (updated Mar 1, 2026)
export const SEED_PROJECTS: Project[] = [
  {
    id: 'brokeriq',
    name: 'BrokerIQ Platform',
    description: 'Agency Management System replacing Record Guardian — 3 agencies (FasTrak, Better Help, DUI-Help)',
    goal: 'Full AMS with multi-tenant, Twilio comms, email marketing, SMS, CC processing — then license to other agencies',
    status: 'in_progress',
    priority: 'high',
    deadline: '2026-04-01',
    owner: 'FT (AI Assistant)',
    tasks: [
      { id: 'bq-1', title: 'Phase 1-4: Core AMS (Dashboard, Clients, Policies, Transactions)', status: 'done', priority: 'high', createdAt: '2026-02-22', completedAt: '2026-02-25' },
      { id: 'bq-2', title: 'Phase 5: Salesforce features (Lead Scoring, Pipeline, Commissions, KB, Cases, Workflows, Activity Scoring)', status: 'done', priority: 'high', createdAt: '2026-02-27', completedAt: '2026-02-28' },
      { id: 'bq-3', title: 'Multi-tenant architecture (FT/BH/DH)', status: 'done', priority: 'high', createdAt: '2026-02-23', completedAt: '2026-02-26' },
      { id: 'bq-4', title: 'Twilio phone system (dialer, IVR, voicemail, extensions, power dialer)', status: 'done', priority: 'high', createdAt: '2026-02-27', completedAt: '2026-02-28' },
      { id: 'bq-5', title: 'Email Marketing via Mailgun (campaigns, templates, analytics)', status: 'done', priority: 'high', createdAt: '2026-02-28', completedAt: '2026-03-01' },
      { id: 'bq-6', title: 'SMS Mass Mailer via ClickSend', status: 'done', priority: 'high', createdAt: '2026-02-26', completedAt: '2026-02-27' },
      { id: 'bq-7', title: 'TranzPay + Merchant Center CC processing', status: 'done', priority: 'high', createdAt: '2026-02-26', completedAt: '2026-02-27' },
      { id: 'bq-8', title: 'Microsoft 365 email integration', status: 'done', priority: 'medium', createdAt: '2026-02-28', completedAt: '2026-02-28' },
      { id: 'bq-9', title: 'Fix double sidebar bug (Commission Tracker, Workflow Builder, Email Marketing)', status: 'todo', priority: 'medium', createdAt: '2026-03-01' },
      { id: 'bq-10', title: 'Fix Power Dialer campaigns loading spinner', status: 'todo', priority: 'medium', createdAt: '2026-03-01' },
      { id: 'bq-11', title: 'Role-based access testing (38 test cases)', status: 'in_progress', priority: 'high', dueDate: '2026-03-05', createdAt: '2026-03-01' },
      { id: 'bq-12', title: 'Soft launch (parallel with Record Guardian)', status: 'in_progress', priority: 'high', dueDate: '2026-03-01', createdAt: '2026-02-26' },
      { id: 'bq-13', title: 'Mid-March full cutover', status: 'todo', priority: 'high', dueDate: '2026-03-15', createdAt: '2026-02-26' },
      { id: 'bq-14', title: 'Cancel Record Guardian', status: 'todo', priority: 'high', dueDate: '2026-04-01', createdAt: '2026-02-26' },
    ],
    notes: [
      { id: 'bn-1', content: 'v2.5 deployed Mar 1 — training hub, email marketing fix, RBAC tests, all roles access all agencies', type: 'update', author: 'FT', createdAt: '2026-03-01T22:00:00' },
      { id: 'bn-2', content: 'MAILGUN_API_KEY was missing from Vercel env — added by Maria, email sends now working', type: 'update', author: 'FT', createdAt: '2026-03-01T22:30:00' },
      { id: 'bn-3', content: '317 tests across 33 sections in testing checklist. 114 credentials imported. 51 extensions assigned.', type: 'update', author: 'FT', createdAt: '2026-03-01T20:00:00' },
      { id: 'bn-4', content: 'Security score ~9/10 after hardening: global middleware, rate limiting, CORS, 2FA, token revocation', type: 'update', author: 'FT', createdAt: '2026-02-28T18:00:00' },
    ],
    files: [
      { id: 'bf-1', name: 'Live App', url: 'https://www.broker-iq.com', type: 'link' },
      { id: 'bf-2', name: 'GitHub Repo', url: 'https://github.com/mgassistant/fastrak-command', type: 'repo' },
      { id: 'bf-3', name: 'Testing Checklist', url: 'https://www.broker-iq.com/testing-checklist.html', type: 'link' },
      { id: 'bf-4', name: 'Training Hub', url: 'https://www.broker-iq.com/training/', type: 'link' },
      { id: 'bf-5', name: "What's New", url: 'https://www.broker-iq.com/whats-new.html', type: 'link' },
    ],
    blockers: [],
    createdAt: '2026-02-22',
    updatedAt: '2026-03-01',
  },
  {
    id: 'dui-help-relaunch',
    name: 'DUI-Help.org Relaunch',
    description: 'Membership-first sales model — custom Next.js website replacing Shopify, Intuit Payments, client portal',
    goal: 'Compliance-first DUI service with $595/$695/$995 tiers, tiered commissions, full BrokerIQ integration',
    status: 'in_progress',
    priority: 'high',
    deadline: '2026-03-15',
    owner: 'FT (AI Assistant)',
    tasks: [
      { id: 'dh-1', title: 'Custom Next.js website', status: 'done', priority: 'high', createdAt: '2026-02-28', completedAt: '2026-03-01' },
      { id: 'dh-2', title: 'Intuit Payments checkout', status: 'done', priority: 'high', createdAt: '2026-02-28', completedAt: '2026-03-01' },
      { id: 'dh-3', title: 'AI chatbot on all pages', status: 'done', priority: 'medium', createdAt: '2026-03-01', completedAt: '2026-03-01' },
      { id: 'dh-4', title: '6 Calendly embeds', status: 'done', priority: 'medium', createdAt: '2026-03-01', completedAt: '2026-03-01' },
      { id: 'dh-5', title: 'DNS cutover from Shopify → Vercel', status: 'in_progress', priority: 'high', dueDate: '2026-03-03', createdAt: '2026-03-01' },
      { id: 'dh-6', title: 'Cancel Shopify hosting', status: 'todo', priority: 'medium', assignee: 'Maria', createdAt: '2026-03-01' },
      { id: 'dh-7', title: 'Training package (10 docs)', status: 'done', priority: 'high', createdAt: '2026-03-01', completedAt: '2026-03-01' },
      { id: 'dh-8', title: 'Company-wide Zoom training', status: 'todo', priority: 'high', dueDate: '2026-03-07', assignee: 'Maria', createdAt: '2026-03-01' },
      { id: 'dh-9', title: 'Client portal expansion (full Assembly replacement)', status: 'todo', priority: 'medium', dueDate: '2026-03-20', createdAt: '2026-03-01' },
      { id: 'dh-10', title: 'Assembly client migration (334 clients)', status: 'todo', priority: 'medium', dueDate: '2026-03-25', assignee: 'Maria', createdAt: '2026-03-01' },
      { id: 'dh-11', title: 'Cut Assembly by 4/1', status: 'todo', priority: 'medium', dueDate: '2026-04-01', createdAt: '2026-03-01' },
    ],
    notes: [
      { id: 'dn-1', content: 'Membership-first model replaces free-with-SR22 to eliminate DOI exposure', type: 'decision', author: 'Maria', createdAt: '2026-03-01T14:00:00' },
      { id: 'dn-2', content: 'Commission tiers: 40/45/50/55/60% per pay period based on volume', type: 'decision', author: 'Maria', createdAt: '2026-03-01T14:30:00' },
      { id: 'dn-3', content: 'Website live at dui-help-website.vercel.app — DNS cutover in progress', type: 'update', author: 'FT', createdAt: '2026-03-01T20:00:00' },
    ],
    files: [
      { id: 'df-1', name: 'Live Site', url: 'https://dui-help-website.vercel.app', type: 'link' },
      { id: 'df-2', name: 'GitHub Repo', url: 'https://github.com/mgassistant/dui-help-website', type: 'repo' },
      { id: 'df-3', name: 'Relaunch Slide Deck', url: 'https://www.broker-iq.com/training/relaunch-deck.html', type: 'link' },
      { id: 'df-4', name: 'Sales Manual', url: 'https://www.broker-iq.com/training/dui-sales-manual.html', type: 'link' },
    ],
    blockers: [],
    createdAt: '2026-02-28',
    updatedAt: '2026-03-01',
  },
  {
    id: 'agency-websites',
    name: 'Agency Websites (3 sites)',
    description: 'Next.js rebuilds of fastrakins.com, betterhelpins.com, fastrakroadside.com — replace Marketing 360 + Shopify',
    goal: 'Custom lead-gen websites saving $2,500/mo (Marketing 360) + Shopify hosting',
    status: 'in_progress',
    priority: 'high',
    deadline: '2026-03-15',
    owner: 'FT (AI Assistant)',
    tasks: [
      { id: 'aw-1', title: 'fastrakins.com built (GEICO/Freeway-style)', status: 'done', priority: 'high', createdAt: '2026-02-28', completedAt: '2026-02-28' },
      { id: 'aw-2', title: 'betterhelpins.com built (green-branded)', status: 'done', priority: 'high', createdAt: '2026-02-28', completedAt: '2026-02-28' },
      { id: 'aw-3', title: 'fastrakroadside.com built (red-branded + checkout)', status: 'done', priority: 'high', createdAt: '2026-02-28', completedAt: '2026-02-28' },
      { id: 'aw-4', title: 'DNS cutover all 3 domains to Vercel', status: 'todo', priority: 'high', dueDate: '2026-03-10', assignee: 'Maria', createdAt: '2026-03-01' },
      { id: 'aw-5', title: 'Cancel Marketing 360 hosting ($2,500/mo)', status: 'todo', priority: 'high', assignee: 'Maria', createdAt: '2026-03-01' },
      { id: 'aw-6', title: 'Draft cancellation email to Krissy', status: 'todo', priority: 'medium', createdAt: '2026-03-01' },
      { id: 'aw-7', title: 'Agency client self-service portals', status: 'todo', priority: 'low', createdAt: '2026-03-01' },
    ],
    notes: [
      { id: 'an-1', content: 'All 3 sites built and deployed on Vercel. Waiting on DNS cutover before cancelling Marketing 360.', type: 'update', author: 'FT', createdAt: '2026-03-01T16:00:00' },
    ],
    files: [
      { id: 'af-1', name: 'fastrakins.com (staging)', url: 'https://fastrakins-website.vercel.app', type: 'link' },
      { id: 'af-2', name: 'betterhelpins.com (staging)', url: 'https://betterhelpins-website.vercel.app', type: 'link' },
      { id: 'af-3', name: 'fastrakroadside.com (staging)', url: 'https://fastrakroadside-website.vercel.app', type: 'link' },
    ],
    blockers: ['DNS cutover needed before cancelling Marketing 360'],
    createdAt: '2026-02-28',
    updatedAt: '2026-03-01',
  },
  {
    id: 'phone-system',
    name: 'Twilio Phone System',
    description: 'Full DYL replacement — softphone, IVR, extensions, power dialer, desktop app',
    goal: 'Replace DYL ($2-4K/mo) with Twilio (~$250/mo) — individual agent lines, call routing, voicemail',
    status: 'in_progress',
    priority: 'high',
    owner: 'FT (AI Assistant)',
    tasks: [
      { id: 'ps-1', title: 'Twilio dialer + call log + voicemail', status: 'done', priority: 'high', createdAt: '2026-02-27', completedAt: '2026-02-28' },
      { id: 'ps-2', title: 'IVR + bilingual routing + hold queue', status: 'done', priority: 'high', createdAt: '2026-02-27', completedAt: '2026-02-28' },
      { id: 'ps-3', title: '51 user extensions (1001-1051)', status: 'done', priority: 'medium', createdAt: '2026-02-28', completedAt: '2026-02-28' },
      { id: 'ps-4', title: 'Power dialer with campaigns', status: 'done', priority: 'medium', createdAt: '2026-02-28', completedAt: '2026-02-28' },
      { id: 'ps-5', title: 'BrokerIQ Phone desktop app (Electron)', status: 'done', priority: 'medium', createdAt: '2026-02-28', completedAt: '2026-02-28' },
      { id: 'ps-6', title: 'TalkRoute number porting (3 numbers)', status: 'in_progress', priority: 'high', dueDate: '2026-03-15', createdAt: '2026-02-28' },
      { id: 'ps-7', title: 'Individual Twilio phone numbers per agent', status: 'todo', priority: 'medium', createdAt: '2026-03-01' },
    ],
    notes: [
      { id: 'pn-1', content: 'TalkRoute porting submitted. Toll-free 2-4 weeks, local 7-14 business days.', type: 'update', author: 'FT', createdAt: '2026-02-28T22:00:00' },
      { id: 'pn-2', content: 'Decision: Replace DYL entirely with Twilio. Saves $2-4K/mo.', type: 'decision', author: 'Maria', createdAt: '2026-02-27T16:00:00' },
    ],
    files: [
      { id: 'pf-1', name: 'BrokerIQ Phone DMG', url: 'https://github.com/mgassistant/brokeriq-phone', type: 'repo' },
    ],
    blockers: ['TalkRoute number porting in progress'],
    createdAt: '2026-02-27',
    updatedAt: '2026-03-01',
  },
  {
    id: 'turborater-api',
    name: 'TurboRater API Integration',
    description: 'Consumer-facing quote pages for websites + embedded quoting in BrokerIQ',
    goal: 'Auto-import quotes, bound policies, carrier info into BrokerIQ on bind',
    status: 'waiting',
    priority: 'medium',
    deadline: '2026-05-15',
    owner: 'FT (AI Assistant)',
    tasks: [
      { id: 'tr-1', title: 'Contract signed ($3,300/mo + $3K setup)', status: 'done', priority: 'high', createdAt: '2026-02-28', completedAt: '2026-02-28' },
      { id: 'tr-2', title: 'Build Integration Customization bridge endpoint', status: 'todo', priority: 'high', dueDate: '2026-05-01', createdAt: '2026-03-01' },
      { id: 'tr-3', title: 'Consumer-facing quote pages for websites', status: 'todo', priority: 'medium', dueDate: '2026-05-15', createdAt: '2026-03-01' },
    ],
    notes: [
      { id: 'tn-1', content: 'Contract Q-168946 signed. $3,300/mo offset by cancelling Constant Contact ($1,238/mo).', type: 'decision', author: 'Maria', createdAt: '2026-02-28T16:00:00' },
    ],
    files: [],
    blockers: [],
    createdAt: '2026-02-28',
    updatedAt: '2026-03-01',
  },
  {
    id: 'subscriptions',
    name: 'Subscription Cancellations',
    description: 'Cancel replaced services — Marketing 360, Constant Contact, DYL, Shopify, Record Guardian',
    goal: 'Save $5,700-8,200/mo by cancelling replaced services',
    status: 'in_progress',
    priority: 'high',
    deadline: '2026-04-01',
    owner: 'Maria',
    tasks: [
      { id: 'sc-1', title: 'Cancel Marketing 360 ($2,500/mo)', status: 'todo', priority: 'high', assignee: 'Maria', dueDate: '2026-03-15', createdAt: '2026-03-01' },
      { id: 'sc-2', title: 'Cancel Shopify hosting (dui-help.org)', status: 'todo', priority: 'medium', assignee: 'Maria', createdAt: '2026-03-01' },
      { id: 'sc-3', title: 'Cancel Constant Contact ($1,238/mo)', status: 'todo', priority: 'high', assignee: 'Maria', createdAt: '2026-03-01' },
      { id: 'sc-4', title: 'Cancel DYL ($2-4K/mo)', status: 'todo', priority: 'high', assignee: 'Maria', dueDate: '2026-03-31', createdAt: '2026-03-01' },
      { id: 'sc-5', title: 'Cancel Record Guardian', status: 'todo', priority: 'high', assignee: 'Maria', dueDate: '2026-04-01', createdAt: '2026-03-01' },
      { id: 'sc-6', title: 'Audit Shopify paid apps (autoBlogger, IndexGPT, etc)', status: 'todo', priority: 'low', createdAt: '2026-03-01' },
    ],
    notes: [
      { id: 'sn-1', content: 'All replacement platforms built. Waiting on DNS cutovers before cancelling.', type: 'update', author: 'FT', createdAt: '2026-03-01T20:00:00' },
    ],
    files: [],
    blockers: ['DNS cutovers must complete before Marketing 360 cancel', 'TalkRoute porting must complete before DYL cancel'],
    createdAt: '2026-03-01',
    updatedAt: '2026-03-01',
  },
  {
    id: 'training-launch',
    name: 'Company Training & Launch',
    description: 'BrokerIQ + DUI-Help relaunch training — slide deck, manuals, scripts, compliance docs',
    goal: 'All staff trained on new platform and DUI membership-first sales model',
    status: 'in_progress',
    priority: 'high',
    deadline: '2026-03-07',
    owner: 'Maria',
    tasks: [
      { id: 'tl-1', title: 'Training Hub (10 documents)', status: 'done', priority: 'high', createdAt: '2026-03-01', completedAt: '2026-03-01' },
      { id: 'tl-2', title: '18-slide relaunch deck', status: 'done', priority: 'high', createdAt: '2026-03-01', completedAt: '2026-03-01' },
      { id: 'tl-3', title: 'Speaking script (60 min)', status: 'done', priority: 'high', createdAt: '2026-03-01', completedAt: '2026-03-01' },
      { id: 'tl-4', title: 'Schedule Zoom training date', status: 'todo', priority: 'high', dueDate: '2026-03-05', assignee: 'Maria', createdAt: '2026-03-01' },
      { id: 'tl-5', title: 'Conduct company-wide training', status: 'todo', priority: 'high', dueDate: '2026-03-07', assignee: 'Maria', createdAt: '2026-03-01' },
      { id: 'tl-6', title: 'Role-based access testing complete', status: 'in_progress', priority: 'high', dueDate: '2026-03-05', createdAt: '2026-03-01' },
    ],
    notes: [
      { id: 'ln-1', content: 'Training hub live at broker-iq.com/training/ — 10 docs covering all roles', type: 'update', author: 'FT', createdAt: '2026-03-01T21:00:00' },
    ],
    files: [
      { id: 'lf-1', name: 'Training Hub', url: 'https://www.broker-iq.com/training/', type: 'link' },
      { id: 'lf-2', name: 'Testing Checklist', url: 'https://www.broker-iq.com/testing-checklist.html', type: 'link' },
    ],
    blockers: [],
    createdAt: '2026-03-01',
    updatedAt: '2026-03-01',
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
