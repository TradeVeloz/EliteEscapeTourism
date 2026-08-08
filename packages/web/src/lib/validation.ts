import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(20).optional(),
  password: z
    .string()
    .min(10)
    .max(128)
    .regex(/[a-z]/, "Password must include a lowercase letter")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[0-9]/, "Password must include a number"),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1).max(128),
});

export const mfaVerifySchema = z.object({
  userId: z.string().min(1),
  token: z.string().length(6),
});

export const bookingSchema = z.object({
  packageSlug: z.string().min(1),
  fullName: z.string().trim().min(2).max(150),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(20),
  travelers: z.number().int().min(1).max(50),
  travelDate: z.string().min(1),
  notes: z.string().max(2000).optional(),
});

export const visaApplicationSchema = z.object({
  destinationSlug: z.string().min(1),
  fullName: z.string().trim().min(2).max(150),
  email: z.string().trim().email().max(255),
  nationality: z.string().trim().min(2).max(100),
  passportNo: z.string().trim().min(4).max(30),
  passportExpiry: z.string().min(1),
  purpose: z.string().trim().min(2).max(200),
});

export const paymentInitiateSchema = z.object({
  bookingId: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type VisaApplicationInput = z.infer<typeof visaApplicationSchema>;
