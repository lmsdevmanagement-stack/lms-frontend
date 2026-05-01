'use client';

import { LogOut, PanelLeftOpen, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { DASHBOARD_NAV_ITEMS } from '../../constants/dashboard';
import { APP_ROUTES } from '../../constants/routes';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import type { DashboardSection, UserResponse } from '../../types';
import type { UserRole } from '../../constants/roles';

interface DashboardLayoutProps {
  user: UserResponse | null;
  role: UserRole | null;
  activeSection: DashboardSection;
  searchTerm: string;
  onSectionChange: (section: DashboardSection) => void;
  onSearchChange: (value: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function DashboardLayout({
  user,
  role,
  activeSection,
  searchTerm,
  onSectionChange,
  onSearchChange,
  onLogout,
  children,
}: DashboardLayoutProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const effectiveRole = role || user?.role || null;
  const navItems = useMemo(
    () => (effectiveRole ? DASHBOARD_NAV_ITEMS.filter((item) => item.roles.includes(effectiveRole)) : []),
    [effectiveRole]
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white transition lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
            <div>
              <h1 className="text-base font-semibold">LMS Dashboard</h1>
              <p className="text-xs capitalize text-slate-500">{effectiveRole?.replace('_', ' ') || 'admin'}</p>
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 lg:hidden"
              onClick={() => setOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSectionChange(item.id);
                    router.push(item.id === 'overview' ? APP_ROUTES.dashboard : APP_ROUTES.dashboardSection(item.id));
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                    active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="border-t border-slate-200 p-4">
            <div className="mb-3 rounded-md bg-slate-50 p-3">
              <p className="truncate text-sm font-medium">{user?.full_name || 'Admin'}</p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
            <Button variant="outline" className="w-full" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {open && <button type="button" aria-label="Close menu" className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open sidebar"
            >
              <PanelLeftOpen className="h-5 w-5" />
            </button>
            <div className="relative max-w-xl flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search schools, admins, teachers, students"
                className="pl-9"
              />
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
