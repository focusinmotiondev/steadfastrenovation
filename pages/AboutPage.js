"use client";

import { useRouter } from "next/navigation";
import { C, TESTIMONIALS } from "../constants";
import { Reveal, SectionLabel, IcoStar, IcoCheck } from "../components";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div>
      <section style={{ background: C.bg, padding: "140px 0 64px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 36px" }}>
          <Reveal>
            <SectionLabel>About Steadfast</SectionLabel>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 700, color: C.text, marginBottom: 16 }}>Trusted to renovate the spaces families live in every day</h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 17, color: C.textMid, maxWidth: 820, lineHeight: 1.8 }}>We know homeowners are not just hiring for workmanship. They are hiring for trust, communication, consistency, and a team that treats the home with respect. That is the standard Steadfast is built on.</p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: C.white, padding: "20px 0 84px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 36px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 34, alignItems: "stretch" }} className="about-grid">
            <Reveal>
              <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&q=80" alt="Renovation professionals" style={{ width: "100%", height: "100%", minHeight: 540, objectFit: "cover", borderRadius: 24 }} />
            </Reveal>
            <Reveal delay={0.08}>
              <div style={{ height: '100%', display: 'grid', gap: 18 }}>
                <div style={cardStyle}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 34, color: C.text, marginBottom: 12 }}>Why people trust us</h2>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: C.textMid, lineHeight: 1.8, marginBottom: 16 }}>Steadfast Renovation was built with a simple mindset: show up, communicate clearly, keep the work moving, and finish with pride. We are not trying to be flashy for one day. We want to be the team people recommend years later.</p>
                  <div style={{ display: 'grid', gap: 12 }}>
                    {[
                      'Clear expectations before work starts.',
                      'A team that respects your schedule and your home.',
                      'Thoughtful craftsmanship from demolition to finish work.',
                      'Reliable communication so clients are never left guessing.',
                    ].map((item) => <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><IcoCheck size={16} /><span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: C.textMid, lineHeight: 1.65 }}>{item}</span></div>)}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 14 }} className="stats-grid">
                  {[
                    ['2010', 'Serving homeowners'],
                    ['100+', 'Projects delivered'],
                    ['24 hrs', 'Fast response target'],
                    ['1 team', 'From planning to finish'],
                  ].map(([value, label]) => <div key={label} style={{ ...cardStyle, padding: 18 }}><div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: C.accent }}>{value}</div><div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: C.textMid, lineHeight: 1.5, marginTop: 8 }}>{label}</div></div>)}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section style={{ background: C.bg, padding: "80px 0" }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 36px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }} className="trust-grid">
            {[
              ['Process you can follow', 'We make the renovation path feel structured, not chaotic. From consultation to closeout, every stage is handled with professionalism.'],
              ['Work that reflects the investment', 'When someone is spending on their home, the details matter. We approach finishes, layout decisions, and craftsmanship like they will be judged for years.'],
              ['Relationships over one-time jobs', 'Our best marketing is repeat business and referrals. We care about the outcome because every completed project becomes part of our reputation.'],
            ].map(([title, text]) => (
              <Reveal key={title}>
                <div style={cardStyle}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: C.text, marginBottom: 10 }}>{title}</h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: C.textMid, lineHeight: 1.8 }}>{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: C.white, padding: '82px 0' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 36px' }}>
          <Reveal>
            <SectionLabel>Client Trust</SectionLabel>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 4vw, 48px)', color: C.text, marginBottom: 28 }}>What homeowners say after the work is done</h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 22 }}>
            {TESTIMONIALS.map((testimonial, index) => (
              <Reveal key={testimonial.name} delay={index * 0.05}>
                <div style={{ ...cardStyle, height: '100%' }}>
                  <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>{[...Array(testimonial.rating)].map((_, idx) => <IcoStar key={idx} />)}</div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: C.textMid, lineHeight: 1.8, marginBottom: 18 }}>&ldquo;{testimonial.text}&rdquo;</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700, color: C.text }}>{testimonial.name}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: C.textLight, marginTop: 4 }}>{testimonial.location} • {testimonial.project}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: C.bgDark, padding: '78px 0', textAlign: 'center' }}>
        <Reveal>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 42px)', color: '#fff', marginBottom: 10 }}>Have a renovation in mind?</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'rgba(255,255,255,0.72)', maxWidth: 700, margin: '0 auto 26px', lineHeight: 1.7 }}>Send us the details through the project form and we will follow up with enough context to have a real conversation, not just a generic callback.</p>
          <button onClick={() => router.push('/contact')} style={{ background: C.accent, color: '#fff', border: 'none', padding: '15px 30px', borderRadius: 999, fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Start your request</button>
        </Reveal>
      </section>
    </div>
  );
}

const cardStyle = { background: '#fff', borderRadius: 22, border: `1px solid ${C.borderLight}`, padding: 24, boxShadow: '0 12px 30px rgba(22,22,22,0.04)' };
