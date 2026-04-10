"use client";
import { useState } from "react";
import AdminShell from "../../components/admin/AdminShell";
import RequireAdmin from "../../components/admin/RequireAdmin";
import { C } from "../../constants";
import { getSettings, saveSettings } from "../../lib/crm";

function Toggle({ on, onClick }) {
  return <div onClick={onClick} style={{ width: 48, height: 26, borderRadius: 13, cursor: "pointer", background: on ? "#22A06B" : "#ccc", position: "relative", transition: "background 0.2s" }}><div style={{ width: 22, height: 22, borderRadius: 11, background: "#fff", position: "absolute", top: 2, left: on ? 24 : 2, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} /></div>;
}

export default function AdminAutomationPage() {
  const [s, setS] = useState(() => getSettings());
  const [saved, setSaved] = useState("");
  const upd = (c) => { const next = saveSettings(c); setS(next); };

  return (
    <RequireAdmin>
      <AdminShell title="AI Automation" subtitle="Automate client communication when new inquiries come through the contact form.">
        {saved && <div style={{ background: "#E3FCEF", color: "#22A06B", padding: "10px 16px", borderRadius: 10, fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, marginBottom: 20 }}>{saved}</div>}

        <div style={{ ...panel, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
            <div><h2 style={pt}>Auto-Reply Email</h2><p style={pd}>Automatically send an email to the client when they submit the contact form.</p></div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Toggle on={s.autoEmailEnabled} onClick={() => upd({ autoEmailEnabled: !s.autoEmailEnabled })} /><span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: s.autoEmailEnabled ? "#22A06B" : C.textLight }}>{s.autoEmailEnabled ? "Enabled" : "Disabled"}</span></div>
          </div>
          <div style={{ display: "grid", gap: 14 }}>
            <div><label style={ls}>Subject Line</label><input value={s.autoEmailSubject} onChange={(e) => upd({ autoEmailSubject: e.target.value })} style={is} /></div>
            <div><label style={ls}>Email Body</label><textarea value={s.autoEmailBody} onChange={(e) => upd({ autoEmailBody: e.target.value })} style={{ ...is, resize: "vertical" }} rows={8} /><p style={hs}>Use {"{name}"} to insert the client name automatically.</p></div>
          </div>
        </div>

        <div style={{ ...panel, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
            <div><h2 style={pt}>SMS Notification to You</h2><p style={pd}>Get a text message on your phone with a short summary when a new inquiry comes in.</p></div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Toggle on={s.smsEnabled} onClick={() => upd({ smsEnabled: !s.smsEnabled })} /><span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: s.smsEnabled ? "#22A06B" : C.textLight }}>{s.smsEnabled ? "Enabled" : "Disabled"}</span></div>
          </div>
          <div style={{ display: "grid", gap: 14 }}>
            <div><label style={ls}>Your Phone Number</label><input value={s.smsNumber} onChange={(e) => upd({ smsNumber: e.target.value })} style={is} /></div>
            <div><label style={ls}>SMS Template</label><input value={s.smsTemplate} onChange={(e) => upd({ smsTemplate: e.target.value })} style={is} /><p style={hs}>Variables: {"{name}"}, {"{phone}"}, {"{email}"}, {"{services}"}, {"{budget}"}, {"{location}"}</p></div>
          </div>
        </div>

        <div style={{ ...panel, background: C.bg }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>How It Works</h3>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: C.textMid, lineHeight: 1.7 }}>When a client submits the contact form, two things happen: an email is sent to the client confirming their inquiry, and a text message is sent to your phone with a quick summary so you can call them back. To enable in production, connect these templates to SendGrid (email) and Twilio (SMS) through your Next.js API routes.</p>
        </div>

        <button onClick={() => { setSaved("Settings saved!"); setTimeout(() => setSaved(""), 2000); }} style={{ background: C.accent, color: "#fff", border: "none", padding: "13px 28px", borderRadius: 10, fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 20 }}>Save All Settings</button>
      </AdminShell>
    </RequireAdmin>
  );
}

const panel = { background: "#fff", borderRadius: 16, padding: 24, border: `1px solid ${C.borderLight}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" };
const pt = { fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 4 };
const pd = { fontFamily: "var(--font-body)", fontSize: 13, color: C.textMid };
const ls = { fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: C.textMid, display: "block", marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" };
const is = { width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontFamily: "var(--font-body)", fontSize: 14, outline: "none", boxSizing: "border-box" };
const hs = { fontFamily: "var(--font-body)", fontSize: 11, color: C.textLight, marginTop: 4 };
