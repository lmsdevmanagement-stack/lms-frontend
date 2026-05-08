import type { LucideIcon } from 'lucide-react';
import type React from 'react';
import type { UserRole } from '../constants/roles';
import { DashboardCrud } from '../hooks/useDashboardCrud';
import { ActivityResponse } from './activities';

export interface NavigationItem {
  id: DashboardSection;
  label: string;
  icon: LucideIcon;
  roles: UserRole[];
}

export type DashboardSection =
  | 'overview'
  | 'schools'
  | 'classes'
  | 'attendance'
  | 'fees'
  | 'salaries'
  | 'schedule'
  | 'work'
  | 'results'
  | 'reports'
  | 'organization-settings'
  | 'access-control'
  | 'profile'
  | 'school-admins'
  | 'activities'
  | 'expenses'
  | 'admin-permissions'
  | 'teachers'
  | 'students'
  | 'teacher-permissions'
  | 'student-permissions';

export interface StatCard {
  label: string;
  value: string;
  description: string;
}

export interface SchoolRow {
  id: number;
  organizationId: number;
  name: string;
  address: string;
  admin: string;
  teachers: number;
  students: number;
  status: 'active' | 'blocked' | 'trial';
}

export interface TeacherRow {
  id: number;
  organizationId: number;
  schoolId: number;
  name: string;
  email: string;
  school: string;
  subject: string;
  fatherName: string;
  cnic: string;
  address: string;
  experience: string;
  salary: number;
  joiningDate: string;
  permissions: string[];
  status: 'active' | 'blocked';
}

export interface ClassRow {
  id: number;
  organizationId: number;
  schoolId: number;
  teacherId: number;
  name: string;
  section: string;
  description: string;
  school: string;
  students: number;
  status: 'active' | 'blocked';
}

export interface SchoolAdminRow {
  id: number;
  organizationId: number;
  schoolId: number;
  name: string;
  email: string;
  school: string;
  permissions: string[];
  status: 'active' | 'blocked';
}

export interface StudentRow {
  id: number;
  organizationId: number;
  schoolId: number;
  classId: number;
  name: string;
  email: string;
  registrationNumber: string;
  fatherName: string;
  bFormCnic: string;
  rollNumber: string;
  dateOfBirth: string;
  address: string;
  fatherCnic: string;
  admissionDate: string;
  school: string;
  className: string;
  permissions: string[];
  status: 'active' | 'blocked';
}

export interface AttendanceRow {
  id: number;
  studentId: number;
  organizationId: number;
  schoolId: number;
  classId: number;
  student: string;
  school: string;
  className: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes: string;
}

export interface FeeRow {
  id: number;
  studentId: number;
  organizationId: number;
  schoolId: number;
  classId: number;
  student: string;
  school: string;
  className: string;
  month: string;
  amount: number;
  status: 'paid' | 'unpaid';
  paidAt: string;
  notes: string;
}

export interface ScheduleRow {
  id: number;
  organizationId: number;
  schoolId: number;
  classId: number;
  teacherId: number;
  className: string;
  teacher: string;
  subject: string;
  weekday: string;
  startTime: string;
  endTime: string;
  notes: string;
}

export interface WorkRow {
  id: number;
  organizationId: number;
  schoolId: number;
  classId: number;
  teacherId: number;
  className: string;
  teacher: string;
  title: string;
  description: string;
  dueDate: string;
}

export interface ResultRow {
  id: number;
  studentId: number;
  organizationId: number;
  schoolId: number;
  classId: number;
  teacherId: number;
  student: string;
  className: string;
  teacher: string;
  examName: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  examDate: string;
  remarks: string;
}

export interface SalaryRow {
  id: number;
  teacherId: number;
  organizationId: number;
  schoolId: number;
  teacher: string;
  school: string;
  month: string;
  amount: number;
  status: 'paid' | 'unpaid';
  paidAt: string;
  notes: string;
}

export interface ExpenseRow {
  id: number;
  organizationId: number | null;
  schoolId: number | null;
  school: string;
  title: string;
  category: string;
  date: string;
  period: 'daily' | 'weekly' | 'monthly';
  amount: number;
  vendor: string;
  paymentMethod: string;
  notes: string;
}

export interface DataTableColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
}


export type DashboardDeleteTarget =
  | { type: 'school'; row: SchoolRow }
  | { type: 'class'; row: ClassRow }
  | { type: 'school-admin'; row: SchoolAdminRow }
  | { type: 'teacher'; row: TeacherRow }
  | { type: 'student'; row: StudentRow };

export type DashboardPermissionTarget =
  | ({ type: 'school-admin'; row: SchoolAdminRow } & Pick<SchoolAdminRow, 'name' | 'school' | 'email' | 'permissions'>)
  | ({ type: 'teacher'; row: TeacherRow } & Pick<TeacherRow, 'name' | 'school' | 'email' | 'permissions'>)
  | ({ type: 'student'; row: StudentRow } & Pick<StudentRow, 'name' | 'school' | 'email' | 'permissions'>);

 export interface DashboardDialogsProps {
  crud: DashboardCrud;
  isSuperAdmin: boolean;
  deleteTarget: DashboardDeleteTarget | null;
  setDeleteTarget: React.Dispatch<React.SetStateAction<DashboardDeleteTarget | null>>;
  permissionTarget: DashboardPermissionTarget | null;
  setPermissionTarget: React.Dispatch<React.SetStateAction<DashboardPermissionTarget | null>>;
}

interface OverviewProps {
  crud: DashboardCrud;
  stats: StatCard[];
}

export interface SuperAdminOverviewProps extends OverviewProps {
  schoolColumns: DataTableColumn<SchoolRow>[];
  schoolAdminColumns: DataTableColumn<SchoolAdminRow>[];
  activityColumns: DataTableColumn<ActivityResponse>[];
}

export interface AdminOverviewProps extends OverviewProps {
  teacherColumns: DataTableColumn<TeacherRow>[];
  classColumns: DataTableColumn<ClassRow>[];
  studentColumns: DataTableColumn<StudentRow>[];
}

export interface TeacherOverviewProps extends OverviewProps {
  classColumns: DataTableColumn<ClassRow>[];
  studentColumns: DataTableColumn<StudentRow>[];
  attendanceColumns: DataTableColumn<AttendanceRow>[];
  scheduleColumns: DataTableColumn<ScheduleRow>[];
}

export interface StudentOverviewProps extends OverviewProps {
  attendanceColumns: DataTableColumn<AttendanceRow>[];
  feeColumns: DataTableColumn<FeeRow>[];
  resultColumns: DataTableColumn<ResultRow>[];
  classColumns: DataTableColumn<ClassRow>[];
}
