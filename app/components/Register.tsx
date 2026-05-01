'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerAdmin, clearError } from '../redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import { Loader2, GraduationCap, Building, User } from 'lucide-react';
import { APP_ROUTES } from '../constants/routes';
import Input from './Input';
import type { RootState, AppDispatch } from '../redux/store';

interface UserData {
  email: string;
  full_name: string;
  password: string;
}

interface SchoolData {
  name: string;
  address: string;
}

interface FormData {
  user: UserData;
  school: SchoolData;
}

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    user: {
      email: '',
      full_name: '',
      password: '',
    },
    school: {
      name: '',
      address: '',
    },
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (isAuthenticated) {
    router.push(APP_ROUTES.dashboard);
    return null;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>, section: 'user' | 'school') => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await dispatch(registerAdmin(formData));
      if (registerAdmin.fulfilled.match(result)) {
        router.push(APP_ROUTES.registeredLogin);
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-">Register Your School</h1>
          <p className="text-slate-400">Create your school account to get started</p>
        </div>

        {/* Register Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* School Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-3 flex items-center gap-2">
                <Building className="h-5 w-5 text-indigo-400" />
                School Information
              </h2>
              
              <Input
                type="text"
                name="name"
                label="School Name"
                icon="building"
                placeholder="Green Valley School"
                value={formData.school.name}
                onChange={(e) => handleChange(e, 'school')}
                required
              />

              <Input
                type="text"
                name="address"
                label="School Address"
                icon="mapPin"
                placeholder="123 Education Street, City"
                value={formData.school.address}
                onChange={(e) => handleChange(e, 'school')}
                required
              />
            </div>

            {/* Admin Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-3 flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-400" />
                Admin Account
              </h2>
              
              <Input
                type="text"
                name="full_name"
                label="Full Name"
                icon="user"
                placeholder="John Doe"
                value={formData.user.full_name}
                onChange={(e) => handleChange(e, 'user')}
                required
              />

              <Input
                type="email"
                name="email"
                label="Email Address"
                icon="email"
                placeholder="admin@school.com"
                value={formData.user.email}
                onChange={(e) => handleChange(e, 'user')}
                required
              />

              <Input
                type="password"
                name="password"
                label="Password"
                icon="password"
                placeholder="••••••••"
                value={formData.user.password}
                onChange={(e) => handleChange(e, 'user')}
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                required
                minLength={6}
              />
              <p className="text-xs text-slate-500 -mt-3">Minimum 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 focus:ring-4 focus:ring-indigo-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create School Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Already have an account?{' '}
              <a href={APP_ROUTES.login} className="text-indigo-400 hover:text-indigo-300 font-medium transition">
                Sign in
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-8">
          © 2024 School Management SaaS. All rights reserved.
        </p>
      </div>
    </div>
  );
}
