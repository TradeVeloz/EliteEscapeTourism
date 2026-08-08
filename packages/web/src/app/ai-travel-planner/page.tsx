"use client";

import { useState } from "react";
import { UlisseChat } from "@/components/ai/UlisseChat";
import { VoiceTravel } from "@/components/ai/VoiceTravel";
import { cn } from "@/lib/utils";

export default function AITravelPlannerPage() {
  const [mode, setMode] = useState<"chat" | "voice">("chat");

  return (
    <div>
      <section className="bg-navy py-20 text-white">
        <div className="container-elite">
          <p className="eyebrow text-gold">AI travel planner</p>
          <h1 className="mt-2 text-4xl font-bold">Plan your escape, your way</h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Answer a short set of questions or speak your brief naturally — we&apos;ll match you to a
            package instantly, then a human specialist refines every detail.
          </p>
        </div>
      </section>

      <section className="container-elite py-16">
        <div className="mb-8 flex gap-3">
          <button
            onClick={() => setMode("chat")}
            className={cn("btn-ghost", mode === "chat" && "bg-navy text-white")}
          >
            Question carousel
          </button>
          <button
            onClick={() => setMode("voice")}
            className={cn("btn-ghost", mode === "voice" && "bg-navy text-white")}
          >
            Voice input
          </button>
        </div>

        {mode === "chat" ? <UlisseChat /> : <VoiceTravel />}

        <p className="mt-8 text-xs text-ink-muted">
          This planner matches you to packages from our current catalogue. When an AI model is
          configured on the server it reasons over the catalogue directly; otherwise a deterministic
          rule-based matcher takes over automatically — the planner always stays functional either way.
          Live third-party booking data (e.g. Booking.com, Google Maps) is not wired in.
        </p>
      </section>
    </div>
  );
}
