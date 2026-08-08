import { NextResponse } from "next/server";
import { z } from "zod";
import { AI_MODEL, getAnthropicClient } from "@/lib/ai";
import { matchPackage } from "@/lib/matcher";
import { packages } from "@/lib/data";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import type { PackageType } from "@/types";

const VALID_TYPES: PackageType[] = ["HONEYMOON", "FAMILY", "CORPORATE", "LUXURY", "CUSTOM"];

function asPackageType(value: string | undefined): PackageType | undefined {
  return VALID_TYPES.includes(value as PackageType) ? (value as PackageType) : undefined;
}

const requestSchema = z.object({
  type: z.string().optional(),
  budget: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

const CATALOGUE_SUMMARY = packages.map((p) => ({
  slug: p.slug,
  name: p.name,
  type: p.type,
  duration: p.duration,
  price: p.price,
  description: p.description,
}));

function fallback(criteria: { type?: string; notes?: string }) {
  const pkg = matchPackage({
    type: asPackageType(criteria.type),
    notes: criteria.notes,
  });
  return NextResponse.json({ data: { package: pkg, reasoning: null, source: "rules" } });
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = rateLimit(`ai:recommendations:${ip}`, 20, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 422 });
  }

  const client = getAnthropicClient();
  if (!client) {
    return fallback(parsed.data);
  }

  try {
    const response = await client.messages.create({
      model: AI_MODEL,
      max_tokens: 400,
      tools: [
        {
          name: "select_package",
          description: "Select the best-matching travel package for the traveler and explain why.",
          input_schema: {
            type: "object",
            properties: {
              packageSlug: { type: "string", enum: packages.map((p) => p.slug) },
              reasoning: { type: "string", description: "One or two sentences explaining the match." },
            },
            required: ["packageSlug", "reasoning"],
          },
        },
      ],
      tool_choice: { type: "tool", name: "select_package" },
      messages: [
        {
          role: "user",
          content: `You are a luxury travel concierge for Elite Escape Tourism. Given the traveler's
preferences below, pick the single best-matching package from this catalogue and explain why in
one or two sentences.

Catalogue: ${JSON.stringify(CATALOGUE_SUMMARY)}

Traveler preferences: ${JSON.stringify(parsed.data)}`,
        },
      ],
    });

    const toolUse = response.content.find((block) => block.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") {
      return fallback(parsed.data);
    }

    const input = toolUse.input as { packageSlug?: string; reasoning?: string };
    const matched = packages.find((p) => p.slug === input.packageSlug);
    if (!matched) {
      return fallback(parsed.data);
    }

    return NextResponse.json({
      data: { package: matched, reasoning: input.reasoning ?? null, source: "ai" },
    });
  } catch {
    return fallback(parsed.data);
  }
}
