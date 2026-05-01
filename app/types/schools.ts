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
