export interface PaginationMeta {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  pagination?: PaginationMeta;
}
