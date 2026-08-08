"use client";

import { useMemo, useState } from "react";
import { packages, destinations } from "@/lib/data";
import { PackageCard } from "@/components/travel/PackageCard";
import { packageTypeLabel } from "@/lib/utils";
import type { PackageType } from "@/types";

const TYPES: PackageType[] = ["HONEYMOON", "FAMILY", "CORPORATE", "LUXURY", "CUSTOM"];

export default function HolidaysPage() {
  const [typeFilter, setTypeFilter] = useState<PackageType | "ALL">("ALL");
  const [destinationFilter, setDestinationFilter] = useState<string>("ALL");

  const filtered = useMemo(() => {
    return packages.filter((pkg) => {
      const matchesType = typeFilter === "ALL" || pkg.type === typeFilter;
      const matchesDestination = destinationFilter === "ALL" || pkg.destinationSlug === destinationFilter;
      return matchesType && matchesDestination;
    });
  }, [typeFilter, destinationFilter]);

  return (
    <div className="container-elite py-16">
      <p className="eyebrow">Holiday packages</p>
      <h1 className="mt-2 text-4xl font-bold">Bespoke journeys, ready to book</h1>
      <p className="mt-4 max-w-2xl text-ink-muted">
        Filter by trip type or destination to find the right starting point — every package is fully
        customizable by our travel specialists.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={() => setTypeFilter("ALL")}
          className={`btn-ghost ${typeFilter === "ALL" ? "bg-navy text-white" : ""}`}
        >
          All types
        </button>
        {TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`btn-ghost ${typeFilter === type ? "bg-navy text-white" : ""}`}
          >
            {packageTypeLabel(type)}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <select
          value={destinationFilter}
          onChange={(e) => setDestinationFilter(e.target.value)}
          className="rounded-lg border border-black/10 px-3 py-2 text-sm"
        >
          <option value="ALL">All destinations</option>
          {destinations.map((d) => (
            <option key={d.slug} value={d.slug}>{d.name}</option>
          ))}
        </select>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-ink-muted">
          No packages match those filters yet — contact us for a fully custom itinerary.
        </p>
      )}
    </div>
  );
}
