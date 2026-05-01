import type { UserRole } from '../constants/roles';

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
