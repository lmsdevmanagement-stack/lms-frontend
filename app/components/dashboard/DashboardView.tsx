'use client';

import { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import DataTable from './DataTable';
import StatsGrid from './StatsGrid';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Modal } from '../ui/modal';
import { Skeleton } from '../ui/skeleton';
import { useDashboardAuth } from '../../hooks/useDashboardAuth';
import { useDashboardCrud } from '../../hooks/useDashboardCrud';
import { useMounted } from '../../hooks/useMounted';
import type { DashboardSection, DataTableColumn, SchoolRow, StatCard, StudentRow, TeacherRow } from '../../types';

interface DashboardViewProps {
  initialSection?: DashboardSection;
}

const statusVariant = {
  active: 'success',
  blocked: 'destructive',
  trial: 'warning',
} as const;

export default function DashboardView({ initialSection = 'overview' }: DashboardViewProps) {
  const mounted = useMounted();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<
    | { type: 'school'; row: SchoolRow }
    | { type: 'teacher'; row: TeacherRow }
    | null
  >(null);
  const { user, role, isAuthenticated, isSuperAdmin, organizationId, schoolId, handleLogout } = useDashboardAuth();
  const crud = useDashboardCrud({ isSuperAdmin, organizationId, schoolId, searchTerm, enabled: isAuthenticated });
  const stats: StatCard[] = [
    { label: 'Schools', value: String(crud.schools.length), description: isSuperAdmin ? 'All organizations' : 'Your organization' },
    { label: 'Teachers', value: String(crud.teachers.length), description: isSuperAdmin ? 'Across all schools' : 'Your teachers' },
    { label: 'Students', value: String(crud.students.length), description: isSuperAdmin ? 'Across all schools' : 'Your students' },
    {
      label: 'Blocked',
      value: String([...crud.schools, ...crud.teachers].filter((row) => row.status === 'blocked').length),
      description: 'Inactive records',
    },
  ];

  const schoolColumns: DataTableColumn<SchoolRow>[] = [
    { key: 'name', header: 'School', cell: (row) => <span className="font-medium text-slate-950">{row.name}</span> },
    { key: 'admin', header: 'Admin', cell: (row) => row.admin },
    { key: 'teachers', header: 'Teachers', cell: (row) => row.teachers },
    { key: 'students', header: 'Students', cell: (row) => row.students },
    { key: 'status', header: 'Status', cell: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge> },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" disabled={crud.saving} onClick={() => crud.openCreateSchoolAdminModal(row)}>Add Admin</Button>
          <Button variant="ghost" onClick={() => crud.openEditSchoolModal(row)}>Edit</Button>
          <Button variant="ghost" disabled={crud.saving} onClick={() => crud.toggleSchoolBlock(row)}>{row.status === 'blocked' ? 'Unblock' : 'Block'}</Button>
          <Button variant="destructive" disabled={crud.saving} onClick={() => setDeleteTarget({ type: 'school', row })}>Delete</Button>
        </div>
      ),
      className: 'text-right',
    },
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
          <Button variant="ghost" onClick={() => crud.openEditTeacherModal(row)}>Edit</Button>
          <Button variant="ghost" disabled={crud.saving} onClick={() => crud.toggleTeacherBlock(row)}>{row.status === 'blocked' ? 'Unblock' : 'Block'}</Button>
          <Button variant="destructive" disabled={crud.saving} onClick={() => setDeleteTarget({ type: 'teacher', row })}>Delete</Button>
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
    { key: 'actions', header: 'Actions', cell: () => <Button variant="ghost">View</Button>, className: 'text-right' },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <Skeleton className="hidden h-[calc(100vh-3rem)] lg:block" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const renderSection = () => {
    if (initialSection === 'schools') {
      return <DataTable title="Organizations / Schools" description="Create, edit, block, and delete schools." columns={schoolColumns} data={crud.schools} loading={crud.loading} />;
    }
    if (initialSection === 'teachers') {
      return <DataTable title="Teachers" description="Create, edit, delete, block, and reset teacher access." columns={teacherColumns} data={crud.teachers} loading={crud.loading} />;
    }
    if (initialSection === 'students') {
      return <DataTable title="Students" description="Students scoped to the selected school or organization." columns={studentColumns} data={crud.students} loading={crud.loading} />;
    }
    if (initialSection === 'permissions' || initialSection === 'settings') {
      return (
        <Card>
          <CardHeader>
            <CardTitle>{initialSection === 'permissions' ? 'Permissions' : 'Settings'}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {['Manage permissions', 'Set password policy', 'Block or unblock users', 'School data controls', 'Communication settings', 'Audit access'].map((item) => (
              <Button key={item} variant="outline" className="justify-start">{item}</Button>
            ))}
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <StatsGrid stats={stats} />
        <DataTable title="Organizations / Schools" columns={schoolColumns} data={crud.schools} loading={crud.loading} />
        <DataTable title="Teachers" columns={teacherColumns} data={crud.teachers} loading={crud.loading} />
        <DataTable title="Students" columns={studentColumns} data={crud.students} loading={crud.loading} />
      </div>
    );
  };

  return (
    <DashboardLayout
      user={user}
      role={role}
      activeSection={initialSection}
      searchTerm={searchTerm}
      onSectionChange={() => undefined}
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
        {initialSection !== 'overview' && initialSection !== 'students' && (
          <Button disabled={crud.loading || crud.saving} onClick={initialSection === 'schools' ? crud.openCreateSchoolModal : crud.openCreateTeacherModal}>
            {initialSection === 'schools' ? 'Create School' : 'Create Teacher'}
          </Button>
        )}
      </div>

      {renderSection()}

      <Modal
        open={crud.schoolModalOpen}
        title={crud.editingSchoolId ? 'Edit School' : 'Create School'}
        description="Manage school profile and operational status."
        onClose={() => crud.setSchoolModalOpen(false)}
      >
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            School Name
            <Input value={crud.schoolForm.name} onChange={(event) => crud.setSchoolForm({ ...crud.schoolForm, name: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Address
            <Input value={crud.schoolForm.address} onChange={(event) => crud.setSchoolForm({ ...crud.schoolForm, address: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Status
            <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={crud.schoolForm.status} onChange={(event) => crud.setSchoolForm({ ...crud.schoolForm, status: event.target.value as SchoolRow['status'] })}>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="blocked">Blocked</option>
            </select>
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => crud.setSchoolModalOpen(false)}>Cancel</Button>
            <Button onClick={crud.saveSchool} disabled={crud.saving}>{crud.editingSchoolId ? 'Save Changes' : 'Create School'}</Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={crud.teacherModalOpen}
        title={crud.editingTeacherId ? 'Edit Teacher' : 'Create Teacher'}
        description="Manage teacher account and access status."
        onClose={() => crud.setTeacherModalOpen(false)}
      >
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Full Name
            <Input value={crud.teacherForm.name} onChange={(event) => crud.setTeacherForm({ ...crud.teacherForm, name: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Email
            <Input type="email" value={crud.teacherForm.email} onChange={(event) => crud.setTeacherForm({ ...crud.teacherForm, email: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            School
            <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={crud.teacherForm.schoolId} onChange={(event) => crud.setTeacherForm({ ...crud.teacherForm, schoolId: Number(event.target.value) })}>
              <option value={0}>Select school</option>
              {crud.schools.map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}
            </select>
          </label>
          {!crud.editingTeacherId && (
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Password
              <Input type="password" value={crud.teacherForm.password} onChange={(event) => crud.setTeacherForm({ ...crud.teacherForm, password: event.target.value })} />
            </label>
          )}
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Subject
            <Input value={crud.teacherForm.subject} onChange={(event) => crud.setTeacherForm({ ...crud.teacherForm, subject: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Status
            <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={crud.teacherForm.status} onChange={(event) => crud.setTeacherForm({ ...crud.teacherForm, status: event.target.value as TeacherRow['status'] })}>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => crud.setTeacherModalOpen(false)}>Cancel</Button>
            <Button onClick={crud.saveTeacher} disabled={crud.saving}>{crud.editingTeacherId ? 'Save Changes' : 'Create Teacher'}</Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={crud.schoolAdminModalOpen}
        title="Create School Admin"
        description="Add an admin user for this school. The admin will be scoped to the selected organization."
        onClose={() => crud.setSchoolAdminModalOpen(false)}
      >
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Full Name
            <Input
              value={crud.schoolAdminForm.fullName}
              onChange={(event) => crud.setSchoolAdminForm({ ...crud.schoolAdminForm, fullName: event.target.value })}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Email
            <Input
              type="email"
              value={crud.schoolAdminForm.email}
              onChange={(event) => crud.setSchoolAdminForm({ ...crud.schoolAdminForm, email: event.target.value })}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Password
            <Input
              type="password"
              value={crud.schoolAdminForm.password}
              onChange={(event) => crud.setSchoolAdminForm({ ...crud.schoolAdminForm, password: event.target.value })}
              placeholder="Password123!"
            />
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="outline" disabled={crud.saving} onClick={() => crud.setSchoolAdminModalOpen(false)}>Cancel</Button>
            <Button onClick={crud.saveSchoolAdmin} disabled={crud.saving || !crud.schoolAdminForm.fullName || !crud.schoolAdminForm.email}>
              {crud.saving ? 'Creating...' : 'Create Admin'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={deleteTarget !== null}
        title={deleteTarget?.type === 'school' ? 'Delete School?' : 'Delete Teacher?'}
        description="This will deactivate the record and remove it from the active dashboard list."
        onClose={() => setDeleteTarget(null)}
      >
        <div className="space-y-5">
          <div className="rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            Are you sure you want to delete{' '}
            <span className="font-semibold">
              {deleteTarget?.type === 'school' ? deleteTarget.row.name : deleteTarget?.row.name}
            </span>
            ?
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" disabled={crud.saving} onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={crud.saving}
              onClick={async () => {
                if (!deleteTarget) return;
                if (deleteTarget.type === 'school') {
                  await crud.deleteSchool(deleteTarget.row);
                } else {
                  await crud.deleteTeacher(deleteTarget.row);
                }
                setDeleteTarget(null);
              }}
            >
              {crud.saving ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
