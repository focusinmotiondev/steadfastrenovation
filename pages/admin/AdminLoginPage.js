"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { C } from "../../constants";
import { loginAdmin } from "../../lib/crm";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const submit = () => { if (loginAdmin(email, pass)) { router.push("/admin"); } else { setErr("Invalid credentials"); } };
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 40, maxWidth: 420, width: "100%", textAlign: "center", border: `1px solid ${C.borderLight}` }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.text, marginBottom: 4 }}>Steadfast</div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: C.textMid, marginBottom: 32 }}>Admin Portal</p>
        {err && <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#DE350B", marginBottom: 16, padding: "8px 12px", background: "#FFEBE6", borderRadius: 8 }}>{err}</p>}
        <div style={{ textAlign: "left", marginBottom: 14 }}><label style={labelS}>Email</label><input value={email} onChange={(e) => setEmail(e.target.value)} style={inputS} placeholder="steadfastrenovation@gmail.com" /></div>
        <div style={{ textAlign: "left", marginBottom: 24 }}><label style={labelS}>Password</label><input type="password" value={pass} onChange={(e) => setPass(e.target.value)} style={inputS} placeholder="Enter password" onKeyDown={(e) => e.key === "Enter" && submit()} /></div>
        <button onClick={submit} style={{ width: "100%", background: C.accent, color: "#fff", border: "none", padding: "13px", borderRadius: 10, fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Sign In</button>
      </div>
    </div>
  );
}
const labelS = { fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: C.textMid, display: "block", marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" };
const inputS = { width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontFamily: "var(--font-body)", fontSize: 14, outline: "none", boxSizing: "border-box" };
