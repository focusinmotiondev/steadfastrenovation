"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import AdminShell from "../../components/admin/AdminShell";
import RequireAdmin from "../../components/admin/RequireAdmin";
import { C } from "../../constants";
import { currency, formatDate, getInvoices, getLeads, STATUS_COLORS } from "../../lib/crm";

export default function AdminDashboardPage() {
  const [leads] = useState(() => getLeads());
  const [invoices] = useState(() => getInvoices());
  const active = leads.filter((l) => !l.archived);
  const week = Date.now() - 7 * 864e5;
  const newThisWeek = active.filter((l) => new Date(l.createdAt).getTime() >= week).length;
  const totalRev = invoices.reduce((s, i) => s + Number(i.total || 0), 0);
  const stats = [["Active Clients", active.length, "#0065FF"], ["New This Week", newThisWeek, "#22A06B"], ["Invoices", invoices.length, C.accent], ["Total Revenue", currency(totalRev), "#22A06B"]];
  const pipeline = ["new", "contacted", "quoted", "in progress", "closed"];

  return (
    <RequireAdmin>
      <AdminShell title="Dashboard" subtitle="Overview of your renovation business pipeline.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }} className="admin-stats">
          {stats.map(([label, value, color], i) => (
            <div key={i} style={cardS}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: C.textLight, marginBottom: 10 }}>{label}</p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: i === 3 ? 22 : 32, fontWeight: 700, color }}>{value}</p>
            </div>
          ))}
        </div>
        <div style={{ ...cardS, marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 14 }}>Pipeline Overview</h2>
          <div style={{ display: "flex", gap: 8 }}>
            {pipeline.map((st) => { const count = active.filter((l) => l.status === st).length; const sc = STATUS_COLORS[st]; return (
              <div key={st} style={{ flex: 1, padding: "14px 16px", borderRadius: 12, background: sc.bg, textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: sc.text }}>{count}</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, color: sc.text, textTransform: "capitalize", marginTop: 2 }}>{st}</p>
              </div>
            ); })}
          </div>
        </div>
        <div style={cardS}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: C.text }}>Recent Inquiries</h2>
            <div style={{ display: "flex", gap: 10 }}>
              <Link href="/admin/archive" style={pillS}>View Archive</Link>
              <Link href="/admin/invoices" style={pillS}>All Invoices</Link>
            </div>
          </div>
          {active.length ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
                <thead><tr>{["Client", "Phone", "Services", "Budget", "Status", "Date", ""].map((h) => <th key={h} style={thS}>{h}</th>)}</tr></thead>
                <tbody>{active.slice(0, 12).map((l) => { const sc = STATUS_COLORS[l.status] || STATUS_COLORS.new; return (
                  <tr key={l.id} style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                    <td style={tdS}><div style={{ fontWeight: 700 }}>{l.name}</div><div style={{ fontSize: 12, color: C.textMid }}>{l.email}</div></td>
                    <td style={tdS}>{l.phone || "—"}</td>
                    <td style={{ ...tdS, maxWidth: 200 }}>{(l.services || []).slice(0, 2).join(", ") || "—"}</td>
                    <td style={tdS}>{l.budget || "—"}</td>
                    <td style={tdS}><span style={{ display: "inline-flex", padding: "5px 12px", borderRadius: 20, background: sc.bg, color: sc.text, fontSize: 12, fontWeight: 700, textTransform: "capitalize" }}>{l.status}</span></td>
                    <td style={{ ...tdS, fontSize: 12, color: C.textLight }}>{formatDate(l.createdAt)}</td>
                    <td style={{ ...tdS, textAlign: "right" }}><Link href={`/admin/clients/${l.id}`} style={pillS}>Open</Link></td>
                  </tr>
                ); })}</tbody>
              </table>
            </div>
          ) : <p style={{ fontFamily: "var(--font-body)", color: C.textMid }}>No clients yet. Once the contact form is submitted, they will appear here automatically.</p>}
        </div>
      </AdminShell>
    </RequireAdmin>
  );
}

const cardS = { background: "#fff", borderRadius: 16, padding: 24, border: `1px solid ${C.borderLight}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" };
const thS = { textAlign: "left", fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: C.textLight, padding: "10px 8px", borderBottom: `2px solid ${C.borderLight}` };
const tdS = { fontFamily: "var(--font-body)", fontSize: 14, color: C.text, padding: "14px 8px", verticalAlign: "top" };
const pillS = { textDecoration: "none", display: "inline-flex", padding: "9px 16px", borderRadius: 10, background: C.accent, color: "#fff", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13 };
