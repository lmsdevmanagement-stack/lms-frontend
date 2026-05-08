'use client';

import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import DataTable from './DataTable';
import PermissionsMatrix from './PermissionsMatrix';
import StatsGrid from './StatsGrid';
import {
  AdminDashboardOverview,
  StudentDashboardOverview,
  SuperAdminDashboardOverview,
  TeacherDashboardOverview,
} from './DashboardOverviews';
import type { DashboardCrud } from '../../hooks/useDashboardCrud';
import type {
  ActivityResponse,
  AttendanceRow,
  ClassRow,
  DashboardSection,
  DataTableColumn,
  ExpenseRow,
  FeeRow,
  ResultRow,
  SalaryRow,
  ScheduleRow,
  SchoolAdminRow,
  SchoolRow,
  StatCard,
  StudentRow,
  TeacherRow,
  WorkRow,
  UserResponse,
} from '../../types';
import type { Dispatch, SetStateAction } from 'react';

interface DashboardSectionContentProps {
  activeSection: DashboardSection;
  crud: DashboardCrud;
  user: UserResponse | null;
  isSuperAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  attendanceDateFilter: string;
  setAttendanceDateFilter: Dispatch<SetStateAction<string>>;
  attendanceClassFilter: number;
  setAttendanceClassFilter: Dispatch<SetStateAction<number>>;
  attendanceSchoolFilter: number;
  setAttendanceSchoolFilter: Dispatch<SetStateAction<number>>;
  feeMonthFilter: string;
  setFeeMonthFilter: Dispatch<SetStateAction<string>>;
  feeStatusFilter: 'all' | FeeRow['status'];
  setFeeStatusFilter: Dispatch<SetStateAction<'all' | FeeRow['status']>>;
  feeClassFilter: number;
  setFeeClassFilter: Dispatch<SetStateAction<number>>;
  salaryMonthFilter: string;
  setSalaryMonthFilter: Dispatch<SetStateAction<string>>;
  salaryStatusFilter: 'all' | SalaryRow['status'];
  setSalaryStatusFilter: Dispatch<SetStateAction<'all' | SalaryRow['status']>>;
  expenseDateFilter: string;
  setExpenseDateFilter: Dispatch<SetStateAction<string>>;
  expensePeriodFilter: 'all' | ExpenseRow['period'];
  setExpensePeriodFilter: Dispatch<SetStateAction<'all' | ExpenseRow['period']>>;
}

const statusVariant = {
  active: 'success',
  blocked: 'destructive',
  trial: 'warning',
  present: 'success',
  absent: 'destructive',
  late: 'warning',
  excused: 'secondary',
  paid: 'success',
  unpaid: 'warning',
} as const;

