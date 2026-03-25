
export class GetSubscriptionPlanByIdRequestDTO {
  id!: string;

  constructor(data: GetSubscriptionPlanByIdRequestDTO) {
    Object.assign(this, data);
  }
}