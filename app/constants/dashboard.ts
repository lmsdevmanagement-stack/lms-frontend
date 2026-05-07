import { Activity, Banknote, BarChart3, Building2, CalendarCheck, GraduationCap, LayoutDashboard, Layers, Settings, Shield, ShieldCheck, UserCog, Users } from 'lucide-react';
import { USER_ROLES } from './roles';
import type { NavigationItem } from '../types';

export const DASHBOARD_NAV_ITEMS: NavigationItem[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, roles: [USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.teacher, USER_ROLES.student] },
  { id: 'schools', label: 'Schools', icon: Building2, roles: [USER_ROLES.superAdmin] },
  { id: 'school-admins', label: 'School Admins', icon: UserCog, roles: [USER_ROLES.superAdmin] },
  { id: 'activities', label: 'Activities', icon: Activity, roles: [USER_ROLES.superAdmin] },
  { id: 'expenses', label: 'Expenses', icon: Banknote, roles: [USER_ROLES.superAdmin] },
  { id: 'admin-permissions', label: 'Admin Permissions', icon: ShieldCheck, roles: [USER_ROLES.superAdmin] },
  { id: 'teachers', label: 'Teachers', icon: GraduationCap, roles: [USER_ROLES.admin] },
  { id: 'classes', label: 'Classes', icon: Layers, roles: [USER_ROLES.admin] },
  { id: 'students', label: 'Students', icon: Users, roles: [USER_ROLES.admin] },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck, roles: [USER_ROLES.admin] },
  { id: 'fees', label: 'Fees', icon: Banknote, roles: [USER_ROLES.admin] },
  { id: 'reports', label: 'Reports', icon: BarChart3, roles: [USER_ROLES.admin] },
  { id: 'organization-settings', label: 'Settings', icon: Settings, roles: [USER_ROLES.admin] },
  { id: 'access-control', label: 'Access Control', icon: Shield, roles: [USER_ROLES.admin] },
  { id: 'teacher-permissions', label: 'Teacher Permissions', icon: Shield, roles: [USER_ROLES.admin] },
  { id: 'student-permissions', label: 'Student Permissions', icon: ShieldCheck, roles: [USER_ROLES.admin] },
  { id: 'classes', label: 'My Classes', icon: Layers, roles: [USER_ROLES.teacher] },
  { id: 'students', label: 'My Students', icon: Users, roles: [USER_ROLES.teacher] },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck, roles: [USER_ROLES.teacher] },
  { id: 'reports', label: 'Reports', icon: BarChart3, roles: [USER_ROLES.teacher] },
  { id: 'profile', label: 'Profile', icon: Settings, roles: [USER_ROLES.teacher] },
  { id: 'classes', label: 'Class Info', icon: Layers, roles: [USER_ROLES.student] },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck, roles: [USER_ROLES.student] },
  { id: 'fees', label: 'Fees', icon: Banknote, roles: [USER_ROLES.student] },
  { id: 'reports', label: 'Reports', icon: BarChart3, roles: [USER_ROLES.student] },
  { id: 'profile', label: 'Profile', icon: Settings, roles: [USER_ROLES.student] },
];
