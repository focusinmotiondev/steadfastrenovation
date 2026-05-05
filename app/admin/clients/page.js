"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "../../../components/admin/AdminShell";
import RequireAdmin from "../../../components/admin/RequireAdmin";
import { C } from "../../../constants";
import { formatDate, getLeads, STATUS_COLORS } from "../../../lib/crm";

export default function ClientsListPage() {
  const [leads, setLeads] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => { async function load() { setLeads(await getLeads()); setInvoices(await getInvoices()); setLoading(false); } load(); }, []);

  const active = leads.filter((l) => !l.archived);
  const list = active.filter((l) => {
    const ms = !search || l.name?.toLowerCase().includes(search.toLowerCase()) || l.email?.toLowerCase().includes(search.toLowerCase()) || l.phone?.includes(search);
    const mf = filter === "all" || l.status === filter;
    return ms && mf;
  });

  if (loading) return <RequireAdmin><AdminShell title="Clients"><p style={{ fontFamily: "var(--font-body)", color: C.textMid }}>Loading...</p></AdminShell></RequireAdmin>;

  return (
    <RequireAdmin>
      <AdminShell title="Clients" subtitle="All active client inquiries and ongoing projects.">
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or phone..." style={{ flex: 1, minWidth: 280, padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontFamily: "var(--font-body)", fontSize: 14, outline: "none" }} />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontFamily: "var(--font-body)", fontSize: 14, outline: "none", minWidth: 160 }}>
            <option value="all">All Statuses</option>
            {["new", "contacted", "quoted", "in progress", "closed"].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {list.length ? list.map((c) => {
            const sc = STATUS_COLORS[c.status] || STATUS_COLORS.new;
            const bal = getClientBalance(c, invoices);
            return (
              <Link key={c.id} href={`/admin/clients/${c.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ background: "#fff", borderRadius: 16, padding: 22, border: `1px solid ${C.borderLight}`, display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "center", cursor: "pointer" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4, flexWrap: "wrap" }}>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: C.text }}>{c.name}</h3>
                      <span style={{ padding: "5px 12px", borderRadius: 20, background: sc.bg, color: sc.text, fontSize: 12, fontWeight: 700, textTransform: "capitalize" }}>{c.status}</span>
                      {bal.totalInvoiced > 0 && (
                        <span style={{ padding: "5px 12px", borderRadius: 20, background: bal.paid ? "#E3FCEF" : "#FFEBE6", color: bal.paid ? "#22A06B" : "#DE350B", fontSize: 12, fontWeight: 700 }}>
                          {bal.paid ? "PAID" : `Owing ${new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 0 }).format(bal.balance)}`}
                        </span>
                      )}
                    </div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: C.textMid }}>{c.phone} · {c.email} · {c.location || "No location"}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: C.textLight, marginTop: 4 }}>Services: {(c.services || []).join(", ") || "—"} · Budget: {c.budget || "—"}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: C.textLight }}>{formatDate(c.createdAt)}</p>
                    <span style={{ display: "inline-flex", marginTop: 6, padding: "7px 14px", borderRadius: 10, background: C.accent, color: "#fff", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600 }}>Open</span>
                  </div>
                </div>
              </Link>
            );
          }) : <p style={{ fontFamily: "var(--font-body)", color: C.textMid, padding: 24 }}>No clients match your search.</p>}
        </div>
      </AdminShell>
    </RequireAdmin>
  );
}
