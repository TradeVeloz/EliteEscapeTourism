import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { visaApplicationSchema } from "@/lib/validation";
import { getAuthUser } from "@/lib/session";
import { hashPassword } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = rateLimit(`visa:apply:${ip}`, 20, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = visaApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Missing or invalid application fields" }, { status: 422 });
  }

  const { destinationSlug, fullName, email, nationality, passportNo, passportExpiry, purpose } = parsed.data;

  const destination = await prisma.destination.findUnique({ where: { slug: destinationSlug } });
  if (!destination) {
    return NextResponse.json({ error: "Unknown destination" }, { status: 404 });
  }

  const parsedExpiry = new Date(passportExpiry);
  if (Number.isNaN(parsedExpiry.getTime())) {
    return NextResponse.json({ error: "Invalid passport expiry date" }, { status: 422 });
  }

  const session = getAuthUser(request);
  let userId = session?.sub;

  if (!userId) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      userId = existing.id;
    } else {
      const unusablePassword = await hashPassword(crypto.randomBytes(32).toString("hex"));
      const guest = await prisma.user.create({
        data: { name: fullName, email, passwordHash: unusablePassword, status: "ACTIVE" },
      });
      userId = guest.id;
    }
  }

  const application = await prisma.visaApplication.create({
    data: {
      userId,
      destinationId: destination.id,
      passportNo,
      passportExpiry: parsedExpiry,
      nationality,
      purpose,
      status: "PENDING",
      documents: [],
      submittedAt: new Date(),
    },
  });

  return NextResponse.json({ data: { id: application.id, status: application.status } }, { status: 201 });
}
