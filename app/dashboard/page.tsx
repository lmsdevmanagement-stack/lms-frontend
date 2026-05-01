'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DataTable from '../components/dashboard/DataTable';
import StatsGrid from '../components/dashboard/StatsGrid';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  SCHOOL_ADMIN_STATS,
  SCHOOL_ROWS,
  STUDENT_ROWS,
  SUPER_ADMIN_STATS,
  TEACHER_ROWS,
} from '../constants/dashboard';
import { APP_ROUTES } from '../constants/routes';
import { USER_ROLES } from '../constants/roles';
import { getCurrentUser, logout } from '../redux/slices/authSlice';
import type { AppDispatch, RootState } from '../redux/store';
import type { DashboardSection, DataTableColumn, SchoolRow, StudentRow, TeacherRow } from '../types';

const statusVariant = {
  active: 'success',
  blocked: 'destructive',
  trial: 'warning',
} as const;

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const { user, role, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(APP_ROUTES.login);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated, user]);

  const isSuperAdmin = role === USER_ROLES.superAdmin;
  const organizationId = user?.organization_id || 1;
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const schools = useMemo(() => {
    const scopedRows = isSuperAdmin ? SCHOOL_ROWS : SCHOOL_ROWS.filter((row) => row.organizationId === organizationId);
    if (!normalizedSearch) return scopedRows;
    return scopedRows.filter((row) =>
      Object.values(row).some((value) => String(value).toLowerCase().includes(normalizedSearch))
    );
  }, [isSuperAdmin, normalizedSearch, organizationId]);

  const teachers = useMemo(() => {
    const scopedRows = isSuperAdmin ? TEACHER_ROWS : TEACHER_ROWS.filter((row) => row.organizationId === organizationId);
    if (!normalizedSearch) return scopedRows;
    return scopedRows.filter((row) =>
      Object.values(row).some((value) => String(value).toLowerCase().includes(normalizedSearch))
    );
  }, [isSuperAdmin, normalizedSearch, organizationId]);

  const students = useMemo(() => {
    const scopedRows = isSuperAdmin ? STUDENT_ROWS : STUDENT_ROWS.filter((row) => row.organizationId === organizationId);
    if (!normalizedSearch) return scopedRows;
    return scopedRows.filter((row) =>
      Object.values(row).some((value) => String(value).toLowerCase().includes(normalizedSearch))
    );
  }, [isSuperAdmin, normalizedSearch, organizationId]);

  const schoolColumns: DataTableColumn<SchoolRow>[] = [
    { key: 'name', header: 'School', cell: (row) => <span className="font-medium text-slate-950">{row.name}</span> },
    { key: 'admin', header: 'Admin', cell: (row) => row.admin },
    { key: 'teachers', header: 'Teachers', cell: (row) => row.teachers },
    { key: 'students', header: 'Students', cell: (row) => row.students },
    { key: 'status', header: 'Status', cell: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge> },
    { key: 'actions', header: 'Actions', cell: () => <Button variant="ghost">Edit</Button>, className: 'text-right' },
  ];

  const teacherColumns: DataTableColumn<TeacherRow>[] = [
    {
      key: 'name',
      header: 'Teacher',
      cell: (row) => (
        <div>
          <p className="font-medium text-slate-950">{row.name}</p>
          <p className="text-xs text-slate-500">{row.email}</p>
        </div>
      ),
    },
    { key: 'school', header: 'School', cell: (row) => row.school },
    { key: 'subject', header: 'Subject', cell: (row) => row.subject },
    { key: 'status', header: 'Status', cell: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge> },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost">Password</Button>
          <Button variant="ghost">{row.status === 'blocked' ? 'Unblock' : 'Block'}</Button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  const studentColumns: DataTableColumn<StudentRow>[] = [
    {
      key: 'name',
      header: 'Student',
      cell: (row) => (
        <div>
          <p className="font-medium text-slate-950">{row.name}</p>
          <p className="text-xs text-slate-500">{row.email}</p>
        </div>
      ),
    },
    { key: 'school', header: 'School', cell: (row) => row.school },
    { key: 'className', header: 'Class', cell: (row) => row.className },
    { key: 'status', header: 'Status', cell: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge> },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost">Password</Button>
          <Button variant="ghost">{row.status === 'blocked' ? 'Unblock' : 'Block'}</Button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    router.push(APP_ROUTES.login);
  };

  if (!isAuthenticated) return null;

  const renderSection = () => {
    if (activeSection === 'schools') {
      return <DataTable title="Organizations / Schools" description="Super Admin sees all schools. School Admin sees only their own organization." columns={schoolColumns} data={schools} />;
    }
    if (activeSection === 'teachers') {
      return <DataTable title="Teachers" description="Create, reset passwords, block, and manage teacher access." columns={teacherColumns} data={teachers} />;
    }
    if (activeSection === 'students') {
      return <DataTable title="Students" description="Create, reset passwords, block, and manage student access." columns={studentColumns} data={students} />;
    }
    if (activeSection === 'permissions' || activeSection === 'settings') {
      return (
        <Card>
          <CardHeader>
            <CardTitle>{activeSection === 'permissions' ? 'Permissions' : 'Settings'}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {['Manage permissions', 'Set password policy', 'Block or unblock users', 'School data controls', 'Communication settings', 'Audit access'].map((item) => (
              <Button key={item} variant="outline" className="justify-start">
                {item}
              </Button>
            ))}
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <StatsGrid stats={isSuperAdmin ? SUPER_ADMIN_STATS : SCHOOL_ADMIN_STATS} />
        <DataTable title="Organizations / Schools" columns={schoolColumns} data={schools} />
        <DataTable title="Teachers" columns={teacherColumns} data={teachers} />
        <DataTable title="Students" columns={studentColumns} data={students} />
      </div>
    );
  };

  return (
    <DashboardLayout
      user={user}
      role={role}
      activeSection={activeSection}
      searchTerm={searchTerm}
      onSectionChange={setActiveSection}
      onSearchChange={setSearchTerm}
      onLogout={handleLogout}
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium capitalize text-slate-500">
            {isSuperAdmin ? 'Full system control' : 'Organization-scoped access'}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-normal text-slate-950">
            {isSuperAdmin ? 'Super Admin Dashboard' : 'School Admin Dashboard'}
          </h1>
        </div>
        <Button>{activeSection === 'schools' ? 'Create School' : activeSection === 'students' ? 'Create Student' : 'Create Teacher'}</Button>
      </div>
      {renderSection()}
    </DashboardLayout>
  );
}
