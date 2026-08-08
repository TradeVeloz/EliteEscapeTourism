import { inferTypeFromText, matchPackage } from "@/lib/matcher";
import { packages } from "@/lib/data";

describe("inferTypeFromText", () => {
  it("detects honeymoon-related language", () => {
    expect(inferTypeFromText("We're looking for a romantic honeymoon trip")).toBe("HONEYMOON");
  });

  it("detects corporate-related language", () => {
    expect(inferTypeFromText("Planning a corporate offsite for our team")).toBe("CORPORATE");
  });

  it("returns undefined when nothing matches", () => {
    expect(inferTypeFromText("Just want somewhere nice")).toBeUndefined();
  });
});

describe("matchPackage", () => {
  it("returns a package of the requested type when one exists", () => {
    const match = matchPackage({ type: "FAMILY" });
    expect(match.type).toBe("FAMILY");
  });

  it("infers type from free-text notes when no explicit type is given", () => {
    const match = matchPackage({ notes: "We want a luxury getaway" });
    expect(match.type).toBe("LUXURY");
  });

  it("falls back to the highest-rated package across the whole catalogue when nothing matches", () => {
    const match = matchPackage({});
    const expected = packages.slice().sort((a, b) => b.rating - a.rating)[0];
    expect(match.slug).toBe(expected.slug);
  });
});
