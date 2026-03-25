import Stripe from "stripe";
import { env } from "@/infrastructure/config/env.config";
import { IPaymentProvider } from "@/domain/interfaces/services/paymentProvider.interface";
import { CheckoutSessionURL } from "@/domain/interfaces/services/paymentCheckouturl.interface";
import { IWebhookEvent } from "@/domain/interfaces/services/webhook-event.interface";
import { PAYMENT_MESSAGES } from "@/domain/constants/messages.constants";

export class StripePaymentProvider implements IPaymentProvider {
  private readonly _stripe: Stripe;

  constructor() {
    this._stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    });
  }

  getProviderName(): string {
    return "stripe";
  }

  async createCheckoutSession(params: {
    userId: string;
    userEmail: string;
    planId: string;
    planName: string;
    amount: number;
  }): Promise<CheckoutSessionURL> {
    
    const session = await this._stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: params.userEmail,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: params.planName,
            },
            unit_amount: Math.round(params.amount * 100), 
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        userId: params.userId,
        planId: params.planId,
      },
      success_url: `${env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.CLIENT_URL}/payment/cancel`,
    });

    if (!session.url) {
      throw new Error(PAYMENT_MESSAGES.STRIPE_FAILED_TO_CREATE_CHECKOUT_URL);
    }

    return {
      url: session.url,
      sessionId: session.id,
    };
  }
   verifyWebhook(rawBody: Buffer, headers: Record<string, string | string[] | undefined>): IWebhookEvent {
      try {
        const signature = headers["stripe-signature"] as string;
        const event = this._stripe.webhooks.constructEvent(
            rawBody,
            signature,
            env.STRIPE_WEBHOOK_SECRET!
        );
        const session = event.data.object as Stripe.Checkout.Session;
        return{
        type: event.type,
        sessionId: session.id,
        metadata: {
          userId: session.metadata?.userId,
          planId: session.metadata?.planId,
        }
        };
      } catch {
        throw new Error(PAYMENT_MESSAGES.INVALID_WEBHOOK_SIGNATURE);
      }
  }
}