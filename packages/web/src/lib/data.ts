import type { Attraction, Destination, Package, Testimonial, VisaCountry } from "@/types";

/**
 * First-pass content lives here as mock data so every page renders real,
 * on-brand content without a provisioned database. Shapes mirror the
 * Prisma schema (see packages/web/prisma/schema.prisma) so swapping this
 * module for real queries is a drop-in change.
 *
 * `image` holds a Tailwind gradient pair instead of a binary asset — no
 * photography has been supplied yet, and a broken <img> reads worse than an
 * intentional gradient treatment.
 */

export const destinations: Destination[] = [
  {
    id: "dst-maldives",
    name: "Maldives",
    slug: "maldives",
    region: "Indian Ocean",
    country: "Maldives",
    description:
      "Overwater villas, private lagoons, and coral reefs — the archetypal honeymoon escape, an hour by seaplane from Male.",
    image: "from-teal to-navy",
    rating: 4.9,
    reviews: 214,
    bestTime: "Nov – Apr",
    currency: "MVR / USD",
    language: "Dhivehi, English",
    visaRequired: false,
    popular: true,
    featured: true,
  },
  {
    id: "dst-santorini",
    name: "Santorini",
    slug: "santorini",
    region: "Aegean Sea",
    country: "Greece",
    description:
      "Whitewashed cliffside villages and caldera sunsets. A favourite for honeymooners and anniversary trips alike.",
    image: "from-navy-light to-navy",
    rating: 4.8,
    reviews: 176,
    bestTime: "May – Oct",
    currency: "EUR",
    language: "Greek, English",
    visaRequired: true,
    popular: true,
    featured: true,
  },
  {
    id: "dst-swiss-alps",
    name: "Swiss Alps",
    slug: "swiss-alps",
    region: "Central Europe",
    country: "Switzerland",
    description:
      "Alpine railways, lakeside chalets, and Michelin dining — a luxury four-season playground for families and couples.",
    image: "from-gold to-gold-dark",
    rating: 4.9,
    reviews: 132,
    bestTime: "Dec – Mar, Jun – Sep",
    currency: "CHF",
    language: "German, French, English",
    visaRequired: true,
    popular: true,
    featured: true,
  },
  {
    id: "dst-bali",
    name: "Bali",
    slug: "bali",
    region: "Southeast Asia",
    country: "Indonesia",
    description:
      "Rice-terrace villas, beach clubs, and wellness retreats — flexible for family trips or a corporate offsite.",
    image: "from-teal-light to-teal-dark",
    rating: 4.7,
    reviews: 289,
    bestTime: "Apr – Oct",
    currency: "IDR",
    language: "Indonesian, English",
    visaRequired: false,
    popular: true,
    featured: false,
  },
  {
    id: "dst-tokyo",
    name: "Tokyo",
    slug: "tokyo",
    region: "East Asia",
    country: "Japan",
    description:
      "Precision, culture, and cuisine. A city break that reads equally well as corporate incentive travel or a family adventure.",
    image: "from-navy to-teal-dark",
    rating: 4.9,
    reviews: 158,
    bestTime: "Mar – May, Sep – Nov",
    currency: "JPY",
    language: "Japanese, English",
    visaRequired: true,
    popular: false,
    featured: true,
  },
  {
    id: "dst-seychelles",
    name: "Seychelles",
    slug: "seychelles",
    region: "Indian Ocean",
    country: "Seychelles",
    description:
      "Granite boulders, private-island resorts, and untouched beaches — quieter and more secluded than the Maldives.",
    image: "from-gold-light to-teal",
    rating: 4.8,
    reviews: 97,
    bestTime: "Apr – May, Oct – Nov",
    currency: "SCR",
    language: "Creole, English, French",
    visaRequired: false,
    popular: false,
    featured: false,
  },
];

