"use client";

import { useState } from "react";
import { C, PROJECTS } from "../constants";
import { Reveal, SectionLabel } from "../components";

export default function ProjectsPage() {
  const [filter, setFilter] = useState("All");
  const cats = ["All", "Kitchen", "Bathroom", "Basement", "Full Home"];
  const list = filter === "All" ? PROJECTS : PROJECTS.filter(p => p.category === filter);
  return (
    <div>
      <section style={{ background: C.bg, padding: "140px 0 60px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 36px" }}>
          <Reveal><SectionLabel>Portfolio</SectionLabel><h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 600, color: C.text, marginBottom: 14 }}>Our Projects</h1><p style={{ fontFamily: "var(--font-body)", fontSize: 17, color: C.textMid, maxWidth: 520, lineHeight: 1.7 }}>Browse our portfolio of completed renovations across Ontario.</p></Reveal>
        </div>
      </section>
      <section style={{ background: C.white, padding: "40px 0 80px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 36px" }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 40, flexWrap: "wrap" }}>
            {cats.map(c => <button key={c} onClick={() => setFilter(c)} style={{ background: filter === c ? C.accent : "transparent", color: filter === c ? "#fff" : C.textMid, border: `1.5px solid ${filter === c ? C.accent : C.border}`, padding: "8px 20px", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500, cursor: "pointer", borderRadius: 6, transition: "all 0.2s" }}>{c}</button>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 20 }} className="proj-grid">
            {list.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.07}>
                <div style={{ borderRadius: 6, overflow: "hidden", cursor: "pointer", border: `1px solid ${C.borderLight}`, transition: "box-shadow 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 36px rgba(0,0,0,0.08)"; e.currentTarget.querySelector("img").style.transform = "scale(1.03)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.querySelector("img").style.transform = "scale(1)"; }}>
                  <div style={{ overflow: "hidden", height: 280 }}><img src={p.img} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)" }} /></div>
                  <div style={{ padding: "18px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600, color: C.text, textTransform: "uppercase", letterSpacing: 0.5 }}>{p.title}</h3>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: C.textLight, marginTop: 2 }}>{p.sub}</p>
                      </div>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, color: C.accent, letterSpacing: 1, textTransform: "uppercase", background: `${C.accent}18`, padding: "4px 10px", borderRadius: 4 }}>{p.category}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
