"use client";
import { useState } from "react";
import Link from "next/link";
import AdminShell from "../../components/admin/AdminShell";
import RequireAdmin from "../../components/admin/RequireAdmin";
import { C } from "../../constants";
import { currency, deleteInvoice, formatDate, getInvoices, getLeadById } from "../../lib/crm";

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState(() => getInvoices());
  const refresh = () => setInvoices(getInvoices());
  return (
    <RequireAdmin>
      <AdminShell title="Invoices" subtitle="Draft invoices created from client profiles.">
        {invoices.length ? (
          <div style={{ display: "grid", gap: 12 }}>
            {invoices.map((inv) => { const cl = getLeadById(inv.clientId); return (
              <div key={inv.id} style={{ background: "#fff", borderRadius: 16, padding: 22, border: `1px solid ${C.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: C.textLight, textTransform: "uppercase" }}>Invoice #{inv.invoiceNumber}</p>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: C.text, marginTop: 4 }}>{cl?.name || "Client removed"}</h3>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: C.textMid, marginTop: 4 }}>Total: {currency(inv.total)} · {formatDate(inv.createdAt)}</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {cl && <Link href={`/admin/clients/${inv.clientId}`} style={btnG}>Open Client</Link>}
                  <button onClick={() => { deleteInvoice(inv.id); refresh(); }} style={btnD}>Delete</button>
                </div>
              </div>
            ); })}
          </div>
        ) : <p style={{ fontFamily: "var(--font-body)", color: C.textMid }}>No invoices yet. Open a client and create one from their detail page.</p>}
      </AdminShell>
    </RequireAdmin>
  );
}
const btnG = { textDecoration: "none", background: C.accent, color: "#fff", border: "none", padding: "9px 16px", borderRadius: 10, fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, cursor: "pointer" };
const btnD = { ...btnG, background: "transparent", color: "#DE350B", border: "1.5px solid #DE350B" };
