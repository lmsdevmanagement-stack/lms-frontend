'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LogOut, User, Shield, GraduationCap, Building2, Calendar, DollarSign, Users2, TrendingUp } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { logout } from '../redux/slices/authSlice';


interface StatItem {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export default function Dashboard() {
  const { user, role, permissions, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  const stats: StatItem[] = [
    { label: 'Total Students', value: '1,234', icon: Users2, color: 'from-blue-500 to-cyan-500' },
    { label: 'Total Teachers', value: '89', icon: GraduationCap, color: 'from-green-500 to-emerald-500' },
    { label: 'Attendance Rate', value: '94%', icon: Calendar, color: 'from-purple-500 to-pink-500' },
    { label: 'Fee Collection', value: '78%', icon: DollarSign, color: 'from-yellow-500 to-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">School Management</h1>
              <p className="text-xs text-slate-400">Dashboard</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition border border-red-500/30"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">
                Welcome back, {user?.full_name || 'User'}!
              </h2>
              <p className="text-slate-400">{user?.email}</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-full border border-green-500/30">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium capitalize">{role}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition group"
            >
              <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl w-fit mb-4 group-hover:scale-110 transition`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Permissions Grid */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">Your Permissions</h3>
          </div>
          {permissions.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {permissions.map((permission) => (
                <div
                  key={permission}
                  className="px-4 py-3 bg-indigo-500/20 text-indigo-300 rounded-xl text-center font-medium capitalize border border-indigo-500/30 hover:bg-indigo-500/30 transition"
                >
                  {permission}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">No permissions assigned</p>
          )}
        </div>

        {/* Organization Info */}
        {user?.organization_id && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-indigo-400" />
              <h3 className="text-lg font-semibold text-white">Organization Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-sm text-slate-400 mb-1">Organization ID</p>
                <p className="text-lg font-semibold text-white">{user.organization_id}</p>
              </div>
              {user.school_id && (
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-sm text-slate-400 mb-1">School ID</p>
                  <p className="text-lg font-semibold text-white">{user.school_id}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Quick Actions</h3>
              <p className="text-indigo-100 text-sm">Manage your school efficiently</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition backdrop-blur-sm border border-white/20">
                <TrendingUp className="h-4 w-4 inline mr-2" />
                Reports
              </button>
              <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-medium">
                Settings
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
