'use client';

import { Input } from '@/app/components/ui/input';
import { Modal } from '@/app/components/ui/modal';
import type { DashboardCrud } from '@/app/hooks/useDashboardCrud';
import type { ClassRow } from '@/app/types';
import FormField, { selectClassName } from '@/app/components/modals/dashboard/FormField';
import ModalActions from '@/app/components/modals/dashboard/ModalActions';

interface ClassModalProps {
  crud: DashboardCrud;
  isSuperAdmin: boolean;
}

export default function ClassModal({ crud, isSuperAdmin }: ClassModalProps) {
  const disabled = !crud.classForm.name || (isSuperAdmin && !crud.classForm.schoolId);

  return (
    <Modal
      open={crud.classModalOpen}
      title={crud.editingClassId ? 'Edit Class' : 'Create Class'}
      description="Manage class details for student assignment."
      onClose={() => crud.setClassModalOpen(false)}
      size="wide"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {isSuperAdmin && (
          <FormField label="School">
            <select className={selectClassName} value={crud.classForm.schoolId} onChange={(event) => crud.setClassForm({ ...crud.classForm, schoolId: Number(event.target.value) })}>
              <option value={0}>Select school</option>
              {crud.schools.map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}
            </select>
          </FormField>
        )}
        <FormField label="Class Name">
          <Input value={crud.classForm.name} onChange={(event) => crud.setClassForm({ ...crud.classForm, name: event.target.value })} />
        </FormField>
        <FormField label="Section">
          <Input value={crud.classForm.section} onChange={(event) => crud.setClassForm({ ...crud.classForm, section: event.target.value })} />
        </FormField>
        <FormField label="Details">
          <Input value={crud.classForm.description} onChange={(event) => crud.setClassForm({ ...crud.classForm, description: event.target.value })} />
        </FormField>
        <FormField label="Teacher">
          <select className={selectClassName} value={crud.classForm.teacherId} onChange={(event) => crud.setClassForm({ ...crud.classForm, teacherId: Number(event.target.value) })}>
            <option value={0}>Unassigned</option>
            {crud.teachers
              .filter((teacher) => teacher.schoolId === crud.classForm.schoolId)
              .map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.name}</option>)}
          </select>
        </FormField>
        <FormField label="Status">
          <select className={selectClassName} value={crud.classForm.status} onChange={(event) => crud.setClassForm({ ...crud.classForm, status: event.target.value as ClassRow['status'] })}>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </FormField>
        <ModalActions
          submitLabel={crud.editingClassId ? 'Save Changes' : 'Create Class'}
          savingLabel="Saving..."
          saving={crud.saving}
          disabled={disabled}
          onCancel={() => crud.setClassModalOpen(false)}
          onSubmit={crud.saveClass}
          onSecondarySubmit={!crud.editingClassId ? async () => {
            await crud.saveClass();
            crud.openCreateClassModal();
          } : undefined}
        />
      </div>
    </Modal>
  );
}
