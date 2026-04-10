"use client";

import { useRouter } from "next/navigation";
import { C, BEFORE_AFTER } from "../constants";
import { Reveal, SectionLabel, CompareSlider } from "../components";

export default function BeforeAfterPage() {
  const router = useRouter();
  const featured = BEFORE_AFTER.find(p => p.featured);
  const grid = BEFORE_AFTER.filter(p => !p.featured);

  return (
    <div>
      {/* Header */}
      <section style={{ background: C.bg, padding: "140px 0 60px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 36px" }}>
          <Reveal>
            <SectionLabel>Transformations</SectionLabel>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 600, color: C.text, marginBottom: 14 }}>
              Before <span style={{ color: C.accent }}>&</span> After
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 17, color: C.textMid, maxWidth: 600, lineHeight: 1.7 }}>
              We've had the privilege of transforming countless homes across Ontario. Drag the slider to see the difference — here is the highlight reel.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Featured Slider */}
      {featured && (
        <section style={{ background: C.bgDark, padding: "48px 0" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 36px" }}>
            <Reveal>
              <CompareSlider before={featured.before} after={featured.after} height={500} borderRadius={8} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "#fff" }}>{featured.title}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{featured.location}</p>
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase" }}>Drag to compare</p>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Grid of sliders */}
      <section style={{ background: C.white, padding: "60px 0 80px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 36px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 24 }} className="ba-grid">
            {grid.map((project, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${C.borderLight}`, transition: "box-shadow 0.3s" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 36px rgba(0,0,0,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                  <CompareSlider before={project.before} after={project.after} height={300} borderRadius={0} />
                  <div style={{ padding: "16px 20px", background: C.white }}>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: C.text }}>{project.title}</h3>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: C.textLight, marginTop: 2 }}>{project.location}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: C.accent, padding: "64px 0", textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 600, color: "#fff", marginBottom: 8 }}>Your home could be next</h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "rgba(255,255,255,0.7)", marginBottom: 28 }}>Let's talk about your transformation.</p>
          <button onClick={() => { router.push("/contact"); }}
            style={{ background: "#fff", color: C.text, border: "none", padding: "14px 32px", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, cursor: "pointer", borderRadius: 6 }}>Get a Free Quote</button>
        </Reveal>
      </section>
    </div>
  );
}
