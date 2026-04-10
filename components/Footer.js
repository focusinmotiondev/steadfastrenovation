import Link from "next/link";
import { C, NAV_ITEMS, SERVICES } from "../constants";
import { Roofline, IcoPhone, IcoMail, IcoPin } from "../components";

const pageToHref = {
  home: "/",
  services: "/services",
  projects: "/projects",
  beforeafter: "/before-after",
  about: "/about",
  contact: "/contact",
};

export default function Footer() {
  return (
    <footer style={{ background: C.bgDark, color: "#fff" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "72px 36px 36px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 48, marginBottom: 56 }} className="footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <Roofline color={C.accent} size={18} />
              <span style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Steadfast</span>
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 300 }}>
              Design-led construction management specializing in major Ontario home renovations. One team, one vision, no compromises. Proudly serving Ontario since 2010.
            </p>
          </div>
          <div>
            <h4 style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", color: C.accent, marginBottom: 20 }}>Company</h4>
            {NAV_ITEMS.map((n) => (
              <Link
                key={n.page}
                href={pageToHref[n.page]}
                style={{ display: "block", textDecoration: "none", color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)", fontSize: 14, marginBottom: 10 }}
              >
                {n.label}
              </Link>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", color: C.accent, marginBottom: 20 }}>Services</h4>
            {SERVICES.slice(0, 5).map((s) => <p key={s.title} style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)", fontSize: 14, marginBottom: 10 }}>{s.title}</p>)}
          </div>
          <div>
            <h4 style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", color: C.accent, marginBottom: 20 }}>Contact</h4>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}><IcoPhone size={15} /><span style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)", fontSize: 14 }}>416-834-5484</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}><IcoMail size={15} /><span style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)", fontSize: 14 }}>steadfastrenovation@gmail.com</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}><IcoPin size={15} /><span style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)", fontSize: 14 }}>Greater Toronto Area & surrounding regions</span></div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 28, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>2025 Steadfast Renovation Ltd. All rights reserved.</p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Licensed & Insured in Ontario, Canada</p>
        </div>
      </div>
    </footer>
  );
}
