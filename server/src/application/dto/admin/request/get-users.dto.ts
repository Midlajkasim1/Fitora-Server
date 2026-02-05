export interface GetUsersRequestDTO {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  specialization?: string;
}