"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { C } from "../../constants";
import { logoutAdmin } from "../../lib/crm";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/invoices", label: "Invoices" },
  { href: "/admin/automation", label: "AI Automation" },
  { href: "/admin/archive", label: "Archive" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminShell({ title, subtitle, children, actions }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "#F4F1EB" }}>
      {/* Fixed sidebar */}
      <aside style={{
        position: "fixed", top: 0, left: 0, bottom: 0, width: 250,
        background: C.bgDark, color: "#fff", padding: "24px 18px",
        display: "flex", flexDirection: "column", zIndex: 100, overflowY: "auto",
      }}>
        <Link href="/admin" style={{ textDecoration: "none", color: "#fff", display: "block", marginBottom: 28 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Steadfast</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: 2.5, textTransform: "uppercase", marginTop: -1 }}>Admin Portal</div>
        </Link>

        <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.06)", marginBottom: 24 }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>Signed in as</p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, wordBreak: "break-all" }}>steadfastrenovation@gmail.com</p>
        </div>

        <nav style={{ display: "grid", gap: 4, flex: 1 }}>
          {links.map((link) => {
            const active = pathname === link.href || (link.href === "/admin/clients" && pathname.startsWith("/admin/clients"));
            return (
              <Link key={link.href} href={link.href} style={{
                textDecoration: "none", display: "flex", alignItems: "center", gap: 10,
                color: active ? "#fff" : "rgba(255,255,255,0.6)",
                background: active ? C.accent : "transparent",
                padding: "11px 14px", borderRadius: 10,
                fontFamily: "var(--font-body)", fontSize: 14, fontWeight: active ? 600 : 400,
              }}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16, marginTop: 16 }}>
          <Link href="/" style={{ display: "block", textDecoration: "none", color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)", fontSize: 13, padding: "10px 14px", borderRadius: 10, marginBottom: 6 }}>
            View Website
          </Link>
          <button onClick={() => { logoutAdmin(); router.push("/admin/login"); }}
            style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)", fontSize: 13, cursor: "pointer", textAlign: "left" }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: 250, padding: "32px 40px 48px", minHeight: "100vh" }}>
        <div style={{ maxWidth: 1200 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: 34, lineHeight: 1.1, fontWeight: 700, color: C.text, marginBottom: 6 }}>{title}</h1>
              {subtitle && <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: C.textMid, maxWidth: 700 }}>{subtitle}</p>}
            </div>
            {actions && <div>{actions}</div>}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
