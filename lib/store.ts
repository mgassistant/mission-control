'use client';

import { useState, useEffect } from 'react';
import { Project, SEED_PROJECTS, uid } from './data';

const STORAGE_KEY = 'mission-control-projects';

function loadProjects(): Project[] {
  if (typeof window === 'undefined') return SEED_PROJECTS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch { return SEED_PROJECTS; }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PROJECTS));
  return SEED_PROJECTS;
}

function saveProjects(projects: Project[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProjects(loadProjects());
    setLoaded(true);
  }, []);

  function update(fn: (prev: Project[]) => Project[]) {
    setProjects(prev => {
      const next = fn(prev);
      saveProjects(next);
      return next;
    });
  }

  function updateProject(id: string, patch: Partial<Project>) {
    update(prev => prev.map(p => p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString().split('T')[0] } : p));
  }

  function addProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'tasks' | 'notes' | 'files' | 'blockers'>) {
    const now = new Date().toISOString().split('T')[0];
    update(prev => [...prev, { ...project, id: uid(), tasks: [], notes: [], files: [], blockers: [], createdAt: now, updatedAt: now }]);
  }

  function deleteProject(id: string) {
    update(prev => prev.filter(p => p.id !== id));
  }

  return { projects, loaded, updateProject, addProject, deleteProject };
}
