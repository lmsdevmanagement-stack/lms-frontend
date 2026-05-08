'use client';

import { Input } from '@/app/components/ui/input';
import { Modal } from '@/app/components/ui/modal';
import type { DashboardCrud } from '@/app/hooks/useDashboardCrud';
import type { AttendanceRow } from '@/app/types';
import FormField, { selectClassName } from '@/app/components/modals/dashboard/FormField';
import ModalActions from '@/app/components/modals/dashboard/ModalActions';

interface AttendanceModalProps {
  crud: DashboardCrud;
}

export default function AttendanceModal({ crud }: AttendanceModalProps) {
  return (
    <Modal
      open={crud.attendanceModalOpen}
      title={crud.editingAttendanceId ? 'Override Attendance' : 'Mark Attendance'}
      description="Record or override a student attendance entry."
      onClose={() => crud.setAttendanceModalOpen(false)}
    >
      <div className="grid gap-4">
        <FormField label="Student">
          <select className={selectClassName} value={crud.attendanceForm.studentId} disabled={Boolean(crud.editingAttendanceId)} onChange={(event) => crud.setAttendanceForm({ ...crud.attendanceForm, studentId: Number(event.target.value) })}>
            <option value={0}>Select student</option>
            {crud.students.map((student) => <option key={student.id} value={student.id}>{student.name} - {student.className}</option>)}
          </select>
        </FormField>
        <FormField label="Date">
          <Input type="date" value={crud.attendanceForm.date} onChange={(event) => crud.setAttendanceForm({ ...crud.attendanceForm, date: event.target.value })} />
        </FormField>
        <FormField label="Status">
          <select className={selectClassName} value={crud.attendanceForm.status} onChange={(event) => crud.setAttendanceForm({ ...crud.attendanceForm, status: event.target.value as AttendanceRow['status'] })}>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="excused">Excused</option>
          </select>
        </FormField>
        <FormField label="Notes">
          <Input value={crud.attendanceForm.notes} onChange={(event) => crud.setAttendanceForm({ ...crud.attendanceForm, notes: event.target.value })} />
        </FormField>
        <ModalActions
          submitLabel={crud.editingAttendanceId ? 'Save Override' : 'Mark Attendance'}
          saving={crud.saving}
          disabled={!crud.attendanceForm.studentId || !crud.attendanceForm.date}
          onCancel={() => crud.setAttendanceModalOpen(false)}
          onSubmit={crud.saveAttendance}
        />
      </div>
    </Modal>
  );
}
