import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import { STORAGE_KEYS } from '../constants/auth';
import { APP_ROUTES } from '../constants/routes';
import type {
  ApiResponse,
  ActivityResponse,
  AttendanceCreateData,
  AttendanceResponse,
  AttendanceUpdateData,
  ClassCreateData,
  ClassResponse,
  ClassUpdateData,
  DashboardReport,
  FeeCreateData,
  FeeResponse,
  FeeUpdateData,
  LoginCredentials,
  OrganizationCreateData,
  OrganizationResponse,
  OrganizationUpdateData,
  RegisterAdminData,
  RegisterOrganizationAdminData,
  RegisterSuperAdminData,
  SchoolCreateData,
  SchoolResponse,
  SchoolUpdateData,
  TokenResponse,
  UserCreateData,
  UserResponse,
  UserUpdateData,
} from '../types';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.token) : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.token);
        window.location.href = APP_ROUTES.login;
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const login = (credentials: LoginCredentials): Promise<AxiosResponse<ApiResponse<TokenResponse>>> => {
  const formData = new URLSearchParams();
  formData.append('username', credentials.email);
  formData.append('password', credentials.password);
  
  return api.post(API_ENDPOINTS.auth.login, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

export const registerAdmin = (data: RegisterAdminData): Promise<AxiosResponse<ApiResponse<UserResponse>>> => {
  return api.post(API_ENDPOINTS.auth.registerAdmin, {
    user_in: data.user,
    school_in: data.school,
  });
};

export const registerSuperAdmin = (data: RegisterSuperAdminData): Promise<AxiosResponse<ApiResponse<UserResponse>>> => {
  return api.post(API_ENDPOINTS.auth.registerSuperAdmin, data);
};

export const registerOrganizationAdmin = (data: RegisterOrganizationAdminData): Promise<AxiosResponse<ApiResponse<UserResponse>>> => {
  return api.post(API_ENDPOINTS.auth.registerOrganizationAdmin, data);
};

export const getCurrentUser = (): Promise<AxiosResponse<ApiResponse<UserResponse>>> => {
  return api.get(API_ENDPOINTS.auth.me);
};

export const logout = (): Promise<void> => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.token);
  }
  return Promise.resolve();
};

// Activities API
export const listActivities = (limit = 50): Promise<AxiosResponse<ApiResponse<ActivityResponse[]>>> => {
  return api.get(API_ENDPOINTS.activities.base, { params: { limit } });
};

// Organizations API
export const listOrganizations = (): Promise<AxiosResponse<ApiResponse<OrganizationResponse[]>>> => {
  return api.get(API_ENDPOINTS.organizations.base);
};

export const createOrganization = (data: OrganizationCreateData): Promise<AxiosResponse<ApiResponse<OrganizationResponse>>> => {
  return api.post(API_ENDPOINTS.organizations.base, data);
};

export const getOrganization = (organizationId: number): Promise<AxiosResponse<ApiResponse<OrganizationResponse>>> => {
  return api.get(API_ENDPOINTS.organizations.byId(organizationId));
};

export const updateOrganization = (
  organizationId: number,
  data: OrganizationUpdateData
): Promise<AxiosResponse<ApiResponse<OrganizationResponse>>> => {
  return api.patch(API_ENDPOINTS.organizations.byId(organizationId), data);
};

export const deactivateOrganization = (organizationId: number): Promise<AxiosResponse<ApiResponse<OrganizationResponse>>> => {
  return api.delete(API_ENDPOINTS.organizations.byId(organizationId));
};

export const createOrganizationAdmin = (
  organizationId: number,
  data: UserCreateData
): Promise<AxiosResponse<ApiResponse<UserResponse>>> => {
  return api.post(API_ENDPOINTS.organizations.admins(organizationId), data);
};

// Schools API
export const listSchools = (): Promise<AxiosResponse<ApiResponse<SchoolResponse[]>>> => {
  return api.get(API_ENDPOINTS.schools.base);
};

export const createSchool = (data: SchoolCreateData): Promise<AxiosResponse<ApiResponse<SchoolResponse>>> => {
  return api.post(API_ENDPOINTS.schools.base, data);
};

