import { NextResponse } from "next/server";
import { visaCountries } from "@/lib/data";

/**
 * Visa requirement reference data is editorial content (like the package
 * catalogue), not user data, so it stays on the same mock data module
 * rather than moving into Postgres.
 */
export function GET(_request: Request, { params }: { params: { country: string } }) {
  const query = decodeURIComponent(params.country).toLowerCase();
  const match = visaCountries.find((c) => c.country.toLowerCase() === query);

  if (!match) {
    return NextResponse.json({ error: "No requirements on file for that destination" }, { status: 404 });
  }

  return NextResponse.json({ data: match });
}
