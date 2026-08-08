"use client";

import { useEffect, useState, type FormEvent } from "react";
import { cn, formatCurrency } from "@/lib/utils";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface BookingRow {
  id: string;
  bookingNo: string;
  travelDate: string;
  status: string;
  totalPrice: number;
  package: { name: string; slug: string };
}

async function readJson(res: Response) {
  return res.json().catch(() => null);
}

export default function ClientPortalPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);
  const [mfaUserId, setMfaUserId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookings, setBookings] = useState<BookingRow[] | null>(null);

  useEffect(() => {
    fetch("/api/v1/auth/me")
      .then(async (res) => (res.ok ? (await readJson(res))?.data ?? null : null))
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch("/api/v1/bookings")
      .then(async (res) => (res.ok ? (await readJson(res))?.data ?? [] : []))
      .then(setBookings)
      .catch(() => setBookings([]));
  }, [user]);

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);

    const form = new FormData(event.currentTarget);
    const endpoint = tab === "login" ? "/api/v1/auth/login" : "/api/v1/auth/register";
    const payload =
      tab === "login"
        ? { email: form.get("email"), password: form.get("password") }
        : {
            name: form.get("name"),
            email: form.get("email"),
            password: form.get("password"),
          };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await readJson(res);

      if (!res.ok) {
        throw new Error(body?.error ?? "Something went wrong");
      }

      if (body?.data?.mfaRequired) {
        setMfaUserId(body.data.userId);
      } else {
        setUser(body.data);
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleMfaSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!mfaUserId) return;
    setSubmitting(true);
    setFormError(null);

    const form = new FormData(event.currentTarget);
    try {
      const res = await fetch("/api/v1/auth/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: mfaUserId, token: form.get("token") }),
      });
      const body = await readJson(res);
      if (!res.ok) throw new Error(body?.error ?? "Invalid code");
      setUser(body.data);
      setMfaUserId(null);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Invalid code");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignOut() {
    await fetch("/api/v1/auth/logout", { method: "POST" }).catch(() => undefined);
    setUser(null);
    setBookings(null);
  }

  if (user === undefined) {
    return <div className="container-elite py-24 text-center text-ink-muted">Loading…</div>;
  }

  if (user) {
    return (
      <div className="container-elite py-16">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-navy">Welcome back, {user.name}</h1>
            <p className="text-sm text-ink-muted">{user.email}</p>
          </div>
          <button onClick={handleSignOut} className="btn-ghost">Sign out</button>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-navy">Your bookings</h2>

          {bookings === null ? (
            <p className="mt-4 text-sm text-ink-muted">Loading bookings…</p>
          ) : bookings.length === 0 ? (
            <p className="mt-4 text-sm text-ink-muted">
              No bookings yet — browse{" "}
              <a href="/holidays" className="text-teal hover:underline">holiday packages</a> to get started.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {bookings.map((b) => (
                <div key={b.id} className="card-elevated flex flex-wrap items-center justify-between gap-4 p-5">
                  <div>
                    <p className="font-semibold text-navy">{b.package.name}</p>
                    <p className="text-xs text-ink-muted">
                      Booking #{b.bookingNo} · Travel date {new Date(b.travelDate).toLocaleDateString()} ·{" "}
                      {formatCurrency(b.totalPrice)}
                    </p>
                  </div>
                  <span className="rounded-full bg-teal/15 px-3 py-1 text-xs font-semibold text-teal-dark">
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container-elite flex justify-center py-16">
      <div className="w-full max-w-md">
        {mfaUserId ? (
          <form onSubmit={handleMfaSubmit} className="card-elevated space-y-4 p-6">
            <h2 className="text-lg font-semibold text-navy">Two-factor verification</h2>
            <p className="text-sm text-ink-muted">Enter the 6-digit code from your authenticator app.</p>
            <input
              name="token"
              required
              maxLength={6}
              pattern="[0-9]{6}"
              inputMode="numeric"
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-center text-lg tracking-[0.5em] focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
              {submitting ? "Verifying…" : "Verify"}
            </button>
            <button
              type="button"
              onClick={() => setMfaUserId(null)}
              className="w-full text-center text-xs text-ink-muted hover:underline"
            >
              Back to sign in
            </button>
          </form>
        ) : (
          <>
            <div className="mb-6 flex gap-2 rounded-full bg-navy/5 p-1">
              <button
                onClick={() => { setTab("login"); setFormError(null); }}
                className={cn("flex-1 rounded-full py-2 text-sm font-semibold", tab === "login" ? "bg-white shadow" : "text-ink-muted")}
              >
                Sign in
              </button>
              <button
                onClick={() => { setTab("register"); setFormError(null); }}
                className={cn("flex-1 rounded-full py-2 text-sm font-semibold", tab === "register" ? "bg-white shadow" : "text-ink-muted")}
              >
                Create account
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="card-elevated space-y-4 p-6">
              {tab === "register" && (
                <div>
                  <label className="text-xs font-medium text-ink-muted">Full name</label>
                  <input name="name" required className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold" />
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-ink-muted">Email</label>
                <input name="email" required type="email" className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold" />
              </div>
              <div>
                <label className="text-xs font-medium text-ink-muted">Password</label>
                <input name="password" required type="password" minLength={10} className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold" />
                {tab === "register" && (
                  <p className="mt-1 text-[11px] text-ink-muted">
                    At least 10 characters, with an uppercase letter, a lowercase letter, and a number.
                  </p>
                )}
              </div>

              {formError && <p className="text-sm text-red-600">{formError}</p>}

              <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
                {submitting ? "Please wait…" : tab === "login" ? "Sign in" : "Create account"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
