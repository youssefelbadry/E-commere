import { Injectable } from "@nestjs/common";
import Stripe from "stripe";

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }

  async createCheckoutSession({
    success_url = process.env.STRIPE_SUCCESS_URL as string,
    cancel_url = process.env.STRIPE_CANCEL_URL as string,
    metadata = {},
    discounts = [],
    customer_email,
    mode = "payment",
    line_items,
  }: {
    success_url?: string;
    cancel_url?: string;
    metadata?: Record<string, string>;
    discounts?: Stripe.Checkout.SessionCreateParams.Discount[];
    customer_email?: string;
    mode?: "payment" | "subscription";
    line_items: Stripe.Checkout.SessionCreateParams.LineItem[];
  }) {
    const session = await this.stripe.checkout.sessions.create({
      cancel_url,
      metadata,
      customer_email,
      mode,
      line_items,
      success_url,
      discounts,
    });

    return session;
  }
}
