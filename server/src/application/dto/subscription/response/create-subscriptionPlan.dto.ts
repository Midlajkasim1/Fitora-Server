
export class CreateSubscriptionPlanResponseDTO {
  message!: string;

  constructor(data: CreateSubscriptionPlanResponseDTO) {
    Object.assign(this, data);
  }
}