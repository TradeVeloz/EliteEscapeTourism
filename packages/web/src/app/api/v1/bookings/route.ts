import { NextResponse } from "next/server";
import type { BookingFormValues } from "@/types";

function isValidBookingPayload(value: unknown): value is BookingFormValues {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.packageSlug === "string" &&
    v.packageSlug.length > 0 &&
    typeof v.fullName === "string" &&
    v.fullName.trim().length > 0 &&
    typeof v.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email) &&
    typeof v.phone === "string" &&
    v.phone.trim().length > 0 &&
    typeof v.travelers === "number" &&
    v.travelers > 0 &&
    typeof v.travelDate === "string" &&
    v.travelDate.length > 0
  );
}

/**
 * No database is provisioned yet — this accepts and validates an inquiry
 * and echoes back a booking reference. Wiring this to persistence and a
 * notification pipeline (email/CRM) is a follow-up once infra exists.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isValidBookingPayload(body)) {
    return NextResponse.json({ error: "Missing or invalid booking fields" }, { status: 422 });
  }

  const bookingNo = `EE-${Math.floor(10000 + Math.random() * 89999)}`;

  return NextResponse.json({ data: { bookingNo, status: "INQUIRY" } }, { status: 201 });
}
