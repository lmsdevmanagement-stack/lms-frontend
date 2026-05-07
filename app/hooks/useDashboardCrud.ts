import { useCallback, useEffect, useMemo, useState } from 'react';
import { USER_ROLES } from '../constants/roles';
import * as api from '../services/api';
import type {
  ActivityResponse,
  AttendanceResponse,
  AttendanceRow,
  ClassResponse,
  ClassRow,
  DashboardReport,
  ExpenseResponse,
  ExpenseRow,
  FeeResponse,
  FeeRow,
  OrganizationResponse,
  ResultResponse,
  ResultRow,
  SalaryResponse,
  SalaryRow,
  ScheduleResponse,
  ScheduleRow,
  SchoolAdminRow,
  SchoolResponse,
  SchoolRow,
  StudentRow,
  TeacherRow,
  UserResponse,
  WorkResponse,
  WorkRow,
} from '../types';

export type SchoolFormState = Pick<SchoolRow, 'name' | 'address' | 'status'>;
export type ClassFormState = Pick<ClassRow, 'name' | 'section' | 'description' | 'schoolId' | 'teacherId' | 'status'>;
export type TeacherFormState = Pick<TeacherRow, 'name' | 'email' | 'schoolId' | 'subject' | 'fatherName' | 'cnic' | 'address' | 'experience' | 'salary' | 'joiningDate' | 'status'> & {
  password: string;
};
export type SchoolAdminFormState = {
  fullName: string;
  email: string;
  password: string;
  schoolId: number;
  organizationId: number;
};
export type StudentFormState = Pick<StudentRow, 'name' | 'email' | 'schoolId' | 'classId' | 'registrationNumber' | 'fatherName' | 'bFormCnic' | 'rollNumber' | 'dateOfBirth' | 'address' | 'fatherCnic' | 'admissionDate' | 'status'> & {
  password: string;
};
export type AttendanceFormState = Pick<AttendanceRow, 'studentId' | 'date' | 'status' | 'notes'>;
export type FeeFormState = Pick<FeeRow, 'studentId' | 'month' | 'amount' | 'status' | 'notes'>;
export type ExpenseFormState = Pick<ExpenseRow, 'schoolId' | 'title' | 'category' | 'date' | 'period' | 'amount' | 'vendor' | 'paymentMethod' | 'notes'>;
export type ScheduleFormState = Pick<ScheduleRow, 'classId' | 'teacherId' | 'subject' | 'weekday' | 'startTime' | 'endTime' | 'notes'>;
export type WorkFormState = Pick<WorkRow, 'classId' | 'teacherId' | 'title' | 'description' | 'dueDate'>;
export type ResultFormState = Pick<ResultRow, 'studentId' | 'teacherId' | 'examName' | 'subject' | 'marksObtained' | 'totalMarks' | 'examDate' | 'remarks'>;
export type SalaryFormState = Pick<SalaryRow, 'teacherId' | 'month' | 'amount' | 'status' | 'notes'>;
export type OrganizationSettingsFormState = {
  name: string;
  slug: string;
  contactEmail: string;
  phone: string;
  address: string;
};
export type ProfileFormState = {
  fullName: string;
  email: string;
  currentPassword: string;
  newPassword: string;
};

export const emptySchoolForm: SchoolFormState = {
  name: '',
  address: '',
  status: 'active',
};

export const emptyTeacherForm: TeacherFormState = {
  name: '',
  email: '',
  schoolId: 0,
  subject: '',
  fatherName: '',
  cnic: '',
  address: '',
  experience: '',
  salary: 0,
  joiningDate: '',
  status: 'active',
  password: '',
};

export const emptyClassForm: ClassFormState = {
  name: '',
  section: '',
  description: '',
  schoolId: 0,
  teacherId: 0,
  status: 'active',
};

export const emptySchoolAdminForm: SchoolAdminFormState = {
  fullName: '',
  email: '',
  password: '',
  schoolId: 0,
  organizationId: 0,
};

export const emptyStudentForm: StudentFormState = {
  name: '',
  email: '',
  schoolId: 0,
  classId: 0,
  registrationNumber: '',
  fatherName: '',
  bFormCnic: '',
  rollNumber: '',
  dateOfBirth: '',
  address: '',
  fatherCnic: '',
  admissionDate: '',
  status: 'active',
  password: '',
};

export const emptyAttendanceForm: AttendanceFormState = {
  studentId: 0,
  date: new Date().toISOString().slice(0, 10),
  status: 'present',
  notes: '',
};

export const emptyFeeForm: FeeFormState = {
  studentId: 0,
  month: new Date().toISOString().slice(0, 7),
  amount: 0,
  status: 'unpaid',
  notes: '',
};

export const emptyExpenseForm: ExpenseFormState = {
  schoolId: 0,
  title: '',
  category: 'General',
  date: new Date().toISOString().slice(0, 10),
  period: 'daily',
  amount: 0,
  vendor: '',
  paymentMethod: '',
  notes: '',
};

export const emptyScheduleForm: ScheduleFormState = {
  classId: 0,
  teacherId: 0,
  subject: '',
  weekday: 'Monday',
  startTime: '',
  endTime: '',
  notes: '',
};

export const emptyWorkForm: WorkFormState = {
  classId: 0,
  teacherId: 0,
  title: '',
  description: '',
  dueDate: '',
};

export const emptyResultForm: ResultFormState = {
  studentId: 0,
  teacherId: 0,
  examName: '',
  subject: '',
  marksObtained: 0,
  totalMarks: 100,
  examDate: '',
  remarks: '',
};

export const emptySalaryForm: SalaryFormState = {
  teacherId: 0,
  month: new Date().toISOString().slice(0, 7),
  amount: 0,
  status: 'unpaid',
  notes: '',
};

export const emptyOrganizationSettingsForm: OrganizationSettingsFormState = {
  name: '',
  slug: '',
  contactEmail: '',
  phone: '',
  address: '',
};

export const emptyProfileForm: ProfileFormState = {
  fullName: '',
  email: '',
  currentPassword: '',
  newPassword: '',
};

interface UseDashboardCrudArgs {
  isSuperAdmin: boolean;
  organizationId: number;
  schoolId: number | null;
  searchTerm: string;
  enabled: boolean;
  currentUser?: UserResponse | null;
}

function filterBySearch<T extends object>(rows: T[], searchTerm: string) {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  if (!normalizedSearch) return rows;
  return rows.filter((row) =>
    Object.values(row).some((value) => String(value).toLowerCase().includes(normalizedSearch))
  );
}

