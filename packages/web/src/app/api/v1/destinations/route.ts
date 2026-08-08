import { NextResponse } from "next/server";
import { destinations } from "@/lib/data";

export function GET() {
  return NextResponse.json({ data: destinations });
}
