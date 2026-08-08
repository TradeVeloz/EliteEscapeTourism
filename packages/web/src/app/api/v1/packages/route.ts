import { NextResponse } from "next/server";
import { packages } from "@/lib/data";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const destination = searchParams.get("destination");

  const filtered = packages.filter((pkg) => {
    const matchesType = !type || pkg.type === type;
    const matchesDestination = !destination || pkg.destinationSlug === destination;
    return matchesType && matchesDestination;
  });

  return NextResponse.json({ data: filtered });
}
