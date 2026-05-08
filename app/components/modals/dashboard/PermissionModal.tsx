'use client';

import PermissionsMatrix from '@/app/components/dashboard/PermissionsMatrix';
import { Modal } from '@/app/components/ui/modal';
import type { DashboardCrud } from '@/app/hooks/useDashboardCrud';
import type { DashboardPermissionTarget } from '@/app/types/dashboard';

interface PermissionModalProps {
  crud: DashboardCrud;
  permissionTarget: DashboardPermissionTarget | null;
  setPermissionTarget: (target: DashboardPermissionTarget | null) => void;
}

export default function PermissionModal({ crud, permissionTarget, setPermissionTarget }: PermissionModalProps) {
  const section = permissionTarget?.type === 'school-admin'
    ? 'admin-permissions'
    : permissionTarget?.type === 'teacher'
      ? 'teacher-permissions'
      : 'student-permissions';
  const title = permissionTarget?.type === 'school-admin'
    ? 'Manage Admin Permissions'
    : permissionTarget?.type === 'teacher'
      ? 'Manage Teacher Permissions'
      : 'Manage Student Permissions';

  const savePermissions = async (permissions: string[]) => {
    if (!permissionTarget) return;
    if (permissionTarget.type === 'school-admin') {
      await crud.saveSchoolAdminPermissions(permissionTarget.row, permissions);
    } else if (permissionTarget.type === 'teacher') {
      await crud.saveTeacherPermissions(permissionTarget.row, permissions);
    } else {
      await crud.saveStudentPermissions(permissionTarget.row, permissions);
    }
    setPermissionTarget(null);
  };

  return (
    <Modal
      open={permissionTarget !== null}
      title={title}
      description={permissionTarget ? `Set individual access for ${permissionTarget.row.name}.` : 'Set individual access.'}
      onClose={() => setPermissionTarget(null)}
      size="wide"
      bodyClassName="p-0"
    >
      {permissionTarget && (
        <PermissionsMatrix
          section={section}
          title={permissionTarget.row.name}
          description={`${permissionTarget.school} - ${permissionTarget.email}`}
          value={permissionTarget.row.permissions}
          saving={crud.saving}
          onSave={savePermissions}
        />
      )}
    </Modal>
  );
}
