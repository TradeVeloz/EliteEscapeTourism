"use client";

import { useRef, useState } from "react";

/**
 * Voice-first input using the browser's native SpeechRecognition API —
 * no third-party speech service wired in. Falls back to a text field on
 * browsers without support (notably Firefox, and Safari without the flag).
 */
export function VoiceTravel() {
  const [supported] = useState(
    () => typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
  );
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [sent, setSent] = useState(false);
  const recognitionRef = useRef<any>(null);

  function toggleListening() {
    if (!supported) return;

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const text = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join(" ");
      setTranscript(text);
    };

    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  return (
    <div className="card-elevated p-6">
      <p className="eyebrow">Voice trip brief</p>
      <h3 className="mt-2 text-xl font-semibold text-navy">
        Tell us about your dream trip — just speak naturally
      </h3>
      <p className="mt-2 text-sm text-ink-muted">
        e.g. &ldquo;A relaxed 5-day honeymoon somewhere with beaches, mid-October, budget around 15,000
        dirhams.&rdquo;
      </p>

      <div className="mt-6 flex flex-col items-center gap-4">
        {supported ? (
          <button
            onClick={toggleListening}
            className={`flex h-20 w-20 items-center justify-center rounded-full transition-colors ${
              listening ? "bg-teal text-white" : "bg-gold text-navy"
            }`}
            aria-pressed={listening}
          >
            <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current" aria-hidden="true">
              <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-2.08A7 7 0 0 0 19 12h-2z" />
            </svg>
          </button>
        ) : (
          <p className="text-sm text-ink-muted">
            Voice input isn&apos;t supported in this browser — type your brief instead.
          </p>
        )}

        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          rows={3}
          placeholder="Your spoken (or typed) trip brief will appear here…"
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />

        <button
          className="btn-primary w-full disabled:opacity-50"
          disabled={!transcript.trim() || sent}
          onClick={() => setSent(true)}
        >
          {sent ? "Sent" : "Send brief to a travel specialist"}
        </button>

        {sent && (
          <p className="text-sm text-teal-dark">
            Thanks — a travel specialist will follow up on this brief shortly.
          </p>
        )}
      </div>
    </div>
  );
}