function mapSchoolRows(schools: SchoolResponse[], users: UserResponse[]): SchoolRow[] {
  return schools.map((school) => {
    const schoolUsers = users.filter((user) => user.school_id === school.id);
    const orgUsers = users.filter((user) => user.organization_id === school.organization_id);
    const admin = orgUsers.find((user) => user.role === USER_ROLES.admin && user.school_id === school.id)
      || orgUsers.find((user) => user.role === USER_ROLES.admin);
    return {
      id: school.id,
      organizationId: school.organization_id || 0,
      name: school.name,
      address: school.address || '',
      admin: admin?.full_name || 'Unassigned',
      teachers: schoolUsers.filter((user) => user.role === USER_ROLES.teacher).length,
      students: schoolUsers.filter((user) => user.role === USER_ROLES.student).length,
      status: school.is_active ? 'active' : 'blocked',
    };
  });
}

function formatClassName(schoolClass?: Pick<ClassRow, 'name' | 'section'>) {
  if (!schoolClass) return 'Unassigned';
  return schoolClass.section ? `${schoolClass.name} - ${schoolClass.section}` : schoolClass.name;
}

function mapClassRows(classes: ClassResponse[], schools: SchoolResponse[], users: UserResponse[]): ClassRow[] {
  return classes.map((schoolClass) => {
    const school = schools.find((item) => item.id === schoolClass.school_id);
    return {
      id: schoolClass.id,
      organizationId: schoolClass.organization_id,
      schoolId: schoolClass.school_id,
      teacherId: schoolClass.teacher_id || 0,
      name: schoolClass.name,
      section: schoolClass.section || '',
      description: schoolClass.description || '',
      school: school?.name || 'Unassigned',
      students: users.filter((user) => user.role === USER_ROLES.student && user.class_id === schoolClass.id).length,
      status: schoolClass.is_active ? 'active' : 'blocked',
    };
  });
}

function mapAttendanceRows(records: AttendanceResponse[], students: StudentRow[], schools: SchoolResponse[], classes: ClassRow[]): AttendanceRow[] {
  return records.map((record) => {
    const student = students.find((item) => item.id === record.student_id);
    const school = schools.find((item) => item.id === record.school_id);
    const schoolClass = classes.find((item) => item.id === record.class_id);
    return {
      id: record.id,
      studentId: record.student_id,
      organizationId: record.organization_id,
      schoolId: record.school_id,
      classId: record.class_id,
      student: student?.name || 'Unknown student',
      school: school?.name || 'Unassigned',
      className: formatClassName(schoolClass),
      date: record.attendance_date.slice(0, 10),
      status: record.status,
      notes: record.notes || '',
    };
  });
}

function mapFeeRows(records: FeeResponse[], students: StudentRow[], schools: SchoolResponse[], classes: ClassRow[]): FeeRow[] {
  return records.map((record) => {
    const student = students.find((item) => item.id === record.student_id);
    const school = schools.find((item) => item.id === record.school_id);
    const schoolClass = classes.find((item) => item.id === record.class_id);
    return {
      id: record.id,
      studentId: record.student_id,
      organizationId: record.organization_id,
      schoolId: record.school_id,
      classId: record.class_id,
      student: student?.name || 'Unknown student',
      school: school?.name || 'Unassigned',
      className: formatClassName(schoolClass),
      month: record.fee_month,
      amount: record.amount,
      status: record.status,
      paidAt: record.paid_at || '',
      notes: record.notes || '',
    };
  });
}

function teacherName(teachers: TeacherRow[], teacherId?: number | null) {
  if (!teacherId) return 'Unassigned';
  return teachers.find((teacher) => teacher.id === teacherId)?.name || 'Unassigned';
}

function mapScheduleRows(records: ScheduleResponse[], classes: ClassRow[], teachers: TeacherRow[]): ScheduleRow[] {
  return records.map((record) => {
    const schoolClass = classes.find((item) => item.id === record.class_id);
    return {
      id: record.id,
      organizationId: record.organization_id,
      schoolId: record.school_id,
      classId: record.class_id,
      teacherId: record.teacher_id || 0,
      className: formatClassName(schoolClass),
      teacher: teacherName(teachers, record.teacher_id),
      subject: record.subject,
      weekday: record.weekday,
      startTime: record.start_time || '',
      endTime: record.end_time || '',
      notes: record.notes || '',
    };
  });
}

function mapWorkRows(records: WorkResponse[], classes: ClassRow[], teachers: TeacherRow[]): WorkRow[] {
  return records.map((record) => {
    const schoolClass = classes.find((item) => item.id === record.class_id);
    return {
      id: record.id,
      organizationId: record.organization_id,
      schoolId: record.school_id,
      classId: record.class_id,
      teacherId: record.teacher_id || 0,
      className: formatClassName(schoolClass),
      teacher: teacherName(teachers, record.teacher_id),
      title: record.title,
      description: record.description || '',
      dueDate: record.due_date || '',
    };
  });
}

function mapResultRows(records: ResultResponse[], students: StudentRow[], classes: ClassRow[], teachers: TeacherRow[]): ResultRow[] {
  return records.map((record) => {
    const student = students.find((item) => item.id === record.student_id);
    const schoolClass = classes.find((item) => item.id === record.class_id);
    return {
      id: record.id,
      studentId: record.student_id,
      organizationId: record.organization_id,
      schoolId: record.school_id,
      classId: record.class_id,
      teacherId: record.teacher_id || 0,
      student: student?.name || 'Unknown student',
      className: formatClassName(schoolClass),
      teacher: teacherName(teachers, record.teacher_id),
      examName: record.exam_name,
      subject: record.subject,
      marksObtained: record.marks_obtained,
      totalMarks: record.total_marks,
      examDate: record.exam_date || '',
      remarks: record.remarks || '',
    };
  });
}

function mapSalaryRows(records: SalaryResponse[], teachers: TeacherRow[], schools: SchoolResponse[]): SalaryRow[] {
  return records.map((record) => {
    const teacher = teachers.find((item) => item.id === record.teacher_id);
    const school = schools.find((item) => item.id === record.school_id);
    return {
      id: record.id,
      teacherId: record.teacher_id,
      organizationId: record.organization_id,
      schoolId: record.school_id,
      teacher: teacher?.name || 'Unknown teacher',
      school: school?.name || 'Unassigned',
      month: record.salary_month,
      amount: record.amount,
      status: record.status,
      paidAt: record.paid_at || '',
      notes: record.notes || '',
    };
  });
}

function mapExpenseRows(records: ExpenseResponse[], schools: SchoolResponse[]): ExpenseRow[] {
  return records.map((record) => {
    const school = schools.find((item) => item.id === record.school_id);
    return {
      id: record.id,
      organizationId: record.organization_id,
      schoolId: record.school_id,
      school: school?.name || 'Unassigned',
      title: record.title,
      category: record.category,
      date: record.expense_date.slice(0, 10),
      period: record.period,
      amount: record.amount,
      vendor: record.vendor || '',
      paymentMethod: record.payment_method || '',
      notes: record.notes || '',
    };
  });
}

