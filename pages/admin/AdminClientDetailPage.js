"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "../../components/admin/AdminShell";
import RequireAdmin from "../../components/admin/RequireAdmin";
import { C } from "../../constants";
import { BUDGET_OPTIONS, CONTACT_METHODS, LEAD_STATUSES, SERVICE_OPTIONS, AREA_OPTIONS, TIMELINE_OPTIONS, HOW_FOUND_OPTIONS, currency, formatDateTime, getInvoices, getLeadById, saveInvoice, updateLead } from "../../lib/crm";

const blankItem = { description: "", amount: "" };

export default function AdminClientDetailPage({ clientId }) {
  const router = useRouter();
  const [lead, setLead] = useState(() => getLeadById(clientId));
  const [notes, setNotes] = useState(() => getLeadById(clientId)?.notes || "");
  const [invoiceForm, setInvoiceForm] = useState(() => ({ invoiceNumber: `ST-${Date.now().toString().slice(-6)}`, notes: "", items: [{ ...blankItem }] }));
  const [savedMessage, setSavedMessage] = useState("");

  const refresh = () => {
    const nextLead = getLeadById(clientId);
    setLead(nextLead);
    setNotes(nextLead?.notes || "");
  };

  const clientInvoices = useMemo(() => getInvoices().filter((invoice) => invoice.clientId === clientId), [clientId]);
  const total = invoiceForm.items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  if (!lead) {
    return (
      <RequireAdmin>
        <AdminShell title="Client not found">
          <button onClick={() => router.push('/admin')} style={pillBtn}>Back to dashboard</button>
        </AdminShell>
      </RequireAdmin>
    );
  }

  const infoCard = (title, value) => (
    <div style={{ background: "#fff", borderRadius: 16, padding: 18, border: `1px solid ${C.borderLight}` }}>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.7, color: C.textLight, marginBottom: 8 }}>{title}</p>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: C.text, lineHeight: 1.6 }}>{value || '—'}</p>
    </div>
  );

  return (
    <RequireAdmin>
      <AdminShell
        title={lead.name}
        subtitle={`Submitted ${formatDateTime(lead.createdAt)} • ${lead.phone} • ${lead.email}`}
        actions={<button onClick={() => router.push('/admin')} style={pillBtn}>Back to dashboard</button>}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 20 }} className="admin-detail-grid">
          <div style={{ display: "grid", gap: 20 }}>
            <section style={panelStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
                <div>
                  <h2 style={panelTitle}>Lead overview</h2>
                  <p style={panelDesc}>Everything the client submitted through the website form.</p>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <select value={lead.status} onChange={(e) => { updateLead(lead.id, { status: e.target.value }); refresh(); }} style={selectStyle}>
                    {LEAD_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                  <button onClick={() => { updateLead(lead.id, { archived: !lead.archived, status: lead.archived ? 'contacted' : 'closed' }); refresh(); }} style={pillBtn}>{lead.archived ? 'Restore' : 'Archive / Close'}</button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 14 }} className="admin-mini-grid">
                {infoCard('Location', lead.location)}
                {infoCard('How they found you', lead.howFound)}
                {infoCard('Preferred contact', (lead.preferredContact || []).join(', '))}
                {infoCard('Target start', lead.timeline)}
                {infoCard('Budget', lead.budget)}
                {infoCard('Project type', (lead.areas || []).join(', '))}
              </div>

              <div style={{ marginTop: 14 }}>{infoCard('Services requested', (lead.services || []).join(', '))}</div>
              <div style={{ marginTop: 14 }}>{infoCard('Project details', lead.message)}</div>
            </section>

            <section style={panelStyle}>
              <h2 style={panelTitle}>Internal notes</h2>
              <p style={panelDesc}>Keep callbacks, measurements, quote notes, and next actions here.</p>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={7} style={{ ...inputStyle, marginTop: 14, resize: 'vertical' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginTop: 12, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: C.textLight }}>{savedMessage}</span>
                <button onClick={() => { updateLead(lead.id, { notes }); setSavedMessage('Notes saved.'); setTimeout(() => setSavedMessage(''), 1800); refresh(); }} style={pillBtn}>Save notes</button>
              </div>
            </section>

            <section style={panelStyle}>
              <h2 style={panelTitle}>Build an invoice</h2>
              <p style={panelDesc}>Create a draft invoice for this client and keep it stored in the admin portal.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="admin-mini-grid">
                <label style={labelStyle}>Invoice number<input value={invoiceForm.invoiceNumber} onChange={(e) => setInvoiceForm({ ...invoiceForm, invoiceNumber: e.target.value })} style={inputStyle} /></label>
                <label style={labelStyle}>Notes<input value={invoiceForm.notes} onChange={(e) => setInvoiceForm({ ...invoiceForm, notes: e.target.value })} style={inputStyle} placeholder="Deposit terms, exclusions, etc." /></label>
              </div>
              <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
                {invoiceForm.items.map((item, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 180px auto', gap: 10 }} className="invoice-item-row">
                    <input value={item.description} onChange={(e) => {
                      const next = [...invoiceForm.items];
                      next[index].description = e.target.value;
                      setInvoiceForm({ ...invoiceForm, items: next });
                    }} style={inputStyle} placeholder="Line item description" />
                    <input value={item.amount} onChange={(e) => {
                      const next = [...invoiceForm.items];
                      next[index].amount = e.target.value;
                      setInvoiceForm({ ...invoiceForm, items: next });
                    }} style={inputStyle} placeholder="Amount" type="number" />
                    <button onClick={() => setInvoiceForm({ ...invoiceForm, items: invoiceForm.items.filter((_, i) => i !== index) || [{ ...blankItem }] })} style={{ ...pillBtn, background: '#fff', color: C.text, border: `1px solid ${C.border}` }}>Remove</button>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, gap: 12, flexWrap: 'wrap' }}>
                <button onClick={() => setInvoiceForm({ ...invoiceForm, items: [...invoiceForm.items, { ...blankItem }] })} style={{ ...pillBtn, background: '#fff', color: C.text, border: `1px solid ${C.border}` }}>Add line item</button>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: C.text }}>Total {currency(total)}</div>
              </div>
              <button onClick={() => {
                saveInvoice({ clientId: lead.id, invoiceNumber: invoiceForm.invoiceNumber, notes: invoiceForm.notes, items: invoiceForm.items, total });
                setInvoiceForm({ invoiceNumber: `ST-${Date.now().toString().slice(-6)}`, notes: '', items: [{ ...blankItem }] });
                setSavedMessage('Invoice saved.');
                setTimeout(() => setSavedMessage(''), 1800);
                refresh();
              }} style={{ ...pillBtn, marginTop: 16 }}>Save invoice</button>
            </section>
          </div>

          <div style={{ display: 'grid', gap: 20 }}>
            <section style={panelStyle}>
              <h2 style={panelTitle}>Quick actions</h2>
              <div style={{ display: 'grid', gap: 12, marginTop: 14 }}>
                <a href={`tel:${lead.phone}`} style={pillAnchor}>Call {lead.phone}</a>
                <a href={`mailto:${lead.email}`} style={pillAnchor}>Email {lead.email}</a>
                <a href={`sms:${lead.phone}`} style={pillAnchor}>Text {lead.phone}</a>
              </div>
            </section>

            <section style={panelStyle}>
              <h2 style={panelTitle}>Client summary</h2>
              <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
                <SummaryRow label="Areas" value={(lead.areas || []).join(', ')} />
                <SummaryRow label="Services" value={(lead.services || []).join(', ')} />
                <SummaryRow label="Timeline" value={lead.timeline} />
                <SummaryRow label="Budget" value={lead.budget} />
                <SummaryRow label="Found you via" value={lead.howFound} />
              </div>
            </section>

            <section style={panelStyle}>
              <h2 style={panelTitle}>Saved invoices</h2>
              <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
                {clientInvoices.length ? clientInvoices.map((invoice) => (
                  <div key={invoice.id} style={{ padding: 14, borderRadius: 12, border: `1px solid ${C.borderLight}`, background: C.bg }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, letterSpacing: 1.6, textTransform: 'uppercase', color: C.textLight }}>{invoice.invoiceNumber}</p>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: C.text, marginTop: 4 }}>{currency(invoice.total)}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: C.textMid, marginTop: 6 }}>{formatDateTime(invoice.createdAt)}</p>
                  </div>
                )) : <p style={{ fontFamily: 'var(--font-body)', color: C.textMid }}>No invoices saved yet.</p>}
              </div>
            </section>
          </div>
        </div>
      </AdminShell>
    </RequireAdmin>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: 10 }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: C.textLight }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: C.text, textAlign: 'right' }}>{value || '—'}</span>
    </div>
  );
}

const panelStyle = { background: '#fff', borderRadius: 18, padding: 22, border: `1px solid ${C.borderLight}`, boxShadow: '0 10px 30px rgba(22, 22, 22, 0.04)' };
const panelTitle = { fontFamily: 'var(--font-display)', fontSize: 26, color: C.text, marginBottom: 6 };
const panelDesc = { fontFamily: 'var(--font-body)', fontSize: 14, color: C.textMid };
const inputStyle = { width: '100%', marginTop: 6, padding: '12px 14px', borderRadius: 12, border: `1px solid ${C.border}`, fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', background: '#fff' };
const selectStyle = { padding: '12px 14px', borderRadius: 999, border: `1px solid ${C.border}`, fontFamily: 'var(--font-body)', fontSize: 14, background: '#fff', outline: 'none' };
const pillBtn = { background: C.accent, color: '#fff', border: 'none', padding: '11px 16px', borderRadius: 999, fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, cursor: 'pointer', textDecoration: 'none' };
const pillAnchor = { display: 'inline-flex', justifyContent: 'center', textDecoration: 'none', background: C.accent, color: '#fff', borderRadius: 999, padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700 };
const labelStyle = { fontFamily: 'var(--font-body)', fontSize: 13, color: C.textMid };
