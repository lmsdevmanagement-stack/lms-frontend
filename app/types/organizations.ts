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
