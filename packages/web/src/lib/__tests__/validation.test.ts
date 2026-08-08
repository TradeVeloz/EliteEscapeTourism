import { bookingSchema, loginSchema, registerSchema, visaApplicationSchema } from "@/lib/validation";

describe("registerSchema", () => {
  const valid = { name: "Amina Al Suwaidi", email: "amina@example.com", password: "Str0ngPassword" };

  it("accepts a valid registration payload", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a password without an uppercase letter", () => {
    const result = registerSchema.safeParse({ ...valid, password: "weakpassword1" });
    expect(result.success).toBe(false);
  });

  it("rejects a password without a number", () => {
    const result = registerSchema.safeParse({ ...valid, password: "WeakPassword" });
    expect(result.success).toBe(false);
  });

  it("rejects a short password", () => {
    const result = registerSchema.safeParse({ ...valid, password: "Short1" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = registerSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("accepts email + password", () => {
    expect(loginSchema.safeParse({ email: "a@example.com", password: "anything" }).success).toBe(true);
  });

  it("rejects a missing password", () => {
    expect(loginSchema.safeParse({ email: "a@example.com" }).success).toBe(false);
  });
});

describe("bookingSchema", () => {
  const valid = {
    packageSlug: "maldives-overwater-honeymoon",
    fullName: "Fatima Al Suwaidi",
    email: "fatima@example.com",
    phone: "+971501234567",
    travelers: 2,
    travelDate: "2026-10-14",
  };

  it("accepts a valid booking payload", () => {
    expect(bookingSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects zero travelers", () => {
    expect(bookingSchema.safeParse({ ...valid, travelers: 0 }).success).toBe(false);
  });

  it("rejects a non-integer travelers count", () => {
    expect(bookingSchema.safeParse({ ...valid, travelers: 2.5 }).success).toBe(false);
  });
});

describe("visaApplicationSchema", () => {
  const valid = {
    destinationSlug: "japan",
    fullName: "Hassan Yousuf",
    email: "hassan@example.com",
    nationality: "Emirati",
    passportNo: "A1234567",
    passportExpiry: "2030-01-01",
    purpose: "Tourism",
  };

  it("accepts a valid application", () => {
    expect(visaApplicationSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a too-short passport number", () => {
    expect(visaApplicationSchema.safeParse({ ...valid, passportNo: "A1" }).success).toBe(false);
  });
});
