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
  status: 'active' | 'blocked';
}

export interface SchoolAdminRow {
  id: number;
  organizationId: number;
  schoolId: number;
  name: string;
  email: string;
  school: string;
  status: 'active' | 'blocked';
}

export interface StudentRow {
  id: number;
  organizationId: number;
  schoolId: number;
  name: string;
  email: string;
  school: string;
  className: string;
  status: 'active' | 'blocked';
}

export interface DataTableColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
}
