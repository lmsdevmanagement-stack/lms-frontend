import type { LucideIcon } from 'lucide-react';
import type React from 'react';
import type { UserRole } from '../constants/roles';

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
  | 'reports'
  | 'organization-settings'
  | 'access-control'
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
  teacherId: number;
  name: string;
  email: string;
  school: string;
  subject: string;
  permissions: string[];
  status: 'active' | 'blocked';
}

export interface ClassRow {
  id: number;
  organizationId: number;
  schoolId: number;
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

export interface DataTableColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
}