function mapTeacherRows(users: UserResponse[], schools: SchoolResponse[]): TeacherRow[] {
  return users
    .filter((user) => user.role === USER_ROLES.teacher)
    .map((teacher) => {
      const school = schools.find((item) => item.id === teacher.school_id);
      return {
        id: teacher.id,
        organizationId: teacher.organization_id || 0,
        schoolId: teacher.school_id || 0,
        name: teacher.full_name,
        email: teacher.email,
        school: school?.name || 'Unassigned',
        subject: teacher.subject_specialist || 'General',
        fatherName: teacher.father_name || '',
        cnic: teacher.cnic || '',
        address: teacher.address || '',
        experience: teacher.experience || '',
        salary: teacher.salary || 0,
        joiningDate: teacher.joining_date || '',
        permissions: teacher.permissions || [],
        status: teacher.is_active ? 'active' : 'blocked',
      };
    });
}

function mapSchoolAdminRows(users: UserResponse[], schools: SchoolResponse[]): SchoolAdminRow[] {
  return users
    .filter((user) => user.role === USER_ROLES.admin && Boolean(user.school_id))
    .map((admin) => {
      const school = schools.find((item) => item.id === admin.school_id);
      return {
        id: admin.id,
        organizationId: admin.organization_id || 0,
        schoolId: admin.school_id || 0,
        name: admin.full_name,
        email: admin.email,
        school: school?.name || 'Unassigned',
        permissions: admin.permissions || [],
        status: admin.is_active ? 'active' : 'blocked',
      };
    });
}

function mapStudentRows(users: UserResponse[], schools: SchoolResponse[], classes: ClassRow[]): StudentRow[] {
  return users
    .filter((user) => user.role === USER_ROLES.student)
    .map((student) => {
      const school = schools.find((item) => item.id === student.school_id);
      const schoolClass = classes.find((item) => item.id === student.class_id);
      return {
        id: student.id,
        organizationId: student.organization_id || 0,
        schoolId: student.school_id || 0,
        classId: student.class_id || 0,
        name: student.full_name,
        email: student.email,
        registrationNumber: student.registration_number || '',
        fatherName: student.father_name || '',
        bFormCnic: student.b_form_cnic || '',
        rollNumber: student.roll_number || '',
        dateOfBirth: student.date_of_birth || '',
        address: student.address || '',
        fatherCnic: student.father_cnic || '',
        admissionDate: student.admission_date || '',
        school: school?.name || 'Unassigned',
        className: formatClassName(schoolClass),
        permissions: student.permissions || [],
        status: student.is_active ? 'active' : 'blocked',
      };
    });
}

