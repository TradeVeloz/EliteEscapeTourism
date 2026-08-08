import { packages } from "@/lib/data";
import type { Package, PackageType } from "@/types";

export interface MatchCriteria {
  type?: PackageType;
  notes?: string;
}

const KEYWORD_TYPE_HINTS: Record<PackageType, string[]> = {
  HONEYMOON: ["honeymoon", "romantic", "couple", "wedding"],
  FAMILY: ["family", "kids", "children"],
  CORPORATE: ["corporate", "offsite", "team", "business", "incentive"],
  LUXURY: ["luxury", "five-star", "5-star", "premium", "indulg"],
  CUSTOM: ["custom", "bespoke", "tailor"],
};

export function inferTypeFromText(text: string): PackageType | undefined {
  const lower = text.toLowerCase();
  for (const [type, keywords] of Object.entries(KEYWORD_TYPE_HINTS) as [PackageType, string[]][]) {
    if (keywords.some((keyword) => lower.includes(keyword))) return type;
  }
  return undefined;
}

/**
 * Deterministic fallback used whenever no Anthropic API key is configured
 * (or a live call fails) — never leaves the AI planner non-functional.
 */
export function matchPackage(criteria: MatchCriteria): Package {
  const inferredType = criteria.type ?? (criteria.notes ? inferTypeFromText(criteria.notes) : undefined);
  const pool = inferredType ? packages.filter((p) => p.type === inferredType) : packages;
  const candidates = pool.length ? pool : packages;
  return candidates.slice().sort((a, b) => b.rating - a.rating)[0];
}
