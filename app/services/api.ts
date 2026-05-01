import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import { STORAGE_KEYS } from '../constants/auth';
import { APP_ROUTES } from '../constants/routes';
import type { UserRole } from '../constants/roles';

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

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterAdminData {
  user: {
    email: string;
    full_name: string;
    password: string;
  };
  school: {
    name: string;
    address: string;
  };
}

export interface RegisterSuperAdminData {
  email: string;
  full_name: string;
  password: string;
}

export interface RegisterOrganizationAdminData {
  organization: {
    name: string;
    slug: string;
    contact_email?: string;
    phone?: string;
    address?: string;
  };
  admin: {
    email: string;
    full_name: string;
    password: string;
  };
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  role: UserRole;
  organization_id?: number;
  permissions: string[];
}

export interface UserResponse {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  organization_id?: number;
  school_id?: number;
  is_active: boolean;
  created_at: string;
  permissions: string[];
}

export interface UserCreateData {
  email: string;
  full_name: string;
  password: string;
  role?: UserRole;
  organization_id?: number | null;
  school_id?: number | null;
}

export interface UserUpdateData {
  full_name?: string;
  role?: UserRole;
  organization_id?: number | null;
  school_id?: number | null;
  is_active?: boolean;
}

export interface OrganizationResponse {
  id: number;
  name: string;
  slug: string;
  contact_email?: string | null;
  phone?: string | null;
  address?: string | null;
  subscription_status: string;
  is_active: boolean;
  created_by_id?: number | null;
  created_at: string;
}

export interface OrganizationCreateData {
  name: string;
  slug: string;
  contact_email?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface OrganizationUpdateData {
  name?: string;
  slug?: string;
  contact_email?: string | null;
  phone?: string | null;
  address?: string | null;
  subscription_status?: string;
  is_active?: boolean;
}

export interface SchoolResponse {
  id: number;
  name: string;
  address?: string | null;
  organization_id?: number | null;
  is_active: boolean;
}

export interface SchoolCreateData {
  name: string;
  address?: string | null;
  organization_id?: number | null;
}

export interface SchoolUpdateData {
  name?: string;
  address?: string | null;
  organization_id?: number | null;
  is_active?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

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
