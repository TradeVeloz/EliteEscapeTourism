import { notFound } from "next/navigation";
import Link from "next/link";
import { attractions, getAttractionBySlug, getDestinationBySlug, getPackagesByDestination } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export function generateStaticParams() {
  return attractions.map((a) => ({ slug: a.slug }));
}

export default function AttractionDetailPage({ params }: { params: { slug: string } }) {
  const attraction = getAttractionBySlug(params.slug);
  if (!attraction) notFound();

  const destination = getDestinationBySlug(attraction.destinationSlug);
  const relatedPackages = getPackagesByDestination(attraction.destinationSlug);

  return (
    <div>
      <section className={`bg-gradient-to-br ${attraction.image} py-20 text-white`}>
        <div className="container-elite">
          <p className="eyebrow text-white/80">{destination?.name} · {attraction.category}</p>
          <h1 className="mt-2 text-4xl font-bold">{attraction.name}</h1>
        </div>
      </section>

      <div className="container-elite grid gap-10 py-16 lg:grid-cols-[2fr_1fr]">
        <div>
          <p className="text-ink-muted">{attraction.description}</p>
          <div className="mt-6 flex gap-8 text-sm">
            <div>
              <p className="text-ink-muted">Duration</p>
              <p className="font-semibold text-navy">{attraction.duration}</p>
            </div>
            <div>
              <p className="text-ink-muted">From</p>
              <p className="font-semibold text-navy">{formatCurrency(attraction.priceFrom)} / person</p>
            </div>
          </div>

          {relatedPackages.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg font-semibold text-navy">Included in these packages</h2>
              <ul className="mt-4 space-y-2">
                {relatedPackages.map((pkg) => (
                  <li key={pkg.id}>
                    <Link href={`/holidays/${pkg.slug}`} className="text-sm font-medium text-teal hover:underline">
                      {pkg.name} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="card-elevated p-6">
          <p className="text-sm font-semibold text-navy">Want this as an add-on?</p>
          <p className="mt-2 text-sm text-ink-muted">
            Contact us to add this experience to any existing or new booking.
          </p>
          <Link href="/contact" className="btn-primary mt-4 inline-flex w-full justify-center">
            Contact a specialist
          </Link>
        </div>
      </div>
    </div>
  );
}
