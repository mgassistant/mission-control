'use client';

import './globals.css';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, FolderKanban, MessageSquare, CalendarCheck, Menu, X, Rocket } from 'lucide-react';

const nav = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/comms', label: 'Comms', icon: MessageSquare },
  { href: '/review', label: 'Weekly Review', icon: CalendarCheck },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className="bg-slate-950 text-white min-h-screen">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className={`fixed inset-y-0 left-0 z-40 w-56 bg-slate-900 border-r border-slate-800 transform transition-transform lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Mission Control</p>
                <p className="text-[10px] text-slate-400">Command Center</p>
              </div>
            </div>
            <nav className="p-3 space-y-1">
              {nav.map(n => {
                const active = pathname === n.href || (n.href !== '/' && pathname.startsWith(n.href));
                return (
                  <Link key={n.href} href={n.href} onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-cyan-600/20 text-cyan-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                    <n.icon className="w-4 h-4" /> {n.label}
                  </Link>
                );
              })}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold">MG</div>
                <div>
                  <p className="text-xs font-medium text-white">Maria Gutierrez</p>
                  <p className="text-[10px] text-slate-500">Owner / Operator</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Overlay */}
          {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

          {/* Main */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-slate-900/80 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center gap-3 lg:px-6 sticky top-0 z-20">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-slate-800 rounded-lg">
                <Menu className="w-5 h-5 text-slate-400" />
              </button>
              <div className="flex-1" />
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                System Online
              </div>
            </header>
            <main className="flex-1 overflow-y-auto p-4 lg:p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
