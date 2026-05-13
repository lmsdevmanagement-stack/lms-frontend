'use client';

import { Input } from '@/app/components/ui/input';
import { Modal } from '@/app/components/ui/modal';
import type { DashboardCrud } from '@/app/hooks/useDashboardCrud';
import type { TeacherRow } from '@/app/types';
import FormField, { selectClassName } from '@/app/components/modals/dashboard/FormField';
import ModalActions from '@/app/components/modals/dashboard/ModalActions';

interface TeacherModalProps {
  crud: DashboardCrud;
  isSuperAdmin: boolean;
}

export default function TeacherModal({ crud, isSuperAdmin }: TeacherModalProps) {
  return (
    <Modal
      open={crud.teacherModalOpen}
      title={crud.editingTeacherId ? 'Edit Teacher' : 'Create Teacher'}
      description="Manage teacher account and access status."
      onClose={() => crud.setTeacherModalOpen(false)}
      size="wide"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Full Name">
          <Input value={crud.teacherForm.name} onChange={(event) => crud.setTeacherForm({ ...crud.teacherForm, name: event.target.value })} />
        </FormField>
        <FormField label="Father Name">
          <Input value={crud.teacherForm.fatherName} onChange={(event) => crud.setTeacherForm({ ...crud.teacherForm, fatherName: event.target.value })} />
        </FormField>
        <FormField label="CNIC">
          <Input value={crud.teacherForm.cnic} onChange={(event) => crud.setTeacherForm({ ...crud.teacherForm, cnic: event.target.value })} />
        </FormField>
        <FormField label="Email">
          <Input type="email" value={crud.teacherForm.email} onChange={(event) => crud.setTeacherForm({ ...crud.teacherForm, email: event.target.value })} />
        </FormField>
        {isSuperAdmin && (
          <FormField label="School">
            <select className={selectClassName} value={crud.teacherForm.schoolId} onChange={(event) => crud.setTeacherForm({ ...crud.teacherForm, schoolId: Number(event.target.value) })}>
              <option value={0}>Select school</option>
              {crud.schools.map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}
            </select>
          </FormField>
        )}
        {!crud.editingTeacherId && (
          <FormField label="Password">
            <Input type="password" value={crud.teacherForm.password} onChange={(event) => crud.setTeacherForm({ ...crud.teacherForm, password: event.target.value })} />
          </FormField>
        )}
        <FormField label="Subject">
          <Input value={crud.teacherForm.subject} onChange={(event) => crud.setTeacherForm({ ...crud.teacherForm, subject: event.target.value })} />
        </FormField>
        <FormField label="Experience">
          <Input value={crud.teacherForm.experience} onChange={(event) => crud.setTeacherForm({ ...crud.teacherForm, experience: event.target.value })} />
        </FormField>
        <FormField label="Salary">
          <Input type="number" value={crud.teacherForm.salary} onChange={(event) => crud.setTeacherForm({ ...crud.teacherForm, salary: Number(event.target.value) })} />
        </FormField>
        <FormField label="Joining Date">
          <Input type="date" value={crud.teacherForm.joiningDate} onChange={(event) => crud.setTeacherForm({ ...crud.teacherForm, joiningDate: event.target.value })} />
        </FormField>
        <FormField label="Address">
          <Input value={crud.teacherForm.address} onChange={(event) => crud.setTeacherForm({ ...crud.teacherForm, address: event.target.value })} />
        </FormField>
        <FormField label="Status">
          <select className={selectClassName} value={crud.teacherForm.status} onChange={(event) => crud.setTeacherForm({ ...crud.teacherForm, status: event.target.value as TeacherRow['status'] })}>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </FormField>
        <ModalActions
          submitLabel={crud.editingTeacherId ? 'Save Changes' : 'Create Teacher'}
          saving={crud.saving}
          disabled={!crud.teacherForm.name || !crud.teacherForm.email || (isSuperAdmin && !crud.teacherForm.schoolId)}
          onCancel={() => crud.setTeacherModalOpen(false)}
          onSubmit={crud.saveTeacher}
          onSecondarySubmit={!crud.editingTeacherId ? async () => {
            await crud.saveTeacher();
            crud.openCreateTeacherModal();
          } : undefined}
        />
      </div>
    </Modal>
  );
}