export default function DashboardSectionContent({
  activeSection,
  crud,
  user,
  isSuperAdmin,
  isTeacher,
  isStudent,
  attendanceDateFilter,
  setAttendanceDateFilter,
  attendanceClassFilter,
  setAttendanceClassFilter,
  attendanceSchoolFilter,
  setAttendanceSchoolFilter,
  feeMonthFilter,
  setFeeMonthFilter,
  feeStatusFilter,
  setFeeStatusFilter,
  feeClassFilter,
  setFeeClassFilter,
  salaryMonthFilter,
  setSalaryMonthFilter,
  salaryStatusFilter,
  setSalaryStatusFilter,
  expenseDateFilter,
  setExpenseDateFilter,
  expensePeriodFilter,
  setExpensePeriodFilter,
}: DashboardSectionContentProps) {
  const stats: StatCard[] = isSuperAdmin ? [
    { label: 'Schools', value: String(crud.schools.length), description: 'All managed schools' },
    { label: 'School Admins', value: String(crud.schoolAdmins.length), description: 'Admins assigned to schools' },
    { label: 'Expenses', value: '0', description: 'Expense module pending backend' },
    {
      label: 'Blocked',
      value: String([...crud.schools, ...crud.schoolAdmins].filter((row) => row.status === 'blocked').length),
      description: 'Inactive records',
    },
  ] : isTeacher ? [
    { label: 'Assigned Classes', value: String(crud.classes.length), description: 'Classes assigned to you' },
    { label: 'Assigned Students', value: String(crud.students.length), description: 'Students in your classes' },
    { label: 'Salary', value: `Rs ${(user?.salary || 0).toLocaleString()}`, description: 'Your salary record' },
    { label: 'Attendance Records', value: String(crud.attendance.length), description: 'Recorded classroom attendance' },
    { label: 'Present', value: String(crud.attendance.filter((row) => row.status === 'present').length), description: 'Present attendance entries' },
  ] : isStudent ? [
    { label: 'Attendance', value: `${crud.attendance.filter((row) => row.status === 'present').length}/${crud.attendance.length}`, description: 'Present over recorded attendance' },
    { label: 'Paid Fees', value: String(crud.fees.filter((row) => row.status === 'paid').length), description: 'Paid monthly fee records' },
    { label: 'Unpaid Fees', value: String(crud.fees.filter((row) => row.status === 'unpaid').length), description: 'Pending monthly fee records' },
    { label: 'Marks', value: String(crud.results.length), description: 'Published marks and tests' },
    { label: 'Class', value: crud.classes[0]?.name || 'Unassigned', description: crud.classes[0]?.section || 'Class assignment' },
  ] : [
    { label: 'Teachers', value: String(crud.teachers.length), description: 'Your school teachers' },
    { label: 'Students', value: String(crud.students.length), description: 'Your school students' },
    { label: 'Classes', value: String(crud.classes.length), description: 'Managed student classes' },
    {
      label: 'Blocked',
      value: String([...crud.teachers, ...crud.students].filter((row) => row.status === 'blocked').length),
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
          <Button variant="destructive" disabled={crud.saving} onClick={() => crud.deleteSchool(row)}>Delete</Button>
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
    { key: 'experience', header: 'Experience', cell: (row) => row.experience || 'Not set' },
    { key: 'status', header: 'Status', cell: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge> },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => crud.openEditTeacherModal(row)}>Edit</Button>
          <Button variant="ghost" disabled={crud.saving} onClick={() => crud.toggleTeacherBlock(row)}>{row.status === 'blocked' ? 'Unblock' : 'Block'}</Button>
          <Button variant="destructive" disabled={crud.saving} onClick={() => crud.deleteTeacher(row)}>Delete</Button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  const classColumns: DataTableColumn<ClassRow>[] = [
    { key: 'name', header: 'Class', cell: (row) => <span className="font-medium text-slate-950">{row.section ? `${row.name} - ${row.section}` : row.name}</span> },
    { key: 'school', header: 'School', cell: (row) => row.school },
    { key: 'teacher', header: 'Teacher', cell: (row) => crud.teachers.find((teacher) => teacher.id === row.teacherId)?.name || 'Unassigned' },
    { key: 'students', header: 'Students', cell: (row) => row.students },
    { key: 'description', header: 'Details', cell: (row) => row.description || 'No details' },
    { key: 'status', header: 'Status', cell: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge> },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex justify-end gap-2">
          {!isTeacher && !isStudent && (
            <>
              <Button variant="ghost" onClick={() => crud.openEditClassModal(row)}>Edit</Button>
              <Button variant="ghost" disabled={crud.saving} onClick={() => crud.toggleClassBlock(row)}>{row.status === 'blocked' ? 'Unblock' : 'Block'}</Button>
              <Button variant="destructive" disabled={crud.saving} onClick={() => crud.deleteClass(row)}>Delete</Button>
            </>
          )}
        </div>
      ),
      className: 'text-right',
    },
  ];

  const schoolAdminColumns: DataTableColumn<SchoolAdminRow>[] = [
    {
      key: 'name',
      header: 'Admin',
      cell: (row) => (
        <div>
          <p className="font-medium text-slate-950">{row.name}</p>
          <p className="text-xs text-slate-500">{row.email}</p>
        </div>
      ),
    },
    { key: 'school', header: 'School', cell: (row) => row.school },
    { key: 'status', header: 'Status', cell: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge> },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => crud.openEditSchoolAdminModal(row)}>Edit</Button>
          <Button variant="ghost" disabled={crud.saving} onClick={() => crud.toggleSchoolAdminBlock(row)}>{row.status === 'blocked' ? 'Unblock' : 'Block'}</Button>
          <Button variant="destructive" disabled={crud.saving} onClick={() => crud.deleteSchoolAdmin(row)}>Delete</Button>
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
    { key: 'rollNumber', header: 'Roll No.', cell: (row) => row.rollNumber || 'Not set' },
    { key: 'fatherName', header: 'Father', cell: (row) => row.fatherName || 'Not set' },
    { key: 'status', header: 'Status', cell: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge> },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex justify-end gap-2">
          {!isTeacher && !isStudent && (
            <>
              <Button variant="ghost" onClick={() => crud.openEditStudentModal(row)}>Edit</Button>
              <Button variant="ghost" disabled={crud.saving} onClick={() => crud.toggleStudentBlock(row)}>{row.status === 'blocked' ? 'Unblock' : 'Block'}</Button>
              <Button variant="destructive" disabled={crud.saving} onClick={() => crud.deleteStudent(row)}>Delete</Button>
            </>
          )}
        </div>
      ),
      className: 'text-right',
    },
  ];

  const attendanceRows = crud.attendance.filter((row) => {
    if (attendanceDateFilter && row.date !== attendanceDateFilter) return false;
    if (attendanceClassFilter && row.classId !== attendanceClassFilter) return false;
    if (attendanceSchoolFilter && row.schoolId !== attendanceSchoolFilter) return false;
    return true;
  });
  const attendanceColumns: DataTableColumn<AttendanceRow>[] = [
    { key: 'student', header: 'Student', cell: (row) => <span className="font-medium text-slate-950">{row.student}</span> },
    { key: 'date', header: 'Date', cell: (row) => row.date },
    { key: 'className', header: 'Class', cell: (row) => row.className },
    { key: 'school', header: 'School', cell: (row) => row.school },
    { key: 'status', header: 'Status', cell: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge> },
    { key: 'notes', header: 'Notes', cell: (row) => row.notes || 'No notes' },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row) => isStudent ? <span className="text-xs text-slate-500">Read only</span> : <Button variant="ghost" disabled={crud.saving} onClick={() => crud.openEditAttendanceModal(row)}>Override</Button>,
      className: 'text-right',
    },
  ];

  const feeRows = crud.fees.filter((row) => {
    if (feeMonthFilter && row.month !== feeMonthFilter) return false;
    if (feeClassFilter && row.classId !== feeClassFilter) return false;
    if (feeStatusFilter !== 'all' && row.status !== feeStatusFilter) return false;
    return true;
  });
  const feePaidTotal = feeRows.filter((row) => row.status === 'paid').reduce((total, row) => total + row.amount, 0);
  const feeUnpaidTotal = feeRows.filter((row) => row.status === 'unpaid').reduce((total, row) => total + row.amount, 0);
  const feeSummaryStats: StatCard[] = [
    { label: 'Collected', value: `Rs ${feePaidTotal.toLocaleString()}`, description: `${feeRows.filter((row) => row.status === 'paid').length} paid records` },
    { label: 'Pending', value: `Rs ${feeUnpaidTotal.toLocaleString()}`, description: `${feeRows.filter((row) => row.status === 'unpaid').length} unpaid records` },
    { label: 'Class Records', value: String(feeRows.length), description: feeClassFilter ? 'Filtered class fee rows' : 'All visible fee rows' },
  ];
  const feeColumns: DataTableColumn<FeeRow>[] = [
    { key: 'student', header: 'Student', cell: (row) => <span className="font-medium text-slate-950">{row.student}</span> },
    { key: 'month', header: 'Month', cell: (row) => row.month },
    { key: 'className', header: 'Class', cell: (row) => row.className },
    { key: 'amount', header: 'Amount', cell: (row) => `Rs ${row.amount.toLocaleString()}` },
    { key: 'status', header: 'Status', cell: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge> },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex justify-end gap-2">
          {isStudent ? (
            <span className="text-xs text-slate-500">Read only</span>
          ) : (
            <>
              <Button variant="ghost" disabled={crud.saving} onClick={() => crud.updateFeeStatus(row, row.status === 'paid' ? 'unpaid' : 'paid')}>
                Mark {row.status === 'paid' ? 'Unpaid' : 'Paid'}
              </Button>
              <Button variant="ghost" disabled={crud.saving} onClick={() => crud.openEditFeeModal(row)}>Edit</Button>
            </>
          )}
        </div>
      ),
      className: 'text-right',
    },
  ];

  const scheduleColumns: DataTableColumn<ScheduleRow>[] = [
    { key: 'subject', header: 'Subject', cell: (row) => <span className="font-medium text-slate-950">{row.subject}</span> },
    { key: 'className', header: 'Class', cell: (row) => row.className },
    { key: 'teacher', header: 'Teacher', cell: (row) => row.teacher },
    { key: 'weekday', header: 'Day', cell: (row) => row.weekday },
    { key: 'time', header: 'Time', cell: (row) => `${row.startTime || '-'} - ${row.endTime || '-'}` },
    { key: 'actions', header: 'Actions', cell: (row) => isStudent ? <span className="text-xs text-slate-500">Read only</span> : <Button variant="ghost" onClick={() => crud.openEditScheduleModal(row)}>Edit</Button>, className: 'text-right' },
  ];

  const workColumns: DataTableColumn<WorkRow>[] = [
    { key: 'title', header: 'Work', cell: (row) => <span className="font-medium text-slate-950">{row.title}</span> },
    { key: 'className', header: 'Class', cell: (row) => row.className },
    { key: 'teacher', header: 'Teacher', cell: (row) => row.teacher },
    { key: 'dueDate', header: 'Due Date', cell: (row) => row.dueDate || 'No due date' },
    { key: 'description', header: 'Details', cell: (row) => row.description || 'No details' },
    { key: 'actions', header: 'Actions', cell: (row) => isStudent ? <span className="text-xs text-slate-500">Read only</span> : <Button variant="ghost" onClick={() => crud.openEditWorkModal(row)}>Edit</Button>, className: 'text-right' },
  ];

  const resultColumns: DataTableColumn<ResultRow>[] = [
    { key: 'student', header: 'Student', cell: (row) => <span className="font-medium text-slate-950">{row.student}</span> },
    { key: 'examName', header: 'Exam', cell: (row) => row.examName },
    { key: 'subject', header: 'Subject', cell: (row) => row.subject },
    { key: 'marks', header: 'Marks', cell: (row) => `${row.marksObtained}/${row.totalMarks}` },
    { key: 'examDate', header: 'Date', cell: (row) => row.examDate || 'No date' },
    { key: 'actions', header: 'Actions', cell: (row) => isStudent ? <span className="text-xs text-slate-500">Read only</span> : <Button variant="ghost" onClick={() => crud.openEditResultModal(row)}>Edit</Button>, className: 'text-right' },
  ];

  const expenseRows = crud.expenses.filter((row) => {
    if (expenseDateFilter && row.date !== expenseDateFilter) return false;
    if (expensePeriodFilter !== 'all' && row.period !== expensePeriodFilter) return false;
    return true;
  });
  const expenseTotal = expenseRows.reduce((total, row) => total + row.amount, 0);
  const expenseSummaryStats: StatCard[] = [
    { label: 'Total Expenses', value: `Rs ${expenseTotal.toLocaleString()}`, description: `${expenseRows.length} filtered records` },
    { label: 'Daily', value: `Rs ${expenseRows.filter((row) => row.period === 'daily').reduce((total, row) => total + row.amount, 0).toLocaleString()}`, description: 'Daily expense total' },
    { label: 'Monthly', value: `Rs ${expenseRows.filter((row) => row.period === 'monthly').reduce((total, row) => total + row.amount, 0).toLocaleString()}`, description: 'Monthly expense total' },
  ];
  const expenseColumns: DataTableColumn<ExpenseRow>[] = [
    { key: 'title', header: 'Expense', cell: (row) => <span className="font-medium text-slate-950">{row.title}</span> },
    { key: 'date', header: 'Date', cell: (row) => row.date },
    { key: 'period', header: 'Period', cell: (row) => <Badge variant="secondary">{row.period}</Badge> },
    { key: 'category', header: 'Category', cell: (row) => row.category },
    ...(isSuperAdmin ? [] : [{ key: 'school', header: 'School', cell: (row: ExpenseRow) => row.school }]),
    { key: 'amount', header: 'Amount', cell: (row) => `Rs ${row.amount.toLocaleString()}` },
    { key: 'vendor', header: 'Vendor', cell: (row) => row.vendor || '-' },
    { key: 'paymentMethod', header: 'Payment', cell: (row) => row.paymentMethod || '-' },
    { key: 'actions', header: 'Actions', cell: (row) => <Button variant="ghost" disabled={crud.saving} onClick={() => crud.openEditExpenseModal(row)}>Edit</Button>, className: 'text-right' },
  ];

  const activityColumns: DataTableColumn<ActivityResponse>[] = [
    {
      key: 'description',
      header: 'Activity',
      cell: (row) => (
        <div>
          <p className="font-medium text-slate-950">{row.description}</p>
          <p className="text-xs text-slate-500">{row.actor_name} · {row.actor_role.replace('_', ' ')}</p>
        </div>
      ),
    },
    { key: 'action', header: 'Action', cell: (row) => <Badge variant="secondary">{row.action}</Badge> },
    { key: 'entity_type', header: 'Entity', cell: (row) => row.entity_type },
    {
      key: 'created_at',
      header: 'Time',
      cell: (row) => new Date(row.created_at).toLocaleString(),
      className: 'whitespace-nowrap',
    },
  ];

  const salaryRows = crud.salaries.filter((row) => {
    if (salaryMonthFilter && row.month !== salaryMonthFilter) return false;
    if (salaryStatusFilter !== 'all' && row.status !== salaryStatusFilter) return false;
    return true;
  });
  const salaryPaidTotal = salaryRows.filter((row) => row.status === 'paid').reduce((total, row) => total + row.amount, 0);
  const salaryUnpaidTotal = salaryRows.filter((row) => row.status === 'unpaid').reduce((total, row) => total + row.amount, 0);
  const salarySummaryStats: StatCard[] = [
    { label: 'Paid', value: `Rs ${salaryPaidTotal.toLocaleString()}`, description: `${salaryRows.filter((row) => row.status === 'paid').length} paid records` },
    { label: 'Pending', value: `Rs ${salaryUnpaidTotal.toLocaleString()}`, description: `${salaryRows.filter((row) => row.status === 'unpaid').length} unpaid records` },
    { label: 'Total', value: `Rs ${(salaryPaidTotal + salaryUnpaidTotal).toLocaleString()}`, description: `${salaryRows.length} salary records` },
  ];
  const salaryColumns: DataTableColumn<SalaryRow>[] = [
    { key: 'teacher', header: 'Teacher', cell: (row) => <span className="font-medium text-slate-950">{row.teacher}</span> },
    { key: 'month', header: 'Month', cell: (row) => row.month },
    { key: 'amount', header: 'Amount', cell: (row) => `Rs ${row.amount.toLocaleString()}` },
    { key: 'status', header: 'Status', cell: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge> },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" disabled={crud.saving} onClick={() => crud.updateSalaryStatus(row, row.status === 'paid' ? 'unpaid' : 'paid')}>
            Mark {row.status === 'paid' ? 'Unpaid' : 'Paid'}
          </Button>
          <Button variant="ghost" disabled={crud.saving} onClick={() => crud.openEditSalaryModal(row)}>Edit</Button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  if (activeSection === 'schools') {
    return <DataTable title="Organizations / Schools" description="Create, edit, block, and delete schools." columns={schoolColumns} data={crud.schools} loading={crud.loading} />;
  }
  if (activeSection === 'school-admins') {
    return <DataTable title="School Admins" description="Create, edit, block, and delete school-scoped admins." columns={schoolAdminColumns} data={crud.schoolAdmins} loading={crud.loading} />;
  }
  if (activeSection === 'activities') {
    return <DataTable title="User Activities" description="Track login, school, admin, teacher, and student changes across the platform." columns={activityColumns} data={crud.activities} loading={crud.loading} />;
  }
  if (activeSection === 'expenses') {
    return (
      <div className="space-y-4">
        <StatsGrid stats={expenseSummaryStats} />
        <Card>
          <CardContent className="grid gap-3 p-4 md:grid-cols-2">
            <Input type="date" value={expenseDateFilter} onChange={(event) => setExpenseDateFilter(event.target.value)} />
            <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={expensePeriodFilter} onChange={(event) => setExpensePeriodFilter(event.target.value as 'all' | ExpenseRow['period'])}>
              <option value="all">All periods</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </CardContent>
        </Card>
        <DataTable title="Expenses" description={isSuperAdmin ? 'Record platform expenses and review totals.' : 'Record daily, weekly, or monthly school expenses and review totals.'} columns={expenseColumns} data={expenseRows} loading={crud.loading} />
      </div>
    );
  }
  if (activeSection === 'admin-permissions') {
    return <PermissionsMatrix section="admin-permissions" />;
  }
  if (activeSection === 'teachers') {
    return <DataTable title="Teachers" description="Create, edit, delete, block, and reset teacher access." columns={teacherColumns} data={crud.teachers} loading={crud.loading} />;
  }
  if (activeSection === 'classes') {
    return <DataTable title={isStudent ? 'Class & Subject Info' : 'Classes'} description={isStudent ? 'Your class details and assigned teacher.' : 'Create, edit, block, and assign student classes.'} columns={classColumns} data={crud.classes} loading={crud.loading} />;
  }
  if (activeSection === 'students') {
    return <DataTable title="Students" description="Create, edit, delete, block, and reset student access." columns={studentColumns} data={crud.students} loading={crud.loading} />;
  }
  if (activeSection === 'attendance') {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className={`grid gap-3 p-4 ${isSuperAdmin ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
            <Input type="date" value={attendanceDateFilter} onChange={(event) => setAttendanceDateFilter(event.target.value)} />
            <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={attendanceClassFilter} onChange={(event) => setAttendanceClassFilter(Number(event.target.value))}>
              <option value={0}>All classes</option>
              {crud.classes.map((schoolClass) => <option key={schoolClass.id} value={schoolClass.id}>{schoolClass.section ? `${schoolClass.name} - ${schoolClass.section}` : schoolClass.name}</option>)}
            </select>
            {isSuperAdmin && (
              <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={attendanceSchoolFilter} onChange={(event) => setAttendanceSchoolFilter(Number(event.target.value))}>
                <option value={0}>All schools</option>
                {crud.schools.map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}
              </select>
            )}
          </CardContent>
        </Card>
        <DataTable title="Attendance" description={isStudent ? 'Your daily attendance and date-wise history.' : 'View and override attendance by date, class, or school.'} columns={attendanceColumns} data={attendanceRows} loading={crud.loading} />
      </div>
    );
  }
  if (activeSection === 'fees') {
    return (
      <div className="space-y-4">
        {!isStudent && <StatsGrid stats={feeSummaryStats} />}
        <Card>
          <CardContent className="grid gap-3 p-4 md:grid-cols-3">
            <Input type="month" value={feeMonthFilter} onChange={(event) => setFeeMonthFilter(event.target.value)} />
            <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={feeClassFilter} onChange={(event) => setFeeClassFilter(Number(event.target.value))}>
              <option value={0}>All classes</option>
              {crud.classes.map((schoolClass) => <option key={schoolClass.id} value={schoolClass.id}>{schoolClass.section ? `${schoolClass.name} - ${schoolClass.section}` : schoolClass.name}</option>)}
            </select>
            <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={feeStatusFilter} onChange={(event) => setFeeStatusFilter(event.target.value as 'all' | FeeRow['status'])}>
              <option value="all">All statuses</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </CardContent>
        </Card>
        <DataTable title="Fees" description={isStudent ? 'Your monthly fee breakdown and paid/unpaid status.' : 'Assign monthly fees, update payment status, and track student payments.'} columns={feeColumns} data={feeRows} loading={crud.loading} />
      </div>
    );
  }
  if (activeSection === 'salaries') {
    return (
      <div className="space-y-4">
        <StatsGrid stats={salarySummaryStats} />
        <Card>
          <CardContent className="grid gap-3 p-4 md:grid-cols-2">
            <Input type="month" value={salaryMonthFilter} onChange={(event) => setSalaryMonthFilter(event.target.value)} />
            <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={salaryStatusFilter} onChange={(event) => setSalaryStatusFilter(event.target.value as 'all' | SalaryRow['status'])}>
              <option value="all">All statuses</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </CardContent>
        </Card>
        <DataTable title="Teacher Salaries" description="Assign salary records, update paid/unpaid status, and track salary totals." columns={salaryColumns} data={salaryRows} loading={crud.loading} />
      </div>
    );
  }
  if (activeSection === 'schedule') {
    return <DataTable title="Class Schedule" description={isStudent ? 'Your class schedule.' : 'Manage class-wise schedules.'} columns={scheduleColumns} data={crud.schedules} loading={crud.loading} />;
  }
  if (activeSection === 'work') {
    return <DataTable title="Class Work" description={isStudent ? 'Your assigned class work.' : 'Manage class work for assigned classes.'} columns={workColumns} data={crud.work} loading={crud.loading} />;
  }
  if (activeSection === 'results') {
    return <DataTable title="Marks & Results" description={isStudent ? 'Your marks and test history.' : 'Add and update student marks.'} columns={resultColumns} data={crud.results} loading={crud.loading} />;
  }
  if (activeSection === 'reports') {
    const reportStats: StatCard[] = [
      { label: isStudent ? 'Student' : 'Total Students', value: isStudent ? (user?.full_name || 'Student') : String(crud.report?.total_students || 0), description: isStudent ? 'Academic overview' : 'Active student accounts' },
      { label: 'Teachers', value: String(crud.report?.total_teachers || 0), description: isStudent ? 'Assigned academic support' : 'Active teacher accounts' },
      { label: 'Attendance', value: `${crud.report?.attendance_present || 0}/${(crud.report?.attendance_present || 0) + (crud.report?.attendance_absent || 0) + (crud.report?.attendance_late || 0)}`, description: 'Present over recorded attendance' },
      { label: 'Fees Paid', value: `Rs ${(crud.report?.fee_paid_amount || 0).toLocaleString()}`, description: `${crud.report?.fee_unpaid || 0} unpaid records` },
    ];
    return <StatsGrid stats={reportStats} />;
  }
  if (activeSection === 'organization-settings') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Organization Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Input value={crud.organizationSettingsForm.name} onChange={(event) => crud.setOrganizationSettingsForm({ ...crud.organizationSettingsForm, name: event.target.value })} placeholder="Organization name" />
          <Input value={crud.organizationSettingsForm.slug} onChange={(event) => crud.setOrganizationSettingsForm({ ...crud.organizationSettingsForm, slug: event.target.value })} placeholder="Slug" />
          <Input value={crud.organizationSettingsForm.contactEmail} onChange={(event) => crud.setOrganizationSettingsForm({ ...crud.organizationSettingsForm, contactEmail: event.target.value })} placeholder="Contact email" />
          <Input value={crud.organizationSettingsForm.phone} onChange={(event) => crud.setOrganizationSettingsForm({ ...crud.organizationSettingsForm, phone: event.target.value })} placeholder="Phone" />
          <Input value={crud.organizationSettingsForm.address} onChange={(event) => crud.setOrganizationSettingsForm({ ...crud.organizationSettingsForm, address: event.target.value })} placeholder="Address" />
          <div className="flex justify-end">
            <Button disabled={crud.saving || !crud.organization} onClick={crud.saveOrganizationSettings}>{crud.saving ? 'Saving...' : 'Save Settings'}</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  if (activeSection === 'profile') {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input value={crud.profileForm.fullName} onChange={(event) => crud.setProfileForm({ ...crud.profileForm, fullName: event.target.value })} placeholder="Full name" />
            <Input type="email" value={crud.profileForm.email} onChange={(event) => crud.setProfileForm({ ...crud.profileForm, email: event.target.value })} placeholder="Email" />
            <div className="flex justify-end">
              <Button disabled={crud.saving || !crud.profileForm.fullName || !crud.profileForm.email} onClick={crud.saveMyProfile}>{crud.saving ? 'Saving...' : 'Save Profile'}</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input type="password" value={crud.profileForm.currentPassword} onChange={(event) => crud.setProfileForm({ ...crud.profileForm, currentPassword: event.target.value })} placeholder="Current password" />
            <Input type="password" value={crud.profileForm.newPassword} onChange={(event) => crud.setProfileForm({ ...crud.profileForm, newPassword: event.target.value })} placeholder="New password" />
            <div className="flex justify-end">
              <Button disabled={crud.saving || !crud.profileForm.currentPassword || !crud.profileForm.newPassword} onClick={crud.saveMyPassword}>{crud.saving ? 'Saving...' : 'Change Password'}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (activeSection === 'access-control') {
    return (
      <div className="space-y-6">
        <DataTable title="Teacher Access" description="Assign permissions for attendance, fees, reports, and other modules." columns={teacherColumns} data={crud.teachers} loading={crud.loading} />
        <DataTable title="Student Access" description="Control student access to attendance, fees, and reports." columns={studentColumns} data={crud.students} loading={crud.loading} />
      </div>
    );
  }
  if (activeSection === 'teacher-permissions' || activeSection === 'student-permissions') {
    return <PermissionsMatrix section={activeSection} />;
  }

  if (isSuperAdmin) {
    return <SuperAdminDashboardOverview crud={crud} stats={stats} schoolColumns={schoolColumns} schoolAdminColumns={schoolAdminColumns} activityColumns={activityColumns} />;
  }
  if (isTeacher) {
    return <TeacherDashboardOverview crud={crud} stats={stats} classColumns={classColumns} studentColumns={studentColumns} attendanceColumns={attendanceColumns} scheduleColumns={scheduleColumns} />;
  }
  if (isStudent) {
    return <StudentDashboardOverview crud={crud} stats={stats} attendanceColumns={attendanceColumns} feeColumns={feeColumns} resultColumns={resultColumns} classColumns={classColumns} />;
  }
  return <AdminDashboardOverview crud={crud} stats={stats} teacherColumns={teacherColumns} classColumns={classColumns} studentColumns={studentColumns} />;
}
