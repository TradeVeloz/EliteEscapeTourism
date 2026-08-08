const VALUES = [
  { title: "Personalized", body: "Every itinerary is shaped around how you actually want to travel, not a fixed template." },
  { title: "Comprehensive", body: "Booking, visas, and itinerary management under one roof, coordinated by a single specialist." },
  { title: "Luxury-first", body: "We work exclusively with premium properties and vetted local partners." },
  { title: "AI-assisted", body: "Our planning tools speed up discovery — every plan is still refined by a human specialist." },
];

const TEAM = [
  { name: "Amina Al Suwaidi", role: "Founder & Travel Director" },
  { name: "Hassan Yousuf", role: "Head of Visa Services" },
  { name: "Layla Haddad", role: "Luxury Travel Consultant" },
  { name: "Omar Rahman", role: "Corporate Travel Lead" },
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-navy py-20 text-white">
        <div className="container-elite">
          <p className="eyebrow text-gold">About us</p>
          <h1 className="mt-2 text-4xl font-bold">Elite Escape Tourism</h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Based in Dubai, we design bespoke journeys for UAE and GCC travelers — pairing AI-assisted
            planning with the judgment and relationships only a human travel specialist can offer.
          </p>
        </div>
      </section>

      <section className="container-elite py-16">
        <h2 className="text-2xl font-bold text-navy">Why Elite Escape</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="card-elevated p-6">
              <h3 className="font-semibold text-navy">{v.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-navy/[0.03] py-16">
        <div className="container-elite">
          <h2 className="text-2xl font-bold text-navy">Our team</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member) => (
              <div key={member.name} className="card-elevated p-6 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-gold-gradient" />
                <p className="mt-4 font-semibold text-navy">{member.name}</p>
                <p className="text-xs text-ink-muted">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
