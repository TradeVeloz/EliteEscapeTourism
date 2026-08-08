import Link from "next/link";
import { attractions, destinations } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default function AttractionsPage() {
  return (
    <div>
      <section className="bg-navy py-20 text-white">
        <div className="container-elite">
          <p className="eyebrow text-gold">Attractions</p>
          <h1 className="mt-2 text-4xl font-bold">Curated experiences, by destination</h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Hand-picked activities and excursions across our destination portfolio — bookable as
            add-ons to any package.
          </p>
        </div>
      </section>

      <section className="container-elite py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {attractions.map((attraction) => {
            const destination = destinations.find((d) => d.slug === attraction.destinationSlug);
            return (
              <Link
                key={attraction.id}
                href={`/attractions/${attraction.slug}`}
                className="card-elevated flex flex-col overflow-hidden transition-transform hover:-translate-y-1"
              >
                <div className={`h-40 bg-gradient-to-br ${attraction.image}`} />
                <div className="flex flex-1 flex-col p-5">
                  <p className="eyebrow">{destination?.name} · {attraction.category}</p>
                  <h3 className="mt-1 text-lg font-semibold">{attraction.name}</h3>
                  <p className="mt-2 flex-1 text-sm text-ink-muted">{attraction.description}</p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-ink-muted">{attraction.duration}</span>
                    <span className="font-semibold text-navy">From {formatCurrency(attraction.priceFrom)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
