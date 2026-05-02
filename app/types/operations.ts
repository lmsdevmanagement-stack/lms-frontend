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
