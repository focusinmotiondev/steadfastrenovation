"use client";
import { useState } from "react";
import Link from "next/link";
import AdminShell from "../../components/admin/AdminShell";
import RequireAdmin from "../../components/admin/RequireAdmin";
import { C } from "../../constants";
import { currency, formatDate, getInvoices, getLeads, saveLead, STATUS_COLORS, SERVICE_OPTIONS, AREA_OPTIONS, BUDGET_OPTIONS, TIMELINE_OPTIONS } from "../../lib/crm";

export default function AdminDashboardPage() {
  const [leads, setLeads] = useState(() => getLeads());
  const [invoices] = useState(() => getInvoices());
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", phone: "", email: "", location: "", services: [], areas: [], budget: "", timeline: "", message: "" });

  const active = leads.filter((l) => !l.archived);
  const week = Date.now() - 7 * 864e5;
  const newThisWeek = active.filter((l) => new Date(l.createdAt).getTime() >= week).length;
  const totalRev = invoices.reduce((s, i) => s + Number(i.total || 0), 0);
  const stats = [["Active Clients", active.length, "#0065FF"], ["New This Week", newThisWeek, "#22A06B"], ["Invoices", invoices.length, C.accent], ["Total Revenue", currency(totalRev), "#22A06B"]];
  const pipeline = ["new", "contacted", "quoted", "in progress", "closed"];

  const handleAddClient = () => {
    if (!addForm.name || !addForm.phone) return;
    saveLead({ ...addForm, howFound: "Admin — Manual Entry", preferredContact: ["Phone"] });
    setLeads(getLeads());
    setAddForm({ name: "", phone: "", email: "", location: "", services: [], areas: [], budget: "", timeline: "", message: "" });
    setShowAdd(false);
  };

  const toggleArr = (arr, val) => arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  return (
    <RequireAdmin>
      <AdminShell
        title="Dashboard"
        subtitle="Overview of your renovation business pipeline."
        actions={<button onClick={() => setShowAdd(!showAdd)} style={pillS}>{showAdd ? "Cancel" : "+ Add Client"}</button>}
      >
        {/* Add Client Form */}
        {showAdd && (
          <div style={{ ...cardS, marginBottom: 24, border: `2px solid ${C.accent}` }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 4 }}>Add a client manually</h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: C.textMid, marginBottom: 18 }}>For when a client calls you directly or you meet them on-site.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="admin-mini-grid">
              <div><label style={labS}>Full Name *</label><input value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} style={inpS} placeholder="John Smith" /></div>
              <div><label style={labS}>Phone *</label><input value={addForm.phone} onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })} style={inpS} placeholder="(416) 555-0000" /></div>
              <div><label style={labS}>Email</label><input value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} style={inpS} placeholder="john@example.com" /></div>
              <div><label style={labS}>Location</label><input value={addForm.location} onChange={(e) => setAddForm({ ...addForm, location: e.target.value })} style={inpS} placeholder="Toronto, ON" /></div>
              <div><label style={labS}>Budget</label><select value={addForm.budget} onChange={(e) => setAddForm({ ...addForm, budget: e.target.value })} style={inpS}><option value="">Select</option>{BUDGET_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}</select></div>
              <div><label style={labS}>Timeline</label><select value={addForm.timeline} onChange={(e) => setAddForm({ ...addForm, timeline: e.target.value })} style={inpS}><option value="">Select</option>{TIMELINE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
            </div>
            <div style={{ marginTop: 14 }}>
              <label style={labS}>Services</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                {SERVICE_OPTIONS.map((s) => <button key={s} onClick={() => setAddForm({ ...addForm, services: toggleArr(addForm.services, s) })} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${addForm.services.includes(s) ? C.accent : C.border}`, background: addForm.services.includes(s) ? C.accent : "#fff", color: addForm.services.includes(s) ? "#fff" : C.textMid, fontFamily: "var(--font-body)", fontSize: 12, cursor: "pointer" }}>{s}</button>)}
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <label style={labS}>Areas</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                {AREA_OPTIONS.map((a) => <button key={a} onClick={() => setAddForm({ ...addForm, areas: toggleArr(addForm.areas, a) })} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${addForm.areas.includes(a) ? C.accent : C.border}`, background: addForm.areas.includes(a) ? C.accent : "#fff", color: addForm.areas.includes(a) ? "#fff" : C.textMid, fontFamily: "var(--font-body)", fontSize: 12, cursor: "pointer" }}>{a}</button>)}
              </div>
            </div>
            <div style={{ marginTop: 14 }}><label style={labS}>Notes / Project Details</label><textarea value={addForm.message} onChange={(e) => setAddForm({ ...addForm, message: e.target.value })} rows={3} style={{ ...inpS, resize: "vertical" }} placeholder="Quick notes from the call..." /></div>
            <button onClick={handleAddClient} style={{ ...pillS, marginTop: 16, padding: "13px 28px" }}>Save Client</button>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }} className="admin-stats">
          {stats.map(([label, value, color], i) => <div key={i} style={cardS}><p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: C.textLight, marginBottom: 10 }}>{label}</p><p style={{ fontFamily: "var(--font-display)", fontSize: i === 3 ? 22 : 32, fontWeight: 700, color }}>{value}</p></div>)}
        </div>

        {/* Pipeline */}
        <div style={{ ...cardS, marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 14 }}>Pipeline Overview</h2>
          <div style={{ display: "flex", gap: 8 }}>
            {pipeline.map((st) => { const count = active.filter((l) => l.status === st).length; const sc = STATUS_COLORS[st]; return <div key={st} style={{ flex: 1, padding: "14px 16px", borderRadius: 12, background: sc.bg, textAlign: "center" }}><p style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: sc.text }}>{count}</p><p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, color: sc.text, textTransform: "capitalize", marginTop: 2 }}>{st}</p></div>; })}
          </div>
        </div>

        {/* Table */}
        <div style={cardS}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: C.text }}>Recent Inquiries</h2>
            <div style={{ display: "flex", gap: 10 }}><Link href="/admin/archive" style={pillS}>Archive</Link><Link href="/admin/invoices" style={pillS}>Invoices</Link></div>
          </div>
          {active.length ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
                <thead><tr>{["Client", "Phone", "Services", "Budget", "Status", "Date", ""].map((h) => <th key={h} style={thS}>{h}</th>)}</tr></thead>
                <tbody>{active.slice(0, 15).map((l) => { const sc = STATUS_COLORS[l.status] || STATUS_COLORS.new; return (
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
          ) : <p style={{ fontFamily: "var(--font-body)", color: C.textMid }}>No clients yet.</p>}
        </div>
      </AdminShell>
    </RequireAdmin>
  );
}

const cardS = { background: "#fff", borderRadius: 16, padding: 24, border: `1px solid ${C.borderLight}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" };
const thS = { textAlign: "left", fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: C.textLight, padding: "10px 8px", borderBottom: `2px solid ${C.borderLight}` };
const tdS = { fontFamily: "var(--font-body)", fontSize: 14, color: C.text, padding: "14px 8px", verticalAlign: "top" };
const pillS = { textDecoration: "none", display: "inline-flex", padding: "9px 16px", borderRadius: 10, background: C.accent, color: "#fff", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer" };
const labS = { fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: C.textMid, display: "block", marginBottom: 4, letterSpacing: 0.5, textTransform: "uppercase" };
const inpS = { width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontFamily: "var(--font-body)", fontSize: 14, outline: "none", boxSizing: "border-box" };
