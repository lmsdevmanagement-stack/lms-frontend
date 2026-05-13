'use client';

import { Input } from '@/app/components/ui/input';
import { Modal } from '@/app/components/ui/modal';
import type { DashboardCrud } from '@/app/hooks/useDashboardCrud';
import type { SchoolRow } from '@/app/types';
import FormField, { selectClassName } from '@/app/components/modals/dashboard/FormField';
import ModalActions from '@/app/components/modals/dashboard/ModalActions';

interface SchoolModalProps {
  crud: DashboardCrud;
}

export default function SchoolModal({ crud }: SchoolModalProps) {
  return (
    <Modal
      open={crud.schoolModalOpen}
      title={crud.editingSchoolId ? 'Edit School' : 'Create School'}
      description="Manage school profile and operational status."
      onClose={() => crud.setSchoolModalOpen(false)}
    >
      <div className="grid gap-4">
        <FormField label="School Name">
          <Input value={crud.schoolForm.name} onChange={(event) => crud.setSchoolForm({ ...crud.schoolForm, name: event.target.value })} />
        </FormField>
        <FormField label="Address">
          <Input value={crud.schoolForm.address} onChange={(event) => crud.setSchoolForm({ ...crud.schoolForm, address: event.target.value })} />
        </FormField>
        <FormField label="Status">
          <select className={selectClassName} value={crud.schoolForm.status} onChange={(event) => crud.setSchoolForm({ ...crud.schoolForm, status: event.target.value as SchoolRow['status'] })}>
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="blocked">Blocked</option>
          </select>
        </FormField>
        <ModalActions
          submitLabel={crud.editingSchoolId ? 'Save Changes' : 'Create School'}
          saving={crud.saving}
          disabled={!crud.schoolForm.name}
          onCancel={() => crud.setSchoolModalOpen(false)}
          onSubmit={crud.saveSchool}
          onSecondarySubmit={!crud.editingSchoolId ? async () => {
            await crud.saveSchool();
            crud.openCreateSchoolModal();
          } : undefined}
        />
      </div>
    </Modal>
  );
}
