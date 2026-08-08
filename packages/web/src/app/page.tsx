import Link from "next/link";
import { destinations, packages, testimonials } from "@/lib/data";
import { DestinationCard } from "@/components/travel/DestinationCard";
import { PackageCard } from "@/components/travel/PackageCard";
import { Badge } from "@/components/ui/Badge";

const PACKAGE_TYPES = [
  { type: "HONEYMOON", label: "Honeymoon", blurb: "Overwater villas, private dining, unforgettable firsts." },
  { type: "FAMILY", label: "Family", blurb: "Multi-generation itineraries, paced for every age." },
  { type: "CORPORATE", label: "Corporate", blurb: "Incentive travel and offsites, handled end-to-end." },
  { type: "LUXURY", label: "Luxury", blurb: "Five-star stays, private guides, zero compromises." },
] as const;

const TRUST_STATS = [
  { value: "50+", label: "Destinations" },
  { value: "4.9★", label: "Average rating" },
  { value: "100%", label: "Visa success rate" },
  { value: "24/7", label: "Concierge support" },
];

export default function HomePage() {
  const featuredDestinations = destinations.filter((d) => d.featured);
  const featuredPackages = packages.filter((p) => p.featured);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0 bg-gold-gradient opacity-[0.08]" />
        <div className="container-elite relative py-24 lg:py-32">
          <p className="eyebrow text-gold">Elite Escape Tourism</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Your Escape, Our Elite Services
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/70">
            AI-powered travel planning, human-touched service. Bespoke holidays, seamless visas, and
            curated attractions across the world — designed for the UAE&apos;s most discerning travelers.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/ai-travel-planner" className="btn-primary">
              Plan your escape with AI
            </Link>
            <Link href="/holidays" className="btn-ghost border-white/30 text-white hover:bg-white/10">
              Browse packages
            </Link>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-black/5 bg-white">
        <div className="container-elite grid grid-cols-2 gap-8 py-10 sm:grid-cols-4">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl font-bold text-navy">{stat.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-ink-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Destinations */}
      <section className="container-elite py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Destinations</p>
            <h2 className="mt-2 text-3xl font-bold">Curated escapes, hand-picked</h2>
          </div>
          <Link href="/holidays" className="btn-ghost">
            View all destinations
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredDestinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      </section>

      {/* Package types */}
      <section className="bg-navy/[0.03] py-20">
        <div className="container-elite">
          <p className="eyebrow">Holiday packages</p>
          <h2 className="mt-2 text-3xl font-bold">Every kind of escape</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PACKAGE_TYPES.map((item) => (
              <Link
                key={item.type}
                href={`/holidays?type=${item.type}`}
                className="card-elevated flex flex-col p-6 transition-transform hover:-translate-y-1"
              >
                <Badge variant="teal" className="w-fit">{item.label}</Badge>
                <p className="mt-4 flex-1 text-sm text-ink-muted">{item.blurb}</p>
                <span className="mt-4 text-sm font-semibold text-navy">Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured packages */}
      <section className="container-elite py-20">
        <p className="eyebrow">Signature packages</p>
        <h2 className="mt-2 text-3xl font-bold">This season&apos;s favourites</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </section>

      {/* Visa assistance */}
      <section className="bg-teal py-20 text-white">
        <div className="container-elite grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-white/80">Visa assistance</p>
            <h2 className="mt-2 text-3xl font-bold">Visas, handled — start to finish</h2>
            <p className="mt-4 text-white/80">
              From UAE resident visas to entry requirements for 50+ destinations, our specialists manage
              documentation, submission, and tracking so you don&apos;t have to.
            </p>
            <Link href="/visa" className="btn-primary mt-6 inline-flex">
              Check visa requirements
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["Documentation review", "Application submission", "Status tracking", "Fast-track options"].map(
              (item) => (
                <div key={item} className="rounded-xl bg-white/10 p-4 text-sm font-medium">
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* AI Travel Planner preview */}
      <section className="container-elite py-20">
        <div className="card-elevated grid gap-8 p-8 lg:grid-cols-2 lg:p-12">
          <div>
            <p className="eyebrow">AI travel planner</p>
            <h2 className="mt-2 text-3xl font-bold">Plan smarter, faster</h2>
            <p className="mt-4 text-ink-muted">
              Answer a few questions — or just speak — and our planner matches you to the right package
              from our curated catalogue in seconds. A human specialist refines every detail afterward.
            </p>
            <Link href="/ai-travel-planner" className="btn-primary mt-6 inline-flex">
              Try the AI planner
            </Link>
          </div>
          <div className="flex flex-col justify-center gap-3">
            {["Tell us your vibe, budget, and dates", "Get a matched package instantly", "A specialist tailors every detail"].map(
              (step, i) => (
                <div key={step} className="flex items-center gap-3 rounded-xl bg-navy/[0.04] p-4">
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-gold text-sm font-bold text-navy">
                    {i + 1}
                  </span>
                  <span className="text-sm">{step}</span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-navy py-20 text-white">
        <div className="container-elite">
          <p className="eyebrow text-gold">Testimonials</p>
          <h2 className="mt-2 text-3xl font-bold">Trusted by UAE travelers</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.id} className="rounded-2xl bg-white/5 p-6">
                <p className="text-sm text-white/80">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-4 text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-white/50">{t.location} · {t.trip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-elite py-20 text-center">
        <h2 className="text-3xl font-bold">Plan your escape today</h2>
        <p className="mx-auto mt-4 max-w-xl text-ink-muted">
          Speak to a travel specialist or start with our AI planner — either way, your itinerary is
          ready in days, not weeks.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/contact" className="btn-primary">Contact us</Link>
          <Link href="/ai-travel-planner" className="btn-secondary">Start planning</Link>
        </div>
      </section>
    </div>
  );
}
