import { packages } from "@/lib/data";
import { PackageCard } from "@/components/travel/PackageCard";

export default function SeasonalToursPage() {
  const seasonalPackages = packages.filter((p) => p.discount && p.discount > 0);

  return (
    <div>
      <section className="bg-gold-gradient py-20 text-navy">
        <div className="container-elite">
          <p className="eyebrow text-navy/70">Seasonal tours</p>
          <h1 className="mt-2 text-4xl font-bold">Limited-time escapes</h1>
          <p className="mt-4 max-w-2xl text-navy/80">
            Special pricing on a rotating selection of packages — availability and discounts change
            through the season.
          </p>
        </div>
      </section>

      <section className="container-elite py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {seasonalPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        {seasonalPackages.length === 0 && (
          <p className="text-center text-ink-muted">
            No seasonal offers are live right now — check back soon or browse all packages.
          </p>
        )}
      </section>
    </div>
  );
}
