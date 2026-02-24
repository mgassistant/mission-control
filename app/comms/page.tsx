'use client';

import { useState } from 'react';
import { useProjects } from '@/lib/store';
import { Note } from '@/lib/data';
import { MessageSquare, Filter, Loader2 } from 'lucide-react';
import Link from 'next/link';

const noteTypeConfig: Record<string, { label: string; emoji: string; color: string }> = {
  update: { label: 'Update', emoji: '📝', color: 'border-cyan-800 bg-cyan-950/30' },
  decision: { label: 'Decision', emoji: '⚖️', color: 'border-purple-800 bg-purple-950/30' },
  blocker: { label: 'Blocker', emoji: '🚧', color: 'border-red-800 bg-red-950/30' },
  action: { label: 'Action Item', emoji: '⚡', color: 'border-amber-800 bg-amber-950/30' },
};

export default function CommsPage() {
  const { projects, loaded } = useProjects();
  const [filter, setFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  if (!loaded) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>;

  // Collect all notes across all projects
  const allNotes = projects.flatMap(p =>
    p.notes.map(n => ({ ...n, projectId: p.id, projectName: p.name }))
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  let filtered = allNotes;
  if (filter !== 'all') filtered = filtered.filter(n => n.projectId === filter);
  if (typeFilter !== 'all') filtered = filtered.filter(n => n.type === typeFilter);

  // Group by date
  const grouped: Record<string, typeof filtered> = {};
  filtered.forEach(n => {
    const date = new Date(n.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(n);
  });

  const decisions = allNotes.filter(n => n.type === 'decision');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3"><MessageSquare className="w-6 h-6 text-cyan-400" /> Communication Center</h1>
        <p className="text-sm text-slate-400">All project updates, decisions, and action items</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-700">
          <option value="all">All Projects</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        {['all', 'update', 'decision', 'blocker', 'action'].map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={`text-xs px-3 py-2 rounded-lg ${typeFilter === t ? 'bg-cyan-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400'}`}>
            {t === 'all' ? '📋 All' : `${noteTypeConfig[t]?.emoji} ${noteTypeConfig[t]?.label}`}
          </button>
        ))}
      </div>

      {/* Decision Log (pinned) */}
      {typeFilter === 'all' && decisions.length > 0 && (
        <div className="bg-purple-950/30 rounded-xl border border-purple-800/50 p-4">
          <h2 className="text-sm font-semibold text-purple-400 mb-3">⚖️ Decision Log ({decisions.length})</h2>
          <div className="space-y-2">
            {decisions.slice(0, 5).map(d => (
              <div key={d.id} className="flex items-start gap-3">
                <span className="text-xs text-slate-500 whitespace-nowrap mt-0.5">{new Date(d.createdAt).toLocaleDateString()}</span>
                <div>
                  <p className="text-sm text-slate-300">{d.content}</p>
                  <p className="text-[10px] text-purple-400/60">{d.projectName} · {d.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([date, notes]) => (
          <div key={date}>
            <h3 className="text-xs font-medium text-slate-500 uppercase mb-2">{date}</h3>
            <div className="space-y-2">
              {notes.map(n => {
                const tc = noteTypeConfig[n.type] || noteTypeConfig.update;
                return (
                  <div key={n.id} className={`p-3 rounded-lg border ${tc.color}`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{tc.emoji} {tc.label}</span>
                        <Link href={`/projects/${n.projectId}`} className="text-[10px] text-cyan-400 hover:underline">{n.projectName}</Link>
                      </div>
                      <span className="text-[10px] text-slate-500">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {n.author}</span>
                    </div>
                    <p className="text-sm text-slate-300">{n.content}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-600">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No communications yet. Add notes to projects to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
