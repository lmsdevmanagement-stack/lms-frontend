'use client';

import { Input } from '@/app/components/ui/input';
import { Modal } from '@/app/components/ui/modal';
import type { DashboardCrud } from '@/app/hooks/useDashboardCrud';
import type { SalaryRow } from '@/app/types';
import FormField, { selectClassName } from '@/app/components/modals/dashboard/FormField';
import ModalActions from '@/app/components/modals/dashboard/ModalActions';

interface SalaryModalProps {
  crud: DashboardCrud;
}

export default function SalaryModal({ crud }: SalaryModalProps) {
  return (
    <Modal
      open={crud.salaryModalOpen}
      title={crud.editingSalaryId ? 'Edit Salary' : 'Assign Teacher Salary'}
      description="Assign teacher salaries and track paid or unpaid status."
      onClose={() => crud.setSalaryModalOpen(false)}
    >
      <div className="grid gap-4">
        <FormField label="Teacher">
          <select
            className={selectClassName}
            value={crud.salaryForm.teacherId}
            disabled={Boolean(crud.editingSalaryId)}
            onChange={(event) => {
              const teacherId = Number(event.target.value);
              const teacher = crud.teachers.find((item) => item.id === teacherId);
              crud.setSalaryForm({ ...crud.salaryForm, teacherId, amount: teacher?.salary || crud.salaryForm.amount });
            }}
          >
            <option value={0}>Select teacher</option>
            {crud.teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.name}</option>)}
          </select>
        </FormField>
        <FormField label="Month">
          <Input type="month" value={crud.salaryForm.month} onChange={(event) => crud.setSalaryForm({ ...crud.salaryForm, month: event.target.value })} />
        </FormField>
        <FormField label="Amount">
          <Input type="number" value={crud.salaryForm.amount} onChange={(event) => crud.setSalaryForm({ ...crud.salaryForm, amount: Number(event.target.value) })} />
        </FormField>
        <FormField label="Status">
          <select className={selectClassName} value={crud.salaryForm.status} onChange={(event) => crud.setSalaryForm({ ...crud.salaryForm, status: event.target.value as SalaryRow['status'] })}>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>
        </FormField>
        <FormField label="Notes">
          <Input value={crud.salaryForm.notes} onChange={(event) => crud.setSalaryForm({ ...crud.salaryForm, notes: event.target.value })} />
        </FormField>
        <ModalActions
          submitLabel={crud.editingSalaryId ? 'Save Salary' : 'Assign Salary'}
          saving={crud.saving}
          disabled={!crud.salaryForm.teacherId || !crud.salaryForm.month || crud.salaryForm.amount <= 0}
          onCancel={() => crud.setSalaryModalOpen(false)}
          onSubmit={crud.saveSalary}
        />
      </div>
    </Modal>
  );
}
