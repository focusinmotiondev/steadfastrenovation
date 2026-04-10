"use client";

import { useMemo, useState } from "react";
import { C } from "../constants";
import { Reveal, SectionLabel, IcoPhone, IcoMail, IcoPin, IcoCheck } from "../components";
import { AREA_OPTIONS, BUDGET_OPTIONS, CONTACT_METHODS, HOW_FOUND_OPTIONS, SERVICE_OPTIONS, TIMELINE_OPTIONS, saveLead } from "../lib/crm";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  location: "",
  howFound: "",
  services: [],
  areas: [],
  timeline: "",
  budget: "",
  preferredContact: ["Phone"],
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState(emptyForm);
  const [done, setDone] = useState(false);

  const canSubmit = useMemo(() => form.name && form.email && form.phone && form.location && form.services.length && form.areas.length && form.message, [form]);

  const toggleValue = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value],
    }));
  };

  const submit = () => {
    if (!canSubmit) return;
    saveLead(form);
    setDone(true);
    setForm(emptyForm);
  };

  return (
    <div>
      <section style={{ background: C.bg, padding: "140px 0 60px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 36px" }}>
          <Reveal>
            <SectionLabel>Contact Us</SectionLabel>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 58px)", fontWeight: 700, color: C.text, marginBottom: 14 }}>Tell us about your project</h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 17, color: C.textMid, maxWidth: 760, lineHeight: 1.75 }}>Give us the basics, where the project is, what spaces need work, and what stage you are at. We built this form so you can send one strong inquiry and we can call back with real context.</p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: C.white, padding: "60px 0 90px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 36px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.3fr", gap: 42 }} className="contact-grid">
            <Reveal>
              <div style={{ display: 'grid', gap: 18 }}>
                <div style={infoCardStyle}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 26, color: C.text, marginBottom: 14 }}>What happens next</h3>
                  <div style={{ display: 'grid', gap: 12 }}>
                    {[
                      'We review your inquiry and project scope.',
                      'We contact you within 24 hours by phone or email.',
                      'We qualify the budget, timeline, and next steps.',
                    ].map((item) => (
                      <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><IcoCheck size={16} /><span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: C.textMid, lineHeight: 1.65 }}>{item}</span></div>
                    ))}
                  </div>
                </div>

                {[{ ico: <IcoPhone size={20} />, title: 'Call us', val: '416-834-5484', sub: 'Fastest way to reach the team' }, { ico: <IcoMail size={20} />, title: 'Email us', val: 'steadfastrenovation@gmail.com', sub: 'We respond within 24 hours' }, { ico: <IcoPin size={20} />, title: 'Service area', val: 'Greater Toronto Area', sub: 'Toronto, Durham, York, Peel, Halton and nearby' }].map((c, i) => (
                  <div key={i} style={infoCardStyle}>
                    <div style={{ display: 'flex', gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${C.accent}18`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{c.ico}</div>
                      <div>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: C.textLight, marginBottom: 4 }}>{c.title}</p>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 700, color: C.text }}>{c.val}</p>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: C.textMid, marginTop: 4 }}>{c.sub}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div style={{ background: C.bg, borderRadius: 24, padding: '34px 28px', border: `1px solid ${C.borderLight}` }}>
                {done ? (
                  <div style={{ textAlign: 'center', padding: '70px 0' }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', border: `2px solid ${C.accent}`, display: 'grid', placeItems: 'center', margin: '0 auto 18px' }}><IcoCheck size={26} /></div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: C.text, marginBottom: 8 }}>Inquiry received</h3>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: C.textMid }}>We will respond within 24 hours. Your lead is also saved into the admin portal for follow-up.</p>
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: 22 }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: C.text, marginBottom: 6 }}>Request a quote</h3>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: C.textMid }}>Fill out as much as you can so we know exactly what kind of project you need.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="form-grid">
                      <Field label="Full name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="Your full name" /></Field>
                      <Field label="Phone number"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} placeholder="416-555-1234" /></Field>
                      <Field label="Email"><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} placeholder="you@example.com" /></Field>
                      <Field label="Project location"><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} style={inputStyle} placeholder="City / neighbourhood" /></Field>
                      <Field label="How did you find us?">
                        <select value={form.howFound} onChange={(e) => setForm({ ...form, howFound: e.target.value })} style={inputStyle}>
                          <option value="">Select one</option>
                          {HOW_FOUND_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      </Field>
                      <Field label="Preferred contact method">
                        <div style={pillWrap}>
                          {CONTACT_METHODS.map((option) => <TogglePill key={option} label={option} active={form.preferredContact.includes(option)} onClick={() => toggleValue('preferredContact', option)} />)}
                        </div>
                      </Field>
                    </div>

                    <Field label="Services needed" style={{ marginTop: 18 }}>
                      <div style={pillWrap}>
                        {SERVICE_OPTIONS.map((option) => <TogglePill key={option} label={option} active={form.services.includes(option)} onClick={() => toggleValue('services', option)} />)}
                      </div>
                    </Field>

                    <Field label="Areas / rooms involved" style={{ marginTop: 18 }}>
                      <div style={pillWrap}>
                        {AREA_OPTIONS.map((option) => <TogglePill key={option} label={option} active={form.areas.includes(option)} onClick={() => toggleValue('areas', option)} />)}
                      </div>
                    </Field>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 18 }} className="form-grid">
                      <Field label="Budget range">
                        <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} style={inputStyle}>
                          <option value="">Select budget</option>
                          {BUDGET_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      </Field>
                      <Field label="When would you like to start?">
                        <select value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })} style={inputStyle}>
                          <option value="">Select timeline</option>
                          {TIMELINE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      </Field>
                    </div>

                    <Field label="Project details" style={{ marginTop: 18 }}>
                      <textarea rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} placeholder="What are you trying to renovate, what shape is it in, and what outcome do you want?" />
                    </Field>

                    <button onClick={submit} disabled={!canSubmit} style={{ width: '100%', marginTop: 22, background: canSubmit ? C.accent : C.border, color: '#fff', border: 'none', padding: '16px 18px', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, borderRadius: 999, cursor: canSubmit ? 'pointer' : 'not-allowed' }}>
                      Submit request
                    </button>
                  </>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children, style }) {
  return <label style={{ display: 'block', ...style }}><span style={{ display: 'block', marginBottom: 7, fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, color: C.textMid }}>{label}</span>{children}</label>;
}

function TogglePill({ label, active, onClick }) {
  return <button type="button" onClick={onClick} style={{ border: `1px solid ${active ? C.accent : C.border}`, background: active ? C.accent : '#fff', color: active ? '#fff' : C.text, borderRadius: 999, padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{label}</button>;
}

const inputStyle = { width: '100%', padding: '13px 14px', borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff', fontFamily: 'var(--font-body)', fontSize: 14, color: C.text, outline: 'none', boxSizing: 'border-box' };
const infoCardStyle = { background: '#fff', borderRadius: 18, border: `1px solid ${C.borderLight}`, padding: 22 };
const pillWrap = { display: 'flex', flexWrap: 'wrap', gap: 10 };
