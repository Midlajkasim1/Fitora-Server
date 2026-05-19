export class GetUsersRequestDTO {
  page!: number;
  limit!: number;
  search?: string;
  status?: string;
  specialization?: string;

  constructor(data: GetUsersRequestDTO) {
    Object.assign(this, data);
  }
}