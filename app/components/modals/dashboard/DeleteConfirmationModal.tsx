'use client';

import { Modal } from '@/app/components/ui/modal';
import type { DashboardCrud } from '@/app/hooks/useDashboardCrud';
import type { DashboardDeleteTarget } from '@/app/types/dashboard';
import ModalActions from '@/app/components/modals/dashboard/ModalActions';

interface DeleteConfirmationModalProps {
  crud: DashboardCrud;
  deleteTarget: DashboardDeleteTarget | null;
  setDeleteTarget: (target: DashboardDeleteTarget | null) => void;
}

export default function DeleteConfirmationModal({ crud, deleteTarget, setDeleteTarget }: DeleteConfirmationModalProps) {
  const deleteRecord = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'school') {
      await crud.deleteSchool(deleteTarget.row);
    } else if (deleteTarget.type === 'class') {
      await crud.deleteClass(deleteTarget.row);
    } else if (deleteTarget.type === 'school-admin') {
      await crud.deleteSchoolAdmin(deleteTarget.row);
    } else if (deleteTarget.type === 'student') {
      await crud.deleteStudent(deleteTarget.row);
    } else {
      await crud.deleteTeacher(deleteTarget.row);
    }
    setDeleteTarget(null);
  };

  return (
    <Modal
      open={deleteTarget !== null}
      title="Delete Record?"
      description="This will deactivate the record and remove it from the active dashboard list."
      onClose={() => setDeleteTarget(null)}
    >
      <div className="space-y-5">
        <div className="rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          Are you sure you want to delete <span className="font-semibold">{deleteTarget?.row.name}</span>?
        </div>
        <ModalActions
          submitLabel="Delete"
          savingLabel="Deleting..."
          saving={crud.saving}
          destructive
          onCancel={() => setDeleteTarget(null)}
          onSubmit={deleteRecord}
        />
      </div>
    </Modal>
  );
}
