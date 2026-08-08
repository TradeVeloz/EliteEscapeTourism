"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { matchPackage } from "@/lib/matcher";
import { formatCurrency, packageTypeLabel } from "@/lib/utils";
import type { Package, PackageType } from "@/types";

interface Notes {
  type?: PackageType;
  budget?: "under-10k" | "10k-20k" | "20k-plus";
  travelers?: string;
  vibe?: string;
}

const STEPS: Array<{
  key: keyof Notes;
  question: string;
  options: { label: string; value: string }[];
}> = [
  {
    key: "type",
    question: "What kind of trip are you planning?",
    options: [
      { label: "Honeymoon", value: "HONEYMOON" },
      { label: "Family holiday", value: "FAMILY" },
      { label: "Corporate offsite", value: "CORPORATE" },
      { label: "Luxury getaway", value: "LUXURY" },
      { label: "Something custom", value: "CUSTOM" },
    ],
  },
  {
    key: "budget",
    question: "What's your approximate budget (AED, per couple/group)?",
    options: [
      { label: "Under 10,000", value: "under-10k" },
      { label: "10,000 – 20,000", value: "10k-20k" },
      { label: "20,000+", value: "20k-plus" },
    ],
  },
  {
    key: "vibe",
    question: "What's the vibe you're after?",
    options: [
      { label: "Relax & unwind", value: "relax" },
      { label: "Adventure & activity", value: "adventure" },
      { label: "Culture & cuisine", value: "culture" },
    ],
  },
];

/**
 * A first-party interview-style planner in the spirit of the "Ulisse"
 * agent pattern: a question carousel that builds a live notes panel, then
 * calls /api/v1/ai/recommendations to match against the package catalogue.
 * That endpoint uses the Anthropic API when ANTHROPIC_API_KEY is
 * configured, and otherwise (or on any request failure) falls back to a
 * deterministic rule-based matcher — the same one used here as a
 * client-side fallback if the request itself fails.
 */
export function UlisseChat() {
  const [step, setStep] = useState(0);
  const [notes, setNotes] = useState<Notes>({});
  const [done, setDone] = useState(false);
  const [recommendation, setRecommendation] = useState<Package | null>(null);
  const [reasoning, setReasoning] = useState<string | null>(null);
  const [source, setSource] = useState<"ai" | "rules" | null>(null);
  const [loading, setLoading] = useState(false);

  const currentStep = STEPS[step];

  function answer(value: string) {
    setNotes((prev) => ({ ...prev, [currentStep.key]: value }));
    if (step + 1 < STEPS.length) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  }

  useEffect(() => {
    if (!done) return;
    let cancelled = false;
    setLoading(true);

    fetch("/api/v1/ai/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: notes.type, notes: notes.vibe }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("request failed");
        return res.json();
      })
      .then((body) => {
        if (cancelled) return;
        setRecommendation(body.data.package);
        setReasoning(body.data.reasoning ?? null);
        setSource(body.data.source);
      })
      .catch(() => {
        if (cancelled) return;
        setRecommendation(matchPackage({ type: notes.type }));
        setReasoning(null);
        setSource("rules");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [done, notes]);

  function restart() {
    setStep(0);
    setNotes({});
    setRecommendation(null);
    setReasoning(null);
    setSource(null);
    setDone(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="card-elevated p-6">
        {!done ? (
          <div>
            <p className="eyebrow">Question {step + 1} of {STEPS.length}</p>
            <h3 className="mt-2 text-xl font-semibold text-navy">{currentStep.question}</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {currentStep.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => answer(option.value)}
                  className="rounded-xl border border-black/10 px-4 py-3 text-left text-sm font-medium text-ink transition-colors hover:border-gold hover:bg-gold/5"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ) : loading ? (
          <div className="flex items-center gap-3 text-sm text-ink-muted">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            Matching you to a package…
          </div>
        ) : recommendation ? (
          <div>
            <p className="eyebrow">
              Suggested package {source === "ai" && <span className="text-teal">· AI-assisted</span>}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-navy">{recommendation.name}</h3>
            <p className="mt-2 text-sm text-ink-muted">{recommendation.description}</p>
            {reasoning && (
              <p className="mt-3 rounded-lg bg-navy/[0.04] p-3 text-sm text-ink">{reasoning}</p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full bg-navy px-3 py-1 text-xs font-semibold text-white">
                {packageTypeLabel(recommendation.type)}
              </span>
              <span>{recommendation.duration} days</span>
              <span className="font-semibold text-navy">{formatCurrency(recommendation.price)}</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/holidays/${recommendation.slug}`} className="btn-primary">
                View full itinerary
              </Link>
              <button onClick={restart} className="btn-ghost">
                Start over
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="card-elevated p-6">
        <p className="eyebrow">Live notebook</p>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex justify-between border-b border-black/5 pb-2">
            <span className="text-ink-muted">Trip type</span>
            <span className="font-medium">{notes.type ? packageTypeLabel(notes.type) : "—"}</span>
          </li>
          <li className="flex justify-between border-b border-black/5 pb-2">
            <span className="text-ink-muted">Budget</span>
            <span className="font-medium">{notes.budget ?? "—"}</span>
          </li>
          <li className="flex justify-between pb-2">
            <span className="text-ink-muted">Vibe</span>
            <span className="font-medium">{notes.vibe ?? "—"}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
