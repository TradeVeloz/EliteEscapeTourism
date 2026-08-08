import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripeClient } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Payments are not configured on this deployment yet" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object as { id: string; metadata?: { bookingId?: string } };
    const bookingId = checkoutSession.metadata?.bookingId;

    await prisma.payment
      .updateMany({
        where: { providerRef: checkoutSession.id },
        data: { status: "PAID" },
      })
      .catch(() => undefined);

    if (bookingId) {
      await prisma.booking
        .update({
          where: { id: bookingId },
          data: { paymentStatus: "PAID", status: "CONFIRMED" },
        })
        .catch(() => undefined);
    }
  }

  return NextResponse.json({ received: true });
}
