import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

/**
 * Lazily constructed so importing this module doesn't throw when
 * ANTHROPIC_API_KEY isn't set. Every caller must handle the null case by
 * falling back to the rule-based matcher in lib/matcher.ts — this app
 * never claims to be AI-generated content it didn't actually generate.
 */
export function getAnthropicClient(): Anthropic | null {
  if (client) return client;
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  client = new Anthropic({ apiKey: key });
  return client;
}

export const AI_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5";
