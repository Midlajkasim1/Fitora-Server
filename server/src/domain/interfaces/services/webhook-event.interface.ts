export interface IWebhookEvent {
  type: string;
  sessionId: string;
  metadata?: {
    userId?: string;
    planId?: string;
  };
}