export const getSchool = (schoolId: number): Promise<AxiosResponse<ApiResponse<SchoolResponse>>> => {
  return api.get(API_ENDPOINTS.schools.byId(schoolId));
};

export const updateSchool = (
  schoolId: number,
  data: SchoolUpdateData
): Promise<AxiosResponse<ApiResponse<SchoolResponse>>> => {
  return api.patch(API_ENDPOINTS.schools.byId(schoolId), data);
};

export const deactivateSchool = (schoolId: number): Promise<AxiosResponse<ApiResponse<SchoolResponse>>> => {
  return api.delete(API_ENDPOINTS.schools.byId(schoolId));
};

// Classes API
export const listClasses = (): Promise<AxiosResponse<ApiResponse<ClassResponse[]>>> => {
  return api.get(API_ENDPOINTS.classes.base);
};

export const createClass = (data: ClassCreateData): Promise<AxiosResponse<ApiResponse<ClassResponse>>> => {
  return api.post(API_ENDPOINTS.classes.base, data);
};

export const getClass = (classId: number): Promise<AxiosResponse<ApiResponse<ClassResponse>>> => {
  return api.get(API_ENDPOINTS.classes.byId(classId));
};

export const updateClass = (
  classId: number,
  data: ClassUpdateData
): Promise<AxiosResponse<ApiResponse<ClassResponse>>> => {
  return api.patch(API_ENDPOINTS.classes.byId(classId), data);
};

export const deactivateClass = (classId: number): Promise<AxiosResponse<ApiResponse<ClassResponse>>> => {
  return api.delete(API_ENDPOINTS.classes.byId(classId));
};

// Attendance API
export const listAttendance = (params?: {
  attendance_date?: string;
  class_id?: number;
  school_id?: number;
}): Promise<AxiosResponse<ApiResponse<AttendanceResponse[]>>> => {
  return api.get(API_ENDPOINTS.attendance.base, { params });
};

export const createAttendance = (data: AttendanceCreateData): Promise<AxiosResponse<ApiResponse<AttendanceResponse>>> => {
  return api.post(API_ENDPOINTS.attendance.base, data);
};

export const updateAttendance = (
  attendanceId: number,
  data: AttendanceUpdateData
): Promise<AxiosResponse<ApiResponse<AttendanceResponse>>> => {
  return api.patch(API_ENDPOINTS.attendance.byId(attendanceId), data);
};

// Fees API
export const listFees = (params?: {
  fee_month?: string;
  class_id?: number;
  school_id?: number;
  status?: FeeResponse['status'];
}): Promise<AxiosResponse<ApiResponse<FeeResponse[]>>> => {
  return api.get(API_ENDPOINTS.fees.base, { params });
};

export const createFee = (data: FeeCreateData): Promise<AxiosResponse<ApiResponse<FeeResponse>>> => {
  return api.post(API_ENDPOINTS.fees.base, data);
};

export const updateFee = (feeId: number, data: FeeUpdateData): Promise<AxiosResponse<ApiResponse<FeeResponse>>> => {
  return api.patch(API_ENDPOINTS.fees.byId(feeId), data);
};

// Reports API
export const getDashboardReport = (): Promise<AxiosResponse<ApiResponse<DashboardReport>>> => {
  return api.get(API_ENDPOINTS.reports.dashboard);
};

// Users API
export const listUsers = (): Promise<AxiosResponse<ApiResponse<UserResponse[]>>> => {
  return api.get(API_ENDPOINTS.users.base);
};

export const createUser = (data: UserCreateData): Promise<AxiosResponse<ApiResponse<UserResponse>>> => {
  return api.post(API_ENDPOINTS.users.base, data);
};

export const getUser = (userId: number): Promise<AxiosResponse<ApiResponse<UserResponse>>> => {
  return api.get(API_ENDPOINTS.users.byId(userId));
};

export const updateUser = (userId: number, data: UserUpdateData): Promise<AxiosResponse<ApiResponse<UserResponse>>> => {
  return api.patch(API_ENDPOINTS.users.byId(userId), data);
};

export const deactivateUser = (userId: number): Promise<AxiosResponse<ApiResponse<UserResponse>>> => {
  return api.delete(API_ENDPOINTS.users.byId(userId));
};

export default api;
