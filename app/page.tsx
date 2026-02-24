'use client';

import { useProjects } from '@/lib/store';
import { getProgress, isAtRisk, isOverdue, daysUntil, Project } from '@/lib/data';
import { AlertTriangle, CheckCircle, Clock, Pause, Circle, ArrowRight, Flame, TrendingUp, Loader2 } from 'lucide-react';
import Link from 'next/link';

const statusConfig = {
  not_started: { label: 'Not Started', icon: Circle, color: 'text-slate-400', bg: 'bg-slate-400/10 border-slate-700' },
  in_progress: { label: 'In Progress', icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-800' },
  waiting: { label: 'Waiting', icon: Pause, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-800' },
  completed: { label: 'Completed', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10 border-green-800' },
};

const priorityConfig = {
  high: { label: 'High', color: 'text-red-400', bg: 'bg-red-400/10', dot: 'bg-red-400' },
  medium: { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-400/10', dot: 'bg-amber-400' },
  low: { label: 'Low', color: 'text-slate-400', bg: 'bg-slate-400/10', dot: 'bg-slate-400' },
};

export default function Dashboard() {
  const { projects, loaded } = useProjects();

  if (!loaded) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>;

  const active = projects.filter(p => p.status !== 'completed');
  const atRisk = active.filter(isAtRisk);
  const todayTasks = active.flatMap(p => p.tasks.filter(t => t.status !== 'done' && t.dueDate === new Date().toISOString().split('T')[0]));
  const overdueTasks = active.flatMap(p => p.tasks.filter(t => t.status !== 'done' && t.dueDate && isOverdue(t.dueDate)).map(t => ({ ...t, projectName: p.name, projectId: p.id })));
  const totalTasks = active.reduce((s, p) => s + p.tasks.length, 0);
  const doneTasks = active.reduce((s, p) => s + p.tasks.filter(t => t.status === 'done').length, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mission Control</h1>
        <p className="text-sm text-slate-400">Command center overview</p>
      </div>

      {/* KPI Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <p className="text-xs text-slate-500 uppercase font-medium">Active Projects</p>
          <p className="text-2xl font-bold mt-1">{active.length}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <p className="text-xs text-slate-500 uppercase font-medium">Tasks Done</p>
          <p className="text-2xl font-bold mt-1 text-green-400">{doneTasks}<span className="text-sm text-slate-500">/{totalTasks}</span></p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <p className="text-xs text-slate-500 uppercase font-medium">At Risk</p>
          <p className={`text-2xl font-bold mt-1 ${atRisk.length > 0 ? 'text-red-400' : 'text-green-400'}`}>{atRisk.length}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <p className="text-xs text-slate-500 uppercase font-medium">Overdue Tasks</p>
          <p className={`text-2xl font-bold mt-1 ${overdueTasks.length > 0 ? 'text-amber-400' : 'text-green-400'}`}>{overdueTasks.length}</p>
        </div>
      </div>

      {/* At Risk Alerts */}
      {atRisk.length > 0 && (
        <div className="bg-red-950/50 rounded-xl border border-red-900/50 p-4">
          <h2 className="text-sm font-semibold text-red-400 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4" /> At Risk ({atRisk.length})
          </h2>
          <div className="space-y-2">
            {atRisk.map(p => (
              <Link key={p.id} href={`/projects/${p.id}`}
                className="flex items-center justify-between p-3 bg-red-950/30 rounded-lg border border-red-900/30 hover:border-red-700/50 transition-colors">
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-red-400/70">{p.blockers.length > 0 ? `🚧 ${p.blockers[0]}` : 'Overdue tasks'}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-red-400/50" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <div className="bg-amber-950/30 rounded-xl border border-amber-900/30 p-4">
          <h2 className="text-sm font-semibold text-amber-400 flex items-center gap-2 mb-3">
            <Flame className="w-4 h-4" /> Overdue Tasks ({overdueTasks.length})
          </h2>
          <div className="space-y-1">
            {overdueTasks.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-amber-950/30">
                <div>
                  <p className="text-sm">{t.title}</p>
                  <p className="text-xs text-amber-400/60">{t.projectName} · Due: {t.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Projects */}
      <div>
        <h2 className="text-lg font-semibold mb-3">All Projects</h2>
        <div className="space-y-3">
          {projects.sort((a, b) => {
            const po = { high: 0, medium: 1, low: 2 };
            const so = { in_progress: 0, waiting: 1, not_started: 2, completed: 3 };
            return (so[a.status] - so[b.status]) || (po[a.priority] - po[b.priority]);
          }).map(p => {
            const sc = statusConfig[p.status];
            const pc = priorityConfig[p.priority];
            const progress = getProgress(p);
            const risk = isAtRisk(p);
            const days = daysUntil(p.deadline);
            const Icon = sc.icon;

            return (
              <Link key={p.id} href={`/projects/${p.id}`}
                className={`block bg-slate-900 rounded-xl border p-4 hover:border-cyan-700/50 transition-all ${risk ? 'border-red-800/50' : 'border-slate-800'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold">{p.name}</h3>
                      <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${sc.bg}`}>
                        <Icon className={`w-3 h-3 ${sc.color}`} /> <span className={sc.color}>{sc.label}</span>
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${pc.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${pc.dot}`} /> <span className={pc.color}>{pc.label}</span>
                      </span>
                      {risk && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-400/10 text-red-400">⚠ AT RISK</span>}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 truncate">{p.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      {p.owner && <span>👤 {p.owner}</span>}
                      {p.deadline && <span className={days !== null && days < 0 ? 'text-red-400' : days !== null && days <= 7 ? 'text-amber-400' : ''}>
                        📅 {p.deadline} {days !== null && (days < 0 ? `(${Math.abs(days)}d overdue)` : days === 0 ? '(today)' : `(${days}d left)`)}
                      </span>}
                      <span>✅ {p.tasks.filter(t => t.status === 'done').length}/{p.tasks.length} tasks</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-cyan-400">{progress}%</p>
                    <div className="w-16 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                      <div className={`h-full rounded-full ${progress === 100 ? 'bg-green-400' : progress > 50 ? 'bg-cyan-400' : progress > 0 ? 'bg-amber-400' : 'bg-slate-700'}`}
                        style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
