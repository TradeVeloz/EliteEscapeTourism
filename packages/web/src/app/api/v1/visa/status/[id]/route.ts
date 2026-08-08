import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, hasRole } from "@/lib/session";

const STAFF_ROLES = ["ADMIN", "TRAVEL_AGENT"] as const;

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthUser(request);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const application = await prisma.visaApplication.findUnique({
    where: { id: params.id },
    include: { destination: { select: { name: true, country: true, slug: true } } },
  });

  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isOwner = application.userId === session.sub;
  if (!isOwner && !hasRole(session, [...STAFF_ROLES])) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data: application });
}
