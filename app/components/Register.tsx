'use client';

import { Lock } from 'lucide-react';
import { APP_ROUTES } from '@/app/constants/routes';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

export default function Register() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Signup is disabled</CardTitle>
          <p className="text-sm text-slate-500">Users can only login with credentials created by the Super Admin.</p>
        </CardHeader>
        <CardContent>
          <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
            <div className="flex gap-3">
              <Lock className="mt-0.5 h-5 w-5" />
              <p className="text-sm">
                School admins, teachers, and students are created from the dashboard. Registration is intentionally closed.
              </p>
            </div>
          </div>
          <a href={APP_ROUTES.login}>
            <Button className="w-full">Go to Login</Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
