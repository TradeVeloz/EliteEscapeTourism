import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validation";
import { getAuthUser } from "@/lib/session";
import { hashPassword } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const session = getAuthUser(request);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: session.sub },
    include: { package: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: bookings });
}

function generateBookingNo(): string {
  return `EE-${crypto.randomInt(10000, 99999)}`;
}

/**
 * Public enquiry endpoint — no login required, matching the package-detail
 * "request this package" form. If the email doesn't match an existing
 * account, a lead account is created so the booking has an owner per the
 * schema; that account has an unusable random password until the guest
 * completes registration (or a password-reset flow, which isn't built yet)
 * to claim it.
 */
export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = rateLimit(`bookings:create:${ip}`, 20, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Missing or invalid booking fields" }, { status: 422 });
  }

  const { packageSlug, fullName, email, phone, travelers, travelDate, notes } = parsed.data;

  const pkg = await prisma.package.findUnique({ where: { slug: packageSlug } });
  if (!pkg) {
    return NextResponse.json({ error: "Unknown package" }, { status: 404 });
  }

  const parsedTravelDate = new Date(travelDate);
  if (Number.isNaN(parsedTravelDate.getTime())) {
    return NextResponse.json({ error: "Invalid travel date" }, { status: 422 });
  }
  const returnDate = new Date(parsedTravelDate);
  returnDate.setDate(returnDate.getDate() + pkg.duration);

  const session = getAuthUser(request);
  let userId = session?.sub;

  if (!userId) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      userId = existing.id;
    } else {
      const unusablePassword = await hashPassword(crypto.randomBytes(32).toString("hex"));
      const guest = await prisma.user.create({
        data: { name: fullName, email, phone, passwordHash: unusablePassword, status: "ACTIVE" },
      });
      userId = guest.id;
    }
  }

  const totalPrice = pkg.discount ? Math.round(pkg.price * (1 - pkg.discount / 100)) : pkg.price;

  const booking = await prisma.booking.create({
    data: {
      bookingNo: generateBookingNo(),
      userId,
      packageId: pkg.id,
      travelers,
      travelDate: parsedTravelDate,
      returnDate,
      totalPrice,
      notes,
      status: "INQUIRY",
      paymentStatus: "PENDING",
    },
  });

  return NextResponse.json({ data: { bookingNo: booking.bookingNo, status: booking.status } }, { status: 201 });
}
