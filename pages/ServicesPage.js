"use client";

import { useRouter } from "next/navigation";
import { C, SERVICES } from "../constants";
import { Reveal, SectionLabel, IcoCheck, IcoArrow } from "../components";

export default function ServicesPage() {
  const router = useRouter();

  return (
    <div>
      <section style={{ background: C.bg, padding: "140px 0 60px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 36px" }}>
          <Reveal><SectionLabel>Services</SectionLabel><h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 600, color: C.text, marginBottom: 14 }}>What We Do</h1><p style={{ fontFamily: "var(--font-body)", fontSize: 17, color: C.textMid, maxWidth: 620, lineHeight: 1.7 }}>From single-room upgrades to full-property transformations, our team handles every phase of the renovation journey.</p></Reveal>
        </div>
      </section>
      <section style={{ background: C.white, padding: "60px 0 80px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 36px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24 }} className="services-grid">
            {SERVICES.map((service, i) => (
              <Reveal key={service.title} delay={i * 0.06}>
                <div style={{ border: `1px solid ${C.borderLight}`, background: C.bg, borderRadius: 8, overflow: "hidden", height: "100%" }}>
                  <img src={service.img} alt={service.title} style={{ width: "100%", height: 250, objectFit: "cover", display: "block" }} />
                  <div style={{ padding: 24 }}>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: C.text, marginBottom: 12 }}>{service.title}</h3>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: C.textMid, lineHeight: 1.75, marginBottom: 22 }}>{service.desc}</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      {service.features.map((feature) => (
                        <div key={feature} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <IcoCheck size={14} />
                          <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: C.text }}>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section style={{ background: C.accent, padding: "72px 0" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 36px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <Reveal><h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 600, color: "#fff" }}>Need help choosing the right service?</h2><p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "rgba(255,255,255,0.7)", marginTop: 8 }}>Let's walk through your goals and build a renovation plan that fits.</p></Reveal>
          <Reveal delay={0.1}><button onClick={() => router.push("/contact")} style={{ background: "#fff", color: C.text, border: "none", padding: "14px 32px", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, cursor: "pointer", borderRadius: 6, display: "flex", alignItems: "center", gap: 10 }}>Get a Free Quote <IcoArrow size={15} color={C.text} /></button></Reveal>
        </div>
      </section>
    </div>
  );
}
