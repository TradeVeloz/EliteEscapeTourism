export type PackageType = "HONEYMOON" | "FAMILY" | "CORPORATE" | "LUXURY" | "CUSTOM";

export type BookingStatus =
  | "INQUIRY"
  | "PLANNING"
  | "CONFIRMED"
  | "DEPARTED"
  | "COMPLETED"
  | "CANCELLED";

export type VisaStatus = "PENDING" | "DOCUMENTS" | "SUBMITTED" | "APPROVED" | "REJECTED";

export interface Destination {
  id: string;
  name: string;
  slug: string;
  region: string;
  country: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  bestTime: string;
  currency: string;
  language: string;
  visaRequired: boolean;
  popular: boolean;
  featured: boolean;
}

export interface Package {
  id: string;
  name: string;
  slug: string;
  destinationSlug: string;
  type: PackageType;
  duration: number;
  price: number;
  discount?: number;
  description: string;
  itinerary: string[];
  inclusions: string[];
  exclusions: string[];
  image: string;
  rating: number;
  reviews: number;
  featured: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  trip: string;
}

export interface Attraction {
  id: string;
  name: string;
  slug: string;
  destinationSlug: string;
  category: string;
  description: string;
  image: string;
  duration: string;
  priceFrom: number;
}

export interface VisaCountry {
  country: string;
  processingTime: string;
  visaOnArrival: boolean;
  notes: string;
}

export interface BookingFormValues {
  packageSlug: string;
  fullName: string;
  email: string;
  phone: string;
  travelers: number;
  travelDate: string;
  notes?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  details: string[];
}
