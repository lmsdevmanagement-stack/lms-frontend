'use client';

import { Input } from '@/app/components/ui/input';
import { Modal } from '@/app/components/ui/modal';
import type { DashboardCrud } from '@/app/hooks/useDashboardCrud';
import type { FeeRow } from '@/app/types';
import FormField, { selectClassName } from '@/app/components/modals/dashboard/FormField';
import ModalActions from '@/app/components/modals/dashboard/ModalActions';

interface FeeModalProps {
  crud: DashboardCrud;
}

export default function FeeModal({ crud }: FeeModalProps) {
  return (
    <Modal
      open={crud.feeModalOpen}
      title={crud.editingFeeId ? 'Edit Fee' : 'Assign Monthly Fee'}
      description="Assign monthly fees and track payment status."
      onClose={() => crud.setFeeModalOpen(false)}
      size="wide"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Student">
          <select className={selectClassName} value={crud.feeForm.studentId} disabled={Boolean(crud.editingFeeId)} onChange={(event) => crud.setFeeForm({ ...crud.feeForm, studentId: Number(event.target.value) })}>
            <option value={0}>Select student</option>
            {crud.students.map((student) => <option key={student.id} value={student.id}>{student.name} - {student.className}</option>)}
          </select>
        </FormField>
        <FormField label="Month">
          <Input type="month" value={crud.feeForm.month} onChange={(event) => crud.setFeeForm({ ...crud.feeForm, month: event.target.value })} />
        </FormField>
        <FormField label="Amount">
          <Input type="number" value={crud.feeForm.amount} onChange={(event) => crud.setFeeForm({ ...crud.feeForm, amount: Number(event.target.value) })} />
        </FormField>
        <FormField label="Status">
          <select className={selectClassName} value={crud.feeForm.status} onChange={(event) => crud.setFeeForm({ ...crud.feeForm, status: event.target.value as FeeRow['status'] })}>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>
        </FormField>
        <FormField label="Notes">
          <Input value={crud.feeForm.notes} onChange={(event) => crud.setFeeForm({ ...crud.feeForm, notes: event.target.value })} />
        </FormField>
        <ModalActions
          submitLabel={crud.editingFeeId ? 'Save Fee' : 'Assign Fee'}
          saving={crud.saving}
          disabled={!crud.feeForm.studentId || !crud.feeForm.month || crud.feeForm.amount <= 0}
          onCancel={() => crud.setFeeModalOpen(false)}
          onSubmit={crud.saveFee}
          onSecondarySubmit={!crud.editingFeeId ? async () => {
            await crud.saveFee();
            crud.openCreateFeeModal();
          } : undefined}
        />
      </div>
    </Modal>
  );
}
