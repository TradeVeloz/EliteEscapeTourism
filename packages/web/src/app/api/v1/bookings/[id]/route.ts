import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthUser, hasRole } from "@/lib/session";

const STAFF_ROLES = ["ADMIN", "TRAVEL_AGENT"] as const;

const updateSchema = z.object({
  status: z.enum(["INQUIRY", "PLANNING", "CONFIRMED", "DEPARTED", "COMPLETED", "CANCELLED"]).optional(),
  notes: z.string().max(2000).optional(),
  travelDate: z.string().optional(),
});

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthUser(request);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { package: { select: { name: true, slug: true } } },
  });

  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isOwner = booking.userId === session.sub;
  if (!isOwner && !hasRole(session, [...STAFF_ROLES])) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data: booking });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthUser(request);
  if (!hasRole(session, [...STAFF_ROLES])) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update fields" }, { status: 422 });
  }

  const existing = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const booking = await prisma.booking.update({
    where: { id: params.id },
    data: {
      status: parsed.data.status,
      notes: parsed.data.notes,
      travelDate: parsed.data.travelDate ? new Date(parsed.data.travelDate) : undefined,
    },
  });

  return NextResponse.json({ data: booking });
}
