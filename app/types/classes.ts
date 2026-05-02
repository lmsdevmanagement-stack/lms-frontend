export interface ClassResponse {
  id: number;
  name: string;
  section?: string | null;
  description?: string | null;
  organization_id: number;
  school_id: number;
  is_active: boolean;
  created_at: string;
}

export interface ClassCreateData {
  name: string;
  section?: string | null;
  description?: string | null;
  organization_id?: number | null;
  school_id: number;
}

export interface ClassUpdateData {
  name?: string;
  section?: string | null;
  description?: string | null;
  organization_id?: number | null;
  school_id?: number;
  is_active?: boolean;
}
