
export class HandleWebhookRequestDTO {
  sessionId!: string;
  type!: string;
  metadata?: {
    userId?: string;
    planId?: string;
  };

  constructor(data: HandleWebhookRequestDTO) {
    Object.assign(this, data);
  }
}