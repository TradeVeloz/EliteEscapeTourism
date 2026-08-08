import { notFound } from "next/navigation";
import { packages, getPackageBySlug, getDestinationBySlug } from "@/lib/data";
import { ItineraryDisplay } from "@/components/travel/ItineraryDisplay";
import { BookingForm } from "@/components/travel/BookingForm";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDiscountedPrice, packageTypeLabel } from "@/lib/utils";

export function generateStaticParams() {
  return packages.map((pkg) => ({ slug: pkg.slug }));
}

export default function PackageDetailPage({ params }: { params: { slug: string } }) {
  const pkg = getPackageBySlug(params.slug);
  if (!pkg) notFound();

  const destination = getDestinationBySlug(pkg.destinationSlug);
  const finalPrice = formatDiscountedPrice(pkg.price, pkg.discount);

  return (
    <div>
      <section className={`bg-gradient-to-br ${pkg.image} py-20 text-white`}>
        <div className="container-elite">
          <Badge variant="gold">{packageTypeLabel(pkg.type)}</Badge>
          <h1 className="mt-4 text-4xl font-bold">{pkg.name}</h1>
          <p className="mt-2 text-white/80">
            {destination ? `${destination.name}, ${destination.country}` : ""} · {pkg.duration} days
          </p>
        </div>
      </section>

      <div className="container-elite grid gap-10 py-16 lg:grid-cols-[2fr_1fr]">
        <div>
          <p className="text-ink-muted">{pkg.description}</p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold text-navy">Inclusions</h2>
              <ul className="mt-3 space-y-2 text-sm text-ink-muted">
                {pkg.inclusions.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-teal">✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-navy">Exclusions</h2>
              <ul className="mt-3 space-y-2 text-sm text-ink-muted">
                {pkg.exclusions.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-ink-muted">–</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-lg font-semibold text-navy">Itinerary</h2>
            <div className="mt-4">
              <ItineraryDisplay itinerary={pkg.itinerary} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-elevated p-6">
            {pkg.discount ? (
              <p className="text-sm text-ink-muted line-through">{formatCurrency(pkg.price)}</p>
            ) : null}
            <p className="text-3xl font-bold text-navy">{formatCurrency(finalPrice)}</p>
            <p className="text-xs text-ink-muted">per couple, land package</p>
            <p className="mt-4 text-sm">★ {pkg.rating.toFixed(1)} ({pkg.reviews} reviews)</p>
          </div>
          <BookingForm packageSlug={pkg.slug} packageName={pkg.name} />
        </div>
      </div>
    </div>
  );
}
