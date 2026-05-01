import { Activity, Banknote, Building2, GraduationCap, LayoutDashboard, Shield, ShieldCheck, UserCog, Users } from 'lucide-react';
import { USER_ROLES } from './roles';
import type { NavigationItem } from '../types';

export const DASHBOARD_NAV_ITEMS: NavigationItem[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, roles: [USER_ROLES.superAdmin, USER_ROLES.admin] },
  { id: 'schools', label: 'Schools', icon: Building2, roles: [USER_ROLES.superAdmin] },
  { id: 'school-admins', label: 'School Admins', icon: UserCog, roles: [USER_ROLES.superAdmin] },
  { id: 'activities', label: 'Activities', icon: Activity, roles: [USER_ROLES.superAdmin] },
  { id: 'expenses', label: 'Expenses', icon: Banknote, roles: [USER_ROLES.superAdmin] },
  { id: 'admin-permissions', label: 'Admin Permissions', icon: ShieldCheck, roles: [USER_ROLES.superAdmin] },
  { id: 'teachers', label: 'Teachers', icon: GraduationCap, roles: [USER_ROLES.admin] },
  { id: 'students', label: 'Students', icon: Users, roles: [USER_ROLES.admin] },
  { id: 'teacher-permissions', label: 'Teacher Permissions', icon: Shield, roles: [USER_ROLES.admin] },
  { id: 'student-permissions', label: 'Student Permissions', icon: ShieldCheck, roles: [USER_ROLES.admin] },
];
