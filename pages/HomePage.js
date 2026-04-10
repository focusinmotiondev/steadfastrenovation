"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { C, PROJECTS, TESTIMONIALS } from "../constants";
import { Reveal, Roofline, SectionLabel, BtnPrimary, BtnOutline, IcoArrow, IcoCheck, IcoStar, IcoQuote, IcoPin } from "../components";

export default function HomePage() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setLoaded(true)); }, []);

  return (
    <div>
      {/* ─── HERO (Video Background) ─── */}
      <section style={{ position: "relative", height: "100vh", minHeight: 600, overflow: "hidden" }}>
        <video autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}>
        <source src="/videos/landing-v2.mp4" type="video/mp4" />
        </video>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.55) 100%)" }} />
        <div style={{ position: "absolute", bottom: 48, left: "50%", transform: "translateX(-50%)", opacity: loaded ? 0.5 : 0, transition: "opacity 1.5s ease 1.2s" }}>
          <Roofline color="rgba(255,255,255,0.5)" size={14} />
        </div>
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1320, margin: "0 auto", padding: "0 36px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ maxWidth: 680 }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: 20, opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(20px)", transition: "all 0.8s ease 0.3s" }}>Renovation Experts Since 2010</p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(42px, 6vw, 76px)", fontWeight: 600, color: "#fff", lineHeight: 1.05, marginBottom: 24, opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(40px)", transition: "all 1s cubic-bezier(0.22, 1, 0.36, 1) 0.45s" }}>
              Feel Right<br />at Home
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 17, color: "rgba(255,255,255,0.75)", lineHeight: 1.65, maxWidth: 460, marginBottom: 36, opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(30px)", transition: "all 0.9s ease 0.65s" }}>
              A one-stop solution to solving your home space problems. From kitchens to full-home renovations, we deliver results that exceed expectations.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(30px)", transition: "all 0.9s ease 0.85s" }}>
              <BtnPrimary onClick={() => { router.push("/contact"); }}>Start Your Renovation <IcoArrow size={16} color="#fff" /></BtnPrimary>
              <BtnOutline onClick={() => { router.push("/projects"); }} style={{ color: "#fff", borderColor: "rgba(255,255,255,0.5)" }}>View Our Work</BtnOutline>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INTRO / WHO WE ARE ─── */}
      <section style={{ background: C.bg, padding: "80px 0" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 36px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80, alignItems: "start" }} className="intro-grid">
            <Reveal>
              <SectionLabel>Who We Are</SectionLabel>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 600, color: C.text, lineHeight: 1.15 }}>Built from the ground up, one home at a time</h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 16, color: C.textMid, lineHeight: 1.8, marginBottom: 20 }}>
                Steadfast Renovation started with one man, a toolbelt, and a relentless work ethic. Since 2010, our founder has poured everything into this craft — showing up every single day, earning trust one project at a time. What began as a solo operation has grown into a full team of dedicated professionals who share the same obsession with quality.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 16, color: C.textMid, lineHeight: 1.8 }}>
                We've renovated hundreds of homes across Ontario and built a reputation that speaks for itself. From kitchens and bathrooms to complete home transformations, we handle every detail in-house — no subcontractor roulette, no surprise costs. Just honest work, done right.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── RECENT PROJECTS ─── */}
      <section style={{ background: C.white, padding: "80px 0" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 36px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 44, flexWrap: "wrap", gap: 16 }}>
            <Reveal><SectionLabel>Portfolio</SectionLabel><h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 600, color: C.text, lineHeight: 1.15 }}>Recent Projects</h2></Reveal>
            <Reveal delay={0.1}>
              <button onClick={() => { router.push("/projects"); }} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: C.accent, display: "flex", alignItems: "center", gap: 6, padding: 0, transition: "gap 0.3s" }}
                onMouseEnter={e => e.currentTarget.style.gap = "10px"} onMouseLeave={e => e.currentTarget.style.gap = "6px"}>View all projects <IcoArrow size={15} color={C.accent} /></button>
            </Reveal>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 16 }} className="proj-home-grid">
            {PROJECTS.slice(0, 3).map((p, i) => (
              <Reveal key={i} delay={i * 0.1} style={{ gridRow: i === 0 ? "1 / 3" : "auto" }}>
                <div style={{ position: "relative", overflow: "hidden", cursor: "pointer", height: i === 0 ? "100%" : 280, minHeight: 280, borderRadius: 6 }}
                  onMouseEnter={e => e.currentTarget.querySelector("img").style.transform = "scale(1.04)"}
                  onMouseLeave={e => e.currentTarget.querySelector("img").style.transform = "scale(1)"}>
                  <img src={p.img} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "48px 22px 20px", background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: i === 0 ? 24 : 18, fontWeight: 600, color: "#fff", textTransform: "uppercase", letterSpacing: 1 }}>{p.title}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 3 }}>{p.sub}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MADE TO MEASURE ─── */}
      <section style={{ position: "relative", minHeight: 560, overflow: "hidden" }}>
        <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1400&q=80" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(26,26,26,0.92) 0%, rgba(26,26,26,0.7) 50%, transparent 100%)" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1320, margin: "0 auto", padding: "100px 36px", display: "flex", alignItems: "center" }}>
          <Reveal>
            <div style={{ maxWidth: 520 }}>
              <SectionLabel>Why Steadfast</SectionLabel>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4vw, 50px)", fontWeight: 600, color: "#fff", lineHeight: 1.1, marginBottom: 24 }}>Made to<br />measure</h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "rgba(255,255,255,0.75)", lineHeight: 1.75, marginBottom: 28 }}>We don't pass your home around between disconnected contractors. One team, one vision, one point of contact from day one to move-in day. Every project gets our full attention because that's the only way we know how to work.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {["In-house design team", "Licensed trades", "Transparent pricing", "On-time delivery"].map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}><IcoCheck size={15} /><span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{f}</span></div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── TESTIMONIAL ─── */}
      <section style={{ background: C.bg, padding: "80px 0" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 36px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 60, alignItems: "center" }} className="testi-grid">
            <Reveal>
              <IcoQuote size={40} />
              <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 500, color: C.text, lineHeight: 1.55, margin: "20px 0 24px", fontStyle: "italic" }}>{TESTIMONIALS[0].text}</p>
              <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>{[...Array(5)].map((_, i) => <IcoStar key={i} />)}</div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 600, color: C.text }}>{TESTIMONIALS[0].name}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: C.textLight }}>{TESTIMONIALS[0].location} — {TESTIMONIALS[0].project}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <img src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=700&q=80" alt="" style={{ width: "100%", height: 420, objectFit: "cover", borderRadius: 6 }} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── SERVICE AREA ─── */}
      <section style={{ background: C.white, padding: "80px 0", borderTop: `1px solid ${C.borderLight}` }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 36px", textAlign: "center" }}>
          <Reveal>
            <SectionLabel>Service Area</SectionLabel>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 600, color: C.text, marginBottom: 14 }}>Hello, Ontario</h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 16, color: C.textMid, maxWidth: 520, margin: "0 auto 40px" }}>We serve the Greater Toronto Area, Hamilton, Niagara, and surrounding regions.</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
              {["Toronto", "Mississauga", "Oakville", "Burlington", "Hamilton", "Vaughan"].map((city, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}><IcoPin size={14} /><span style={{ fontFamily: "var(--font-body)", fontSize: 15, color: C.textMid }}>{city}</span></div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ background: C.accent, padding: "72px 0" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 36px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <Reveal><h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>Ready to start your renovation?</h2><p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "rgba(255,255,255,0.7)", marginTop: 8 }}>Book a free consultation. No pressure, no obligations.</p></Reveal>
          <Reveal delay={0.1}>
            <button onClick={() => { router.push("/contact"); }} style={{ background: "#fff", color: C.text, border: "none", padding: "16px 36px", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, cursor: "pointer", borderRadius: 6, display: "flex", alignItems: "center", gap: 10, transition: "all 0.25s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >Get a Free Quote <IcoArrow size={15} color={C.text} /></button>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
