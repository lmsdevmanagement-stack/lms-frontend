import type { UserRole } from '../constants/roles';

export interface UserResponse {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  organization_id?: number;
  school_id?: number;
  class_id?: number | null;
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
  class_id?: number | null;
}

export interface UserUpdateData {
  full_name?: string;
  role?: UserRole;
  organization_id?: number | null;
  school_id?: number | null;
  class_id?: number | null;
  permissions?: string[];
  is_active?: boolean;
}
