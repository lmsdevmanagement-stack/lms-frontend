'use client';

import { Input } from '@/app/components/ui/input';
import { Modal } from '@/app/components/ui/modal';
import type { DashboardCrud } from '@/app/hooks/useDashboardCrud';
import FormField, { selectClassName } from '@/app/components/modals/dashboard/FormField';
import ModalActions from '@/app/components/modals/dashboard/ModalActions';

interface SchoolAdminModalProps {
  crud: DashboardCrud;
}

export default function SchoolAdminModal({ crud }: SchoolAdminModalProps) {
  const disabled = !crud.schoolAdminForm.fullName || !crud.schoolAdminForm.email || !crud.schoolAdminForm.schoolId;

  return (
    <Modal
      open={crud.schoolAdminModalOpen}
      title={crud.editingSchoolAdminId ? 'Edit School Admin' : 'Create School Admin'}
      description="Add an admin user for this school. The admin will be scoped to the selected organization."
      onClose={() => crud.setSchoolAdminModalOpen(false)}
    >
      <div className="grid gap-4">
        <FormField label="School">
          <select
            className={selectClassName}
            value={crud.schoolAdminForm.schoolId}
            onChange={(event) => {
              const selectedSchool = crud.schools.find((school) => school.id === Number(event.target.value));
              crud.setSchoolAdminForm({
                ...crud.schoolAdminForm,
                schoolId: Number(event.target.value),
                organizationId: selectedSchool?.organizationId || crud.schoolAdminForm.organizationId,
              });
            }}
          >
            <option value={0}>Select school</option>
            {crud.schools.map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}
          </select>
        </FormField>
        <FormField label="Full Name">
          <Input value={crud.schoolAdminForm.fullName} onChange={(event) => crud.setSchoolAdminForm({ ...crud.schoolAdminForm, fullName: event.target.value })} />
        </FormField>
        <FormField label="Email">
          <Input
            type="email"
            value={crud.schoolAdminForm.email}
            disabled={Boolean(crud.editingSchoolAdminId)}
            onChange={(event) => crud.setSchoolAdminForm({ ...crud.schoolAdminForm, email: event.target.value })}
          />
        </FormField>
        {!crud.editingSchoolAdminId && (
          <FormField label="Password">
            <Input
              type="password"
              value={crud.schoolAdminForm.password}
              onChange={(event) => crud.setSchoolAdminForm({ ...crud.schoolAdminForm, password: event.target.value })}
              placeholder="Password123!"
            />
          </FormField>
        )}
        <ModalActions
          submitLabel={crud.editingSchoolAdminId ? 'Save Changes' : 'Create Admin'}
          saving={crud.saving}
          disabled={disabled}
          onCancel={() => crud.setSchoolAdminModalOpen(false)}
          onSubmit={crud.saveSchoolAdmin}
        />
      </div>
    </Modal>
  );
}
