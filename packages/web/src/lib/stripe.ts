import Stripe from "stripe";

let client: Stripe | null = null;

/**
 * Lazily constructed so importing this module doesn't throw when
 * STRIPE_SECRET_KEY isn't set (e.g. local dev without payments configured).
 * Callers must handle the null case explicitly.
 */
export function getStripeClient(): Stripe | null {
  if (client) return client;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  client = new Stripe(key, { apiVersion: "2024-06-20" });
  return client;
}
