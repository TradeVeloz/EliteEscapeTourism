"use client";

import { useState, type FormEvent } from "react";
import { visaCountries, destinations } from "@/lib/data";

export default function VisaPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      destinationSlug: form.get("destinationSlug"),
      fullName: form.get("fullName"),
      nationality: form.get("nationality"),
      purpose: form.get("purpose"),
      email: form.get("email"),
      passportNo: form.get("passportNo"),
      passportExpiry: form.get("passportExpiry"),
    };

    try {
      const res = await fetch("/api/v1/visa/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Request failed");
      }
      setStatus("success");
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  return (
    <div>
      <section className="bg-navy py-20 text-white">
        <div className="container-elite">
          <p className="eyebrow text-gold">Visa assistance</p>
          <h1 className="mt-2 text-4xl font-bold">Visas, handled start to finish</h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Documentation review, application submission, and status tracking for UAE residents and
            citizens traveling worldwide.
          </p>
        </div>
      </section>

      <section className="container-elite py-16">
        <h2 className="text-2xl font-bold text-navy">Requirements by destination</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-black/10 text-left text-ink-muted">
                <th className="py-3 pr-4 font-medium">Destination</th>
                <th className="py-3 pr-4 font-medium">Processing time</th>
                <th className="py-3 pr-4 font-medium">Visa on arrival</th>
                <th className="py-3 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {visaCountries.map((c) => (
                <tr key={c.country} className="border-b border-black/5">
                  <td className="py-3 pr-4 font-medium text-navy">{c.country}</td>
                  <td className="py-3 pr-4">{c.processingTime}</td>
                  <td className="py-3 pr-4">{c.visaOnArrival ? "Yes" : "No"}</td>
                  <td className="py-3 text-ink-muted">{c.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-ink-muted">
          Requirements change frequently — figures above are indicative. Confirm current requirements
          with a visa specialist before booking.
        </p>
      </section>

      <section className="bg-navy/[0.03] py-16">
        <div className="container-elite grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-navy">Start a visa application</h2>
            <p className="mt-3 text-ink-muted">
              Share your travel details and a specialist will confirm requirements, list the documents
              you need, and manage submission on your behalf.
            </p>
          </div>

          {status === "success" ? (
            <div className="card-elevated p-6 text-center">
              <p className="text-lg font-semibold text-navy">Request received</p>
              <p className="mt-2 text-sm text-ink-muted">
                A visa specialist will contact you with next steps and a document checklist.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card-elevated space-y-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-ink-muted">Full name</label>
                  <input name="fullName" required className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold" />
                </div>
                <div>
                  <label className="text-xs font-medium text-ink-muted">Nationality</label>
                  <input name="nationality" required className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-ink-muted">Destination</label>
                <select
                  name="destinationSlug"
                  required
                  defaultValue=""
                  className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                >
                  <option value="" disabled>Select a destination</option>
                  {destinations.map((d) => (
                    <option key={d.slug} value={d.slug}>{d.name}, {d.country}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-ink-muted">Passport number</label>
                  <input name="passportNo" required className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold" />
                </div>
                <div>
                  <label className="text-xs font-medium text-ink-muted">Passport expiry</label>
                  <input name="passportExpiry" type="date" required className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-ink-muted">Purpose of travel</label>
                <input name="purpose" required className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold" />
              </div>
              <div>
                <label className="text-xs font-medium text-ink-muted">Email</label>
                <input name="email" required type="email" className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold" />
              </div>

              {status === "error" && (
                <p className="text-sm text-red-600">{errorMessage ?? "Something went wrong — please try again."}</p>
              )}

              <button type="submit" disabled={status === "submitting"} className="btn-primary w-full disabled:opacity-60">
                {status === "submitting" ? "Sending…" : "Submit application"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
