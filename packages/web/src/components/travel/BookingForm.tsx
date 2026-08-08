"use client";

import { useState, type FormEvent } from "react";

export function BookingForm({ packageSlug, packageName }: { packageSlug: string; packageName: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = new FormData(event.currentTarget);
    const payload = {
      packageSlug,
      fullName: form.get("fullName"),
      email: form.get("email"),
      phone: form.get("phone"),
      travelers: Number(form.get("travelers")),
      travelDate: form.get("travelDate"),
      notes: form.get("notes"),
    };

    try {
      const res = await fetch("/api/v1/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      event.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="card-elevated p-6 text-center">
        <p className="text-lg font-semibold text-navy">Inquiry received</p>
        <p className="mt-2 text-sm text-ink-muted">
          Thank you — a travel specialist will reach out about your {packageName} inquiry within one
          business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card-elevated space-y-4 p-6">
      <h3 className="text-lg font-semibold text-navy">Enquire about this package</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="text-xs font-medium text-ink-muted">Full name</label>
          <input
            id="fullName"
            name="fullName"
            required
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>
        <div>
          <label htmlFor="phone" className="text-xs font-medium text-ink-muted">Phone</label>
          <input
            id="phone"
            name="phone"
            required
            type="tel"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="text-xs font-medium text-ink-muted">Email</label>
        <input
          id="email"
          name="email"
          required
          type="email"
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="travelers" className="text-xs font-medium text-ink-muted">Travelers</label>
          <input
            id="travelers"
            name="travelers"
            type="number"
            min={1}
            defaultValue={2}
            required
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>
        <div>
          <label htmlFor="travelDate" className="text-xs font-medium text-ink-muted">Preferred travel date</label>
          <input
            id="travelDate"
            name="travelDate"
            type="date"
            required
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="text-xs font-medium text-ink-muted">Notes (optional)</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">Something went wrong — please try again or WhatsApp us directly.</p>
      )}

      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full disabled:opacity-60">
        {status === "submitting" ? "Sending…" : "Request this package"}
      </button>
    </form>
  );
}
