import * as React from 'react';
import { cn } from '@/app/lib/utils';

type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'destructive';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-slate-900 text-white',
  secondary: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  destructive: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
};

export function Badge({ className, variant = 'secondary', ...props }: BadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center rounded-md px-2 py-1 text-xs font-medium capitalize', variants[variant], className)}
      {...props}
    />
  );
}
