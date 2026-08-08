"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const MOCK_BOOKINGS = [
  { id: "EE-10234", package: "Maldives Overwater Honeymoon", status: "CONFIRMED", travelDate: "2026-10-14" },
  { id: "EE-10198", package: "Swiss Alps Family Adventure", status: "PLANNING", travelDate: "2026-12-20" },
];

export default function ClientPortalPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [signedIn, setSignedIn] = useState(false);

  if (signedIn) {
    return (
      <div className="container-elite py-16">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-navy">Welcome back</h1>
          <button onClick={() => setSignedIn(false)} className="btn-ghost">Sign out</button>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-navy">Your bookings</h2>
          <div className="mt-4 space-y-4">
            {MOCK_BOOKINGS.map((b) => (
              <div key={b.id} className="card-elevated flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-semibold text-navy">{b.package}</p>
                  <p className="text-xs text-ink-muted">Booking #{b.id} · Travel date {b.travelDate}</p>
                </div>
                <span className="rounded-full bg-teal/15 px-3 py-1 text-xs font-semibold text-teal-dark">
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-10 text-xs text-ink-muted">
          This dashboard is showing sample data — no account system or database is connected yet. Real
          bookings, visa status, and profile management will populate this once auth and a backend are
          provisioned.
        </p>
      </div>
    );
  }

  return (
    <div className="container-elite flex justify-center py-16">
      <div className="w-full max-w-md">
        <div className="mb-6 flex gap-2 rounded-full bg-navy/5 p-1">
          <button
            onClick={() => setTab("login")}
            className={cn("flex-1 rounded-full py-2 text-sm font-semibold", tab === "login" ? "bg-white shadow" : "text-ink-muted")}
          >
            Sign in
          </button>
          <button
            onClick={() => setTab("register")}
            className={cn("flex-1 rounded-full py-2 text-sm font-semibold", tab === "register" ? "bg-white shadow" : "text-ink-muted")}
          >
            Create account
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSignedIn(true);
          }}
          className="card-elevated space-y-4 p-6"
        >
          {tab === "register" && (
            <div>
              <label className="text-xs font-medium text-ink-muted">Full name</label>
              <input required className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold" />
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-ink-muted">Email</label>
            <input required type="email" className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold" />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-muted">Password</label>
            <input required type="password" className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold" />
          </div>
          <button type="submit" className="btn-primary w-full">
            {tab === "login" ? "Sign in" : "Create account"}
          </button>
          <p className="text-center text-[11px] text-ink-muted">
            Demo only — no account is created or verified yet.
          </p>
        </form>
      </div>
    </div>
  );
}
