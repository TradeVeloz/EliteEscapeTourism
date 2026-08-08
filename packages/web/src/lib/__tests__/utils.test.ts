import { cn, formatCurrency, formatDiscountedPrice, packageTypeLabel } from "@/lib/utils";

describe("cn", () => {
  it("joins truthy class names with a space", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("returns an empty string when nothing is truthy", () => {
    expect(cn(false, undefined, null)).toBe("");
  });
});

describe("formatCurrency", () => {
  it("formats a whole-number AED amount with no decimals", () => {
    expect(formatCurrency(18500)).toContain("18,500");
  });

  it("supports a different currency code", () => {
    expect(formatCurrency(100, "USD")).toContain("100");
  });
});

describe("formatDiscountedPrice", () => {
  it("returns the original price when there is no discount", () => {
    expect(formatDiscountedPrice(1000)).toBe(1000);
    expect(formatDiscountedPrice(1000, 0)).toBe(1000);
  });

  it("applies a percentage discount and rounds", () => {
    expect(formatDiscountedPrice(1000, 10)).toBe(900);
    expect(formatDiscountedPrice(999, 15)).toBe(849);
  });
});

describe("packageTypeLabel", () => {
  it("maps known enum values to display labels", () => {
    expect(packageTypeLabel("HONEYMOON")).toBe("Honeymoon");
    expect(packageTypeLabel("CORPORATE")).toBe("Corporate");
  });

  it("falls back to the raw value for unknown types", () => {
    expect(packageTypeLabel("SOMETHING_ELSE")).toBe("SOMETHING_ELSE");
  });
});
