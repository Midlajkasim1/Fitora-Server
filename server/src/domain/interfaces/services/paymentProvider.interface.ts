import { CheckoutSessionURL } from "./paymentCheckouturl.interface";
import { IWebhookEvent } from "./webhook-event.interface";

export interface IPaymentProvider {
  
  createCheckoutSession(params: {
    userId: string;
    userName: string;
    userEmail: string;
    planId: string;
    planName: string;
    amount: number;      
    interval: string;   
  }): Promise<CheckoutSessionURL>;

  getProviderName(): string;
  verifyWebhook(rawBody:Buffer,headers:Record<string,string | string[] | undefined>):IWebhookEvent;
}