export function useDashboardCrud({ isSuperAdmin, organizationId, schoolId, searchTerm, enabled, currentUser }: UseDashboardCrudArgs) {
  const [schoolRows, setSchoolRows] = useState<SchoolRow[]>([]);
  const [classRows, setClassRows] = useState<ClassRow[]>([]);
  const [schoolAdminRows, setSchoolAdminRows] = useState<SchoolAdminRow[]>([]);
  const [teacherRows, setTeacherRows] = useState<TeacherRow[]>([]);
  const [studentRows, setStudentRows] = useState<StudentRow[]>([]);
  const [attendanceRows, setAttendanceRows] = useState<AttendanceRow[]>([]);
  const [feeRows, setFeeRows] = useState<FeeRow[]>([]);
  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[]>([]);
  const [workRows, setWorkRows] = useState<WorkRow[]>([]);
  const [resultRows, setResultRows] = useState<ResultRow[]>([]);
  const [salaryRows, setSalaryRows] = useState<SalaryRow[]>([]);
  const [expenseRows, setExpenseRows] = useState<ExpenseRow[]>([]);
  const [activityRows, setActivityRows] = useState<ActivityResponse[]>([]);
  const [report, setReport] = useState<DashboardReport | null>(null);
  const [organization, setOrganization] = useState<OrganizationResponse | null>(null);
  const [schoolModalOpen, setSchoolModalOpen] = useState(false);
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [feeModalOpen, setFeeModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [workModalOpen, setWorkModalOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [salaryModalOpen, setSalaryModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [schoolAdminModalOpen, setSchoolAdminModalOpen] = useState(false);
  const [editingSchoolId, setEditingSchoolId] = useState<number | null>(null);
  const [editingClassId, setEditingClassId] = useState<number | null>(null);
  const [editingTeacherId, setEditingTeacherId] = useState<number | null>(null);
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [editingAttendanceId, setEditingAttendanceId] = useState<number | null>(null);
  const [editingFeeId, setEditingFeeId] = useState<number | null>(null);
  const [editingScheduleId, setEditingScheduleId] = useState<number | null>(null);
  const [editingWorkId, setEditingWorkId] = useState<number | null>(null);
  const [editingResultId, setEditingResultId] = useState<number | null>(null);
  const [editingSalaryId, setEditingSalaryId] = useState<number | null>(null);
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
  const [editingSchoolAdminId, setEditingSchoolAdminId] = useState<number | null>(null);
  const [schoolForm, setSchoolForm] = useState<SchoolFormState>(emptySchoolForm);
  const [classForm, setClassForm] = useState<ClassFormState>(emptyClassForm);
  const [teacherForm, setTeacherForm] = useState<TeacherFormState>(emptyTeacherForm);
  const [studentForm, setStudentForm] = useState<StudentFormState>(emptyStudentForm);
  const [attendanceForm, setAttendanceForm] = useState<AttendanceFormState>(emptyAttendanceForm);
  const [feeForm, setFeeForm] = useState<FeeFormState>(emptyFeeForm);
  const [scheduleForm, setScheduleForm] = useState<ScheduleFormState>(emptyScheduleForm);
  const [workForm, setWorkForm] = useState<WorkFormState>(emptyWorkForm);
  const [resultForm, setResultForm] = useState<ResultFormState>(emptyResultForm);
  const [salaryForm, setSalaryForm] = useState<SalaryFormState>(emptySalaryForm);
  const [expenseForm, setExpenseForm] = useState<ExpenseFormState>(emptyExpenseForm);
  const [organizationSettingsForm, setOrganizationSettingsForm] = useState<OrganizationSettingsFormState>(emptyOrganizationSettingsForm);
  const [profileForm, setProfileForm] = useState<ProfileFormState>(emptyProfileForm);
  const [schoolAdminForm, setSchoolAdminForm] = useState<SchoolAdminFormState>(emptySchoolAdminForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const [schoolsResponse, classesResponse, usersResponse, attendanceResponse, feesResponse, salariesResponse, expensesResponse, schedulesResponse, workResponse, resultsResponse, reportResponse, organizationsResponse, activitiesResponse] = await Promise.all([
        api.listSchools(),
        api.listClasses(),
        api.listUsers(),
        api.listAttendance(),
        api.listFees(),
        api.listSalaries(),
        api.listExpenses(),
        api.listSchedules(),
        api.listWork(),
        api.listResults(),
        api.getDashboardReport(),
        api.listOrganizations(),
        api.listActivities(50),
      ]);
      const schools = schoolsResponse.data.data;
      const classes = classesResponse.data.data;
      const users = usersResponse.data.data;
      const mappedClasses = mapClassRows(classes, schools, users);
      const mappedStudents = mapStudentRows(users, schools, mappedClasses);
      setSchoolRows(mapSchoolRows(schools, users));
      setClassRows(mappedClasses);
      const mappedTeachers = mapTeacherRows(users, schools);
      setSchoolAdminRows(mapSchoolAdminRows(users, schools));
      setTeacherRows(mappedTeachers);
      setStudentRows(mappedStudents);
      setAttendanceRows(mapAttendanceRows(attendanceResponse.data.data, mappedStudents, schools, mappedClasses));
      setFeeRows(mapFeeRows(feesResponse.data.data, mappedStudents, schools, mappedClasses));
      setScheduleRows(mapScheduleRows(schedulesResponse.data.data, mappedClasses, mappedTeachers));
      setWorkRows(mapWorkRows(workResponse.data.data, mappedClasses, mappedTeachers));
      setResultRows(mapResultRows(resultsResponse.data.data, mappedStudents, mappedClasses, mappedTeachers));
      setSalaryRows(mapSalaryRows(salariesResponse.data.data, mappedTeachers, schools));
      setExpenseRows(mapExpenseRows(expensesResponse.data.data, schools));
      setReport(reportResponse.data.data);
      const currentOrganization = organizationsResponse.data.data.find((item) => item.id === organizationId) || organizationsResponse.data.data[0] || null;
      setOrganization(currentOrganization);
      if (currentOrganization) {
        setOrganizationSettingsForm({
          name: currentOrganization.name,
          slug: currentOrganization.slug,
          contactEmail: currentOrganization.contact_email || '',
          phone: currentOrganization.phone || '',
          address: currentOrganization.address || '',
        });
      }
      setActivityRows(activitiesResponse.data.data);
      if (currentUser) {
        setProfileForm((current) => ({
          ...current,
          fullName: currentUser.full_name,
          email: currentUser.email,
        }));
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load dashboard data');
      setSchoolRows([]);
      setClassRows([]);
      setSchoolAdminRows([]);
      setTeacherRows([]);
      setStudentRows([]);
      setAttendanceRows([]);
      setFeeRows([]);
      setScheduleRows([]);
      setWorkRows([]);
      setResultRows([]);
      setSalaryRows([]);
      setExpenseRows([]);
      setReport(null);
      setOrganization(null);
      setActivityRows([]);
    } finally {
      setLoading(false);
    }
  }, [enabled, organizationId, currentUser]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadDashboardData();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadDashboardData]);

  const scopedSchools = useMemo(() => {
    const orgRows = isSuperAdmin ? schoolRows : schoolRows.filter((row) => row.organizationId === organizationId);
    const scopedRows = schoolId ? orgRows.filter((row) => row.id === schoolId) : orgRows;
    return filterBySearch(scopedRows, searchTerm);
  }, [isSuperAdmin, organizationId, schoolId, schoolRows, searchTerm]);

  const scopedTeachers = useMemo(() => {
    const orgRows = isSuperAdmin ? teacherRows : teacherRows.filter((row) => row.organizationId === organizationId);
    const scopedRows = schoolId ? orgRows.filter((row) => row.schoolId === schoolId) : orgRows;
    return filterBySearch(scopedRows, searchTerm);
  }, [isSuperAdmin, organizationId, schoolId, teacherRows, searchTerm]);

  const scopedClasses = useMemo(() => {
    const orgRows = isSuperAdmin ? classRows : classRows.filter((row) => row.organizationId === organizationId);
    const scopedRows = schoolId ? orgRows.filter((row) => row.schoolId === schoolId) : orgRows;
    return filterBySearch(scopedRows, searchTerm);
  }, [classRows, isSuperAdmin, organizationId, schoolId, searchTerm]);

  const scopedSchoolAdmins = useMemo(() => {
    const orgRows = isSuperAdmin ? schoolAdminRows : schoolAdminRows.filter((row) => row.organizationId === organizationId);
    const scopedRows = schoolId ? orgRows.filter((row) => row.schoolId === schoolId) : orgRows;
    return filterBySearch(scopedRows, searchTerm);
  }, [isSuperAdmin, organizationId, schoolAdminRows, schoolId, searchTerm]);

  const scopedStudents = useMemo(() => {
    const orgRows = isSuperAdmin ? studentRows : studentRows.filter((row) => row.organizationId === organizationId);
    const scopedRows = schoolId ? orgRows.filter((row) => row.schoolId === schoolId) : orgRows;
    return filterBySearch(scopedRows, searchTerm);
  }, [isSuperAdmin, organizationId, schoolId, studentRows, searchTerm]);

  const scopedActivities = useMemo(() => {
    const orgRows = isSuperAdmin ? activityRows : activityRows.filter((row) => row.organization_id === organizationId);
    const scopedRows = schoolId ? orgRows.filter((row) => row.school_id === schoolId) : orgRows;
    return filterBySearch(scopedRows, searchTerm);
  }, [activityRows, isSuperAdmin, organizationId, schoolId, searchTerm]);

  const scopedAttendance = useMemo(() => {
    const orgRows = isSuperAdmin ? attendanceRows : attendanceRows.filter((row) => row.organizationId === organizationId);
    const scopedRows = schoolId ? orgRows.filter((row) => row.schoolId === schoolId) : orgRows;
    return filterBySearch(scopedRows, searchTerm);
  }, [attendanceRows, isSuperAdmin, organizationId, schoolId, searchTerm]);

  const scopedFees = useMemo(() => {
    const orgRows = isSuperAdmin ? feeRows : feeRows.filter((row) => row.organizationId === organizationId);
    const scopedRows = schoolId ? orgRows.filter((row) => row.schoolId === schoolId) : orgRows;
    return filterBySearch(scopedRows, searchTerm);
  }, [feeRows, isSuperAdmin, organizationId, schoolId, searchTerm]);

  const scopedSalaries = useMemo(() => {
    const orgRows = isSuperAdmin ? salaryRows : salaryRows.filter((row) => row.organizationId === organizationId);
    const scopedRows = schoolId ? orgRows.filter((row) => row.schoolId === schoolId) : orgRows;
    return filterBySearch(scopedRows, searchTerm);
  }, [salaryRows, isSuperAdmin, organizationId, schoolId, searchTerm]);

  const scopedExpenses = useMemo(() => {
    const orgRows = isSuperAdmin ? expenseRows : expenseRows.filter((row) => row.organizationId === organizationId);
    const scopedRows = schoolId ? orgRows.filter((row) => row.schoolId === schoolId) : orgRows;
    return filterBySearch(scopedRows, searchTerm);
  }, [expenseRows, isSuperAdmin, organizationId, schoolId, searchTerm]);

  const scopedSchedules = useMemo(() => {
    const orgRows = isSuperAdmin ? scheduleRows : scheduleRows.filter((row) => row.organizationId === organizationId);
    const scopedRows = schoolId ? orgRows.filter((row) => row.schoolId === schoolId) : orgRows;
    return filterBySearch(scopedRows, searchTerm);
  }, [scheduleRows, isSuperAdmin, organizationId, schoolId, searchTerm]);

  const scopedWork = useMemo(() => {
    const orgRows = isSuperAdmin ? workRows : workRows.filter((row) => row.organizationId === organizationId);
    const scopedRows = schoolId ? orgRows.filter((row) => row.schoolId === schoolId) : orgRows;
    return filterBySearch(scopedRows, searchTerm);
  }, [workRows, isSuperAdmin, organizationId, schoolId, searchTerm]);

  const scopedResults = useMemo(() => {
    const orgRows = isSuperAdmin ? resultRows : resultRows.filter((row) => row.organizationId === organizationId);
    const scopedRows = schoolId ? orgRows.filter((row) => row.schoolId === schoolId) : orgRows;
    return filterBySearch(scopedRows, searchTerm);
  }, [resultRows, isSuperAdmin, organizationId, schoolId, searchTerm]);

  const openCreateSchoolModal = () => {
    setEditingSchoolId(null);
    setSchoolForm(emptySchoolForm);
    setSchoolModalOpen(true);
  };

  const openEditSchoolModal = (school: SchoolRow) => {
    setEditingSchoolId(school.id);
    setSchoolForm({
      name: school.name,
      address: school.address,
      status: school.status,
    });
    setSchoolModalOpen(true);
  };

  const saveSchool = async () => {
    setSaving(true);
    try {
      if (editingSchoolId) {
        await api.updateSchool(editingSchoolId, {
          name: schoolForm.name,
          address: schoolForm.address,
          is_active: schoolForm.status !== 'blocked',
        });
      } else {
        await api.createSchool({
          name: schoolForm.name,
          address: schoolForm.address,
          organization_id: isSuperAdmin ? organizationId : undefined,
        });
      }
      setSchoolModalOpen(false);
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const deleteSchool = async (school: SchoolRow) => {
    setSaving(true);
    try {
      await api.deactivateSchool(school.id);
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const toggleSchoolBlock = async (school: SchoolRow) => {
    setSaving(true);
    try {
      await api.updateSchool(school.id, { is_active: school.status === 'blocked' });
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const openCreateClassModal = () => {
    setEditingClassId(null);
      setClassForm({
        ...emptyClassForm,
        schoolId: scopedSchools[0]?.id || 0,
        teacherId: scopedTeachers.find((teacher) => teacher.schoolId === scopedSchools[0]?.id)?.id || 0,
      });
    setClassModalOpen(true);
  };

  const openEditClassModal = (schoolClass: ClassRow) => {
    setEditingClassId(schoolClass.id);
    setClassForm({
      name: schoolClass.name,
      section: schoolClass.section,
      description: schoolClass.description,
      schoolId: schoolClass.schoolId,
      teacherId: schoolClass.teacherId,
      status: schoolClass.status,
    });
    setClassModalOpen(true);
  };

  const saveClass = async () => {
    setSaving(true);
    try {
      const selectedSchool = schoolRows.find((school) => school.id === Number(classForm.schoolId));
      if (editingClassId) {
        await api.updateClass(editingClassId, {
          name: classForm.name,
          section: classForm.section || null,
          description: classForm.description || null,
          school_id: Number(classForm.schoolId),
          organization_id: selectedSchool?.organizationId || organizationId,
          teacher_id: Number(classForm.teacherId) || null,
          is_active: classForm.status !== 'blocked',
        });
      } else {
        await api.createClass({
          name: classForm.name,
          section: classForm.section || null,
          description: classForm.description || null,
          school_id: Number(classForm.schoolId),
          organization_id: selectedSchool?.organizationId || organizationId,
          teacher_id: Number(classForm.teacherId) || null,
        });
      }
      setClassModalOpen(false);
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const deleteClass = async (schoolClass: ClassRow) => {
    setSaving(true);
    try {
      await api.deactivateClass(schoolClass.id);
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const toggleClassBlock = async (schoolClass: ClassRow) => {
    setSaving(true);
    try {
      await api.updateClass(schoolClass.id, { is_active: schoolClass.status === 'blocked' });
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const openCreateSchoolAdminModal = (school?: SchoolRow) => {
    setEditingSchoolAdminId(null);
    setSchoolAdminForm({
      ...emptySchoolAdminForm,
      schoolId: school?.id || scopedSchools[0]?.id || 0,
      organizationId: school?.organizationId || scopedSchools[0]?.organizationId || organizationId,
    });
    setSchoolAdminModalOpen(true);
  };

  const openEditSchoolAdminModal = (admin: SchoolAdminRow) => {
    setEditingSchoolAdminId(admin.id);
    setSchoolAdminForm({
      fullName: admin.name,
      email: admin.email,
      password: '',
      schoolId: admin.schoolId,
      organizationId: admin.organizationId,
    });
    setSchoolAdminModalOpen(true);
  };

  const saveSchoolAdmin = async () => {
    setSaving(true);
    try {
      if (editingSchoolAdminId) {
        await api.updateUser(editingSchoolAdminId, {
          full_name: schoolAdminForm.fullName,
          role: USER_ROLES.admin,
          organization_id: schoolAdminForm.organizationId || organizationId,
          school_id: schoolAdminForm.schoolId || null,
        });
      } else {
        await api.createUser({
          email: schoolAdminForm.email,
          full_name: schoolAdminForm.fullName,
          password: schoolAdminForm.password || 'Password123!',
          role: USER_ROLES.admin,
          organization_id: schoolAdminForm.organizationId || organizationId,
          school_id: schoolAdminForm.schoolId || null,
        });
      }
      setSchoolAdminModalOpen(false);
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const deleteSchoolAdmin = async (admin: SchoolAdminRow) => {
    setSaving(true);
    try {
      await api.deactivateUser(admin.id);
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const toggleSchoolAdminBlock = async (admin: SchoolAdminRow) => {
    setSaving(true);
    try {
      await api.updateUser(admin.id, { is_active: admin.status === 'blocked' });
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const saveSchoolAdminPermissions = async (admin: SchoolAdminRow, permissions: string[]) => {
    setSaving(true);
    try {
      await api.updateUser(admin.id, { permissions });
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const openCreateTeacherModal = () => {
    setEditingTeacherId(null);
    setTeacherForm({
      ...emptyTeacherForm,
      schoolId: scopedSchools[0]?.id || 0,
    });
    setTeacherModalOpen(true);
  };

  const openEditTeacherModal = (teacher: TeacherRow) => {
    setEditingTeacherId(teacher.id);
    setTeacherForm({
      name: teacher.name,
      email: teacher.email,
      schoolId: teacher.schoolId,
      subject: teacher.subject,
      fatherName: teacher.fatherName,
      cnic: teacher.cnic,
      address: teacher.address,
      experience: teacher.experience,
      salary: teacher.salary,
      joiningDate: teacher.joiningDate,
      status: teacher.status,
      password: '',
    });
    setTeacherModalOpen(true);
  };

  const saveTeacher = async () => {
    setSaving(true);
    try {
      const selectedSchool = schoolRows.find((school) => school.id === Number(teacherForm.schoolId));
      if (editingTeacherId) {
        await api.updateUser(editingTeacherId, {
          full_name: teacherForm.name,
          school_id: Number(teacherForm.schoolId),
          father_name: teacherForm.fatherName || null,
          cnic: teacherForm.cnic || null,
          address: teacherForm.address || null,
          experience: teacherForm.experience || null,
          subject_specialist: teacherForm.subject || null,
          salary: Number(teacherForm.salary) || null,
          joining_date: teacherForm.joiningDate || null,
          is_active: teacherForm.status !== 'blocked',
        });
      } else {
        await api.createUser({
          email: teacherForm.email,
          full_name: teacherForm.name,
          password: teacherForm.password || 'Password123!',
          role: USER_ROLES.teacher,
          father_name: teacherForm.fatherName || null,
          cnic: teacherForm.cnic || null,
          address: teacherForm.address || null,
          experience: teacherForm.experience || null,
          subject_specialist: teacherForm.subject || null,
          salary: Number(teacherForm.salary) || null,
          joining_date: teacherForm.joiningDate || null,
          organization_id: selectedSchool?.organizationId || organizationId,
          school_id: Number(teacherForm.schoolId),
        });
      }
      setTeacherModalOpen(false);
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const deleteTeacher = async (teacher: TeacherRow) => {
    setSaving(true);
    try {
      await api.deactivateUser(teacher.id);
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const toggleTeacherBlock = async (teacher: TeacherRow) => {
    setSaving(true);
    try {
      await api.updateUser(teacher.id, { is_active: teacher.status === 'blocked' });
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const saveTeacherPermissions = async (teacher: TeacherRow, permissions: string[]) => {
    setSaving(true);
    try {
      await api.updateUser(teacher.id, { permissions });
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const openCreateStudentModal = () => {
    const defaultSchoolId = scopedSchools[0]?.id || 0;
    setEditingStudentId(null);
    setStudentForm({
      ...emptyStudentForm,
      schoolId: defaultSchoolId,
      classId: scopedClasses.find((schoolClass) => schoolClass.schoolId === defaultSchoolId)?.id || 0,
    });
    setStudentModalOpen(true);
  };

  const openEditStudentModal = (student: StudentRow) => {
    setEditingStudentId(student.id);
    setStudentForm({
      name: student.name,
      email: student.email,
      schoolId: student.schoolId,
      classId: student.classId,
      registrationNumber: student.registrationNumber,
      fatherName: student.fatherName,
      bFormCnic: student.bFormCnic,
      rollNumber: student.rollNumber,
      dateOfBirth: student.dateOfBirth,
      address: student.address,
      fatherCnic: student.fatherCnic,
      admissionDate: student.admissionDate,
      status: student.status,
      password: '',
    });
    setStudentModalOpen(true);
  };

  const saveStudent = async () => {
    setSaving(true);
    try {
      const selectedSchool = schoolRows.find((school) => school.id === Number(studentForm.schoolId));
      if (editingStudentId) {
        await api.updateUser(editingStudentId, {
          full_name: studentForm.name,
          school_id: Number(studentForm.schoolId),
          class_id: Number(studentForm.classId) || null,
          registration_number: studentForm.registrationNumber || null,
          father_name: studentForm.fatherName || null,
          b_form_cnic: studentForm.bFormCnic || null,
          roll_number: studentForm.rollNumber || null,
          date_of_birth: studentForm.dateOfBirth || null,
          address: studentForm.address || null,
          father_cnic: studentForm.fatherCnic || null,
          admission_date: studentForm.admissionDate || null,
          is_active: studentForm.status !== 'blocked',
        });
      } else {
        await api.createUser({
          email: studentForm.email,
          full_name: studentForm.name,
          password: studentForm.password || 'Password123!',
          role: USER_ROLES.student,
          registration_number: studentForm.registrationNumber || null,
          father_name: studentForm.fatherName || null,
          b_form_cnic: studentForm.bFormCnic || null,
          roll_number: studentForm.rollNumber || null,
          date_of_birth: studentForm.dateOfBirth || null,
          address: studentForm.address || null,
          father_cnic: studentForm.fatherCnic || null,
          admission_date: studentForm.admissionDate || null,
          organization_id: selectedSchool?.organizationId || organizationId,
          school_id: Number(studentForm.schoolId),
          class_id: Number(studentForm.classId) || null,
        });
      }
      setStudentModalOpen(false);
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const deleteStudent = async (student: StudentRow) => {
    setSaving(true);
    try {
      await api.deactivateUser(student.id);
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const toggleStudentBlock = async (student: StudentRow) => {
    setSaving(true);
    try {
      await api.updateUser(student.id, { is_active: student.status === 'blocked' });
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const saveStudentPermissions = async (student: StudentRow, permissions: string[]) => {
    setSaving(true);
    try {
      await api.updateUser(student.id, { permissions });
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const updateTeacherRole = async (teacher: TeacherRow, role: string) => {
    setSaving(true);
    try {
      await api.updateUser(teacher.id, { role: role as never });
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const updateStudentRole = async (student: StudentRow, role: string) => {
    setSaving(true);
    try {
      await api.updateUser(student.id, { role: role as never });
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const openCreateAttendanceModal = () => {
    setEditingAttendanceId(null);
    setAttendanceForm({
      ...emptyAttendanceForm,
      studentId: scopedStudents[0]?.id || 0,
    });
    setAttendanceModalOpen(true);
  };

  const openEditAttendanceModal = (attendance: AttendanceRow) => {
    setEditingAttendanceId(attendance.id);
    setAttendanceForm({
      studentId: attendance.studentId,
      date: attendance.date,
      status: attendance.status,
      notes: attendance.notes,
    });
    setAttendanceModalOpen(true);
  };

  const saveAttendance = async () => {
    setSaving(true);
    try {
      if (editingAttendanceId) {
        await api.updateAttendance(editingAttendanceId, {
          attendance_date: attendanceForm.date,
          status: attendanceForm.status,
          notes: attendanceForm.notes || null,
        });
      } else {
        await api.createAttendance({
          student_id: Number(attendanceForm.studentId),
          attendance_date: attendanceForm.date,
          status: attendanceForm.status,
          notes: attendanceForm.notes || null,
        });
      }
      setAttendanceModalOpen(false);
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const openCreateFeeModal = () => {
    setEditingFeeId(null);
    setFeeForm({
      ...emptyFeeForm,
      studentId: scopedStudents[0]?.id || 0,
    });
    setFeeModalOpen(true);
  };

  const openEditFeeModal = (fee: FeeRow) => {
    setEditingFeeId(fee.id);
    setFeeForm({
      studentId: fee.studentId,
      month: fee.month,
      amount: fee.amount,
      status: fee.status,
      notes: fee.notes,
    });
    setFeeModalOpen(true);
  };

  const saveFee = async () => {
    setSaving(true);
    try {
      if (editingFeeId) {
        await api.updateFee(editingFeeId, {
          fee_month: feeForm.month,
          amount: Number(feeForm.amount),
          status: feeForm.status,
          notes: feeForm.notes || null,
        });
      } else {
        await api.createFee({
          student_id: Number(feeForm.studentId),
          fee_month: feeForm.month,
          amount: Number(feeForm.amount),
          status: feeForm.status,
          notes: feeForm.notes || null,
        });
      }
      setFeeModalOpen(false);
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const updateFeeStatus = async (fee: FeeRow, status: FeeRow['status']) => {
    setSaving(true);
    try {
      await api.updateFee(fee.id, { status });
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const openCreateSalaryModal = () => {
    const defaultTeacher = scopedTeachers[0];
    setEditingSalaryId(null);
    setSalaryForm({
      ...emptySalaryForm,
      teacherId: defaultTeacher?.id || 0,
      amount: defaultTeacher?.salary || 0,
    });
    setSalaryModalOpen(true);
  };

  const openEditSalaryModal = (salary: SalaryRow) => {
    setEditingSalaryId(salary.id);
    setSalaryForm({
      teacherId: salary.teacherId,
      month: salary.month,
      amount: salary.amount,
      status: salary.status,
      notes: salary.notes,
    });
    setSalaryModalOpen(true);
  };

  const saveSalary = async () => {
    setSaving(true);
    try {
      if (editingSalaryId) {
        await api.updateSalary(editingSalaryId, {
          salary_month: salaryForm.month,
          amount: Number(salaryForm.amount),
          status: salaryForm.status,
          notes: salaryForm.notes || null,
        });
      } else {
        await api.createSalary({
          teacher_id: Number(salaryForm.teacherId),
          salary_month: salaryForm.month,
          amount: Number(salaryForm.amount),
          status: salaryForm.status,
          notes: salaryForm.notes || null,
        });
      }
      setSalaryModalOpen(false);
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const updateSalaryStatus = async (salary: SalaryRow, status: SalaryRow['status']) => {
    setSaving(true);
    try {
      await api.updateSalary(salary.id, { status });
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const openCreateExpenseModal = () => {
    setEditingExpenseId(null);
    setExpenseForm({
      ...emptyExpenseForm,
      schoolId: scopedSchools[0]?.id || 0,
    });
    setExpenseModalOpen(true);
  };

  const openEditExpenseModal = (expense: ExpenseRow) => {
    setEditingExpenseId(expense.id);
    setExpenseForm({
      schoolId: expense.schoolId,
      title: expense.title,
      category: expense.category,
      date: expense.date,
      period: expense.period,
      amount: expense.amount,
      vendor: expense.vendor,
      paymentMethod: expense.paymentMethod,
      notes: expense.notes,
    });
    setExpenseModalOpen(true);
  };

  const saveExpense = async () => {
    setSaving(true);
    try {
      const payload = {
        school_id: Number(expenseForm.schoolId) || null,
        title: expenseForm.title,
        category: expenseForm.category,
        expense_date: expenseForm.date,
        period: expenseForm.period,
        amount: Number(expenseForm.amount),
        vendor: expenseForm.vendor || null,
        payment_method: expenseForm.paymentMethod || null,
        notes: expenseForm.notes || null,
      };
      if (editingExpenseId) await api.updateExpense(editingExpenseId, payload);
      else await api.createExpense(payload);
      setExpenseModalOpen(false);
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const openCreateScheduleModal = () => {
    setEditingScheduleId(null);
    setScheduleForm({ ...emptyScheduleForm, classId: scopedClasses[0]?.id || 0, teacherId: scopedClasses[0]?.teacherId || 0 });
    setScheduleModalOpen(true);
  };

  const openEditScheduleModal = (schedule: ScheduleRow) => {
    setEditingScheduleId(schedule.id);
    setScheduleForm({
      classId: schedule.classId,
      teacherId: schedule.teacherId,
      subject: schedule.subject,
      weekday: schedule.weekday,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      notes: schedule.notes,
    });
    setScheduleModalOpen(true);
  };

  const saveSchedule = async () => {
    setSaving(true);
    try {
      const payload = {
        class_id: Number(scheduleForm.classId),
        teacher_id: Number(scheduleForm.teacherId) || null,
        subject: scheduleForm.subject,
        weekday: scheduleForm.weekday,
        start_time: scheduleForm.startTime || null,
        end_time: scheduleForm.endTime || null,
        notes: scheduleForm.notes || null,
      };
      if (editingScheduleId) await api.updateSchedule(editingScheduleId, payload);
      else await api.createSchedule(payload);
      setScheduleModalOpen(false);
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const openCreateWorkModal = () => {
    setEditingWorkId(null);
    setWorkForm({ ...emptyWorkForm, classId: scopedClasses[0]?.id || 0, teacherId: scopedClasses[0]?.teacherId || 0 });
    setWorkModalOpen(true);
  };

  const openEditWorkModal = (work: WorkRow) => {
    setEditingWorkId(work.id);
    setWorkForm({
      classId: work.classId,
      teacherId: work.teacherId,
      title: work.title,
      description: work.description,
      dueDate: work.dueDate,
    });
    setWorkModalOpen(true);
  };

  const saveWork = async () => {
    setSaving(true);
    try {
      const payload = {
        class_id: Number(workForm.classId),
        teacher_id: Number(workForm.teacherId) || null,
        title: workForm.title,
        description: workForm.description || null,
        due_date: workForm.dueDate || null,
      };
      if (editingWorkId) await api.updateWork(editingWorkId, payload);
      else await api.createWork(payload);
      setWorkModalOpen(false);
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const openCreateResultModal = () => {
    const defaultStudent = scopedStudents[0];
    setEditingResultId(null);
    setResultForm({
      ...emptyResultForm,
      studentId: defaultStudent?.id || 0,
      teacherId: defaultStudent ? scopedClasses.find((item) => item.id === defaultStudent.classId)?.teacherId || 0 : 0,
    });
    setResultModalOpen(true);
  };

  const openEditResultModal = (result: ResultRow) => {
    setEditingResultId(result.id);
    setResultForm({
      studentId: result.studentId,
      teacherId: result.teacherId,
      examName: result.examName,
      subject: result.subject,
      marksObtained: result.marksObtained,
      totalMarks: result.totalMarks,
      examDate: result.examDate,
      remarks: result.remarks,
    });
    setResultModalOpen(true);
  };

  const saveResult = async () => {
    setSaving(true);
    try {
      const payload = {
        teacher_id: Number(resultForm.teacherId) || null,
        exam_name: resultForm.examName,
        subject: resultForm.subject,
        marks_obtained: Number(resultForm.marksObtained),
        total_marks: Number(resultForm.totalMarks),
        exam_date: resultForm.examDate || null,
        remarks: resultForm.remarks || null,
      };
      if (editingResultId) await api.updateResult(editingResultId, payload);
      else await api.createResult({ ...payload, student_id: Number(resultForm.studentId) });
      setResultModalOpen(false);
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const saveOrganizationSettings = async () => {
    if (!organization) return;
    setSaving(true);
    try {
      await api.updateOrganization(organization.id, {
        name: organizationSettingsForm.name,
        slug: organizationSettingsForm.slug,
        contact_email: organizationSettingsForm.contactEmail || null,
        phone: organizationSettingsForm.phone || null,
        address: organizationSettingsForm.address || null,
      });
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const saveMyProfile = async () => {
    setSaving(true);
    try {
      await api.updateMyProfile({
        full_name: profileForm.fullName,
        email: profileForm.email,
      });
      await loadDashboardData();
    } finally {
      setSaving(false);
    }
  };

  const saveMyPassword = async () => {
    setSaving(true);
    try {
      await api.updateMyPassword({
        current_password: profileForm.currentPassword,
        new_password: profileForm.newPassword,
      });
      setProfileForm({ ...profileForm, currentPassword: '', newPassword: '' });
    } finally {
      setSaving(false);
    }
  };

  return {
    schools: scopedSchools,
    classes: scopedClasses,
    schoolAdmins: scopedSchoolAdmins,
    teachers: scopedTeachers,
    students: scopedStudents,
    attendance: scopedAttendance,
    fees: scopedFees,
    salaries: scopedSalaries,
    expenses: scopedExpenses,
    schedules: scopedSchedules,
    work: scopedWork,
    results: scopedResults,
    activities: scopedActivities,
    report,
    organization,
    loading,
    saving,
    error,
    schoolModalOpen,
    classModalOpen,
    teacherModalOpen,
    studentModalOpen,
    attendanceModalOpen,
    feeModalOpen,
    salaryModalOpen,
    expenseModalOpen,
    scheduleModalOpen,
    workModalOpen,
    resultModalOpen,
    schoolAdminModalOpen,
    editingSchoolId,
    editingClassId,
    editingTeacherId,
    editingStudentId,
    editingAttendanceId,
    editingFeeId,
    editingSalaryId,
    editingExpenseId,
    editingScheduleId,
    editingWorkId,
    editingResultId,
    editingSchoolAdminId,
    schoolForm,
    classForm,
    teacherForm,
    studentForm,
    attendanceForm,
    feeForm,
    salaryForm,
    expenseForm,
    scheduleForm,
    workForm,
    resultForm,
    organizationSettingsForm,
    profileForm,
    schoolAdminForm,
    setSchoolForm,
    setClassForm,
    setTeacherForm,
    setStudentForm,
    setAttendanceForm,
    setFeeForm,
    setSalaryForm,
    setExpenseForm,
    setScheduleForm,
    setWorkForm,
    setResultForm,
    setOrganizationSettingsForm,
    setProfileForm,
    setSchoolAdminForm,
    setSchoolModalOpen,
    setClassModalOpen,
    setTeacherModalOpen,
    setStudentModalOpen,
    setAttendanceModalOpen,
    setFeeModalOpen,
    setSalaryModalOpen,
    setExpenseModalOpen,
    setScheduleModalOpen,
    setWorkModalOpen,
    setResultModalOpen,
    setSchoolAdminModalOpen,
    openCreateSchoolModal,
    openEditSchoolModal,
    saveSchool,
    deleteSchool,
    toggleSchoolBlock,
    openCreateClassModal,
    openEditClassModal,
    saveClass,
    deleteClass,
    toggleClassBlock,
    openCreateSchoolAdminModal,
    openEditSchoolAdminModal,
    saveSchoolAdmin,
    deleteSchoolAdmin,
    toggleSchoolAdminBlock,
    saveSchoolAdminPermissions,
    openCreateTeacherModal,
    openEditTeacherModal,
    saveTeacher,
    deleteTeacher,
    toggleTeacherBlock,
    saveTeacherPermissions,
    openCreateStudentModal,
    openEditStudentModal,
    saveStudent,
    deleteStudent,
    toggleStudentBlock,
    saveStudentPermissions,
    updateTeacherRole,
    updateStudentRole,
    openCreateAttendanceModal,
    openEditAttendanceModal,
    saveAttendance,
    openCreateFeeModal,
    openEditFeeModal,
    saveFee,
    updateFeeStatus,
    openCreateSalaryModal,
    openEditSalaryModal,
    saveSalary,
    updateSalaryStatus,
    openCreateExpenseModal,
    openEditExpenseModal,
    saveExpense,
    openCreateScheduleModal,
    openEditScheduleModal,
    saveSchedule,
    openCreateWorkModal,
    openEditWorkModal,
    saveWork,
    openCreateResultModal,
    openEditResultModal,
    saveResult,
    saveOrganizationSettings,
    saveMyProfile,
    saveMyPassword,
  };
}
