import type { DashboardSection } from '../types';

export type PermissionColumnKey = 'view' | 'create' | 'edit' | 'delete';

export interface PermissionColumn {
  key: PermissionColumnKey;
  label: string;
}

export interface PermissionRule {
  id: string;
  label: string;
  description: string;
  defaults: Record<PermissionColumnKey, boolean>;
}

export interface PermissionGroup {
  title: string;
  rules: PermissionRule[];
}

export const PERMISSION_COLUMNS: PermissionColumn[] = [
  { key: 'view', label: 'View' },
  { key: 'create', label: 'Create' },
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete' },
];

export const PERMISSION_GROUPS: Record<
  Extract<DashboardSection, 'admin-permissions' | 'teacher-permissions' | 'student-permissions'>,
  PermissionGroup[]
> = {
  'admin-permissions': [
    {
      title: 'School Management',
      rules: [
        { id: 'schools', label: 'Manage Schools', description: 'Create and update school profile records', defaults: { view: true, create: true, edit: true, delete: false } },
        { id: 'school-admins', label: 'Manage Admins', description: 'Create, edit, and block school admin accounts', defaults: { view: true, create: true, edit: true, delete: true } },
        { id: 'communication', label: 'Communication', description: 'Handle school-wide notices and messages', defaults: { view: true, create: true, edit: true, delete: false } },
      ],
    },
    {
      title: 'Financial Records',
      rules: [
        { id: 'expenses', label: 'Expenses', description: 'View and manage school expense records', defaults: { view: true, create: true, edit: true, delete: false } },
        { id: 'reports', label: 'Reports', description: 'Access operational and financial reports', defaults: { view: true, create: false, edit: false, delete: false } },
      ],
    },
  ],
  'teacher-permissions': [
    {
      title: 'Academic Records',
      rules: [
        { id: 'students', label: 'View Students', description: 'Access assigned student records', defaults: { view: true, create: false, edit: false, delete: false } },
        { id: 'attendance', label: 'Mark Attendance', description: 'Create and update attendance entries', defaults: { view: true, create: true, edit: true, delete: false } },
        { id: 'grades', label: 'View Grades', description: 'Access final grades and progress history', defaults: { view: true, create: false, edit: false, delete: false } },
      ],
    },
    {
      title: 'User Management',
      rules: [
        { id: 'profile', label: 'Profile Access', description: 'View and update own teacher profile', defaults: { view: true, create: false, edit: true, delete: false } },
        { id: 'messages', label: 'Student Messages', description: 'Communicate with assigned students', defaults: { view: true, create: true, edit: false, delete: false } },
      ],
    },
  ],
  'student-permissions': [
    {
      title: 'Academic Records',
      rules: [
        { id: 'attendance', label: 'View Attendance', description: 'Access personal attendance records', defaults: { view: true, create: false, edit: false, delete: false } },
        { id: 'fees', label: 'View Fees', description: 'Access fee status and payment history', defaults: { view: true, create: false, edit: false, delete: false } },
        { id: 'results', label: 'View Results', description: 'Access grades and progress reports', defaults: { view: true, create: false, edit: false, delete: false } },
      ],
    },
    {
      title: 'Account Access',
      rules: [
        { id: 'profile', label: 'Profile Access', description: 'View and update student profile basics', defaults: { view: true, create: false, edit: true, delete: false } },
        { id: 'messages', label: 'School Messages', description: 'Read school notices and messages', defaults: { view: true, create: false, edit: false, delete: false } },
      ],
    },
  ],
};

export const PERMISSION_PAGE_TITLES = {
  'admin-permissions': 'Admin Permissions',
  'teacher-permissions': 'Teacher Permissions',
  'student-permissions': 'Student Permissions',
} as const;
