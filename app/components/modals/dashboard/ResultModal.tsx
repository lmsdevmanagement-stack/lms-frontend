'use client';

import { Input } from '@/app/components/ui/input';
import { Modal } from '@/app/components/ui/modal';
import type { DashboardCrud } from '@/app/hooks/useDashboardCrud';
import FormField, { selectClassName } from '@/app/components/modals/dashboard/FormField';
import ModalActions from '@/app/components/modals/dashboard/ModalActions';

interface ResultModalProps {
  crud: DashboardCrud;
}

export default function ResultModal({ crud }: ResultModalProps) {
  return (
    <Modal
      open={crud.resultModalOpen}
      title={crud.editingResultId ? 'Edit Result' : 'Add Result'}
      description="Manage marks and tests."
      onClose={() => crud.setResultModalOpen(false)}
    >
      <div className="grid gap-4">
        <FormField label="Student">
          <select
            className={selectClassName}
            value={crud.resultForm.studentId}
            disabled={Boolean(crud.editingResultId)}
            onChange={(event) => {
              const studentId = Number(event.target.value);
              const student = crud.students.find((item) => item.id === studentId);
              const schoolClass = student ? crud.classes.find((item) => item.id === student.classId) : undefined;
              crud.setResultForm({ ...crud.resultForm, studentId, teacherId: schoolClass?.teacherId || 0 });
            }}
          >
            <option value={0}>Select student</option>
            {crud.students.map((student) => <option key={student.id} value={student.id}>{student.name} - {student.className}</option>)}
          </select>
        </FormField>
        <FormField label="Exam Name">
          <Input value={crud.resultForm.examName} onChange={(event) => crud.setResultForm({ ...crud.resultForm, examName: event.target.value })} />
        </FormField>
        <FormField label="Subject">
          <Input value={crud.resultForm.subject} onChange={(event) => crud.setResultForm({ ...crud.resultForm, subject: event.target.value })} />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Marks">
            <Input type="number" value={crud.resultForm.marksObtained} onChange={(event) => crud.setResultForm({ ...crud.resultForm, marksObtained: Number(event.target.value) })} />
          </FormField>
          <FormField label="Total">
            <Input type="number" value={crud.resultForm.totalMarks} onChange={(event) => crud.setResultForm({ ...crud.resultForm, totalMarks: Number(event.target.value) })} />
          </FormField>
        </div>
        <FormField label="Exam Date">
          <Input type="date" value={crud.resultForm.examDate} onChange={(event) => crud.setResultForm({ ...crud.resultForm, examDate: event.target.value })} />
        </FormField>
        <FormField label="Remarks">
          <Input value={crud.resultForm.remarks} onChange={(event) => crud.setResultForm({ ...crud.resultForm, remarks: event.target.value })} />
        </FormField>
        <ModalActions
          submitLabel="Save Result"
          saving={crud.saving}
          disabled={!crud.resultForm.studentId || !crud.resultForm.examName || !crud.resultForm.subject}
          onCancel={() => crud.setResultModalOpen(false)}
          onSubmit={crud.saveResult}
        />
      </div>
    </Modal>
  );
}
