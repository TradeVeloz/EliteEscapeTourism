import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, hasRole } from "@/lib/session";

const STAFF_ROLES = ["ADMIN", "TRAVEL_AGENT"] as const;
const NON_CANCELLABLE = ["DEPARTED", "COMPLETED", "CANCELLED"];

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthUser(request);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const booking = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isOwner = booking.userId === session.sub;
  if (!isOwner && !hasRole(session, [...STAFF_ROLES])) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (NON_CANCELLABLE.includes(booking.status)) {
    return NextResponse.json({ error: `Booking cannot be cancelled while ${booking.status}` }, { status: 409 });
  }

  const updated = await prisma.booking.update({
    where: { id: params.id },
    data: { status: "CANCELLED" },
  });

  return NextResponse.json({ data: updated });
}
