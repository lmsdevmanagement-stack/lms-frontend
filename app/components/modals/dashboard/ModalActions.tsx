'use client';

import { Button } from '@/app/components/ui/button';

interface ModalActionsProps {
  cancelLabel?: string;
  submitLabel: string;
  savingLabel?: string;
  saving?: boolean;
  disabled?: boolean;
  destructive?: boolean;
  secondarySubmitLabel?: string;
  onCancel: () => void;
  onSubmit: () => void | Promise<void>;
  onSecondarySubmit?: () => void | Promise<void>;
}

export default function ModalActions({
  cancelLabel = 'Cancel',
  submitLabel,
  savingLabel = 'Saving...',
  saving = false,
  disabled = false,
  destructive = false,
  secondarySubmitLabel,
  onCancel,
  onSubmit,
  onSecondarySubmit,
}: ModalActionsProps) {
  return (
    <div className="sticky bottom-0 -mx-4 -mb-4 mt-2 flex justify-end gap-2 border-t border-slate-200 bg-white p-4 sm:-mx-5 sm:-mb-5 md:col-span-2">
      <Button variant="outline" disabled={saving} onClick={onCancel}>
        {cancelLabel}
      </Button>
      {onSecondarySubmit && (
        <Button variant="outline" disabled={saving || disabled} onClick={onSecondarySubmit}>
          {saving ? savingLabel : secondarySubmitLabel || 'Save & New'}
        </Button>
      )}
      <Button variant={destructive ? 'destructive' : 'default'} disabled={saving || disabled} onClick={onSubmit}>
        {saving ? savingLabel : submitLabel}
      </Button>
    </div>
  );
}
