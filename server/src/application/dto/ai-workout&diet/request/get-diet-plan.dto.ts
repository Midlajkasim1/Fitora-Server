export class GetDietPlanRequestDTO {
  userId!: string;
  constructor(data: GetDietPlanRequestDTO) {
    Object.assign(this, data);
  }
}