'use client';

import { Button } from '@/app/components/ui/button';

interface ModalActionsProps {
  cancelLabel?: string;
  submitLabel: string;
  savingLabel?: string;
  saving?: boolean;
  disabled?: boolean;
  destructive?: boolean;
  onCancel: () => void;
  onSubmit: () => void | Promise<void>;
}

export default function ModalActions({
  cancelLabel = 'Cancel',
  submitLabel,
  savingLabel = 'Saving...',
  saving = false,
  disabled = false,
  destructive = false,
  onCancel,
  onSubmit,
}: ModalActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" disabled={saving} onClick={onCancel}>
        {cancelLabel}
      </Button>
      <Button variant={destructive ? 'destructive' : 'default'} disabled={saving || disabled} onClick={onSubmit}>
        {saving ? savingLabel : submitLabel}
      </Button>
    </div>
  );
}
