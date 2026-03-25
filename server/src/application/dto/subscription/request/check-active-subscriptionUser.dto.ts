export class CheckActiveSubscriptionRequestDTO {
  userId!: string;

  constructor(data: CheckActiveSubscriptionRequestDTO) {
    Object.assign(this, data);
  }
}