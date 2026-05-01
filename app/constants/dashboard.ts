import { Building2, GraduationCap, LayoutDashboard, Settings, Shield, Users } from 'lucide-react';
import { USER_ROLES } from './roles';
import type { NavigationItem } from '../types';

export const DASHBOARD_NAV_ITEMS: NavigationItem[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, roles: [USER_ROLES.superAdmin, USER_ROLES.admin] },
  { id: 'schools', label: 'Organizations / Schools', icon: Building2, roles: [USER_ROLES.superAdmin, USER_ROLES.admin] },
  { id: 'teachers', label: 'Teachers', icon: GraduationCap, roles: [USER_ROLES.superAdmin, USER_ROLES.admin] },
  { id: 'students', label: 'Students', icon: Users, roles: [USER_ROLES.superAdmin, USER_ROLES.admin] },
  { id: 'permissions', label: 'Permissions', icon: Shield, roles: [USER_ROLES.superAdmin, USER_ROLES.admin] },
  { id: 'settings', label: 'Settings', icon: Settings, roles: [USER_ROLES.superAdmin, USER_ROLES.admin] },
];
