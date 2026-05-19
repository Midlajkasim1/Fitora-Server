

export class UpdateSubscriptionPlanStatusRequestDTO {
  id!: string;

  constructor(data: UpdateSubscriptionPlanStatusRequestDTO) {
    Object.assign(this, data);
  }
}