'use client';

import CreateStudentModal from '@/app/components/modals/CreateStudentModal';
import EditStudentModal from '@/app/components/modals/EditStudentModal';
import AttendanceModal from '@/app/components/modals/dashboard/AttendanceModal';
import ClassModal from '@/app/components/modals/dashboard/ClassModal';
import DeleteConfirmationModal from '@/app/components/modals/dashboard/DeleteConfirmationModal';
import ExpenseModal from '@/app/components/modals/dashboard/ExpenseModal';
import FeeModal from '@/app/components/modals/dashboard/FeeModal';
import PermissionModal from '@/app/components/modals/dashboard/PermissionModal';
import ResultModal from '@/app/components/modals/dashboard/ResultModal';
import SalaryModal from '@/app/components/modals/dashboard/SalaryModal';
import ScheduleModal from '@/app/components/modals/dashboard/ScheduleModal';
import SchoolAdminModal from '@/app/components/modals/dashboard/SchoolAdminModal';
import SchoolModal from '@/app/components/modals/dashboard/SchoolModal';
import TeacherModal from '@/app/components/modals/dashboard/TeacherModal';
import WorkModal from '@/app/components/modals/dashboard/WorkModal';
import type { DashboardDialogsProps } from '@/app/types/dashboard';

export default function DashboardDialogs({
  crud,
  isSuperAdmin,
  deleteTarget,
  setDeleteTarget,
  permissionTarget,
  setPermissionTarget,
}: DashboardDialogsProps) {
  return (
    <>
      <SchoolModal crud={crud} />
      <ClassModal crud={crud} isSuperAdmin={isSuperAdmin} />
      <TeacherModal crud={crud} isSuperAdmin={isSuperAdmin} />
      <SchoolAdminModal crud={crud} />
      <CreateStudentModal crud={crud} isSuperAdmin={isSuperAdmin} />
      <EditStudentModal crud={crud} isSuperAdmin={isSuperAdmin} />
      <AttendanceModal crud={crud} />
      <FeeModal crud={crud} />
      <SalaryModal crud={crud} />
      <ExpenseModal crud={crud} />
      <ScheduleModal crud={crud} />
      <WorkModal crud={crud} />
      <ResultModal crud={crud} />
      <PermissionModal crud={crud} permissionTarget={permissionTarget} setPermissionTarget={setPermissionTarget} />
      <DeleteConfirmationModal crud={crud} deleteTarget={deleteTarget} setDeleteTarget={setDeleteTarget} />
    </>
  );
}
