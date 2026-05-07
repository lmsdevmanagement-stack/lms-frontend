export interface AttendanceResponse {
  id: number;
  student_id: number;
  organization_id: number;
  school_id: number;
  class_id: number;
  attendance_date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string | null;
  marked_by_id?: number | null;
  created_at: string;
}

export interface AttendanceCreateData {
  student_id: number;
  attendance_date: string;
  status: AttendanceResponse['status'];
  notes?: string | null;
}

export interface AttendanceUpdateData {
  attendance_date?: string;
  status?: AttendanceResponse['status'];
  notes?: string | null;
}

export interface FeeResponse {
  id: number;
  student_id: number;
  organization_id: number;
  school_id: number;
  class_id: number;
  fee_month: string;
  amount: number;
  status: 'paid' | 'unpaid';
  paid_at?: string | null;
  notes?: string | null;
  created_at: string;
}

export interface FeeCreateData {
  student_id: number;
  fee_month: string;
  amount: number;
  status: FeeResponse['status'];
  notes?: string | null;
}

export interface FeeUpdateData {
  fee_month?: string;
  amount?: number;
  status?: FeeResponse['status'];
  notes?: string | null;
}

export interface DashboardReport {
  total_students: number;
  total_teachers: number;
  attendance_present: number;
  attendance_absent: number;
  attendance_late: number;
  fee_paid: number;
  fee_unpaid: number;
  fee_paid_amount: number;
  fee_unpaid_amount: number;
}

export interface ScheduleResponse {
  id: number;
  organization_id: number;
  school_id: number;
  class_id: number;
  teacher_id?: number | null;
  subject: string;
  weekday: string;
  start_time?: string | null;
  end_time?: string | null;
  notes?: string | null;
  created_at: string;
}

export interface ScheduleCreateData {
  class_id: number;
  teacher_id?: number | null;
  subject: string;
  weekday: string;
  start_time?: string | null;
  end_time?: string | null;
  notes?: string | null;
}

export type ScheduleUpdateData = Partial<ScheduleCreateData>;

export interface WorkResponse {
  id: number;
  organization_id: number;
  school_id: number;
  class_id: number;
  teacher_id?: number | null;
  title: string;
  description?: string | null;
  due_date?: string | null;
  created_at: string;
}

export interface WorkCreateData {
  class_id: number;
  teacher_id?: number | null;
  title: string;
  description?: string | null;
  due_date?: string | null;
}

export type WorkUpdateData = Partial<WorkCreateData>;

export interface ResultResponse {
  id: number;
  student_id: number;
  organization_id: number;
  school_id: number;
  class_id: number;
  teacher_id?: number | null;
  exam_name: string;
  subject: string;
  marks_obtained: number;
  total_marks: number;
  exam_date?: string | null;
  remarks?: string | null;
  created_at: string;
}

export interface ResultCreateData {
  student_id: number;
  teacher_id?: number | null;
  exam_name: string;
  subject: string;
  marks_obtained: number;
  total_marks: number;
  exam_date?: string | null;
  remarks?: string | null;
}

export type ResultUpdateData = Partial<Omit<ResultCreateData, 'student_id'>>;

export interface SalaryResponse {
  id: number;
  teacher_id: number;
  organization_id: number;
  school_id: number;
  salary_month: string;
  amount: number;
  status: 'paid' | 'unpaid';
  paid_at?: string | null;
  notes?: string | null;
  created_at: string;
}

export interface SalaryCreateData {
  teacher_id: number;
  salary_month: string;
  amount: number;
  status: SalaryResponse['status'];
  notes?: string | null;
}

export interface SalaryUpdateData {
  salary_month?: string;
  amount?: number;
  status?: SalaryResponse['status'];
  notes?: string | null;
}
