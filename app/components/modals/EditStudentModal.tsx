'use client';

import { Modal } from '@/app/components/ui/modal';
import StudentFormFields from '@/app/components/forms/StudentFormFields';
import ModalActions from '@/app/components/modals/dashboard/ModalActions';
import type { DashboardCrud } from '@/app/hooks/useDashboardCrud';

interface EditStudentModalProps {
  crud: DashboardCrud;
  isSuperAdmin: boolean;
}

export default function EditStudentModal({ crud, isSuperAdmin }: EditStudentModalProps) {
  const open = crud.studentModalOpen && Boolean(crud.editingStudentId);
  const disabled = crud.saving || !crud.studentForm.name || !crud.studentForm.email || (isSuperAdmin && !crud.studentForm.schoolId) || !crud.studentForm.classId;

  return (
    <Modal
      open={open}
      title="Edit Student"
      description="Manage student account and access status."
      onClose={() => crud.setStudentModalOpen(false)}
    >
      <div className="grid gap-4">
        <StudentFormFields crud={crud} isSuperAdmin={isSuperAdmin} />
        <ModalActions
          submitLabel="Save Changes"
          saving={crud.saving}
          disabled={disabled}
          onCancel={() => crud.setStudentModalOpen(false)}
          onSubmit={crud.saveStudent}
        />
      </div>
    </Modal>
  );
}
