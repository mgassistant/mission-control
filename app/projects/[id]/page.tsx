'use client';

import { use, useState } from 'react';
import { useProjects } from '@/lib/store';
import { getProgress, isOverdue, daysUntil, uid, Task, Note, FileLink, Status, Priority } from '@/lib/data';
import { ArrowLeft, Plus, Check, X, Trash2, AlertTriangle, ExternalLink, FileText, GitBranch, Link2, Loader2, CheckSquare, Square, Clock, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const statusOpts: { value: Status; label: string }[] = [
  { value: 'not_started', label: '⬜ Not Started' }, { value: 'in_progress', label: '🔵 In Progress' },
  { value: 'waiting', label: '🟡 Waiting' }, { value: 'completed', label: '✅ Completed' },
];
const priorityOpts: { value: Priority; label: string }[] = [
  { value: 'high', label: '🔴 High' }, { value: 'medium', label: '🟡 Medium' }, { value: 'low', label: '⚪ Low' },
];

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { projects, loaded, updateProject } = useProjects();
  const [tab, setTab] = useState<'tasks' | 'notes' | 'files' | 'blockers'>('tasks');
  const [newTask, setNewTask] = useState('');
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState<Note['type']>('update');
  const [newFile, setNewFile] = useState({ name: '', url: '' });
  const [newBlocker, setNewBlocker] = useState('');

  if (!loaded) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>;

  const projectMaybe = projects.find(p => p.id === id);
  if (!projectMaybe) return <div className="text-center py-20 text-slate-400">Project not found</div>;
  const project = projectMaybe;

  const progress = getProgress(project);
  const days = daysUntil(project.deadline);
  const risk = project.blockers.length > 0 || project.tasks.some(t => t.status !== 'done' && t.dueDate && isOverdue(t.dueDate));

  function addTask() {
    if (!newTask.trim()) return;
    const task: Task = { id: uid(), title: newTask.trim(), status: 'todo', priority: 'medium', createdAt: new Date().toISOString() };
    updateProject(id, { tasks: [...project.tasks, task] });
    setNewTask('');
  }

  function toggleTask(taskId: string) {
    const tasks = project.tasks.map(t => t.id === taskId ? { ...t, status: (t.status === 'done' ? 'todo' : 'done') as Task['status'], completedAt: t.status !== 'done' ? new Date().toISOString() : undefined } : t);
    updateProject(id, { tasks });
  }

  function deleteTask(taskId: string) {
    updateProject(id, { tasks: project.tasks.filter(t => t.id !== taskId) });
  }

  function addNote() {
    if (!newNote.trim()) return;
    const note: Note = { id: uid(), content: newNote.trim(), type: noteType, author: 'Maria', createdAt: new Date().toISOString() };
    updateProject(id, { notes: [...project.notes, note] });
    setNewNote('');
    // Auto-create action item if type is 'action'
    if (noteType === 'action') {
      const task: Task = { id: uid(), title: newNote.trim(), status: 'todo', priority: 'medium', createdAt: new Date().toISOString() };
      updateProject(id, { tasks: [...project.tasks, task], notes: [...project.notes, note] });
    }
  }

  function addFile() {
    if (!newFile.name || !newFile.url) return;
    const file: FileLink = { id: uid(), name: newFile.name, url: newFile.url, type: newFile.url.includes('github') ? 'repo' : 'link' };
    updateProject(id, { files: [...project.files, file] });
    setNewFile({ name: '', url: '' });
  }

  function addBlocker() {
    if (!newBlocker.trim()) return;
    updateProject(id, { blockers: [...project.blockers, newBlocker.trim()] });
    setNewBlocker('');
  }

  function removeBlocker(idx: number) {
    updateProject(id, { blockers: project.blockers.filter((_, i) => i !== idx) });
  }

  const noteTypeConfig = {
    update: { label: '📝 Update', color: 'border-cyan-800 bg-cyan-950/30' },
    decision: { label: '⚖️ Decision', color: 'border-purple-800 bg-purple-950/30' },
    blocker: { label: '🚧 Blocker', color: 'border-red-800 bg-red-950/30' },
    action: { label: '⚡ Action Item', color: 'border-amber-800 bg-amber-950/30' },
  };

  const tabs = [
    { id: 'tasks' as const, label: 'Tasks', count: project.tasks.length },
    { id: 'notes' as const, label: 'Notes', count: project.notes.length },
    { id: 'files' as const, label: 'Files', count: project.files.length },
    { id: 'blockers' as const, label: 'Blockers', count: project.blockers.length },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link href="/" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mb-3"><ArrowLeft className="w-4 h-4" /> Back to Dashboard</Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              {project.name}
              {risk && <AlertTriangle className="w-5 h-5 text-red-400" />}
            </h1>
            <p className="text-sm text-slate-400 mt-1">{project.description}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-cyan-400">{progress}%</p>
            <div className="w-24 h-2 bg-slate-800 rounded-full mt-1 overflow-hidden">
              <div className={`h-full rounded-full transition-all ${progress === 100 ? 'bg-green-400' : 'bg-cyan-400'}`} style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-3">
          <p className="text-[10px] text-slate-500 uppercase">Status</p>
          <select value={project.status} onChange={e => updateProject(id, { status: e.target.value as Status })}
            className="bg-transparent text-sm font-medium mt-1 w-full focus:outline-none cursor-pointer">
            {statusOpts.map(s => <option key={s.value} value={s.value} className="bg-slate-900">{s.label}</option>)}
          </select>
        </div>
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-3">
          <p className="text-[10px] text-slate-500 uppercase">Priority</p>
          <select value={project.priority} onChange={e => updateProject(id, { priority: e.target.value as Priority })}
            className="bg-transparent text-sm font-medium mt-1 w-full focus:outline-none cursor-pointer">
            {priorityOpts.map(p => <option key={p.value} value={p.value} className="bg-slate-900">{p.label}</option>)}
          </select>
        </div>
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-3">
          <p className="text-[10px] text-slate-500 uppercase">Deadline</p>
          <input type="date" value={project.deadline || ''} onChange={e => updateProject(id, { deadline: e.target.value })}
            className="bg-transparent text-sm font-medium mt-1 w-full focus:outline-none" />
          {days !== null && <p className={`text-[10px] mt-0.5 ${days < 0 ? 'text-red-400' : days <= 7 ? 'text-amber-400' : 'text-slate-500'}`}>
            {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due today' : `${days}d left`}
          </p>}
        </div>
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-3">
          <p className="text-[10px] text-slate-500 uppercase">Owner</p>
          <input type="text" value={project.owner || ''} onChange={e => updateProject(id, { owner: e.target.value })}
            className="bg-transparent text-sm font-medium mt-1 w-full focus:outline-none" placeholder="Assign..." />
        </div>
      </div>

      {/* Goal */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
        <p className="text-[10px] text-slate-500 uppercase mb-1">Goal</p>
        <p className="text-sm text-slate-300">{project.goal || 'No goal defined yet.'}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-800 pb-0">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t.id ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-500 hover:text-white'}`}>
            {t.label} <span className="text-xs opacity-60">({t.count})</span>
          </button>
        ))}
      </div>

      {/* Tasks */}
      {tab === 'tasks' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()}
              placeholder="Add a task..." className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-700" />
            <button onClick={addTask} className="px-4 py-2.5 bg-cyan-600 rounded-lg text-sm font-medium hover:bg-cyan-500"><Plus className="w-4 h-4" /></button>
          </div>
          {project.tasks.sort((a, b) => {
            if (a.status === 'done' && b.status !== 'done') return 1;
            if (a.status !== 'done' && b.status === 'done') return -1;
            return 0;
          }).map(t => (
            <div key={t.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${t.status === 'done' ? 'bg-slate-900/50 border-slate-800/50 opacity-60' : 'bg-slate-900 border-slate-800'}`}>
              <button onClick={() => toggleTask(t.id)} className="flex-shrink-0">
                {t.status === 'done' ? <CheckSquare className="w-5 h-5 text-green-400" /> : <Square className="w-5 h-5 text-slate-600" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${t.status === 'done' ? 'line-through text-slate-500' : ''}`}>{t.title}</p>
                <div className="flex gap-3 mt-0.5 text-[10px] text-slate-500">
                  {t.assignee && <span>👤 {t.assignee}</span>}
                  {t.dueDate && <span className={isOverdue(t.dueDate) && t.status !== 'done' ? 'text-red-400' : ''}>📅 {t.dueDate}</span>}
                </div>
              </div>
              <button onClick={() => deleteTask(t.id)} className="p-1 hover:bg-slate-800 rounded opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5 text-slate-600 hover:text-red-400" /></button>
            </div>
          ))}
          {project.tasks.length === 0 && <p className="text-sm text-slate-600 text-center py-8">No tasks yet. Add one above.</p>}
        </div>
      )}

      {/* Notes */}
      {tab === 'notes' && (
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex gap-2">
              {(['update', 'decision', 'blocker', 'action'] as Note['type'][]).map(t => (
                <button key={t} onClick={() => setNoteType(t)}
                  className={`text-xs px-3 py-1.5 rounded-lg ${noteType === t ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {noteTypeConfig[t].label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newNote} onChange={e => setNewNote(e.target.value)} onKeyDown={e => e.key === 'Enter' && addNote()}
                placeholder={`Add ${noteType}...`} className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-700" />
              <button onClick={addNote} className="px-4 py-2.5 bg-cyan-600 rounded-lg text-sm font-medium hover:bg-cyan-500"><Plus className="w-4 h-4" /></button>
            </div>
          </div>
          {[...project.notes].reverse().map(n => (
            <div key={n.id} className={`p-3 rounded-lg border ${noteTypeConfig[n.type].color}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-medium">{noteTypeConfig[n.type].label}</span>
                <span className="text-[10px] text-slate-500">{new Date(n.createdAt).toLocaleDateString()} · {n.author}</span>
              </div>
              <p className="text-sm text-slate-300">{n.content}</p>
            </div>
          ))}
          {project.notes.length === 0 && <p className="text-sm text-slate-600 text-center py-8">No notes yet.</p>}
        </div>
      )}

      {/* Files */}
      {tab === 'files' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input value={newFile.name} onChange={e => setNewFile(f => ({ ...f, name: e.target.value }))}
              placeholder="Name" className="w-1/3 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-700" />
            <input value={newFile.url} onChange={e => setNewFile(f => ({ ...f, url: e.target.value }))}
              placeholder="URL" className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-700" />
            <button onClick={addFile} className="px-4 py-2.5 bg-cyan-600 rounded-lg text-sm font-medium hover:bg-cyan-500"><Plus className="w-4 h-4" /></button>
          </div>
          {project.files.map(f => (
            <a key={f.id} href={f.url} target="_blank" rel="noopener"
              className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg border border-slate-800 hover:border-cyan-700/50 transition-colors">
              {f.type === 'repo' ? <GitBranch className="w-4 h-4 text-purple-400" /> : f.type === 'file' ? <FileText className="w-4 h-4 text-green-400" /> : <Link2 className="w-4 h-4 text-cyan-400" />}
              <span className="text-sm flex-1">{f.name}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
            </a>
          ))}
          {project.files.length === 0 && <p className="text-sm text-slate-600 text-center py-8">No files or links yet.</p>}
        </div>
      )}

      {/* Blockers */}
      {tab === 'blockers' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input value={newBlocker} onChange={e => setNewBlocker(e.target.value)} onKeyDown={e => e.key === 'Enter' && addBlocker()}
              placeholder="Add a blocker..." className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-700" />
            <button onClick={addBlocker} className="px-4 py-2.5 bg-red-600 rounded-lg text-sm font-medium hover:bg-red-500"><Plus className="w-4 h-4" /></button>
          </div>
          {project.blockers.map((b, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-red-950/30 rounded-lg border border-red-900/30">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-sm flex-1">{b}</p>
              <button onClick={() => removeBlocker(i)} className="p-1 hover:bg-red-900/30 rounded"><X className="w-4 h-4 text-red-400/50 hover:text-red-400" /></button>
            </div>
          ))}
          {project.blockers.length === 0 && (
            <div className="text-center py-8"><p className="text-sm text-green-400">✅ No blockers — clear path ahead</p></div>
          )}
        </div>
      )}
    </div>
  );
}
