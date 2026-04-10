"use client";

import { useRef } from "react";
import { C } from "../../constants";
import { COMPANY, currency, formatDate } from "../../lib/crm";

export default function InvoicePreview({ invoice, onClose }) {
  const printRef = useRef();

  const handlePrint = () => {
    const w = window.open("", "", "width=900,height=700");
    w.document.write(`
      <html><head><title>Invoice #${invoice.invoiceNumber}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1A1A; padding: 48px; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #8A8279; font-weight: 600; padding: 12px 8px; border-bottom: 2px solid #E2DDD5; }
        td { padding: 14px 8px; border-bottom: 1px solid #EDEBE6; font-size: 14px; vertical-align: top; }
        .right { text-align: right; }
        .total-row td { border-bottom: none; }
        @media print { body { padding: 24px; } }
      </style></head><body>${printRef.current.innerHTML}</body></html>
    `);
    w.document.close();
    w.print();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.6)", display: "grid", placeItems: "center", padding: 24, overflow: "auto" }}
      onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 16, maxWidth: 860, width: "100%", maxHeight: "90vh", overflow: "auto" }}>
        {/* Toolbar */}
        <div style={{
          position: "sticky", top: 0, background: "#fff", padding: "16px 28px",
          borderBottom: `1px solid ${C.borderLight}`, display: "flex",
          justifyContent: "space-between", alignItems: "center", zIndex: 1,
        }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: C.text }}>
            Invoice #{invoice.invoiceNumber}
          </h3>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handlePrint} style={btnStyle}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
              Print / Save PDF
            </button>
            <button onClick={onClose} style={btnOutlineStyle}>Close</button>
          </div>
        </div>

        {/* Invoice Content */}
        <div ref={printRef} style={{ padding: "48px 48px 40px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 40 }}>
            <div>
              <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: 0.5, marginBottom: 12, fontFamily: "Helvetica Neue, Helvetica, sans-serif" }}>
                {COMPANY.name}
              </h2>
              <p style={{ fontSize: 13, color: "#6B6258", lineHeight: 1.8 }}>
                PHONE: {COMPANY.phone}<br />
                EMAIL: {COMPANY.email}<br />
                HST#: {COMPANY.hst}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <h1 style={{ fontSize: 38, fontWeight: 800, color: "#1A1A1A", marginBottom: 4 }}>INVOICE</h1>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#6B6258" }}>Invoice# {invoice.invoiceNumber}</p>
            </div>
          </div>

          {/* Bill To */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 36 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#9A9084", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Bill To:</p>
              <p style={{ fontSize: 15, lineHeight: 1.7 }}>
                {invoice.client?.name || "Client"}<br />
                {invoice.client?.address || ""}<br />
                Canada
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 14, color: C.accent, fontWeight: 600 }}>
                Invoice Date : {formatDate(invoice.createdAt)}
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <table>
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Item Description</th>
                <th style={{ width: 50 }} className="right">Qty</th>
                <th style={{ width: 100 }} className="right">Rate</th>
                <th style={{ width: 100 }} className="right">Tax</th>
                <th style={{ width: 120 }} className="right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {(invoice.items || []).map((item, i) => {
                const qty = Number(item.qty || 1);
                const rate = Number(item.rate || 0);
                const amt = qty * rate;
                const itemTax = amt * (invoice.taxRate || 13) / 100;
                return (
                  <tr key={i}>
                    <td style={{ color: "#9A9084" }}>{i + 1}</td>
                    <td>{item.description}</td>
                    <td className="right">{qty}</td>
                    <td className="right">{currency(rate)}</td>
                    <td className="right" style={{ color: "#6B6258" }}>
                      {currency(itemTax)}
                      <br /><span style={{ fontSize: 11, color: "#9A9084" }}>{invoice.taxRate || 13}</span>
                    </td>
                    <td className="right" style={{ fontWeight: 600 }}>{currency(amt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 28 }}>
            <div style={{ width: 280 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.borderLight}` }}>
                <span style={{ color: "#6B6258" }}>Sub Total</span>
                <span>{currency(invoice.subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.borderLight}` }}>
                <span style={{ color: "#6B6258" }}>Tax ({invoice.taxRate || 13}%)</span>
                <span>{currency(invoice.tax)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0" }}>
                <span style={{ fontSize: 20, fontWeight: 800 }}>TOTAL</span>
                <span style={{ fontSize: 20, fontWeight: 800 }}>{currency(invoice.total)}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div style={{ marginTop: 28, padding: 18, background: "#F7F5F0", borderRadius: 10 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#9A9084", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Notes / Terms</p>
              <p style={{ fontSize: 13, color: "#6B6258", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const btnStyle = {
  background: "#C9A96E", color: "#fff", border: "none", padding: "10px 20px",
  borderRadius: 10, fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
  cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8,
};
const btnOutlineStyle = {
  ...btnStyle, background: "transparent", color: "#1A1A1A",
  border: "1.5px solid #E2DDD5",
};
