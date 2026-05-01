export interface ActivityResponse {
  id: number;
  actor_user_id?: number | null;
  actor_name: string;
  actor_role: string;
  organization_id?: number | null;
  school_id?: number | null;
  action: string;
  entity_type: string;
  entity_id?: number | null;
  description: string;
  created_at: string;
}
