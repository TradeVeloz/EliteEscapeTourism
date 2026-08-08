"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { packages } from "@/lib/data";
import { formatCurrency, packageTypeLabel } from "@/lib/utils";
import type { PackageType } from "@/types";

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
 * matches against the package catalogue. This is a rules-based matcher
 * against local data, not a live LLM call — there is no backend wired up
 * yet, so it doesn't claim to be one.
 */
export function UlisseChat() {
  const [step, setStep] = useState(0);
  const [notes, setNotes] = useState<Notes>({});
  const [done, setDone] = useState(false);

  const currentStep = STEPS[step];

  function answer(value: string) {
    setNotes((prev) => ({ ...prev, [currentStep.key]: value }));
    if (step + 1 < STEPS.length) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  }

  const recommendation = useMemo(() => {
    if (!done) return null;
    const byType = notes.type ? packages.filter((p) => p.type === notes.type) : packages;
    const pool = byType.length ? byType : packages;
    return pool.slice().sort((a, b) => b.rating - a.rating)[0];
  }, [done, notes]);

  function restart() {
    setStep(0);
    setNotes({});
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
        ) : recommendation ? (
          <div>
            <p className="eyebrow">Suggested package</p>
            <h3 className="mt-2 text-xl font-semibold text-navy">{recommendation.name}</h3>
            <p className="mt-2 text-sm text-ink-muted">{recommendation.description}</p>
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
