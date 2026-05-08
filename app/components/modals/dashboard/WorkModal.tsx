'use client';

import { Input } from '@/app/components/ui/input';
import { Modal } from '@/app/components/ui/modal';
import type { DashboardCrud } from '@/app/hooks/useDashboardCrud';
import FormField, { selectClassName } from '@/app/components/modals/dashboard/FormField';
import ModalActions from '@/app/components/modals/dashboard/ModalActions';

interface WorkModalProps {
  crud: DashboardCrud;
}

export default function WorkModal({ crud }: WorkModalProps) {
  return (
    <Modal
      open={crud.workModalOpen}
      title={crud.editingWorkId ? 'Edit Class Work' : 'Add Class Work'}
      description="Manage class work."
      onClose={() => crud.setWorkModalOpen(false)}
    >
      <div className="grid gap-4">
        <FormField label="Class">
          <select
            className={selectClassName}
            value={crud.workForm.classId}
            onChange={(event) => {
              const classId = Number(event.target.value);
              const schoolClass = crud.classes.find((item) => item.id === classId);
              crud.setWorkForm({ ...crud.workForm, classId, teacherId: schoolClass?.teacherId || 0 });
            }}
          >
            <option value={0}>Select class</option>
            {crud.classes.map((schoolClass) => (
              <option key={schoolClass.id} value={schoolClass.id}>
                {schoolClass.section ? `${schoolClass.name} - ${schoolClass.section}` : schoolClass.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Title">
          <Input value={crud.workForm.title} onChange={(event) => crud.setWorkForm({ ...crud.workForm, title: event.target.value })} />
        </FormField>
        <FormField label="Due Date">
          <Input type="date" value={crud.workForm.dueDate} onChange={(event) => crud.setWorkForm({ ...crud.workForm, dueDate: event.target.value })} />
        </FormField>
        <FormField label="Details">
          <Input value={crud.workForm.description} onChange={(event) => crud.setWorkForm({ ...crud.workForm, description: event.target.value })} />
        </FormField>
        <ModalActions
          submitLabel="Save Work"
          saving={crud.saving}
          disabled={!crud.workForm.classId || !crud.workForm.title}
          onCancel={() => crud.setWorkModalOpen(false)}
          onSubmit={crud.saveWork}
        />
      </div>
    </Modal>
  );
}
