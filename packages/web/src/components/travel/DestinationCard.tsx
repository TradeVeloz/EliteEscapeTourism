import Link from "next/link";
import type { Destination } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link href={`/holidays?destination=${destination.slug}`}>
      <Card className="group h-full transition-transform hover:-translate-y-1">
        <div className={`relative h-48 bg-gradient-to-br ${destination.image}`}>
          <div className="absolute inset-0 bg-black/10" />
          {destination.featured && (
            <Badge variant="gold" className="absolute left-4 top-4">
              Featured
            </Badge>
          )}
          <div className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy">
            ★ {destination.rating.toFixed(1)} ({destination.reviews})
          </div>
        </div>
        <div className="p-5">
          <p className="eyebrow">{destination.region}</p>
          <h3 className="mt-1 text-lg font-semibold">{destination.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{destination.description}</p>
          <div className="mt-4 flex items-center justify-between text-xs text-ink-muted">
            <span>Best time: {destination.bestTime}</span>
            <span>{destination.visaRequired ? "Visa required" : "Visa-free / on arrival"}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
