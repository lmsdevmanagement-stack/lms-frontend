import { useCallback, useEffect, useMemo, useState } from 'react';
import { USER_ROLES } from '../constants/roles';
import * as api from '../services/api';
import type { ActivityResponse, SchoolAdminRow, SchoolResponse, SchoolRow, StudentRow, TeacherRow, UserResponse } from '../types';

export type SchoolFormState = Pick<SchoolRow, 'name' | 'address' | 'status'>;
export type TeacherFormState = Pick<TeacherRow, 'name' | 'email' | 'schoolId' | 'subject' | 'status'> & {
  password: string;
};
export type SchoolAdminFormState = {
  fullName: string;
  email: string;
  password: string;
  schoolId: number;
  organizationId: number;
};
export type StudentFormState = Pick<StudentRow, 'name' | 'email' | 'schoolId' | 'className' | 'status'> & {
  password: string;
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
  status: 'active',
  password: '',
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
  className: '',
  status: 'active',
  password: '',
};

interface UseDashboardCrudArgs {
  isSuperAdmin: boolean;
  organizationId: number;
  schoolId: number | null;
  searchTerm: string;
  enabled: boolean;
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
        subject: 'General',
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

function mapStudentRows(users: UserResponse[], schools: SchoolResponse[]): StudentRow[] {
  return users
    .filter((user) => user.role === USER_ROLES.student)
    .map((student) => {
      const school = schools.find((item) => item.id === student.school_id);
      return {
        id: student.id,
        organizationId: student.organization_id || 0,
        schoolId: student.school_id || 0,
        name: student.full_name,
        email: student.email,
        school: school?.name || 'Unassigned',
        className: 'Unassigned',
        status: student.is_active ? 'active' : 'blocked',
      };
    });
}

export function useDashboardCrud({ isSuperAdmin, organizationId, schoolId, searchTerm, enabled }: UseDashboardCrudArgs) {
  const [schoolRows, setSchoolRows] = useState<SchoolRow[]>([]);
  const [schoolAdminRows, setSchoolAdminRows] = useState<SchoolAdminRow[]>([]);
  const [teacherRows, setTeacherRows] = useState<TeacherRow[]>([]);
  const [studentRows, setStudentRows] = useState<StudentRow[]>([]);
  const [activityRows, setActivityRows] = useState<ActivityResponse[]>([]);
  const [schoolModalOpen, setSchoolModalOpen] = useState(false);
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [schoolAdminModalOpen, setSchoolAdminModalOpen] = useState(false);
  const [editingSchoolId, setEditingSchoolId] = useState<number | null>(null);
  const [editingTeacherId, setEditingTeacherId] = useState<number | null>(null);
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [editingSchoolAdminId, setEditingSchoolAdminId] = useState<number | null>(null);
  const [schoolForm, setSchoolForm] = useState<SchoolFormState>(emptySchoolForm);
  const [teacherForm, setTeacherForm] = useState<TeacherFormState>(emptyTeacherForm);
  const [studentForm, setStudentForm] = useState<StudentFormState>(emptyStudentForm);
  const [schoolAdminForm, setSchoolAdminForm] = useState<SchoolAdminFormState>(emptySchoolAdminForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const [schoolsResponse, usersResponse, activitiesResponse] = await Promise.all([
        api.listSchools(),
        api.listUsers(),
        api.listActivities(50),
      ]);
      const schools = schoolsResponse.data.data;
      const users = usersResponse.data.data;
      setSchoolRows(mapSchoolRows(schools, users));
      setSchoolAdminRows(mapSchoolAdminRows(users, schools));
      setTeacherRows(mapTeacherRows(users, schools));
      setStudentRows(mapStudentRows(users, schools));
      setActivityRows(activitiesResponse.data.data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load dashboard data');
      setSchoolRows([]);
      setSchoolAdminRows([]);
      setTeacherRows([]);
      setStudentRows([]);
      setActivityRows([]);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

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
          is_active: teacherForm.status !== 'blocked',
        });
      } else {
        await api.createUser({
          email: teacherForm.email,
          full_name: teacherForm.name,
          password: teacherForm.password || 'Password123!',
          role: USER_ROLES.teacher,
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

  const openCreateStudentModal = () => {
    setEditingStudentId(null);
    setStudentForm({
      ...emptyStudentForm,
      schoolId: scopedSchools[0]?.id || 0,
    });
    setStudentModalOpen(true);
  };

  const openEditStudentModal = (student: StudentRow) => {
    setEditingStudentId(student.id);
    setStudentForm({
      name: student.name,
      email: student.email,
      schoolId: student.schoolId,
      className: student.className,
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
          is_active: studentForm.status !== 'blocked',
        });
      } else {
        await api.createUser({
          email: studentForm.email,
          full_name: studentForm.name,
          password: studentForm.password || 'Password123!',
          role: USER_ROLES.student,
          organization_id: selectedSchool?.organizationId || organizationId,
          school_id: Number(studentForm.schoolId),
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

  return {
    schools: scopedSchools,
    schoolAdmins: scopedSchoolAdmins,
    teachers: scopedTeachers,
    students: scopedStudents,
    activities: scopedActivities,
    loading,
    saving,
    error,
    schoolModalOpen,
    teacherModalOpen,
    studentModalOpen,
    schoolAdminModalOpen,
    editingSchoolId,
    editingTeacherId,
    editingStudentId,
    editingSchoolAdminId,
    schoolForm,
    teacherForm,
    studentForm,
    schoolAdminForm,
    setSchoolForm,
    setTeacherForm,
    setStudentForm,
    setSchoolAdminForm,
    setSchoolModalOpen,
    setTeacherModalOpen,
    setStudentModalOpen,
    setSchoolAdminModalOpen,
    openCreateSchoolModal,
    openEditSchoolModal,
    saveSchool,
    deleteSchool,
    toggleSchoolBlock,
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
    openCreateStudentModal,
    openEditStudentModal,
    saveStudent,
    deleteStudent,
    toggleStudentBlock,
  };
}
