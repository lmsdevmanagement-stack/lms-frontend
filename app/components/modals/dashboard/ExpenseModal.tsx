'use client';

import { Input } from '@/app/components/ui/input';
import { Modal } from '@/app/components/ui/modal';
import type { DashboardCrud } from '@/app/hooks/useDashboardCrud';
import type { ExpenseRow } from '@/app/types';
import FormField, { selectClassName } from '@/app/components/modals/dashboard/FormField';
import ModalActions from '@/app/components/modals/dashboard/ModalActions';

interface ExpenseModalProps {
  crud: DashboardCrud;
}

export default function ExpenseModal({ crud }: ExpenseModalProps) {
  return (
    <Modal
      open={crud.expenseModalOpen}
      title={crud.editingExpenseId ? 'Edit Expense' : 'Add Expense'}
      description="Record organization or school expenses."
      onClose={() => crud.setExpenseModalOpen(false)}
    >
      <div className="grid gap-4">
        <FormField label="Title">
          <Input value={crud.expenseForm.title} onChange={(event) => crud.setExpenseForm({ ...crud.expenseForm, title: event.target.value })} />
        </FormField>
        <FormField label="Category">
          <Input value={crud.expenseForm.category} onChange={(event) => crud.setExpenseForm({ ...crud.expenseForm, category: event.target.value })} />
        </FormField>
        <FormField label="Date">
          <Input type="date" value={crud.expenseForm.date} onChange={(event) => crud.setExpenseForm({ ...crud.expenseForm, date: event.target.value })} />
        </FormField>
        <FormField label="Period">
          <select className={selectClassName} value={crud.expenseForm.period} onChange={(event) => crud.setExpenseForm({ ...crud.expenseForm, period: event.target.value as ExpenseRow['period'] })}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </FormField>
        <FormField label="Amount">
          <Input type="number" value={crud.expenseForm.amount} onChange={(event) => crud.setExpenseForm({ ...crud.expenseForm, amount: Number(event.target.value) })} />
        </FormField>
        <FormField label="Vendor">
          <Input value={crud.expenseForm.vendor} onChange={(event) => crud.setExpenseForm({ ...crud.expenseForm, vendor: event.target.value })} />
        </FormField>
        <FormField label="Payment Method">
          <Input value={crud.expenseForm.paymentMethod} onChange={(event) => crud.setExpenseForm({ ...crud.expenseForm, paymentMethod: event.target.value })} />
        </FormField>
        <FormField label="Notes">
          <Input value={crud.expenseForm.notes} onChange={(event) => crud.setExpenseForm({ ...crud.expenseForm, notes: event.target.value })} />
        </FormField>
        <ModalActions
          submitLabel={crud.editingExpenseId ? 'Save Expense' : 'Add Expense'}
          saving={crud.saving}
          disabled={!crud.expenseForm.title || crud.expenseForm.amount <= 0}
          onCancel={() => crud.setExpenseModalOpen(false)}
          onSubmit={crud.saveExpense}
        />
      </div>
    </Modal>
  );
}
