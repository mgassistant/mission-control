'use client';

import { useProjects } from '@/lib/store';
import { getProgress, isAtRisk, isOverdue, Project } from '@/lib/data';
import { CalendarCheck, TrendingUp, AlertTriangle, CheckCircle, Clock, Trophy, Flame, Loader2 } from 'lucide-react';
import Link from 'next/link';

function isThisWeek(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  return d >= weekStart && d < weekEnd;
}

export default function ReviewPage() {
  const { projects, loaded } = useProjects();

  if (!loaded) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>;

  const active = projects.filter(p => p.status !== 'completed');
  const atRisk = active.filter(isAtRisk);
  const completedThisWeek = projects.flatMap(p => p.tasks.filter(t => t.completedAt && isThisWeek(t.completedAt)).map(t => ({ ...t, projectName: p.name })));
  const delayedTasks = active.flatMap(p => p.tasks.filter(t => t.status !== 'done' && t.dueDate && isOverdue(t.dueDate)).map(t => ({ ...t, projectName: p.name })));
  const weekNotes = projects.flatMap(p => p.notes.filter(n => isThisWeek(n.createdAt)).map(n => ({ ...n, projectName: p.name })));
  const decisions = weekNotes.filter(n => n.type === 'decision');

  const now = new Date();
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay());
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6);
  const weekLabel = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3"><CalendarCheck className="w-6 h-6 text-cyan-400" /> Weekly Review</h1>
        <p className="text-sm text-slate-400">{weekLabel}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 text-center">
          <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-green-400">{completedThisWeek.length}</p>
          <p className="text-xs text-slate-500">Tasks Completed</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 text-center">
          <Flame className="w-5 h-5 text-amber-400 mx-auto mb-1" />
          <p className={`text-2xl font-bold ${delayedTasks.length > 0 ? 'text-amber-400' : 'text-green-400'}`}>{delayedTasks.length}</p>
          <p className="text-xs text-slate-500">Delayed Tasks</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 text-center">
          <AlertTriangle className="w-5 h-5 text-red-400 mx-auto mb-1" />
          <p className={`text-2xl font-bold ${atRisk.length > 0 ? 'text-red-400' : 'text-green-400'}`}>{atRisk.length}</p>
          <p className="text-xs text-slate-500">At Risk</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 text-center">
          <TrendingUp className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
          <p className="text-2xl font-bold">{weekNotes.length}</p>
          <p className="text-xs text-slate-500">Updates Logged</p>
        </div>
      </div>

      {/* Project Statuses */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
        <h2 className="text-sm font-semibold mb-4">📊 Project Statuses</h2>
        <div className="space-y-3">
          {active.map(p => {
            const progress = getProgress(p);
            const risk = isAtRisk(p);
            return (
              <Link key={p.id} href={`/projects/${p.id}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{p.name}</p>
                    {risk && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-400/10 text-red-400">AT RISK</span>}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{p.tasks.filter(t => t.status === 'done').length}/{p.tasks.length} tasks · {p.status.replace('_', ' ')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${progress === 100 ? 'bg-green-400' : 'bg-cyan-400'}`} style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-sm font-bold text-cyan-400 w-10 text-right">{progress}%</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Key Wins */}
      {completedThisWeek.length > 0 && (
        <div className="bg-green-950/30 rounded-xl border border-green-800/50 p-5">
          <h2 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2"><Trophy className="w-4 h-4" /> Key Wins This Week ({completedThisWeek.length})</h2>
          <div className="space-y-1">
            {completedThisWeek.map((t: any) => (
              <div key={t.id} className="flex items-center gap-3 py-1.5">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-sm">{t.title}</p>
                  <p className="text-[10px] text-green-400/60">{t.projectName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delayed Tasks */}
      {delayedTasks.length > 0 && (
        <div className="bg-amber-950/30 rounded-xl border border-amber-800/50 p-5">
          <h2 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2"><Flame className="w-4 h-4" /> Delayed Tasks ({delayedTasks.length})</h2>
          <div className="space-y-1">
            {delayedTasks.map((t: any) => (
              <div key={t.id} className="flex items-center gap-3 py-1.5">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-sm">{t.title}</p>
                  <p className="text-[10px] text-amber-400/60">{t.projectName} · Due: {t.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issues Needing Escalation */}
      {atRisk.length > 0 && (
        <div className="bg-red-950/30 rounded-xl border border-red-800/50 p-5">
          <h2 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Needs Escalation</h2>
          <div className="space-y-2">
            {atRisk.map(p => (
              <Link key={p.id} href={`/projects/${p.id}`} className="block p-3 rounded-lg bg-red-950/30 border border-red-900/30 hover:border-red-700/50">
                <p className="text-sm font-medium">{p.name}</p>
                {p.blockers.map((b, i) => <p key={i} className="text-xs text-red-400/70 mt-0.5">🚧 {b}</p>)}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Decisions This Week */}
      {decisions.length > 0 && (
        <div className="bg-purple-950/30 rounded-xl border border-purple-800/50 p-5">
          <h2 className="text-sm font-semibold text-purple-400 mb-3">⚖️ Decisions Made This Week</h2>
          <div className="space-y-2">
            {decisions.map((d: any) => (
              <div key={d.id} className="flex items-start gap-3">
                <span className="text-xs text-slate-500 whitespace-nowrap mt-0.5">{new Date(d.createdAt).toLocaleDateString()}</span>
                <div>
                  <p className="text-sm text-slate-300">{d.content}</p>
                  <p className="text-[10px] text-purple-400/60">{d.projectName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
