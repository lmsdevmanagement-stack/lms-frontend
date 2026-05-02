export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    me: '/auth/me',
    registerAdmin: '/auth/register/admin',
    registerOrganizationAdmin: '/auth/register/organization-admin',
    registerSuperAdmin: '/auth/register/super-admin',
  },
  activities: {
    base: '/activities',
  },
  organizations: {
    base: '/organizations',
    byId: (organizationId: number) => `/organizations/${organizationId}`,
    admins: (organizationId: number) => `/organizations/${organizationId}/admins`,
  },
  schools: {
    base: '/schools',
    byId: (schoolId: number) => `/schools/${schoolId}`,
  },
  classes: {
    base: '/classes',
    byId: (classId: number) => `/classes/${classId}`,
  },
  attendance: {
    base: '/attendance',
    byId: (attendanceId: number) => `/attendance/${attendanceId}`,
  },
  fees: {
    base: '/fees',
    byId: (feeId: number) => `/fees/${feeId}`,
  },
  reports: {
    dashboard: '/reports/dashboard',
  },
  users: {
    base: '/users',
    byId: (userId: number) => `/users/${userId}`,
  },
} as const;