export const packages: Package[] = [
  {
    id: "pkg-maldives-honeymoon",
    name: "Maldives Overwater Honeymoon",
    slug: "maldives-overwater-honeymoon",
    destinationSlug: "maldives",
    type: "HONEYMOON",
    duration: 6,
    price: 18500,
    discount: 10,
    description:
      "Six nights in a private overwater villa with sunset cruises, a couple's spa ritual, and a private-island picnic.",
    itinerary: [
      "Arrival by seaplane, welcome ritual, villa check-in",
      "Private snorkelling excursion over the house reef",
      "Couple's spa day — 90-minute overwater treatment",
      "Sunset dolphin cruise and private beach dinner",
      "Free day — water sports or in-villa relaxation",
      "Departure with breakfast on the deck",
    ],
    inclusions: ["Seaplane transfers", "All meals", "Daily excursion", "Couple's spa treatment"],
    exclusions: ["International flights", "Travel insurance", "Alcoholic beverages"],
    image: "from-teal to-navy",
    rating: 5.0,
    reviews: 42,
    featured: true,
  },
  {
    id: "pkg-swiss-family",
    name: "Swiss Alps Family Adventure",
    slug: "swiss-alps-family-adventure",
    destinationSlug: "swiss-alps",
    type: "FAMILY",
    duration: 8,
    price: 24900,
    description:
      "Eight days across Lucerne, Interlaken, and Zermatt with cable cars, lake cruises, and a kid-friendly chocolate workshop.",
    itinerary: [
      "Arrival in Zurich, transfer to Lucerne",
      "Mount Pilatus cable car and lake cruise",
      "Transfer to Interlaken via scenic rail",
      "Jungfraujoch — Top of Europe excursion",
      "Chocolate-making workshop for the family",
      "Transfer to Zermatt, Gornergrat railway",
      "Free day in Zermatt village",
      "Departure via Geneva",
    ],
    inclusions: ["First-class rail passes", "4-star hotels", "Daily breakfast", "Guided excursions"],
    exclusions: ["International flights", "Lunch and dinner", "Travel insurance"],
    image: "from-gold to-gold-dark",
    rating: 4.9,
    reviews: 31,
    featured: true,
  },
  {
    id: "pkg-bali-corporate",
    name: "Bali Corporate Offsite",
    slug: "bali-corporate-offsite",
    destinationSlug: "bali",
    type: "CORPORATE",
    duration: 4,
    price: 9800,
    description:
      "A four-day incentive package with a dedicated event venue, team-building excursions, and a closing gala dinner.",
    itinerary: [
      "Arrival, welcome reception at beach club",
      "Full-day offsite at private villa venue",
      "Team-building: outrigger canoe race and rice-terrace trek",
      "Closing gala dinner and departure",
    ],
    inclusions: ["Venue hire", "AV equipment", "Team-building facilitator", "Gala dinner"],
    exclusions: ["International flights", "Personal expenses"],
    image: "from-teal-light to-teal-dark",
    rating: 4.8,
    reviews: 19,
    featured: false,
  },
  {
    id: "pkg-santorini-luxury",
    name: "Santorini Caldera Escape",
    slug: "santorini-caldera-escape",
    destinationSlug: "santorini",
    type: "LUXURY",
    duration: 5,
    price: 15200,
    discount: 15,
    description:
      "Five nights in a caldera-view suite with a private catamaran cruise and a wine-tasting tour of Oia's vineyards.",
    itinerary: [
      "Arrival, caldera-suite check-in",
      "Private catamaran cruise with onboard BBQ",
      "Oia vineyard wine-tasting tour",
      "Free day — Fira exploration or spa",
      "Sunset dinner in Oia, departure next morning",
    ],
    inclusions: ["Airport transfers", "Daily breakfast", "Catamaran cruise", "Wine tour"],
    exclusions: ["International flights", "Lunch and dinner (except noted)", "Travel insurance"],
    image: "from-navy-light to-navy",
    rating: 4.9,
    reviews: 27,
    featured: true,
  },
  {
    id: "pkg-tokyo-custom",
    name: "Tokyo & Kyoto Signature Journey",
    slug: "tokyo-kyoto-signature-journey",
    destinationSlug: "tokyo",
    type: "CUSTOM",
    duration: 9,
    price: 21300,
    description:
      "A fully bespoke nine-day route through Tokyo, Hakone, and Kyoto, tailored to your pace and interests.",
    itinerary: [
      "Arrival in Tokyo, private city orientation",
      "Tsukiji Outer Market and teamLab digital art museum",
      "Day trip to Hakone — hot springs and Mount Fuji views",
      "Bullet train to Kyoto",
      "Fushimi Inari and Arashiyama bamboo grove",
      "Private tea ceremony",
      "Nara day trip",
      "Free day for tailoring to guest interests",
      "Departure from Osaka",
    ],
    inclusions: ["Bullet train tickets", "Private guide", "4/5-star hotels", "Select meals"],
    exclusions: ["International flights", "Most lunches and dinners"],
    image: "from-navy to-teal-dark",
    rating: 5.0,
    reviews: 14,
    featured: false,
  },
];

