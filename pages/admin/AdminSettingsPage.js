"use client";
import { useState } from "react";
import AdminShell from "../../components/admin/AdminShell";
import RequireAdmin from "../../components/admin/RequireAdmin";
import { C } from "../../constants";
import { COMPANY, getSettings, saveSettings } from "../../lib/crm";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(() => getSettings());
  const [saved, setSaved] = useState("");
  const upd = (c) => { const next = saveSettings(c); setSettings(next); };

  return (
    <RequireAdmin>
      <AdminShell title="Settings" subtitle="Configure your admin portal preferences.">
        {saved && <div style={{ background: "#E3FCEF", color: "#22A06B", padding: "10px 16px", borderRadius: 10, fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, marginBottom: 20 }}>{saved}</div>}
        <div style={{ ...panel, marginBottom: 20 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 16 }}>Company Information</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[["Company Name", COMPANY.name], ["Phone", COMPANY.phone], ["Email", COMPANY.email], ["HST Number", COMPANY.hst]].map(([l, v]) => (
              <div key={l}><label style={ls}>{l}</label><input value={v} disabled style={{ ...is, background: C.bg, color: C.textMid }} /></div>
            ))}
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: C.textLight, marginTop: 10 }}>To change company details, update the COMPANY object in lib/crm.js</p>
        </div>
        <div style={{ ...panel, marginBottom: 20 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 16 }}>Invoice Settings</h2>
          <div style={{ maxWidth: 200 }}><label style={ls}>Tax Rate (%)</label><input value={settings.taxRate} onChange={(e) => upd({ taxRate: Number(e.target.value) || 0 })} style={is} type="number" /></div>
          <button onClick={() => { setSaved("Settings saved!"); setTimeout(() => setSaved(""), 1800); }} style={{ background: C.accent, color: "#fff", border: "none", padding: "10px 20px", borderRadius: 10, fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 16 }}>Save Settings</button>
        </div>
        <div style={{ ...panel, background: C.bg }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 8 }}>Data Management</h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: C.textMid, lineHeight: 1.7, marginBottom: 16 }}>All data is stored locally in your browser. To deploy with persistent storage, connect to Supabase.</p>
          <button onClick={() => { if (confirm("This will clear ALL client and invoice data. Are you sure?")) { localStorage.clear(); window.location.reload(); } }} style={{ background: "transparent", color: "#DE350B", border: "1.5px solid #DE350B", padding: "10px 20px", borderRadius: 10, fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Reset All Data</button>
        </div>
      </AdminShell>
    </RequireAdmin>
  );
}
const panel = { background: "#fff", borderRadius: 16, padding: 24, border: `1px solid ${C.borderLight}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" };
const ls = { fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: C.textMid, display: "block", marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" };
const is = { width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontFamily: "var(--font-body)", fontSize: 14, outline: "none", boxSizing: "border-box" };
