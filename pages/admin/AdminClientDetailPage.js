"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "../../components/admin/AdminShell";
import RequireAdmin from "../../components/admin/RequireAdmin";
import { C } from "../../constants";
import {
  LEAD_STATUSES, COMPANY, currency, formatDateTime, formatDate,
  getInvoices, getLeadById, saveInvoice, updateLead, getSettings,
} from "../../lib/crm";

const blankItem = { description: "", qty: 1, rate: "" };

export default function AdminClientDetailPage({ clientId }) {
  const router = useRouter();
  const [lead, setLead] = useState(() => getLeadById(clientId));
  const [notes, setNotes] = useState(() => getLeadById(clientId)?.notes || "");
  const [savedMessage, setSavedMessage] = useState("");
  const [previewInv, setPreviewInv] = useState(null);
  const settings = getSettings();

  const today = new Date().toISOString().split("T")[0];
  const [invoiceForm, setInvoiceForm] = useState({
    invoiceNumber: "",
    invoiceDate: today,
    notes: "",
    deposit: "",
    items: [{ ...blankItem }],
  });

  const refresh = () => { const l = getLeadById(clientId); setLead(l); setNotes(l?.notes || ""); };
  const flash = (msg) => { setSavedMessage(msg); setTimeout(() => setSavedMessage(""), 2000); };

  const clientInvoices = useMemo(() => getInvoices().filter((i) => i.clientId === clientId), [clientId, savedMessage]);

  const subtotal = invoiceForm.items.reduce((s, i) => s + Number(i.qty || 1) * Number(i.rate || 0), 0);
  const tax = subtotal * (settings.taxRate / 100);
  const total = subtotal + tax;
  const deposit = Number(invoiceForm.deposit || 0);

  if (!lead) return <RequireAdmin><AdminShell title="Client not found"><button onClick={() => router.push("/admin")} style={pill}>Back</button></AdminShell></RequireAdmin>;

  const createInvoice = () => {
    const inv = saveInvoice({
      clientId: lead.id,
      invoiceNumber: invoiceForm.invoiceNumber || undefined,
      invoiceDate: invoiceForm.invoiceDate,
      notes: invoiceForm.notes,
      items: invoiceForm.items,
      subtotal, tax, taxRate: settings.taxRate, total, deposit,
      client: { name: lead.name, address: lead.location || "", email: lead.email, phone: lead.phone },
    });
    setInvoiceForm({ invoiceNumber: "", invoiceDate: today, notes: "", deposit: "", items: [{ ...blankItem }] });
    flash("Invoice created!");
    refresh();
  };

  const downloadInvoice = (inv) => {
    const dep = Number(inv.deposit || 0);
    const owing = Number(inv.total || 0) - dep;
    const invDate = inv.invoiceDate || inv.createdAt;
    const w = window.open("", "", "width=900,height=800");
    w.document.write(`<!DOCTYPE html><html><head><title>Invoice #${inv.invoiceNumber}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1A1A1A;padding:0;font-size:14px;background:#fff}
.page{max-width:800px;margin:0 auto;padding:48px}
table{width:100%;border-collapse:collapse}
th{text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#8A8279;font-weight:700;padding:14px 10px;border-bottom:2px solid #C9A96E}
td{padding:14px 10px;border-bottom:1px solid #EDEBE6;vertical-align:top;font-size:13px}
.r{text-align:right}
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;padding-bottom:30px;border-bottom:3px solid #C9A96E}
.logo-area h2{font-size:22px;font-weight:800;letter-spacing:1px;margin-bottom:2px;color:#1A1A1A}
.logo-area .sub{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#C9A96E;font-weight:600;margin-bottom:12px}
.logo-area .info{font-size:12px;color:#6B6258;line-height:1.9}
.inv-title{text-align:right}
.inv-title h1{font-size:42px;font-weight:800;color:#C9A96E;letter-spacing:2px}
.inv-title .num{font-size:15px;font-weight:600;color:#6B6258;margin-top:4px}
.bill-section{display:flex;justify-content:space-between;margin-bottom:32px}
.bill-to .label{font-size:10px;font-weight:700;color:#C9A96E;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px}
.bill-to p{font-size:14px;line-height:1.8}
.date-info{text-align:right;font-size:13px;color:#6B6258}
.totals{display:flex;justify-content:flex-end;margin-top:28px}
.totals-box{width:300px}
.totals-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #EDEBE6;font-size:14px}
.totals-row.grand{border-bottom:3px solid #C9A96E;padding:14px 0}
.totals-row.grand span{font-size:20px;font-weight:800}
.totals-row.deposit span{color:#22A06B;font-weight:600}
.totals-row.owing span{font-weight:700}
.notes-box{margin-top:32px;padding:20px;background:#FDFCFA;border:1px solid #EDEBE6;border-radius:6px}
.notes-box .label{font-size:10px;font-weight:700;color:#C9A96E;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px}
.notes-box p{font-size:12px;color:#6B6258;line-height:1.7;white-space:pre-wrap}
.footer{margin-top:40px;padding-top:20px;border-top:1px solid #EDEBE6;text-align:center;font-size:11px;color:#9A9084}
@media print{body{padding:0}.page{padding:32px}}
</style></head><body><div class="page">
<div class="header">
  <div class="logo-area">
    <h2>STEADFAST</h2>
    <div class="sub">Renovation Inc</div>
    <div class="info">
      PHONE: ${COMPANY.phone}<br>
      EMAIL: ${COMPANY.email}<br>
      HST#: ${COMPANY.hst}
    </div>
  </div>
  <div class="inv-title">
    <h1>INVOICE</h1>
    <div class="num">Invoice #${inv.invoiceNumber}</div>
  </div>
</div>

<div class="bill-section">
  <div class="bill-to">
    <div class="label">Bill To</div>
    <p><strong>${inv.client?.name || "Client"}</strong><br>${inv.client?.address || ""}<br>Canada</p>
  </div>
  <div class="date-info">
    <strong>Invoice Date:</strong> ${formatDate(invDate)}
  </div>
</div>

<table>
  <thead><tr><th style="width:40px">#</th><th>Item Description</th><th style="width:50px" class="r">Qty</th><th style="width:100px" class="r">Rate</th><th style="width:90px" class="r">Tax</th><th style="width:110px" class="r">Amount</th></tr></thead>
  <tbody>
    ${(inv.items || []).map((item, i) => {
      const q = Number(item.qty || 1);
      const r = Number(item.rate || item.amount || 0);
      const a = q * r;
      const t = a * (inv.taxRate || 13) / 100;
      return `<tr>
        <td style="color:#9A9084">${i + 1}</td>
        <td>${item.description}</td>
        <td class="r">${q}</td>
        <td class="r">${currency(r)}</td>
        <td class="r" style="color:#6B6258;font-size:12px">${currency(t)}<br><span style="font-size:10px;color:#9A9084">${inv.taxRate || 13}%</span></td>
        <td class="r" style="font-weight:600">${currency(a)}</td>
      </tr>`;
    }).join("")}
  </tbody>
</table>

<div class="totals"><div class="totals-box">
  <div class="totals-row"><span style="color:#6B6258">Sub Total</span><span>${currency(inv.subtotal)}</span></div>
  <div class="totals-row"><span style="color:#6B6258">HST (${inv.taxRate || 13}%)</span><span>${currency(inv.tax)}</span></div>
  <div class="totals-row grand"><span>TOTAL</span><span>${currency(inv.total)}</span></div>
  ${dep > 0 ? `<div class="totals-row deposit"><span>Deposit</span><span>-${currency(dep)}</span></div>
  <div class="totals-row owing"><span>${owing <= 0 ? "PAID IN FULL" : "Balance Owing"}</span><span>${owing > 0 ? currency(owing) : ""}</span></div>` : ""}
</div></div>

${inv.notes ? `<div class="notes-box"><div class="label">Notes / Terms</div><p>${inv.notes}</p></div>` : ""}

<div class="footer">${COMPANY.name} &nbsp;|&nbsp; ${COMPANY.phone} &nbsp;|&nbsp; ${COMPANY.email} &nbsp;|&nbsp; HST# ${COMPANY.hst}</div>
</div></body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 300);
  };

  const InfoRow = ({ label, value }) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.borderLight}` }}>
      <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: C.textLight }}>{label}</span>
      <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: C.text, textAlign: "right", maxWidth: "60%" }}>{value || "—"}</span>
    </div>
  );

  return (
    <RequireAdmin>
      <AdminShell
        title={lead.name}
        subtitle={`Submitted ${formatDateTime(lead.createdAt)} · ${lead.phone} · ${lead.email}`}
        actions={<button onClick={() => router.push("/admin")} style={pill}>Back to dashboard</button>}
      >
        {savedMessage && <div style={{ background: "#E3FCEF", color: "#22A06B", padding: "10px 16px", borderRadius: 10, fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, marginBottom: 20 }}>{savedMessage}</div>}

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 20 }} className="admin-detail-grid">
          <div style={{ display: "grid", gap: 20 }}>
            {/* Lead Overview */}
            <section style={panel}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
                <div><h2 style={panelTitle}>Lead overview</h2><p style={panelDesc}>Everything the client submitted.</p></div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <select value={lead.status} onChange={(e) => { updateLead(lead.id, { status: e.target.value }); refresh(); }} style={selS}>{LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select>
                  <button onClick={() => { updateLead(lead.id, { archived: !lead.archived, status: lead.archived ? "contacted" : "closed" }); refresh(); }} style={pill}>{lead.archived ? "Restore" : "Archive"}</button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }} className="admin-mini-grid">
                <InfoRow label="Location" value={lead.location} />
                <InfoRow label="How found" value={lead.howFound} />
                <InfoRow label="Preferred contact" value={(lead.preferredContact || []).join(", ")} />
                <InfoRow label="Timeline" value={lead.timeline} />
                <InfoRow label="Budget" value={lead.budget} />
                <InfoRow label="Areas" value={(lead.areas || []).join(", ")} />
              </div>
              <div style={{ marginTop: 10 }}><InfoRow label="Services" value={(lead.services || []).join(", ")} /></div>
              <div style={{ marginTop: 10 }}>
                <p style={labS}>Project Details</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: C.text, lineHeight: 1.7, background: C.bg, padding: 14, borderRadius: 10 }}>{lead.message || "No details."}</p>
              </div>
            </section>

            {/* Notes */}
            <section style={panel}>
              <h2 style={panelTitle}>Internal notes</h2>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} style={{ ...inpS, marginTop: 10, resize: "vertical" }} />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                <button onClick={() => { updateLead(lead.id, { notes }); flash("Notes saved!"); refresh(); }} style={pill}>Save notes</button>
              </div>
            </section>

            {/* Invoice Builder */}
            <section style={panel}>
              <h2 style={panelTitle}>Build an invoice</h2>
              <p style={panelDesc}>Create a professional invoice for this client.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 14 }} className="admin-mini-grid">
                <div><label style={labS}>Invoice # (auto if blank)</label><input value={invoiceForm.invoiceNumber} onChange={(e) => setInvoiceForm({ ...invoiceForm, invoiceNumber: e.target.value })} style={inpS} placeholder="e.g. 1001" /></div>
                <div><label style={labS}>Invoice Date</label><input type="date" value={invoiceForm.invoiceDate} onChange={(e) => setInvoiceForm({ ...invoiceForm, invoiceDate: e.target.value })} style={inpS} /></div>
                <div><label style={labS}>Deposit (optional)</label><input value={invoiceForm.deposit} onChange={(e) => setInvoiceForm({ ...invoiceForm, deposit: e.target.value })} style={inpS} placeholder="0.00" type="number" /></div>
              </div>
              <div style={{ marginTop: 10 }}><label style={labS}>Notes / Terms</label><input value={invoiceForm.notes} onChange={(e) => setInvoiceForm({ ...invoiceForm, notes: e.target.value })} style={inpS} placeholder="Payment schedule, exclusions..." /></div>

              <div style={{ marginTop: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 70px 120px 40px", gap: 8, marginBottom: 8 }}>
                  <span style={labS}>Item Description</span><span style={labS}>Qty</span><span style={labS}>Rate</span><span></span>
                </div>
                {invoiceForm.items.map((item, idx) => (
                  <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 70px 120px 40px", gap: 8, marginBottom: 8 }}>
                    <input value={item.description} onChange={(e) => { const n = [...invoiceForm.items]; n[idx].description = e.target.value; setInvoiceForm({ ...invoiceForm, items: n }); }} style={inpS} placeholder="e.g. Kitchen - Cabinet installation" />
                    <input value={item.qty} onChange={(e) => { const n = [...invoiceForm.items]; n[idx].qty = e.target.value; setInvoiceForm({ ...invoiceForm, items: n }); }} style={inpS} type="number" min="1" />
                    <input value={item.rate} onChange={(e) => { const n = [...invoiceForm.items]; n[idx].rate = e.target.value; setInvoiceForm({ ...invoiceForm, items: n }); }} style={inpS} placeholder="0.00" type="number" />
                    <button onClick={() => { if (invoiceForm.items.length > 1) setInvoiceForm({ ...invoiceForm, items: invoiceForm.items.filter((_, i) => i !== idx) }); }} style={{ ...pill, background: "#fff", color: C.text, border: `1px solid ${C.border}`, padding: 8, justifyContent: "center" }}>×</button>
                  </div>
                ))}
              </div>
              <button onClick={() => setInvoiceForm({ ...invoiceForm, items: [...invoiceForm.items, { ...blankItem }] })} style={{ ...pill, background: "#fff", color: C.text, border: `1px solid ${C.border}`, marginBottom: 14 }}>+ Add line item</button>

              <div style={{ background: C.bg, borderRadius: 12, padding: 16, display: "grid", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: C.textMid }}>Subtotal</span><span style={{ fontFamily: "var(--font-body)", fontSize: 14 }}>{currency(subtotal)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: C.textMid }}>HST ({settings.taxRate}%)</span><span style={{ fontFamily: "var(--font-body)", fontSize: 14 }}>{currency(tax)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: `2px solid ${C.accent}`, paddingTop: 8, marginTop: 4 }}><span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>Total</span><span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>{currency(total)}</span></div>
                {deposit > 0 && <><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#22A06B", fontWeight: 600 }}>Deposit</span><span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#22A06B", fontWeight: 600 }}>-{currency(deposit)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700 }}>Balance Owing</span><span style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700 }}>{currency(total - deposit)}</span></div></>}
              </div>
              <button onClick={createInvoice} style={{ ...pill, marginTop: 16, width: "100%", justifyContent: "center", padding: "14px" }}>Create Invoice</button>
            </section>
          </div>

          {/* Right sidebar */}
          <div style={{ display: "grid", gap: 20, alignContent: "start" }}>
            <section style={panel}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 14 }}>Quick Actions</h3>
              <div style={{ display: "grid", gap: 8 }}>
                <a href={`tel:${lead.phone}`} style={anchorBtn}>Call {lead.phone}</a>
                <a href={`mailto:${lead.email}`} style={anchorBtn}>Email client</a>
                <a href={`sms:${lead.phone}`} style={{ ...anchorBtn, background: "#22A06B" }}>Text client</a>
              </div>
            </section>

            <section style={panel}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 14 }}>Saved Invoices</h3>
              {clientInvoices.length ? clientInvoices.map((inv) => (
                <div key={inv.id} style={{ padding: 14, borderRadius: 10, border: `1px solid ${C.borderLight}`, marginBottom: 8 }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: C.textLight, textTransform: "uppercase" }}>Invoice #{inv.invoiceNumber}</p>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: C.text, marginTop: 2 }}>{currency(inv.total)}</p>
                  {Number(inv.deposit || 0) > 0 && <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#5243AA" }}>Deposit: {currency(inv.deposit)}</p>}
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: C.textMid, marginTop: 4 }}>{formatDate(inv.invoiceDate || inv.createdAt)}</p>
                  <button onClick={() => downloadInvoice(inv)} style={{ ...pill, padding: "7px 14px", fontSize: 12, marginTop: 8 }}>Download / Print</button>
                </div>
              )) : <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: C.textMid }}>No invoices yet.</p>}
            </section>

            <section style={panel}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 14 }}>Client Summary</h3>
              <InfoRow label="Budget" value={lead.budget} />
              <InfoRow label="Timeline" value={lead.timeline} />
              <InfoRow label="Found via" value={lead.howFound} />
              <InfoRow label="Areas" value={(lead.areas || []).join(", ")} />
            </section>
          </div>
        </div>
      </AdminShell>
    </RequireAdmin>
  );
}

const panel = { background: "#fff", borderRadius: 16, padding: 24, border: `1px solid ${C.borderLight}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" };
const panelTitle = { fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 4 };
const panelDesc = { fontFamily: "var(--font-body)", fontSize: 13, color: C.textMid };
const inpS = { width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontFamily: "var(--font-body)", fontSize: 14, outline: "none", boxSizing: "border-box" };
const selS = { padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontFamily: "var(--font-body)", fontSize: 14, outline: "none" };
const pill = { background: C.accent, color: "#fff", border: "none", padding: "10px 16px", borderRadius: 10, fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" };
const anchorBtn = { ...pill, justifyContent: "center", textDecoration: "none", display: "flex" };
const labS = { fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, color: C.textMid, display: "block", marginBottom: 4, letterSpacing: 1, textTransform: "uppercase" };
