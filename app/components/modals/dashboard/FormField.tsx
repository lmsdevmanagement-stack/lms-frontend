'use client';

import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  children: ReactNode;
}

export const selectClassName = 'h-10 rounded-md border border-slate-200 bg-white px-3 text-sm';

export default function FormField({ label, children }: FormFieldProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {label}
      {children}
    </label>
  );
}
