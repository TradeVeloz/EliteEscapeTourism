"use client";

import { useState, type FormEvent } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setTimeout(() => setStatus("success"), 600);
  }

  return (
    <div className="container-elite py-16">
      <p className="eyebrow">Contact</p>
      <h1 className="mt-2 text-4xl font-bold">We&apos;d love to plan your next escape</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="card-elevated p-6">
            <h2 className="font-semibold text-navy">Office</h2>
            <p className="mt-2 text-sm text-ink-muted">#305 Damas Tower, Dubai, United Arab Emirates</p>
          </div>
          <div className="card-elevated p-6">
            <h2 className="font-semibold text-navy">Phone</h2>
            <a href="tel:+971555753133" className="mt-2 block text-sm text-teal hover:underline">
              +971 55 575 3133
            </a>
          </div>
          <div className="card-elevated p-6">
            <h2 className="font-semibold text-navy">Email</h2>
            <a href="mailto:info@eliteescapetourism.com" className="mt-2 block text-sm text-teal hover:underline">
              info@eliteescapetourism.com
            </a>
          </div>
          <div className="card-elevated p-6">
            <h2 className="font-semibold text-navy">Working hours</h2>
            <p className="mt-2 text-sm text-ink-muted">Monday – Friday, 9AM – 5PM</p>
          </div>
        </div>

        {status === "success" ? (
          <div className="card-elevated flex flex-col items-center justify-center p-6 text-center">
            <p className="text-lg font-semibold text-navy">Message sent</p>
            <p className="mt-2 text-sm text-ink-muted">We&apos;ll respond within one business day.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card-elevated space-y-4 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-ink-muted">Name</label>
                <input required className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold" />
              </div>
              <div>
                <label className="text-xs font-medium text-ink-muted">Phone</label>
                <input required type="tel" className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-ink-muted">Email</label>
              <input required type="email" className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold" />
            </div>
            <div>
              <label className="text-xs font-medium text-ink-muted">Message</label>
              <textarea required rows={5} className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold" />
            </div>
            <button type="submit" disabled={status === "submitting"} className="btn-primary w-full disabled:opacity-60">
              {status === "submitting" ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
