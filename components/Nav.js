"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { C, NAV_ITEMS } from "../constants";
import { Roofline, IcoMenu, IcoX, BtnPrimary } from "../components";

const pageToHref = {
  home: "/",
  services: "/services",
  projects: "/projects",
  beforeafter: "/before-after",
  about: "/about",
  contact: "/contact",
};

const pathnameToPage = (pathname) => {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/services")) return "services";
  if (pathname.startsWith("/projects")) return "projects";
  if (pathname.startsWith("/before-after")) return "beforeafter";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/contact")) return "contact";
  return "";
};

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mob, setMob] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    h();
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    setMob(false);
  }, [pathname]);

  const page = pathnameToPage(pathname || "/");
  const isHero = page === "home" && !scrolled;
  const navColor = isHero ? "#fff" : C.text;

  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: isHero ? "transparent" : C.white, borderBottom: `1px solid ${isHero ? "transparent" : C.borderLight}`, transition: "all 0.35s", backdropFilter: scrolled ? "blur(12px)" : "none" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 36px", height: scrolled ? 64 : 76, display: "flex", alignItems: "center", justifyContent: "space-between", transition: "height 0.35s" }}>
          <Link href="/" style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <Roofline color={isHero ? "#fff" : C.accent} size={20} />
            <div>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, letterSpacing: 3, color: navColor, textTransform: "uppercase" }}>Steadfast</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 500, letterSpacing: 2.5, color: isHero ? "rgba(255,255,255,0.6)" : C.textLight, textTransform: "uppercase", display: "block", marginTop: -2 }}>Renovation Ltd</span>
            </div>
          </Link>
          <div className="dsk-nav" style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {NAV_ITEMS.map((n) => {
              const href = pageToHref[n.page];
              const active = page === n.page;
              return (
                <Link
                  key={n.page}
                  href={href}
                  style={{ textDecoration: "none", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: active ? 600 : 400, color: active ? (isHero ? "#fff" : C.accent) : (isHero ? "rgba(255,255,255,0.75)" : C.textMid), padding: "4px 0", borderBottom: active ? `2px solid ${isHero ? "#fff" : C.accent}` : "2px solid transparent", transition: "all 0.2s", whiteSpace: "nowrap" }}
                >
                  {n.label}
                </Link>
              );
            })}
            <Link href="/contact" style={{ textDecoration: "none" }}>
              <BtnPrimary style={{ padding: "10px 22px", fontSize: 13 }}>Get a Quote</BtnPrimary>
            </Link>
          </div>
          <button className="mob-btn" onClick={() => setMob(!mob)} style={{ background: "none", border: "none", cursor: "pointer", color: navColor, display: "none" }}>{mob ? <IcoX /> : <IcoMenu />}</button>
        </div>
      </nav>
      <div style={{ position: "fixed", inset: 0, zIndex: 999, background: C.white, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, opacity: mob ? 1 : 0, pointerEvents: mob ? "all" : "none", transition: "opacity 0.3s" }}>
        {NAV_ITEMS.map((n) => {
          const href = pageToHref[n.page];
          const active = page === n.page;
          return (
            <Link
              key={n.page}
              href={href}
              onClick={() => setMob(false)}
              style={{ textDecoration: "none", fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: active ? C.accent : C.text, letterSpacing: 2, textTransform: "uppercase" }}
            >
              {n.label}
            </Link>
          );
        })}
      </div>
    </>
  );
}
