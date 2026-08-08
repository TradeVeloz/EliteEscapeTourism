import { PrismaClient } from "@prisma/client";
import { destinations, packages } from "../src/lib/data";

const prisma = new PrismaClient();

async function main() {
  for (const destination of destinations) {
    await prisma.destination.upsert({
      where: { slug: destination.slug },
      update: {
        name: destination.name,
        region: destination.region,
        country: destination.country,
        description: destination.description,
        image: destination.image,
        rating: destination.rating,
        reviews: destination.reviews,
        bestTime: destination.bestTime,
        currency: destination.currency,
        language: destination.language,
        visaRequired: destination.visaRequired,
        popular: destination.popular,
        featured: destination.featured,
      },
      create: {
        slug: destination.slug,
        name: destination.name,
        region: destination.region,
        country: destination.country,
        description: destination.description,
        image: destination.image,
        gallery: [],
        rating: destination.rating,
        reviews: destination.reviews,
        bestTime: destination.bestTime,
        currency: destination.currency,
        language: destination.language,
        visaRequired: destination.visaRequired,
        popular: destination.popular,
        featured: destination.featured,
      },
    });
  }

  for (const pkg of packages) {
    const destination = await prisma.destination.findUnique({
      where: { slug: pkg.destinationSlug },
    });
    if (!destination) {
      throw new Error(`Seed error: no destination found for package ${pkg.slug}`);
    }

    await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: {
        name: pkg.name,
        destinationId: destination.id,
        type: pkg.type,
        duration: pkg.duration,
        price: pkg.price,
        discount: pkg.discount ?? 0,
        description: pkg.description,
        itinerary: pkg.itinerary,
        inclusions: pkg.inclusions,
        exclusions: pkg.exclusions,
        images: [],
        rating: pkg.rating,
        reviews: pkg.reviews,
        featured: pkg.featured,
      },
      create: {
        slug: pkg.slug,
        name: pkg.name,
        destinationId: destination.id,
        type: pkg.type,
        duration: pkg.duration,
        price: pkg.price,
        discount: pkg.discount ?? 0,
        description: pkg.description,
        itinerary: pkg.itinerary,
        inclusions: pkg.inclusions,
        exclusions: pkg.exclusions,
        images: [],
        rating: pkg.rating,
        reviews: pkg.reviews,
        featured: pkg.featured,
      },
    });
  }

  console.log(`Seeded ${destinations.length} destinations and ${packages.length} packages.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
