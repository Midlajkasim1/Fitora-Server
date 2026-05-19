export class GetTrainersRequestDTO {
  page!: number;
  limit!: number;
  search?: string;
  status?: string;
  specialization?: string;

  constructor(data: GetTrainersRequestDTO) {
    Object.assign(this, data);
  }
}