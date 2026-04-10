"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "../../components/admin/AdminShell";
import RequireAdmin from "../../components/admin/RequireAdmin";
import { C } from "../../constants";
import { COMPANY, currency, deleteInvoice, formatDate, getInvoices, getLeadById } from "../../lib/crm";

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const invs = await getInvoices();
      setInvoices(invs);
      setLoading(false);
    }
    load();
  }, []);

  const refresh = async () => setInvoices(await getInvoices());

  const downloadInvoice = (inv) => {
    const dep = Number(inv.deposit || 0);
    const w = window.open("", "", "width=900,height=700");
    w.document.write(`<!DOCTYPE html><html><head><title>Invoice #${inv.invoiceNumber}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Helvetica Neue',Helvetica,sans-serif;color:#1A1A1A;padding:48px;font-size:14px}table{width:100%;border-collapse:collapse}th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#8A8279;font-weight:600;padding:12px 8px;border-bottom:2px solid #E2DDD5}td{padding:14px 8px;border-bottom:1px solid #EDEBE6;vertical-align:top}.r{text-align:right}@media print{body{padding:24px}}</style></head><body>
<div style="display:flex;justify-content:space-between;margin-bottom:40px">
<div><h2 style="font-size:24px;font-weight:800;margin-bottom:12px">${COMPANY.name}</h2><p style="font-size:13px;color:#6B6258;line-height:1.8">PHONE: ${COMPANY.phone}<br>EMAIL: ${COMPANY.email}<br>HST#: ${COMPANY.hst}</p></div>
<div style="text-align:right"><h1 style="font-size:36px;font-weight:800;margin-bottom:4px">INVOICE</h1><p style="font-size:16px;font-weight:600;color:#6B6258">Invoice# ${inv.invoiceNumber}</p></div></div>
<div style="display:flex;justify-content:space-between;margin-bottom:36px"><div><p style="font-size:12px;font-weight:700;color:#9A9084;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px">Bill To:</p><p style="font-size:15px;line-height:1.7">${inv.client?.name || "Client"}<br>${inv.client?.address || ""}<br>Canada</p></div><div style="text-align:right"><p style="font-size:14px;color:#C9A96E;font-weight:600">Invoice Date: ${formatDate(inv.createdAt)}</p></div></div>
<table><thead><tr><th style="width:40px">#</th><th>Item Description</th><th style="width:50px" class="r">Qty</th><th style="width:100px" class="r">Rate</th><th style="width:100px" class="r">Tax</th><th style="width:120px" class="r">Amount</th></tr></thead><tbody>
${(inv.items || []).map((item, i) => { const q = Number(item.qty || 1); const r = Number(item.rate || item.amount || 0); const a = q * r; const t = a * (inv.taxRate || 13) / 100; return `<tr><td style="color:#9A9084">${i + 1}</td><td>${item.description}</td><td class="r">${q}</td><td class="r">${currency(r)}</td><td class="r" style="color:#6B6258">${currency(t)}<br><span style="font-size:11px;color:#9A9084">${inv.taxRate || 13}</span></td><td class="r" style="font-weight:600">${currency(a)}</td></tr>`; }).join("")}
</tbody></table>
<div style="display:flex;justify-content:flex-end;margin-top:28px"><div style="width:300px">
<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #EDEBE6"><span style="color:#6B6258">Sub Total</span><span>${currency(inv.subtotal)}</span></div>
<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #EDEBE6"><span style="color:#6B6258">Tax (${inv.taxRate || 13}%)</span><span>${currency(inv.tax)}</span></div>
<div style="display:flex;justify-content:space-between;padding:14px 0;border-bottom:1px solid #EDEBE6"><span style="font-size:20px;font-weight:800">TOTAL</span><span style="font-size:20px;font-weight:800">${currency(inv.total)}</span></div>
${dep > 0 ? `<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #EDEBE6"><span style="color:#22A06B;font-weight:600">Deposit</span><span style="color:#22A06B;font-weight:600">-${currency(dep)}</span></div><div style="display:flex;justify-content:space-between;padding:12px 0"><span style="font-size:16px;font-weight:700">Balance Owing</span><span style="font-size:16px;font-weight:700">${currency(Number(inv.total) - dep)}</span></div>` : ""}
</div></div>
${inv.notes ? `<div style="margin-top:28px;padding:18px;background:#F7F5F0;border-radius:10px"><p style="font-size:12px;font-weight:700;color:#9A9084;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px">Notes / Terms</p><p style="font-size:13px;color:#6B6258;line-height:1.6;white-space:pre-wrap">${inv.notes}</p></div>` : ""}
</body></html>`);
    w.document.close();
    w.print();
  };

  if (loading) return <RequireAdmin><AdminShell title="Invoices"><p style={{ fontFamily: "var(--font-body)", color: C.textMid }}>Loading...</p></AdminShell></RequireAdmin>;

  return (
    <RequireAdmin>
      <AdminShell title="Invoices" subtitle="All invoices created from client profiles.">
        {invoices.length ? (
          <div style={{ display: "grid", gap: 12 }}>
            {invoices.map((inv) => {
              const dep = Number(inv.deposit || 0);
              const owing = Number(inv.total || 0) - dep;
              return (
                <div key={inv.id} style={{ background: "#fff", borderRadius: 16, padding: 22, border: `1px solid ${C.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: C.textLight, textTransform: "uppercase" }}>Invoice #{inv.invoiceNumber}</p>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: C.text, marginTop: 4 }}>{inv.client?.name || "Client"}</h3>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: C.textMid, marginTop: 4 }}>
                      Total: {currency(inv.total)}
                      {dep > 0 && <span style={{ color: "#22A06B", marginLeft: 8 }}>Deposit: {currency(dep)}</span>}
                      {dep > 0 && <span style={{ color: "#DE350B", marginLeft: 8 }}>Owing: {currency(owing)}</span>}
                      <span style={{ marginLeft: 8 }}>· {formatDate(inv.createdAt)}</span>
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button onClick={() => downloadInvoice(inv)} style={btnG}>Download / Print</button>
                    <Link href={`/admin/clients/${inv.clientId}`} style={btnG}>Open Client</Link>
                    <button onClick={async () => { await deleteInvoice(inv.id); refresh(); }} style={btnD}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : <p style={{ fontFamily: "var(--font-body)", color: C.textMid }}>No invoices yet. Open a client and create one from their detail page.</p>}
      </AdminShell>
    </RequireAdmin>
  );
}

const btnG = { textDecoration: "none", background: C.accent, color: "#fff", border: "none", padding: "9px 16px", borderRadius: 10, fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 };
const btnD = { ...btnG, background: "transparent", color: "#DE350B", border: "1.5px solid #DE350B" };