export const attractions: Attraction[] = [
  {
    id: "atn-maldives-reef",
    name: "House Reef Snorkelling",
    slug: "maldives-house-reef-snorkelling",
    destinationSlug: "maldives",
    category: "Marine",
    description: "Guided snorkelling over a private house reef teeming with reef sharks and rays.",
    image: "from-teal to-navy",
    duration: "2 hours",
    priceFrom: 350,
  },
  {
    id: "atn-santorini-catamaran",
    name: "Caldera Catamaran Cruise",
    slug: "santorini-caldera-catamaran-cruise",
    destinationSlug: "santorini",
    category: "Sailing",
    description: "Sunset sailing around the caldera with an onboard BBQ and swim stops.",
    image: "from-navy-light to-navy",
    duration: "5 hours",
    priceFrom: 480,
  },
  {
    id: "atn-swiss-jungfrau",
    name: "Jungfraujoch — Top of Europe",
    slug: "swiss-jungfraujoch-top-of-europe",
    destinationSlug: "swiss-alps",
    category: "Rail & Alpine",
    description: "Cogwheel railway to Europe's highest railway station, with glacier views.",
    image: "from-gold to-gold-dark",
    duration: "Full day",
    priceFrom: 620,
  },
  {
    id: "atn-bali-terrace",
    name: "Tegallalang Rice Terrace Trek",
    slug: "bali-tegallalang-rice-terrace-trek",
    destinationSlug: "bali",
    category: "Nature",
    description: "Guided trek through the iconic tiered rice terraces with a local farmer.",
    image: "from-teal-light to-teal-dark",
    duration: "3 hours",
    priceFrom: 180,
  },
  {
    id: "atn-tokyo-teamlab",
    name: "teamLab Digital Art Museum",
    slug: "tokyo-teamlab-digital-art-museum",
    destinationSlug: "tokyo",
    category: "Culture",
    description: "Immersive digital-art installations spanning an entire museum floor.",
    image: "from-navy to-teal-dark",
    duration: "3 hours",
    priceFrom: 210,
  },
  {
    id: "atn-seychelles-boulders",
    name: "Anse Source d'Argent",
    slug: "seychelles-anse-source-dargent",
    destinationSlug: "seychelles",
    category: "Beach",
    description: "Guided visit to one of the world's most photographed granite-boulder beaches.",
    image: "from-gold-light to-teal",
    duration: "Half day",
    priceFrom: 260,
  },
];

export function getAttractionsByDestination(slug: string) {
  return attractions.filter((a) => a.destinationSlug === slug);
}

export function getAttractionBySlug(slug: string) {
  return attractions.find((a) => a.slug === slug);
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Fatima & Omar",
    location: "Dubai, UAE",
    quote:
      "Elite Escape handled everything — the villa upgrade in the Maldives, the visa for our stopover, even a last-minute flight change. Genuinely white-glove.",
    rating: 5,
    trip: "Maldives Overwater Honeymoon",
  },
  {
    id: "t2",
    name: "The Al Mazrouei Family",
    location: "Abu Dhabi, UAE",
    quote:
      "Our kids still talk about the Swiss chocolate workshop. Every transfer was on time and the itinerary was paced perfectly for a family with young children.",
    rating: 5,
    trip: "Swiss Alps Family Adventure",
  },
  {
    id: "t3",
    name: "Rashid K.",
    location: "Sharjah, UAE",
    quote:
      "We ran our leadership offsite through them in Bali — venue, AV, team-building, all sorted without us lifting a finger.",
    rating: 4.8,
    trip: "Bali Corporate Offsite",
  },
];

export const visaCountries: VisaCountry[] = [
  { country: "United Kingdom", processingTime: "10–15 working days", visaOnArrival: false, notes: "Standard visitor visa required for UAE residents." },
  { country: "Schengen Area", processingTime: "10–15 working days", visaOnArrival: false, notes: "Single-entry or multiple-entry Schengen visa; apply via destination country." },
  { country: "Maldives", processingTime: "On arrival", visaOnArrival: true, notes: "Free 30-day visa on arrival for UAE passport and resident-visa holders." },
  { country: "Indonesia (Bali)", processingTime: "On arrival", visaOnArrival: true, notes: "Visa on arrival available, 30 days, extendable once." },
  { country: "Japan", processingTime: "5–7 working days", visaOnArrival: false, notes: "Tourist visa required; Elite Escape assists with document prep." },
  { country: "Seychelles", processingTime: "On arrival", visaOnArrival: true, notes: "Free visitor's permit issued on arrival, valid up to 3 months." },
];

export function getDestinationBySlug(slug: string) {
  return destinations.find((d) => d.slug === slug);
}

export function getPackageBySlug(slug: string) {
  return packages.find((p) => p.slug === slug);
}

export function getPackagesByDestination(slug: string) {
  return packages.filter((p) => p.destinationSlug === slug);
}

export function getPackagesByType(type: Package["type"]) {
  return packages.filter((p) => p.type === type);
}
