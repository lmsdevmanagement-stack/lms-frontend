export interface ClassResponse {
  id: number;
  name: string;
  section?: string | null;
  description?: string | null;
  organization_id: number;
  school_id: number;
  teacher_id?: number | null;
  is_active: boolean;
  created_at: string;
}

export interface ClassCreateData {
  name: string;
  section?: string | null;
  description?: string | null;
  organization_id?: number | null;
  school_id?: number;
  teacher_id?: number | null;
}

export interface ClassUpdateData {
  name?: string;
  section?: string | null;
  description?: string | null;
  organization_id?: number | null;
  school_id?: number;
  teacher_id?: number | null;
  is_active?: boolean;
}
