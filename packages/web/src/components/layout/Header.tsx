"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/holidays", label: "Holidays" },
  { href: "/visa", label: "Visa" },
  { href: "/attractions", label: "Attractions" },
  { href: "/seasonal-tours", label: "Seasonal Tours" },
  { href: "/ai-travel-planner", label: "AI Travel Planner" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="container-elite flex h-20 items-center justify-between">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-display text-2xl font-bold tracking-wide text-navy">ELITE</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-dark">
            Escape Tourism
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium text-ink-muted transition-colors hover:text-navy",
                pathname === link.href && "text-navy font-semibold"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link href="/client-portal" className="btn-secondary">
            Client Portal
          </Link>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/15 lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-1.5">
            <span className="h-0.5 w-5 bg-navy" />
            <span className="h-0.5 w-5 bg-navy" />
            <span className="h-0.5 w-5 bg-navy" />
          </div>
        </button>
      </div>

      {open && (
        <nav className="border-t border-black/5 bg-white lg:hidden">
          <div className="container-elite flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted hover:bg-navy/5 hover:text-navy"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/client-portal"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-navy"
              onClick={() => setOpen(false)}
            >
              Client Portal
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
