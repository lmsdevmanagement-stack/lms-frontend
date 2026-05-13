'use client';

import { Modal } from '@/app/components/ui/modal';
import StudentFormFields from '@/app/components/forms/StudentFormFields';
import ModalActions from '@/app/components/modals/dashboard/ModalActions';
import type { DashboardCrud } from '@/app/hooks/useDashboardCrud';

interface CreateStudentModalProps {
  crud: DashboardCrud;
  isSuperAdmin: boolean;
}

export default function CreateStudentModal({ crud, isSuperAdmin }: CreateStudentModalProps) {
  const open = crud.studentModalOpen && !crud.editingStudentId;
  const disabled = crud.saving || !crud.studentForm.name || !crud.studentForm.email || (isSuperAdmin && !crud.studentForm.schoolId) || !crud.studentForm.classId;

  return (
    <Modal
      open={open}
      title="Create Student"
      description="Manage student account and access status."
      onClose={() => crud.setStudentModalOpen(false)}
      size="wide"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <StudentFormFields crud={crud} isSuperAdmin={isSuperAdmin} showPassword />
        <ModalActions
          submitLabel="Create Student"
          saving={crud.saving}
          disabled={disabled}
          onCancel={() => crud.setStudentModalOpen(false)}
          onSubmit={crud.saveStudent}
          onSecondarySubmit={async () => {
            await crud.saveStudent();
            crud.openCreateStudentModal();
          }}
        />
      </div>
    </Modal>
  );
}
