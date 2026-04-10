"use client";
import { useState } from "react";
import Link from "next/link";
import AdminShell from "../../components/admin/AdminShell";
import RequireAdmin from "../../components/admin/RequireAdmin";
import { C } from "../../constants";
import { formatDate, getLeads, updateLead } from "../../lib/crm";

export default function AdminArchivePage() {
  const [leads, setLeads] = useState(() => getLeads().filter((l) => l.archived));
  const refresh = () => setLeads(getLeads().filter((l) => l.archived));
  return (
    <RequireAdmin>
      <AdminShell title="Archive" subtitle="Closed and archived client records.">
        {leads.length ? (
          <div style={{ display: "grid", gap: 12 }}>
            {leads.map((l) => (
              <div key={l.id} style={{ background: "#fff", borderRadius: 16, padding: 22, border: `1px solid ${C.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: C.text }}>{l.name}</h3>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: C.textMid }}>{l.phone} · {l.email} · {formatDate(l.createdAt)}</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { updateLead(l.id, { archived: false, status: "contacted" }); refresh(); }} style={btnO}>Restore</button>
                  <Link href={`/admin/clients/${l.id}`} style={btnG}>View</Link>
                </div>
              </div>
            ))}
          </div>
        ) : <p style={{ fontFamily: "var(--font-body)", color: C.textMid }}>No archived clients.</p>}
      </AdminShell>
    </RequireAdmin>
  );
}
const btnG = { textDecoration: "none", background: C.accent, color: "#fff", border: "none", padding: "9px 16px", borderRadius: 10, fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, cursor: "pointer" };
const btnO = { ...btnG, background: "transparent", color: C.text, border: `1.5px solid ${C.border}` };
