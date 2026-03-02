
export interface GetTrainersRequestDTO {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  specialization?:string;
}