import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getStripeClient } from "@/lib/stripe";
import { getAuthUser } from "@/lib/session";
import { paymentInitiateSchema } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const session = getAuthUser(request);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const ip = clientIp(request);
  const limit = rateLimit(`payments:initiate:${ip}`, 20, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json(
      { error: "Payments are not configured on this deployment yet" },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = paymentInitiateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payment request" }, { status: 422 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: parsed.data.bookingId },
    include: { package: true },
  });

  if (!booking || booking.userId !== session.sub) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (booking.paymentStatus === "PAID") {
    return NextResponse.json({ error: "Booking is already paid" }, { status: 409 });
  }

  const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";
  const zodStringSchema = z.string();
  const validatedFrontendUrl = zodStringSchema.url().safeParse(frontendUrl).success
    ? frontendUrl
    : "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "aed",
          unit_amount: Math.round(booking.totalPrice * 100),
          product_data: { name: booking.package.name, description: `Booking ${booking.bookingNo}` },
        },
      },
    ],
    success_url: `${validatedFrontendUrl}/client-portal?payment=success`,
    cancel_url: `${validatedFrontendUrl}/client-portal?payment=cancelled`,
    metadata: { bookingId: booking.id },
  });

  await prisma.payment.create({
    data: {
      bookingId: booking.id,
      provider: "stripe",
      providerRef: checkoutSession.id,
      amount: booking.totalPrice,
      currency: "AED",
      status: "PENDING",
    },
  });

  return NextResponse.json({ data: { checkoutUrl: checkoutSession.url } }, { status: 201 });
}
