'use client';

import { Input } from '@/app/components/ui/input';
import { Modal } from '@/app/components/ui/modal';
import type { DashboardCrud } from '@/app/hooks/useDashboardCrud';
import FormField, { selectClassName } from '@/app/components/modals/dashboard/FormField';
import ModalActions from '@/app/components/modals/dashboard/ModalActions';

interface ScheduleModalProps {
  crud: DashboardCrud;
}

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ScheduleModal({ crud }: ScheduleModalProps) {
  return (
    <Modal
      open={crud.scheduleModalOpen}
      title={crud.editingScheduleId ? 'Edit Schedule' : 'Add Schedule'}
      description="Manage class schedule."
      onClose={() => crud.setScheduleModalOpen(false)}
      size="wide"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Class">
          <select
            className={selectClassName}
            value={crud.scheduleForm.classId}
            onChange={(event) => {
              const classId = Number(event.target.value);
              const schoolClass = crud.classes.find((item) => item.id === classId);
              crud.setScheduleForm({ ...crud.scheduleForm, classId, teacherId: schoolClass?.teacherId || 0 });
            }}
          >
            <option value={0}>Select class</option>
            {crud.classes.map((schoolClass) => (
              <option key={schoolClass.id} value={schoolClass.id}>
                {schoolClass.section ? `${schoolClass.name} - ${schoolClass.section}` : schoolClass.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Subject">
          <Input value={crud.scheduleForm.subject} onChange={(event) => crud.setScheduleForm({ ...crud.scheduleForm, subject: event.target.value })} />
        </FormField>
        <FormField label="Day">
          <select className={selectClassName} value={crud.scheduleForm.weekday} onChange={(event) => crud.setScheduleForm({ ...crud.scheduleForm, weekday: event.target.value })}>
            {weekdays.map((day) => <option key={day} value={day}>{day}</option>)}
          </select>
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2 md:col-span-2">
          <FormField label="Start Time">
            <Input type="time" value={crud.scheduleForm.startTime} onChange={(event) => crud.setScheduleForm({ ...crud.scheduleForm, startTime: event.target.value })} />
          </FormField>
          <FormField label="End Time">
            <Input type="time" value={crud.scheduleForm.endTime} onChange={(event) => crud.setScheduleForm({ ...crud.scheduleForm, endTime: event.target.value })} />
          </FormField>
        </div>
        <FormField label="Notes">
          <Input value={crud.scheduleForm.notes} onChange={(event) => crud.setScheduleForm({ ...crud.scheduleForm, notes: event.target.value })} />
        </FormField>
        <ModalActions
          submitLabel="Save Schedule"
          saving={crud.saving}
          disabled={!crud.scheduleForm.classId || !crud.scheduleForm.subject}
          onCancel={() => crud.setScheduleModalOpen(false)}
          onSubmit={crud.saveSchedule}
          onSecondarySubmit={!crud.editingScheduleId ? async () => {
            await crud.saveSchedule();
            crud.openCreateScheduleModal();
          } : undefined}
        />
      </div>
    </Modal>
  );
}
