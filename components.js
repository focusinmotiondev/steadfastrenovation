"use client";

import { useState, useEffect, useRef } from "react";
import { C } from "./constants";

// ─── Intersection Observer Hook ───
export function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── Scroll Reveal Wrapper ───
export function Reveal({ children, delay = 0, y = 50, className = "", style = {} }) {
  const [ref, inView] = useInView(0.08);
  return (
    <div ref={ref} className={className} style={{
      ...style,
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : `translateY(${y}px)`,
      transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

// ─── Roofline SVG (from logo) ───
export function Roofline({ color = C.accent, size = 60 }) {
  return (
    <svg viewBox="0 0 120 50" width={size * 2} height={size} fill="none" style={{ display: "block" }}>
      <path d="M30 38 L60 12 L90 38" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 44 L48 18 L60 27" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="82" y="20" width="6" height="10" stroke={color} strokeWidth="2.5" />
      <rect x="56" y="22" width="5" height="5" stroke={color} strokeWidth="2" />
      <line x1="58.5" y1="22" x2="58.5" y2="27" stroke={color} strokeWidth="1.2" />
      <line x1="56" y1="24.5" x2="61" y2="24.5" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}

// ─── Icons ───
export function IcoArrow({ size = 18, color = "currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
}
export function IcoPhone({ size = 18, color = C.accent }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>; }
export function IcoMail({ size = 18, color = C.accent }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>; }
export function IcoPin({ size = 18, color = C.accent }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
export function IcoCheck({ size = 16, color = C.accent }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>; }
export function IcoStar({ size = 16, color = C.accent }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="0.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
export function IcoQuote({ size = 32, color = C.accent }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill={color} opacity="0.35"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609L9.978 5.151c-2.432.917-3.995 3.638-3.995 5.849H10v10H0z"/></svg>; }
export function IcoMenu({ size = 26 }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="17" x2="21" y2="17"/></svg>; }
export function IcoX({ size = 26 }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }

// ─── Buttons ───
export function BtnPrimary({ children, onClick, style: s = {} }) {
  return <button onClick={onClick} style={{ background: C.accent, color: "#fff", border: "none", padding: "14px 32px", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, letterSpacing: 0.5, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10, borderRadius: 6, transition: "all 0.25s", ...s }}
    onMouseEnter={e => { e.currentTarget.style.background = C.accentDark; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(201,169,110,0.3)"; }}
    onMouseLeave={e => { e.currentTarget.style.background = C.accent; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
  >{children}</button>;
}

export function BtnOutline({ children, onClick, style: s = {} }) {
  return <button onClick={onClick} style={{ background: "transparent", color: C.text, border: `1.5px solid ${C.text}`, padding: "13px 30px", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, letterSpacing: 0.5, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10, borderRadius: 6, transition: "all 0.25s", ...s }}
    onMouseEnter={e => { e.currentTarget.style.background = C.text; e.currentTarget.style.color = "#fff"; }}
    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = s.color || C.text; }}
  >{children}</button>;
}

export function SectionLabel({ children }) {
  return <p style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: C.accent, marginBottom: 12 }}>{children}</p>;
}

// ─── Before/After Comparison Slider ───
export function CompareSlider({ before, after, height = 400, borderRadius = 6 }) {
  const containerRef = useRef(null);
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);

  const updatePos = (clientX) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPos((x / rect.width) * 100);
  };

  const onDown = (e) => { e.preventDefault(); setDragging(true); updatePos(e.touches ? e.touches[0].clientX : e.clientX); };
  const onMove = (e) => { if (!dragging) return; updatePos(e.touches ? e.touches[0].clientX : e.clientX); };
  const onUp = () => setDragging(false);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      window.addEventListener("touchmove", onMove);
      window.addEventListener("touchend", onUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging]);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height, borderRadius, overflow: "hidden", cursor: "ew-resize", userSelect: "none", touchAction: "none" }}
      onMouseDown={onDown} onTouchStart={onDown}>
      {/* After (full) */}
      <img src={after} alt="After" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      {/* Before (clipped) */}
      <div style={{ position: "absolute", inset: 0, width: `${pos}%`, overflow: "hidden" }}>
        <img src={before} alt="Before" style={{ position: "absolute", top: 0, left: 0, width: containerRef.current ? containerRef.current.offsetWidth : "100%", height: "100%", objectFit: "cover", maxWidth: "none" }}
          style={{ position: "absolute", top: 0, left: 0, height: "100%", objectFit: "cover", width: `${containerRef.current ? containerRef.current.offsetWidth : 800}px`, maxWidth: "none" }} />
      </div>
      {/* Labels */}
      <div style={{ position: "absolute", top: 14, left: 14, background: "rgba(0,0,0,0.6)", color: "#fff", padding: "4px 12px", borderRadius: 4, fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Before</div>
      <div style={{ position: "absolute", top: 14, right: 14, background: `rgba(201,169,110,0.85)`, color: "#fff", padding: "4px 12px", borderRadius: 4, fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>After</div>
      {/* Divider line */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 3, background: "#fff", transform: "translateX(-50%)", boxShadow: "0 0 8px rgba(0,0,0,0.3)" }} />
      {/* Handle */}
      <div style={{
        position: "absolute", top: "50%", left: `${pos}%`, transform: "translate(-50%, -50%)",
        width: 44, height: 44, borderRadius: "50%", background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2,
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth="2.5" strokeLinecap="round">
          <polyline points="8 4 4 12 8 20" />
          <polyline points="16 4 20 12 16 20" />
        </svg>
      </div>
    </div>
  );
}
