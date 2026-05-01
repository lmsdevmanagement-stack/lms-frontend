import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
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
        localStorage.removeItem('token');
        window.location.href = '/login';
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
  role: string;
  organization_id?: number;
  permissions: string[];
}

export interface UserResponse {
  id: number;
  email: string;
  full_name: string;
  role: string;
  organization_id?: number;
  school_id?: number;
  is_active: boolean;
  created_at: string;
  permissions: string[];
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
  
  return api.post('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

export const registerAdmin = (data: RegisterAdminData): Promise<AxiosResponse<ApiResponse<UserResponse>>> => {
  return api.post('/auth/register/admin', {
    user_in: data.user,
    school_in: data.school,
  });
};

export const registerSuperAdmin = (data: RegisterSuperAdminData): Promise<AxiosResponse<ApiResponse<UserResponse>>> => {
  return api.post('/auth/register/super-admin', data);
};

export const registerOrganizationAdmin = (data: RegisterOrganizationAdminData): Promise<AxiosResponse<ApiResponse<UserResponse>>> => {
  return api.post('/auth/register/organization-admin', data);
};

export const getCurrentUser = (): Promise<AxiosResponse<ApiResponse<UserResponse>>> => {
  return api.get('/auth/me');
};

export const logout = (): Promise<void> => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
  return Promise.resolve();
};

export default api;
