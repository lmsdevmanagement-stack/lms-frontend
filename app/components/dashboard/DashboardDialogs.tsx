'use client';

import type React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Modal } from '../ui/modal';
import PermissionsMatrix from './PermissionsMatrix';
import type {
  AttendanceRow,
  ClassRow,
  ExpenseRow,
  FeeRow,
  SalaryRow,
  SchoolRow,
  StudentRow,
  TeacherRow,
} from '../../types';
import { DashboardDialogsProps } from '@/app/types/dashboard';


export default function DashboardDialogs({ crud, isSuperAdmin, deleteTarget, setDeleteTarget, permissionTarget, setPermissionTarget }: DashboardDialogsProps) {
  const permissionSection = permissionTarget?.type === 'school-admin'
    ? 'admin-permissions'
    : permissionTarget?.type === 'teacher'
      ? 'teacher-permissions'
      : 'student-permissions';
  const permissionModalTitle = permissionTarget?.type === 'school-admin'
    ? 'Manage Admin Permissions'
    : permissionTarget?.type === 'teacher'
      ? 'Manage Teacher Permissions'
      : 'Manage Student Permissions';

  const saveTargetPermissions = async (permissions: string[]) => {
    if (!permissionTarget) return;
    if (permissionTarget.type === 'school-admin') {
      await crud.saveSchoolAdminPermissions(permissionTarget.row, permissions);
    } else if (permissionTarget.type === 'teacher') {
      await crud.saveTeacherPermissions(permissionTarget.row, permissions);
    } else {
      await crud.saveStudentPermissions(permissionTarget.row, permissions);
    }
    setPermissionTarget(null);
  };

  return (
    <>
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
        open={crud.classModalOpen}
        title={crud.editingClassId ? 'Edit Class' : 'Create Class'}
        description="Manage class details for student assignment."
        onClose={() => crud.setClassModalOpen(false)}
      >
        <div className="grid gap-4">
          {isSuperAdmin && (
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              School
              <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={crud.classForm.schoolId} onChange={(event) => crud.setClassForm({ ...crud.classForm, schoolId: Number(event.target.value) })}>
                <option value={0}>Select school</option>
                {crud.schools.map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}
              </select>
            </label>
          )}
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Class Name
            <Input value={crud.classForm.name} onChange={(event) => crud.setClassForm({ ...crud.classForm, name: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Section
            <Input value={crud.classForm.section} onChange={(event) => crud.setClassForm({ ...crud.classForm, section: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Details
            <Input value={crud.classForm.description} onChange={(event) => crud.setClassForm({ ...crud.classForm, description: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Teacher
            <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={crud.classForm.teacherId} onChange={(event) => crud.setClassForm({ ...crud.classForm, teacherId: Number(event.target.value) })}>
              <option value={0}>Unassigned</option>
              {crud.teachers
                .filter((teacher) => teacher.schoolId === crud.classForm.schoolId)
                .map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.name}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Status
            <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={crud.classForm.status} onChange={(event) => crud.setClassForm({ ...crud.classForm, status: event.target.value as ClassRow['status'] })}>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => crud.setClassModalOpen(false)}>Cancel</Button>
            <Button onClick={crud.saveClass} disabled={crud.saving || !crud.classForm.name || !crud.classForm.schoolId}>
              {crud.saving ? 'Saving...' : crud.editingClassId ? 'Save Changes' : 'Create Class'}
            </Button>
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
            Father Name
            <Input value={crud.teacherForm.fatherName} onChange={(event) => crud.setTeacherForm({ ...crud.teacherForm, fatherName: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            CNIC
            <Input value={crud.teacherForm.cnic} onChange={(event) => crud.setTeacherForm({ ...crud.teacherForm, cnic: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Email
            <Input type="email" value={crud.teacherForm.email} onChange={(event) => crud.setTeacherForm({ ...crud.teacherForm, email: event.target.value })} />
          </label>
          {isSuperAdmin && (
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              School
              <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={crud.teacherForm.schoolId} onChange={(event) => crud.setTeacherForm({ ...crud.teacherForm, schoolId: Number(event.target.value) })}>
                <option value={0}>Select school</option>
                {crud.schools.map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}
              </select>
            </label>
          )}
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
            Experience
            <Input value={crud.teacherForm.experience} onChange={(event) => crud.setTeacherForm({ ...crud.teacherForm, experience: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Salary
            <Input type="number" value={crud.teacherForm.salary} onChange={(event) => crud.setTeacherForm({ ...crud.teacherForm, salary: Number(event.target.value) })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Joining Date
            <Input type="date" value={crud.teacherForm.joiningDate} onChange={(event) => crud.setTeacherForm({ ...crud.teacherForm, joiningDate: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Address
            <Input value={crud.teacherForm.address} onChange={(event) => crud.setTeacherForm({ ...crud.teacherForm, address: event.target.value })} />
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
        title={crud.editingSchoolAdminId ? 'Edit School Admin' : 'Create School Admin'}
        description="Add an admin user for this school. The admin will be scoped to the selected organization."
        onClose={() => crud.setSchoolAdminModalOpen(false)}
      >
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            School
            <select
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm"
              value={crud.schoolAdminForm.schoolId}
              onChange={(event) => {
                const selectedSchool = crud.schools.find((school) => school.id === Number(event.target.value));
                crud.setSchoolAdminForm({
                  ...crud.schoolAdminForm,
                  schoolId: Number(event.target.value),
                  organizationId: selectedSchool?.organizationId || crud.schoolAdminForm.organizationId,
                });
              }}
            >
              <option value={0}>Select school</option>
              {crud.schools.map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}
            </select>
          </label>
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
              disabled={Boolean(crud.editingSchoolAdminId)}
              onChange={(event) => crud.setSchoolAdminForm({ ...crud.schoolAdminForm, email: event.target.value })}
            />
          </label>
          {!crud.editingSchoolAdminId && (
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Password
              <Input
                type="password"
                value={crud.schoolAdminForm.password}
                onChange={(event) => crud.setSchoolAdminForm({ ...crud.schoolAdminForm, password: event.target.value })}
                placeholder="Password123!"
              />
            </label>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" disabled={crud.saving} onClick={() => crud.setSchoolAdminModalOpen(false)}>Cancel</Button>
            <Button onClick={crud.saveSchoolAdmin} disabled={crud.saving || !crud.schoolAdminForm.fullName || !crud.schoolAdminForm.email || !crud.schoolAdminForm.schoolId}>
              {crud.saving ? 'Saving...' : crud.editingSchoolAdminId ? 'Save Changes' : 'Create Admin'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={crud.studentModalOpen}
        title={crud.editingStudentId ? 'Edit Student' : 'Create Student'}
        description="Manage student account and access status."
        onClose={() => crud.setStudentModalOpen(false)}
      >
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Full Name
            <Input value={crud.studentForm.name} onChange={(event) => crud.setStudentForm({ ...crud.studentForm, name: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Registration Number
            <Input value={crud.studentForm.registrationNumber} onChange={(event) => crud.setStudentForm({ ...crud.studentForm, registrationNumber: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Father Name
            <Input value={crud.studentForm.fatherName} onChange={(event) => crud.setStudentForm({ ...crud.studentForm, fatherName: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            B-Form / CNIC
            <Input value={crud.studentForm.bFormCnic} onChange={(event) => crud.setStudentForm({ ...crud.studentForm, bFormCnic: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Roll Number
            <Input value={crud.studentForm.rollNumber} onChange={(event) => crud.setStudentForm({ ...crud.studentForm, rollNumber: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Date of Birth
            <Input type="date" value={crud.studentForm.dateOfBirth} onChange={(event) => crud.setStudentForm({ ...crud.studentForm, dateOfBirth: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Email
            <Input type="email" value={crud.studentForm.email} disabled={Boolean(crud.editingStudentId)} onChange={(event) => crud.setStudentForm({ ...crud.studentForm, email: event.target.value })} />
          </label>
          {isSuperAdmin && (
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              School
              <select
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm"
                value={crud.studentForm.schoolId}
                onChange={(event) => {
                  const nextSchoolId = Number(event.target.value);
                  const nextClassId = crud.classes.find((schoolClass) => schoolClass.schoolId === nextSchoolId)?.id || 0;
                  crud.setStudentForm({ ...crud.studentForm, schoolId: nextSchoolId, classId: nextClassId });
                }}
              >
                <option value={0}>Select school</option>
                {crud.schools.map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}
              </select>
            </label>
          )}
          {!crud.editingStudentId && (
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Password
              <Input type="password" value={crud.studentForm.password} onChange={(event) => crud.setStudentForm({ ...crud.studentForm, password: event.target.value })} />
            </label>
          )}
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Class
            <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={crud.studentForm.classId} onChange={(event) => crud.setStudentForm({ ...crud.studentForm, classId: Number(event.target.value) })}>
              <option value={0}>Select class</option>
              {crud.classes
                .filter((schoolClass) => schoolClass.schoolId === crud.studentForm.schoolId && schoolClass.status === 'active')
                .map((schoolClass) => (
                  <option key={schoolClass.id} value={schoolClass.id}>
                    {schoolClass.section ? `${schoolClass.name} - ${schoolClass.section}` : schoolClass.name}
                  </option>
                ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Father CNIC
            <Input value={crud.studentForm.fatherCnic} onChange={(event) => crud.setStudentForm({ ...crud.studentForm, fatherCnic: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Admission Date
            <Input type="date" value={crud.studentForm.admissionDate} onChange={(event) => crud.setStudentForm({ ...crud.studentForm, admissionDate: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Address
            <Input value={crud.studentForm.address} onChange={(event) => crud.setStudentForm({ ...crud.studentForm, address: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Status
            <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={crud.studentForm.status} onChange={(event) => crud.setStudentForm({ ...crud.studentForm, status: event.target.value as StudentRow['status'] })}>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => crud.setStudentModalOpen(false)}>Cancel</Button>
            <Button onClick={crud.saveStudent} disabled={crud.saving || !crud.studentForm.name || !crud.studentForm.email || !crud.studentForm.schoolId || !crud.studentForm.classId}>
              {crud.saving ? 'Saving...' : crud.editingStudentId ? 'Save Changes' : 'Create Student'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={crud.attendanceModalOpen}
        title={crud.editingAttendanceId ? 'Override Attendance' : 'Mark Attendance'}
        description="Record or override a student attendance entry."
        onClose={() => crud.setAttendanceModalOpen(false)}
      >
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Student
            <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={crud.attendanceForm.studentId} disabled={Boolean(crud.editingAttendanceId)} onChange={(event) => crud.setAttendanceForm({ ...crud.attendanceForm, studentId: Number(event.target.value) })}>
              <option value={0}>Select student</option>
              {crud.students.map((student) => <option key={student.id} value={student.id}>{student.name} - {student.className}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Date
            <Input type="date" value={crud.attendanceForm.date} onChange={(event) => crud.setAttendanceForm({ ...crud.attendanceForm, date: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Status
            <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={crud.attendanceForm.status} onChange={(event) => crud.setAttendanceForm({ ...crud.attendanceForm, status: event.target.value as AttendanceRow['status'] })}>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="excused">Excused</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Notes
            <Input value={crud.attendanceForm.notes} onChange={(event) => crud.setAttendanceForm({ ...crud.attendanceForm, notes: event.target.value })} />
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => crud.setAttendanceModalOpen(false)}>Cancel</Button>
            <Button onClick={crud.saveAttendance} disabled={crud.saving || !crud.attendanceForm.studentId || !crud.attendanceForm.date}>
              {crud.saving ? 'Saving...' : crud.editingAttendanceId ? 'Save Override' : 'Mark Attendance'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={crud.feeModalOpen}
        title={crud.editingFeeId ? 'Edit Fee' : 'Assign Monthly Fee'}
        description="Assign monthly fees and track payment status."
        onClose={() => crud.setFeeModalOpen(false)}
      >
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Student
            <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={crud.feeForm.studentId} disabled={Boolean(crud.editingFeeId)} onChange={(event) => crud.setFeeForm({ ...crud.feeForm, studentId: Number(event.target.value) })}>
              <option value={0}>Select student</option>
              {crud.students.map((student) => <option key={student.id} value={student.id}>{student.name} - {student.className}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Month
            <Input type="month" value={crud.feeForm.month} onChange={(event) => crud.setFeeForm({ ...crud.feeForm, month: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Amount
            <Input type="number" value={crud.feeForm.amount} onChange={(event) => crud.setFeeForm({ ...crud.feeForm, amount: Number(event.target.value) })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Status
            <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={crud.feeForm.status} onChange={(event) => crud.setFeeForm({ ...crud.feeForm, status: event.target.value as FeeRow['status'] })}>
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Notes
            <Input value={crud.feeForm.notes} onChange={(event) => crud.setFeeForm({ ...crud.feeForm, notes: event.target.value })} />
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => crud.setFeeModalOpen(false)}>Cancel</Button>
            <Button onClick={crud.saveFee} disabled={crud.saving || !crud.feeForm.studentId || !crud.feeForm.month || crud.feeForm.amount <= 0}>
              {crud.saving ? 'Saving...' : crud.editingFeeId ? 'Save Fee' : 'Assign Fee'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={crud.salaryModalOpen}
        title={crud.editingSalaryId ? 'Edit Salary' : 'Assign Teacher Salary'}
        description="Assign teacher salaries and track paid or unpaid status."
        onClose={() => crud.setSalaryModalOpen(false)}
      >
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Teacher
            <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={crud.salaryForm.teacherId} disabled={Boolean(crud.editingSalaryId)} onChange={(event) => {
              const teacherId = Number(event.target.value);
              const teacher = crud.teachers.find((item) => item.id === teacherId);
              crud.setSalaryForm({ ...crud.salaryForm, teacherId, amount: teacher?.salary || crud.salaryForm.amount });
            }}>
              <option value={0}>Select teacher</option>
              {crud.teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.name}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Month
            <Input type="month" value={crud.salaryForm.month} onChange={(event) => crud.setSalaryForm({ ...crud.salaryForm, month: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Amount
            <Input type="number" value={crud.salaryForm.amount} onChange={(event) => crud.setSalaryForm({ ...crud.salaryForm, amount: Number(event.target.value) })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Status
            <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={crud.salaryForm.status} onChange={(event) => crud.setSalaryForm({ ...crud.salaryForm, status: event.target.value as SalaryRow['status'] })}>
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Notes
            <Input value={crud.salaryForm.notes} onChange={(event) => crud.setSalaryForm({ ...crud.salaryForm, notes: event.target.value })} />
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => crud.setSalaryModalOpen(false)}>Cancel</Button>
            <Button onClick={crud.saveSalary} disabled={crud.saving || !crud.salaryForm.teacherId || !crud.salaryForm.month || crud.salaryForm.amount <= 0}>
              {crud.saving ? 'Saving...' : crud.editingSalaryId ? 'Save Salary' : 'Assign Salary'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={crud.expenseModalOpen}
        title={crud.editingExpenseId ? 'Edit Expense' : 'Add Expense'}
        description="Record organization or school expenses."
        onClose={() => crud.setExpenseModalOpen(false)}
      >
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Title
            <Input value={crud.expenseForm.title} onChange={(event) => crud.setExpenseForm({ ...crud.expenseForm, title: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Category
            <Input value={crud.expenseForm.category} onChange={(event) => crud.setExpenseForm({ ...crud.expenseForm, category: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Date
            <Input type="date" value={crud.expenseForm.date} onChange={(event) => crud.setExpenseForm({ ...crud.expenseForm, date: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Period
            <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={crud.expenseForm.period} onChange={(event) => crud.setExpenseForm({ ...crud.expenseForm, period: event.target.value as ExpenseRow['period'] })}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Amount
            <Input type="number" value={crud.expenseForm.amount} onChange={(event) => crud.setExpenseForm({ ...crud.expenseForm, amount: Number(event.target.value) })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Vendor
            <Input value={crud.expenseForm.vendor} onChange={(event) => crud.setExpenseForm({ ...crud.expenseForm, vendor: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Payment Method
            <Input value={crud.expenseForm.paymentMethod} onChange={(event) => crud.setExpenseForm({ ...crud.expenseForm, paymentMethod: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Notes
            <Input value={crud.expenseForm.notes} onChange={(event) => crud.setExpenseForm({ ...crud.expenseForm, notes: event.target.value })} />
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => crud.setExpenseModalOpen(false)}>Cancel</Button>
            <Button onClick={crud.saveExpense} disabled={crud.saving || !crud.expenseForm.title || crud.expenseForm.amount <= 0}>
              {crud.saving ? 'Saving...' : crud.editingExpenseId ? 'Save Expense' : 'Add Expense'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={crud.scheduleModalOpen} title={crud.editingScheduleId ? 'Edit Schedule' : 'Add Schedule'} description="Manage class schedule." onClose={() => crud.setScheduleModalOpen(false)}>
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-slate-700">Class
            <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={crud.scheduleForm.classId} onChange={(event) => {
              const classId = Number(event.target.value);
              const schoolClass = crud.classes.find((item) => item.id === classId);
              crud.setScheduleForm({ ...crud.scheduleForm, classId, teacherId: schoolClass?.teacherId || 0 });
            }}>
              <option value={0}>Select class</option>
              {crud.classes.map((schoolClass) => <option key={schoolClass.id} value={schoolClass.id}>{schoolClass.section ? `${schoolClass.name} - ${schoolClass.section}` : schoolClass.name}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">Subject
            <Input value={crud.scheduleForm.subject} onChange={(event) => crud.setScheduleForm({ ...crud.scheduleForm, subject: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">Day
            <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={crud.scheduleForm.weekday} onChange={(event) => crud.setScheduleForm({ ...crud.scheduleForm, weekday: event.target.value })}>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => <option key={day} value={day}>{day}</option>)}
            </select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">Start Time<Input type="time" value={crud.scheduleForm.startTime} onChange={(event) => crud.setScheduleForm({ ...crud.scheduleForm, startTime: event.target.value })} /></label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">End Time<Input type="time" value={crud.scheduleForm.endTime} onChange={(event) => crud.setScheduleForm({ ...crud.scheduleForm, endTime: event.target.value })} /></label>
          </div>
          <label className="grid gap-2 text-sm font-medium text-slate-700">Notes<Input value={crud.scheduleForm.notes} onChange={(event) => crud.setScheduleForm({ ...crud.scheduleForm, notes: event.target.value })} /></label>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => crud.setScheduleModalOpen(false)}>Cancel</Button>
            <Button disabled={crud.saving || !crud.scheduleForm.classId || !crud.scheduleForm.subject} onClick={crud.saveSchedule}>{crud.saving ? 'Saving...' : 'Save Schedule'}</Button>
          </div>
        </div>
      </Modal>

      <Modal open={crud.workModalOpen} title={crud.editingWorkId ? 'Edit Class Work' : 'Add Class Work'} description="Manage class work." onClose={() => crud.setWorkModalOpen(false)}>
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-slate-700">Class
            <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={crud.workForm.classId} onChange={(event) => {
              const classId = Number(event.target.value);
              const schoolClass = crud.classes.find((item) => item.id === classId);
              crud.setWorkForm({ ...crud.workForm, classId, teacherId: schoolClass?.teacherId || 0 });
            }}>
              <option value={0}>Select class</option>
              {crud.classes.map((schoolClass) => <option key={schoolClass.id} value={schoolClass.id}>{schoolClass.section ? `${schoolClass.name} - ${schoolClass.section}` : schoolClass.name}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">Title<Input value={crud.workForm.title} onChange={(event) => crud.setWorkForm({ ...crud.workForm, title: event.target.value })} /></label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">Due Date<Input type="date" value={crud.workForm.dueDate} onChange={(event) => crud.setWorkForm({ ...crud.workForm, dueDate: event.target.value })} /></label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">Details<Input value={crud.workForm.description} onChange={(event) => crud.setWorkForm({ ...crud.workForm, description: event.target.value })} /></label>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => crud.setWorkModalOpen(false)}>Cancel</Button>
            <Button disabled={crud.saving || !crud.workForm.classId || !crud.workForm.title} onClick={crud.saveWork}>{crud.saving ? 'Saving...' : 'Save Work'}</Button>
          </div>
        </div>
      </Modal>

      <Modal open={crud.resultModalOpen} title={crud.editingResultId ? 'Edit Result' : 'Add Result'} description="Manage marks and tests." onClose={() => crud.setResultModalOpen(false)}>
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-slate-700">Student
            <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={crud.resultForm.studentId} disabled={Boolean(crud.editingResultId)} onChange={(event) => {
              const studentId = Number(event.target.value);
              const student = crud.students.find((item) => item.id === studentId);
              const schoolClass = student ? crud.classes.find((item) => item.id === student.classId) : undefined;
              crud.setResultForm({ ...crud.resultForm, studentId, teacherId: schoolClass?.teacherId || 0 });
            }}>
              <option value={0}>Select student</option>
              {crud.students.map((student) => <option key={student.id} value={student.id}>{student.name} - {student.className}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">Exam Name<Input value={crud.resultForm.examName} onChange={(event) => crud.setResultForm({ ...crud.resultForm, examName: event.target.value })} /></label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">Subject<Input value={crud.resultForm.subject} onChange={(event) => crud.setResultForm({ ...crud.resultForm, subject: event.target.value })} /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">Marks<Input type="number" value={crud.resultForm.marksObtained} onChange={(event) => crud.setResultForm({ ...crud.resultForm, marksObtained: Number(event.target.value) })} /></label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">Total<Input type="number" value={crud.resultForm.totalMarks} onChange={(event) => crud.setResultForm({ ...crud.resultForm, totalMarks: Number(event.target.value) })} /></label>
          </div>
          <label className="grid gap-2 text-sm font-medium text-slate-700">Exam Date<Input type="date" value={crud.resultForm.examDate} onChange={(event) => crud.setResultForm({ ...crud.resultForm, examDate: event.target.value })} /></label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">Remarks<Input value={crud.resultForm.remarks} onChange={(event) => crud.setResultForm({ ...crud.resultForm, remarks: event.target.value })} /></label>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => crud.setResultModalOpen(false)}>Cancel</Button>
            <Button disabled={crud.saving || !crud.resultForm.studentId || !crud.resultForm.examName || !crud.resultForm.subject} onClick={crud.saveResult}>{crud.saving ? 'Saving...' : 'Save Result'}</Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={permissionTarget !== null}
        title={permissionModalTitle}
        description={permissionTarget ? `Set individual access for ${permissionTarget.row.name}.` : 'Set individual access.'}
        onClose={() => setPermissionTarget(null)}
        size="wide"
        bodyClassName="p-0"
      >
        {permissionTarget && (
          <PermissionsMatrix
            section={permissionSection}
            title={permissionTarget.row.name}
            description={`${permissionTarget.school} · ${permissionTarget.email}`}
            value={permissionTarget.row.permissions}
            saving={crud.saving}
            onSave={saveTargetPermissions}
          />
        )}
      </Modal>

      <Modal
        open={deleteTarget !== null}
        title="Delete Record?"
        description="This will deactivate the record and remove it from the active dashboard list."
        onClose={() => setDeleteTarget(null)}
      >
        <div className="space-y-5">
          <div className="rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            Are you sure you want to delete{' '}
            <span className="font-semibold">
              {deleteTarget?.row.name}
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
                } else if (deleteTarget.type === 'class') {
                  await crud.deleteClass(deleteTarget.row);
                } else if (deleteTarget.type === 'school-admin') {
                  await crud.deleteSchoolAdmin(deleteTarget.row);
                } else if (deleteTarget.type === 'student') {
                  await crud.deleteStudent(deleteTarget.row);
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
    </>
  );
}
