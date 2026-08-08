import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, hasRole } from "@/lib/session";

const STAFF_ROLES = ["ADMIN", "TRAVEL_AGENT"] as const;

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthUser(request);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const payment = await prisma.payment.findUnique({
    where: { id: params.id },
    include: { booking: { select: { userId: true, bookingNo: true } } },
  });

  if (!payment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isOwner = payment.booking.userId === session.sub;
  if (!isOwner && !hasRole(session, [...STAFF_ROLES])) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data: payment });
}
