import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container-elite grid gap-10 py-16 md:grid-cols-4">
        <div>
          <p className="font-display text-xl font-bold">ELITE</p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
            Escape Tourism
          </p>
          <p className="mt-4 text-sm text-white/70">
            Your Escape, Our Elite Services — AI-Powered Travel, Human-Touched Service.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gold">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><Link href="/holidays" className="hover:text-white">Holiday Packages</Link></li>
            <li><Link href="/visa" className="hover:text-white">Visa Assistance</Link></li>
            <li><Link href="/attractions" className="hover:text-white">Attractions</Link></li>
            <li><Link href="/seasonal-tours" className="hover:text-white">Seasonal Tours</Link></li>
            <li><Link href="/ai-travel-planner" className="hover:text-white">AI Travel Planner</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gold">Company</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="/client-portal" className="hover:text-white">Client Portal</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gold">Get in touch</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>#305 Damas Tower, Dubai, United Arab Emirates</li>
            <li>
              <a href="tel:+971555753133" className="hover:text-white">+971 55 575 3133</a>
            </li>
            <li>
              <a href="mailto:info@eliteescapetourism.com" className="hover:text-white">
                info@eliteescapetourism.com
              </a>
            </li>
            <li>Monday – Friday, 9AM – 5PM</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container-elite flex flex-col items-center justify-between gap-2 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Elite Escape Tourism. All rights reserved.</p>
          <p>Dubai, United Arab Emirates</p>
        </div>
      </div>
    </footer>
  );
}
