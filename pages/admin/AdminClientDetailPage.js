"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "../../components/admin/AdminShell";
import RequireAdmin from "../../components/admin/RequireAdmin";
import { C } from "../../constants";
import { LOGO_BASE64 } from "../../lib/logo";
import {
  LEAD_STATUSES, COMPANY, currency, formatDateTime, formatDate,
  getInvoices, getLeadById, saveInvoice, updateLead, addPayment,
  getClientBalance, getSettings, updateInvoice,
} from "../../lib/crm";

export default function AdminClientDetailPage({ clientId }) {
  const router = useRouter();
  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState("");
  const [allInvoices, setAllInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedMsg, setSavedMsg] = useState("");
  const [payForm, setPayForm] = useState({ amount: "", type: "payment", note: "" });
  const [editingInv, setEditingInv] = useState(null);
  const settings = getSettings();

  const today = new Date().toISOString().split("T")[0];
  const [invForm, setInvForm] = useState({
    invoiceNumber: "", invoiceDate: today,
    notes: "", deposit: "",
    items: [{ description: "", qty: 1, rate: "" }],
  });

  useEffect(() => {
    async function load() {
      const l = await getLeadById(clientId);
      const invs = await getInvoices();
      setLead(l); setNotes(l?.notes || ""); setAllInvoices(invs); setLoading(false);
    }
    load();
  }, [clientId]);

  const refresh = async () => {
    const l = await getLeadById(clientId);
    const invs = await getInvoices();
    setLead(l); setNotes(l?.notes || ""); setAllInvoices(invs);
  };

  const clientInvoices = useMemo(() => allInvoices.filter((i) => i.clientId === clientId), [allInvoices, clientId]);
  const balance = lead ? getClientBalance(lead, allInvoices) : { totalInvoiced: 0, totalPaid: 0, balance: 0, paid: false };
  const subtotal = invForm.items.reduce((s, i) => s + Number(i.qty || 1) * Number(i.rate || 0), 0);
  const tax = subtotal * (settings.taxRate / 100);
  const deposit = Number(invForm.deposit || 0);
  const invTotal = subtotal + tax;

  if (loading) return <RequireAdmin><AdminShell title="Loading..."><p>Loading client...</p></AdminShell></RequireAdmin>;
  if (!lead) return <RequireAdmin><AdminShell title="Client not found"><button onClick={() => router.push("/admin")} style={btn}>Back</button></AdminShell></RequireAdmin>;

  const flash = (msg) => { setSavedMsg(msg); setTimeout(() => setSavedMsg(""), 2000); };

  const resetForm = () => {
    setInvForm({ invoiceNumber: "", invoiceDate: today, notes: "", deposit: "", items: [{ description: "", qty: 1, rate: "" }] });
    setEditingInv(null);
  };

  const startEdit = (inv) => {
    setEditingInv(inv.id);
    setInvForm({
      invoiceNumber: inv.invoiceNumber || "",
      invoiceDate: inv.invoiceDate ? inv.invoiceDate.split("T")[0] : today,
      notes: inv.notes || "",
      deposit: inv.deposit || "",
      items: (inv.items || []).map((it) => ({ description: it.description || "", qty: it.qty || 1, rate: it.rate || it.amount || "" })),
    });
    // Scroll to builder
    document.getElementById("invoice-builder")?.scrollIntoView({ behavior: "smooth" });
  };

  const createOrUpdateInvoice = async () => {
    if (editingInv) {
      // Update existing
      await updateInvoice(editingInv, {
        invoice_number: Number(invForm.invoiceNumber) || undefined,
        invoice_date: invForm.invoiceDate,
        notes: invForm.notes,
        items: invForm.items,
        subtotal, tax, tax_rate: settings.taxRate, total: invTotal,
        deposit,
        client_data: { name: lead.name, address: lead.location || "", email: lead.email, phone: lead.phone },
      });
      flash("Invoice updated!");
    } else {
      // Create new
      await saveInvoice({
        clientId: lead.id,
        invoiceNumber: invForm.invoiceNumber || undefined,
        invoiceDate: invForm.invoiceDate,
        notes: invForm.notes,
        items: invForm.items,
        subtotal, tax, taxRate: settings.taxRate, total: invTotal, deposit,
        client: { name: lead.name, address: lead.location || "", email: lead.email, phone: lead.phone },
      });
      flash("Invoice created!");
    }
    resetForm();
    await refresh();
  };

  const recordPayment = async () => {
    if (!payForm.amount) return;
    await addPayment(clientId, { amount: Number(payForm.amount), type: payForm.type, note: payForm.note });
    setPayForm({ amount: "", type: "payment", note: "" });
    flash(payForm.type === "deposit" ? "Deposit recorded!" : "Payment recorded!");
    await refresh();
  };

  const downloadInvoice = (inv) => {
    const dep = Number(inv.deposit || 0);
    const totalPaidOnInv = (inv.payments || []).reduce((s, p) => s + Number(p.amount || 0), 0);
    const owing = Number(inv.total || 0) - dep - totalPaidOnInv;
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
.logo-area{display:flex;align-items:center;gap:16px}
.logo-area img{width:80px;height:80px;object-fit:contain;border-radius:8px}
.logo-text h2{font-size:22px;font-weight:800;letter-spacing:1px;margin-bottom:2px;color:#1A1A1A}
.logo-text .sub{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#C9A96E;font-weight:600;margin-bottom:10px}
.logo-text .info{font-size:12px;color:#6B6258;line-height:1.9}
.inv-title{text-align:right}
.inv-title h1{font-size:42px;font-weight:800;color:#C9A96E;letter-spacing:2px}
.inv-title .num{font-size:15px;font-weight:600;color:#6B6258;margin-top:4px}
.bill-section{display:flex;justify-content:space-between;margin-bottom:32px}
.bill-to .label{font-size:10px;font-weight:700;color:#C9A96E;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px}
.bill-to p{font-size:14px;line-height:1.8}
.date-info{text-align:right;font-size:13px;color:#6B6258}
.totals{display:flex;justify-content:flex-end;margin-top:28px}
.totals-box{width:300px}
.t-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #EDEBE6;font-size:14px}
.t-row.grand{border-bottom:3px solid #C9A96E;padding:14px 0}
.t-row.grand span{font-size:20px;font-weight:800}
.t-row.green span{color:#22A06B;font-weight:600}
.t-row.bold span{font-weight:700}
.notes-box{margin-top:32px;padding:20px;background:#FDFCFA;border:1px solid #EDEBE6;border-radius:6px}
.notes-box .label{font-size:10px;font-weight:700;color:#C9A96E;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px}
.notes-box p{font-size:12px;color:#6B6258;line-height:1.7;white-space:pre-wrap}
.footer{margin-top:40px;padding-top:20px;border-top:1px solid #EDEBE6;text-align:center;font-size:11px;color:#9A9084}
@media print{body{padding:0}.page{padding:32px}}
</style></head><body><div class="page">

<div class="header">
  <div class="logo-area">
    <img src="${LOGO_BASE64}" alt="Steadfast Renovation" />
    <div class="logo-text">
      <h2>STEADFAST</h2>
      <div class="sub">Renovation Inc</div>
      <div class="info">PHONE: ${COMPANY.phone}<br>EMAIL: ${COMPANY.email}<br>HST#: ${COMPANY.hst}</div>
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
  <div class="date-info"><strong>Invoice Date:</strong> ${formatDate(invDate)}</div>
</div>

<table>
  <thead><tr><th style="width:40px">#</th><th>Item Description</th><th style="width:50px" class="r">Qty</th><th style="width:100px" class="r">Rate</th><th style="width:90px" class="r">Tax</th><th style="width:110px" class="r">Amount</th></tr></thead>
  <tbody>${(inv.items || []).map((item, i) => {
    const q = Number(item.qty || 1), r = Number(item.rate || item.amount || 0), a = q * r, t = a * (inv.taxRate || 13) / 100;
    return `<tr><td style="color:#9A9084">${i+1}</td><td>${item.description}</td><td class="r">${q}</td><td class="r">${currency(r)}</td><td class="r" style="color:#6B6258;font-size:12px">${currency(t)}<br><span style="font-size:10px;color:#9A9084">${inv.taxRate||13}%</span></td><td class="r" style="font-weight:600">${currency(a)}</td></tr>`;
  }).join("")}</tbody>
</table>

<div class="totals"><div class="totals-box">
  <div class="t-row"><span style="color:#6B6258">Sub Total</span><span>${currency(inv.subtotal)}</span></div>
  <div class="t-row"><span style="color:#6B6258">HST (${inv.taxRate||13}%)</span><span>${currency(inv.tax)}</span></div>
  <div class="t-row grand"><span>TOTAL</span><span>${currency(inv.total)}</span></div>
  ${dep > 0 ? `<div class="t-row green"><span>Deposit</span><span>-${currency(dep)}</span></div>` : ""}
  ${totalPaidOnInv > 0 ? `<div class="t-row green"><span>Payments</span><span>-${currency(totalPaidOnInv)}</span></div>` : ""}
  ${(dep > 0 || totalPaidOnInv > 0) ? `<div class="t-row bold"><span style="color:${owing<=0?'#22A06B':'#DE350B'}">${owing<=0?'PAID IN FULL':'Balance Owing'}</span><span>${owing>0?currency(owing):''}</span></div>` : ""}
</div></div>

${inv.notes ? `<div class="notes-box"><div class="label">Notes / Terms</div><p>${inv.notes}</p></div>` : ""}
<div class="footer">${COMPANY.name} &nbsp;|&nbsp; ${COMPANY.phone} &nbsp;|&nbsp; ${COMPANY.email} &nbsp;|&nbsp; HST# ${COMPANY.hst}</div>

</div></body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 300);
  };

  const InfoRow = ({ label, value }) => <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.borderLight}` }}><span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: C.textLight }}>{label}</span><span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: C.text, textAlign: "right", maxWidth: "60%" }}>{value || "—"}</span></div>;

  return (
    <RequireAdmin>
      <AdminShell title={lead.name} subtitle={`Submitted ${formatDateTime(lead.createdAt)} · ${lead.phone} · ${lead.email}`} actions={<button onClick={() => router.push("/admin")} style={btn}>Back to dashboard</button>}>
        {savedMsg && <div style={{ background: "#E3FCEF", color: "#22A06B", padding: "10px 16px", borderRadius: 10, fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, marginBottom: 20 }}>{savedMsg}</div>}

        {/* Balance Banner */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }} className="admin-stats">
          <div style={statCard}><p style={statLabel}>Total Invoiced</p><p style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: C.text }}>{currency(balance.totalInvoiced)}</p></div>
          <div style={statCard}><p style={statLabel}>Total Paid</p><p style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "#22A06B" }}>{currency(balance.totalPaid)}</p></div>
          <div style={statCard}><p style={statLabel}>Balance Owing</p><p style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: balance.balance > 0 ? "#DE350B" : "#22A06B" }}>{balance.balance > 0 ? currency(balance.balance) : "$0.00"}</p></div>
          <div style={statCard}><p style={statLabel}>Status</p><p style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: balance.paid ? "#22A06B" : "#FF8B00" }}>{balance.paid ? "PAID" : balance.totalInvoiced > 0 ? "OWING" : "NO INVOICE"}</p></div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 20 }} className="admin-detail-grid">
          <div style={{ display: "grid", gap: 20 }}>
            {/* Lead Overview */}
            <section style={panel}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
                <div><h2 style={panelTitle}>Lead overview</h2><p style={panelDesc}>Everything the client submitted.</p></div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <select value={lead.status} onChange={async (e) => { await updateLead(lead.id, { status: e.target.value }); refresh(); }} style={selectS}>{LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select>
                  <button onClick={async () => { await updateLead(lead.id, { archived: !lead.archived, status: lead.archived ? "contacted" : "closed" }); refresh(); }} style={btn}>{lead.archived ? "Restore" : "Archive"}</button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="admin-mini-grid">
                <InfoRow label="Location" value={lead.location} /><InfoRow label="How found" value={lead.howFound} />
                <InfoRow label="Preferred contact" value={(lead.preferredContact || []).join(", ")} /><InfoRow label="Timeline" value={lead.timeline} />
                <InfoRow label="Budget" value={lead.budget} /><InfoRow label="Areas" value={(lead.areas || []).join(", ")} />
              </div>
              <div style={{ marginTop: 14 }}><InfoRow label="Services" value={(lead.services || []).join(", ")} /></div>
              <div style={{ marginTop: 14 }}><p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: C.textLight, marginBottom: 6 }}>Project details</p><p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: C.text, lineHeight: 1.7, background: C.bg, padding: 14, borderRadius: 10 }}>{lead.message || "No details."}</p></div>
            </section>

            {/* Notes */}
            <section style={panel}>
              <h2 style={panelTitle}>Internal notes</h2>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} style={{ ...inputS, marginTop: 10, resize: "vertical" }} />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                <button onClick={async () => { await updateLead(lead.id, { notes }); flash("Notes saved!"); }} style={btn}>Save notes</button>
              </div>
            </section>

            {/* Record Payment / Deposit */}
            <section style={panel}>
              <h2 style={panelTitle}>Record Payment / Deposit</h2>
              <p style={panelDesc}>Log a deposit or payment the client has made.</p>
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr auto", gap: 10, marginTop: 14 }} className="admin-mini-grid">
                <select value={payForm.type} onChange={(e) => setPayForm({ ...payForm, type: e.target.value })} style={inputS}><option value="payment">Payment</option><option value="deposit">Deposit</option></select>
                <input value={payForm.amount} onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })} style={inputS} placeholder="Amount" type="number" />
                <input value={payForm.note} onChange={(e) => setPayForm({ ...payForm, note: e.target.value })} style={inputS} placeholder="Note (optional)" />
                <button onClick={recordPayment} style={btn}>Record</button>
              </div>
              {(lead.payments || []).length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: C.textLight, marginBottom: 8 }}>Payment History</p>
                  {lead.payments.map((p, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.borderLight}` }}>
                      <div><span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: p.type === "deposit" ? "#5243AA" : "#22A06B", textTransform: "capitalize" }}>{p.type}</span>{p.note && <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: C.textLight, marginLeft: 8 }}>— {p.note}</span>}</div>
                      <div><span style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: "#22A06B" }}>{currency(p.amount)}</span><span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: C.textLight, marginLeft: 8 }}>{formatDate(p.date)}</span></div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Invoice Builder */}
            <section style={{ ...panel, border: editingInv ? `2px solid ${C.accent}` : `1px solid ${C.borderLight}` }} id="invoice-builder">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <h2 style={panelTitle}>{editingInv ? "Edit Invoice" : "Build an invoice"}</h2>
                {editingInv && <button onClick={resetForm} style={{ ...btn, background: "transparent", color: C.text, border: `1px solid ${C.border}` }}>Cancel edit</button>}
              </div>
              <p style={panelDesc}>{editingInv ? "Editing an existing invoice. Save when done." : "Create a professional invoice for this client."}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14, marginTop: 14 }} className="admin-mini-grid">
                <div><label style={labelS}>Invoice # (auto if blank)</label><input value={invForm.invoiceNumber} onChange={(e) => setInvForm({ ...invForm, invoiceNumber: e.target.value })} style={inputS} placeholder="e.g. 1001" /></div>
                <div><label style={labelS}>Invoice Date</label><input type="date" value={invForm.invoiceDate} onChange={(e) => setInvForm({ ...invForm, invoiceDate: e.target.value })} style={inputS} /></div>
                <div><label style={labelS}>Deposit (optional)</label><input value={invForm.deposit} onChange={(e) => setInvForm({ ...invForm, deposit: e.target.value })} style={inputS} placeholder="0.00" type="number" /></div>
                <div><label style={labelS}>Notes / Terms</label><input value={invForm.notes} onChange={(e) => setInvForm({ ...invForm, notes: e.target.value })} style={inputS} placeholder="Payment schedule..." /></div>
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 70px 120px 40px", gap: 8, marginBottom: 8 }}>
                  <span style={labelS}>Item Description</span><span style={labelS}>Qty</span><span style={labelS}>Rate</span><span></span>
                </div>
                {invForm.items.map((item, idx) => (
                  <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 70px 120px 40px", gap: 8, marginBottom: 8 }}>
                    <input value={item.description} onChange={(e) => { const n = [...invForm.items]; n[idx].description = e.target.value; setInvForm({ ...invForm, items: n }); }} style={inputS} placeholder="e.g. Kitchen - Cabinet installation" />
                    <input value={item.qty} onChange={(e) => { const n = [...invForm.items]; n[idx].qty = e.target.value; setInvForm({ ...invForm, items: n }); }} style={inputS} type="number" min="1" />
                    <input value={item.rate} onChange={(e) => { const n = [...invForm.items]; n[idx].rate = e.target.value; setInvForm({ ...invForm, items: n }); }} style={inputS} placeholder="0.00" type="number" />
                    <button onClick={() => { if (invForm.items.length > 1) setInvForm({ ...invForm, items: invForm.items.filter((_, i) => i !== idx) }); }} style={{ ...btn, background: "transparent", color: C.text, border: `1px solid ${C.border}`, padding: 8, justifyContent: "center" }}>×</button>
                  </div>
                ))}
              </div>
              <button onClick={() => setInvForm({ ...invForm, items: [...invForm.items, { description: "", qty: 1, rate: "" }] })} style={{ ...btn, background: "transparent", color: C.text, border: `1px solid ${C.border}`, marginBottom: 14 }}>+ Add line item</button>
              <div style={{ background: C.bg, borderRadius: 12, padding: 16, display: "grid", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: C.textMid }}>Subtotal</span><span style={{ fontFamily: "var(--font-body)", fontSize: 14 }}>{currency(subtotal)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: C.textMid }}>HST ({settings.taxRate}%)</span><span style={{ fontFamily: "var(--font-body)", fontSize: 14 }}>{currency(tax)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: `2px solid ${C.accent}`, paddingTop: 8, marginTop: 4 }}><span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>Total</span><span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>{currency(invTotal)}</span></div>
                {deposit > 0 && <><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#22A06B", fontWeight: 600 }}>Deposit</span><span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#22A06B", fontWeight: 600 }}>-{currency(deposit)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700 }}>Balance Owing</span><span style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700 }}>{currency(invTotal - deposit)}</span></div></>}
              </div>
              <button onClick={createOrUpdateInvoice} style={{ ...btn, marginTop: 16, width: "100%", justifyContent: "center", padding: "14px" }}>{editingInv ? "Save Changes" : "Create Invoice"}</button>
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
                <div key={inv.id} style={{ padding: 14, borderRadius: 10, border: `1px solid ${C.borderLight}`, marginBottom: 10 }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: C.textLight, textTransform: "uppercase" }}>Invoice #{inv.invoiceNumber}</p>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: C.text, marginTop: 2 }}>{currency(inv.total)}</p>
                  {Number(inv.deposit || 0) > 0 && <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#5243AA" }}>Deposit: {currency(inv.deposit)}</p>}
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: C.textMid, marginTop: 4 }}>{formatDate(inv.invoiceDate || inv.createdAt)}</p>
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <button onClick={() => downloadInvoice(inv)} style={{ ...btn, padding: "7px 12px", fontSize: 12 }}>Download</button>
                    <button onClick={() => startEdit(inv)} style={{ ...btn, padding: "7px 12px", fontSize: 12, background: "transparent", color: C.text, border: `1px solid ${C.border}` }}>Edit</button>
                  </div>
                </div>
              )) : <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: C.textMid }}>No invoices yet.</p>}
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
const statCard = { background: "#fff", borderRadius: 16, padding: 20, border: `1px solid ${C.borderLight}` };
const statLabel = { fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: C.textLight, marginBottom: 8 };
const inputS = { width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontFamily: "var(--font-body)", fontSize: 14, outline: "none", boxSizing: "border-box" };
const selectS = { padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontFamily: "var(--font-body)", fontSize: 14, outline: "none" };
const btn = { background: C.accent, color: "#fff", border: "none", padding: "10px 16px", borderRadius: 10, fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" };
const anchorBtn = { ...btn, justifyContent: "center", textDecoration: "none", display: "flex" };
const labelS = { fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, color: C.textMid, display: "block", marginBottom: 4, letterSpacing: 1, textTransform: "uppercase" };
