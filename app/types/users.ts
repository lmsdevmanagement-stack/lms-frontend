import type { UserRole } from '../constants/roles';

export interface UserResponse {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  father_name?: string | null;
  cnic?: string | null;
  address?: string | null;
  experience?: string | null;
  subject_specialist?: string | null;
  salary?: number | null;
  joining_date?: string | null;
  registration_number?: string | null;
  b_form_cnic?: string | null;
  roll_number?: string | null;
  date_of_birth?: string | null;
  father_cnic?: string | null;
  admission_date?: string | null;
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
  father_name?: string | null;
  cnic?: string | null;
  address?: string | null;
  experience?: string | null;
  subject_specialist?: string | null;
  salary?: number | null;
  joining_date?: string | null;
  registration_number?: string | null;
  b_form_cnic?: string | null;
  roll_number?: string | null;
  date_of_birth?: string | null;
  father_cnic?: string | null;
  admission_date?: string | null;
  organization_id?: number | null;
  school_id?: number | null;
  class_id?: number | null;
}

export interface UserUpdateData {
  full_name?: string;
  role?: UserRole;
  father_name?: string | null;
  cnic?: string | null;
  address?: string | null;
  experience?: string | null;
  subject_specialist?: string | null;
  salary?: number | null;
  joining_date?: string | null;
  registration_number?: string | null;
  b_form_cnic?: string | null;
  roll_number?: string | null;
  date_of_birth?: string | null;
  father_cnic?: string | null;
  admission_date?: string | null;
  organization_id?: number | null;
  school_id?: number | null;
  class_id?: number | null;
  permissions?: string[];
  is_active?: boolean;
}

export interface UserProfileUpdateData {
  full_name?: string;
  email?: string;
}

export interface UserPasswordUpdateData {
  current_password: string;
  new_password: string;
}
