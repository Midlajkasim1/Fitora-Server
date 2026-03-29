export class GetUserUpcomingRequestDTO {
  userId!: string;
  page!: number;
  limit!: number;

  constructor(data: GetUserUpcomingRequestDTO) {
    Object.assign(this, data);
  }
}