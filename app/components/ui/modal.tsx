import { X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/lib/utils';
import type React from 'react';

type ModalSize = 'default' | 'wide' | 'full';

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: ModalSize;
  bodyClassName?: string;
}

const sizes: Record<ModalSize, string> = {
  default: 'max-w-xl',
  wide: 'max-w-5xl',
  full: 'max-w-7xl',
};

export function Modal({ open, title, description, onClose, children, size = 'default', bodyClassName }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/40 p-3 sm:items-center sm:p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          'flex max-h-[calc(100dvh-1.5rem)] w-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg sm:max-h-[calc(100vh-2rem)]',
          sizes[size]
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 p-4 sm:p-5">
          <div className="min-w-0">
            <h2 id="modal-title" className="text-lg font-semibold text-slate-950">{title}</h2>
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
          </div>
          <Button variant="ghost" className="h-8 w-8 shrink-0 px-0" onClick={onClose} aria-label="Close modal">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className={cn('min-h-0 overflow-y-auto p-4 sm:p-5', bodyClassName)}>{children}</div>
        <div className="flex shrink-0 justify-end border-t border-slate-200 bg-white p-3 sm:p-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}
