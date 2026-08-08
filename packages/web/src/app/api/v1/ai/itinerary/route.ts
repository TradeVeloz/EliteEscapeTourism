import { NextResponse } from "next/server";
import { z } from "zod";
import { AI_MODEL, getAnthropicClient } from "@/lib/ai";
import { getPackageBySlug } from "@/lib/data";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const requestSchema = z.object({
  packageSlug: z.string().min(1),
  preferences: z.string().max(1000).optional(),
});

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = rateLimit(`ai:itinerary:${ip}`, 20, 60_000);
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

  const pkg = getPackageBySlug(parsed.data.packageSlug);
  if (!pkg) {
    return NextResponse.json({ error: "Unknown package" }, { status: 404 });
  }

  const client = getAnthropicClient();
  if (!client || !parsed.data.preferences) {
    return NextResponse.json({ data: { itinerary: pkg.itinerary, source: "catalogue" } });
  }

  try {
    const response = await client.messages.create({
      model: AI_MODEL,
      max_tokens: 800,
      tools: [
        {
          name: "propose_itinerary",
          description: "Propose a day-by-day itinerary tailored to the traveler's stated preferences.",
          input_schema: {
            type: "object",
            properties: {
              days: {
                type: "array",
                items: { type: "string" },
                description: "One entry per day, same length as the base itinerary.",
              },
            },
            required: ["days"],
          },
        },
      ],
      tool_choice: { type: "tool", name: "propose_itinerary" },
      messages: [
        {
          role: "user",
          content: `You are a luxury travel concierge for Elite Escape Tourism. Adapt this base
${pkg.duration}-day itinerary for "${pkg.name}" to the traveler's stated preferences, keeping the
same number of days and the same general structure, but adjusting emphasis and activities.

Base itinerary: ${JSON.stringify(pkg.itinerary)}

Traveler preferences: ${parsed.data.preferences}`,
        },
      ],
    });

    const toolUse = response.content.find((block) => block.type === "tool_use");
    const input = toolUse && toolUse.type === "tool_use" ? (toolUse.input as { days?: string[] }) : null;

    if (!input?.days?.length) {
      return NextResponse.json({ data: { itinerary: pkg.itinerary, source: "catalogue" } });
    }

    return NextResponse.json({ data: { itinerary: input.days, source: "ai" } });
  } catch {
    return NextResponse.json({ data: { itinerary: pkg.itinerary, source: "catalogue" } });
  }
}
