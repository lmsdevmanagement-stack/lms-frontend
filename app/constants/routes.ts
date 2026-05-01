export const APP_ROUTES = {
  dashboard: '/dashboard',
  login: '/login',
  register: '/register',
  registeredLogin: '/login?registered=true',
  dashboardSection: (section: string) => `/dashboard/${section}`,
} as const;
