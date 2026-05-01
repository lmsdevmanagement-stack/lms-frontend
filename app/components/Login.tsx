'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { GraduationCap, Loader2 } from 'lucide-react';
import { APP_ROUTES } from '../constants/routes';
import { clearError, login } from '../redux/slices/authSlice';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Input from './Input';
import type { AppDispatch, RootState } from '../redux/store';

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (isAuthenticated) {
    router.push(APP_ROUTES.dashboard);
    return null;
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await dispatch(login(formData));
    if (login.fulfilled.match(result)) {
      router.push(APP_ROUTES.dashboard);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-slate-900">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <CardTitle>LMS Admin Login</CardTitle>
          <p className="text-sm text-slate-500">Login with your Super Admin or School Admin credentials.</p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-5 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              name="email"
              label="Email Address"
              icon="email"
              placeholder="lms.dev.management@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              type="password"
              name="password"
              label="Password"
              icon="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              showPasswordToggle
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword((current) => !current)}
              required
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
