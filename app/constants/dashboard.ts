import { Building2, GraduationCap, LayoutDashboard, Settings, Shield, Users } from 'lucide-react';
import { USER_ROLES } from './roles';
import type { NavigationItem, SchoolRow, StatCard, StudentRow, TeacherRow } from '../types';

export const DASHBOARD_NAV_ITEMS: NavigationItem[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, roles: [USER_ROLES.superAdmin, USER_ROLES.admin] },
  { id: 'schools', label: 'Organizations / Schools', icon: Building2, roles: [USER_ROLES.superAdmin, USER_ROLES.admin] },
  { id: 'teachers', label: 'Teachers', icon: GraduationCap, roles: [USER_ROLES.superAdmin, USER_ROLES.admin] },
  { id: 'students', label: 'Students', icon: Users, roles: [USER_ROLES.superAdmin, USER_ROLES.admin] },
  { id: 'permissions', label: 'Permissions', icon: Shield, roles: [USER_ROLES.superAdmin, USER_ROLES.admin] },
  { id: 'settings', label: 'Settings', icon: Settings, roles: [USER_ROLES.superAdmin, USER_ROLES.admin] },
];

export const SCHOOL_ROWS: SchoolRow[] = [
  { id: 1, organizationId: 1, name: 'North Valley School', admin: 'Ayesha Khan', teachers: 38, students: 740, status: 'active' },
  { id: 2, organizationId: 2, name: 'Greenfield Academy', admin: 'Hamza Ali', teachers: 51, students: 980, status: 'trial' },
  { id: 3, organizationId: 3, name: 'City Grammar Campus', admin: 'Sara Ahmed', teachers: 29, students: 612, status: 'blocked' },
];

export const TEACHER_ROWS: TeacherRow[] = [
  { id: 1, organizationId: 1, name: 'Maira Siddiqui', email: 'maira@northvalley.edu', school: 'North Valley School', subject: 'Mathematics', status: 'active' },
  { id: 2, organizationId: 1, name: 'Bilal Hassan', email: 'bilal@northvalley.edu', school: 'North Valley School', subject: 'Science', status: 'active' },
  { id: 3, organizationId: 2, name: 'Nida Farooq', email: 'nida@greenfield.edu', school: 'Greenfield Academy', subject: 'English', status: 'blocked' },
  { id: 4, organizationId: 3, name: 'Taha Mir', email: 'taha@citygrammar.edu', school: 'City Grammar Campus', subject: 'Computer Science', status: 'active' },
];

export const STUDENT_ROWS: StudentRow[] = [
  { id: 1, organizationId: 1, name: 'Ali Raza', email: 'ali@student.northvalley.edu', school: 'North Valley School', className: 'Grade 8', status: 'active' },
  { id: 2, organizationId: 1, name: 'Hina Shah', email: 'hina@student.northvalley.edu', school: 'North Valley School', className: 'Grade 9', status: 'active' },
  { id: 3, organizationId: 2, name: 'Omar Saeed', email: 'omar@student.greenfield.edu', school: 'Greenfield Academy', className: 'Grade 7', status: 'blocked' },
  { id: 4, organizationId: 3, name: 'Zara Malik', email: 'zara@student.citygrammar.edu', school: 'City Grammar Campus', className: 'Grade 10', status: 'active' },
];

export const SUPER_ADMIN_STATS: StatCard[] = [
  { label: 'Schools', value: '3', description: 'All organizations' },
  { label: 'Teachers', value: '4', description: 'Across all schools' },
  { label: 'Students', value: '4', description: 'Across all schools' },
  { label: 'Blocked', value: '2', description: 'Users needing review' },
];

export const SCHOOL_ADMIN_STATS: StatCard[] = [
  { label: 'Schools', value: '1', description: 'Your organization' },
  { label: 'Teachers', value: '2', description: 'Your teachers' },
  { label: 'Students', value: '2', description: 'Your students' },
  { label: 'Blocked', value: '0', description: 'Your organization' },
];
