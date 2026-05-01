export const USER_ROLES = {
  superAdmin: 'super_admin',
  admin: 'admin',
  teacher: 'teacher',
  accountant: 'accountant',
  receptionist: 'receptionist',
  student: 'student',
  parent: 'parent',
  librarian: 'librarian',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [USER_ROLES.superAdmin]: ['dashboard', 'organizations', 'users', 'billing', 'reports', 'settings'],
  [USER_ROLES.admin]: ['dashboard', 'schools', 'students', 'teachers', 'attendance', 'fees', 'reports', 'settings'],
  [USER_ROLES.teacher]: ['dashboard', 'students', 'attendance', 'reports'],
  [USER_ROLES.accountant]: ['dashboard', 'fees', 'billing', 'reports'],
  [USER_ROLES.receptionist]: ['dashboard', 'admissions', 'enquiries'],
  [USER_ROLES.student]: ['dashboard', 'attendance', 'fees', 'results'],
  [USER_ROLES.parent]: ['dashboard', 'attendance', 'fees', 'progress'],
  [USER_ROLES.librarian]: ['dashboard', 'library', 'books', 'fines'],
};
