'use client';

import { Input } from '@/app/components/ui/input';
import type { DashboardCrud } from '@/app/hooks/useDashboardCrud';
import type { StudentRow } from '@/app/types';

interface StudentFormFieldsProps {
  crud: DashboardCrud;
  isSuperAdmin: boolean;
  showPassword?: boolean;
}

export default function StudentFormFields({ crud, isSuperAdmin, showPassword = false }: StudentFormFieldsProps) {
  return (
    <>
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
      {showPassword && (
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
    </>
  );
}
