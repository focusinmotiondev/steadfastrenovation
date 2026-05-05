import { supabase } from "./supabase";

export const COMPANY = { name: "STEADFAST RENOVATION INC", phone: "+1 4168345484", email: "steadfastrenovation@gmail.com", hst: "771520079RT0001" };
export const ADMIN_EMAIL = "steadfastrenovation@gmail.com";
export const ADMIN_PASSWORD = "steadfast-admin";
export const HOW_FOUND_OPTIONS = ["Instagram","TikTok","YouTube","Facebook","Pinterest","Google Search","Referral","Lawn Sign","Mobile Car","Advertisement","Houzz","Other"];
export const SERVICE_OPTIONS = ["General Renovation","Kitchen Renovation","Bathroom Renovation","Basement Renovation","Full Home Renovation","Backyard / Outdoor Living","Flooring","Painting","Drywall / Framing","Electrical","Plumbing","Tile Work","Finish Carpentry","Custom Cabinetry","Additions / Rebuilds","Repairs / Upgrades"];
export const AREA_OPTIONS = ["Kitchen","Washroom","Basement","Entire Home","Backyard","Living Room","Bedroom","Laundry Room","Garage","Exterior","Office","Other"];
export const BUDGET_OPTIONS = ["Under $10,000","$10,000 - $25,000","$25,000 - $50,000","$50,000 - $100,000","$100,000 - $250,000","$250,000+","Not sure yet"];
export const TIMELINE_OPTIONS = ["ASAP","Within 1 month","1 - 3 months","3 - 6 months","6 - 12 months","Just planning / researching"];
export const CONTACT_METHODS = ["Phone","Email","Text"];
export const LEAD_STATUSES = ["new","contacted","quoted","in progress","closed"];
export const STATUS_COLORS = { new:{bg:"#DEEBFF",text:"#0065FF"}, contacted:{bg:"#FFF0D6",text:"#FF8B00"}, quoted:{bg:"#EAE6FF",text:"#5243AA"}, "in progress":{bg:"#E3FCEF",text:"#22A06B"}, closed:{bg:"#F4F5F7",text:"#6B778C"} };

// ─── DB field mapping ───
function dbToLead(r) {
  return {
    id: r.id, createdAt: r.created_at, name: r.name, email: r.email,
    phone: r.phone, location: r.location, howFound: r.how_found,
    services: r.services || [], areas: r.areas || [], timeline: r.timeline,
    budget: r.budget, preferredContact: r.preferred_contact || [],
    message: r.message, status: r.status, archived: r.archived,
    notes: r.notes, invoices: r.invoices || [], payments: r.payments || [],
  };
}

function leadToDb(updates) {
  const map = { howFound: "how_found", preferredContact: "preferred_contact", createdAt: "created_at" };
  const result = {};
  for (const [k, v] of Object.entries(updates)) {
    result[map[k] || k] = v;
  }
  return result;
}

function dbToInv(r) {
  return {
    id: r.id, createdAt: r.created_at, clientId: r.client_id,
    invoiceNumber: r.invoice_number, invoiceDate: r.invoice_date,
    notes: r.notes, items: r.items || [],
    subtotal: r.subtotal, tax: r.tax, taxRate: r.tax_rate, total: r.total,
    deposit: r.deposit || 0, payments: r.payments || [],
    client: r.client_data || {}, status: r.status,
  };
}

// ─── LEADS ───
export async function getLeads() {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("SUPABASE getLeads ERROR:", error.message);
    return [];
  }
  return (data || []).map(dbToLead);
}

export async function getLeadById(id) {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("SUPABASE getLeadById ERROR:", error.message);
    return null;
  }
  return data ? dbToLead(data) : null;
}

export async function saveLead(payload) {
  const row = {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    location: payload.location || "",
    how_found: payload.howFound || "",
    services: payload.services || [],
    areas: payload.areas || [],
    timeline: payload.timeline || "",
    budget: payload.budget || "",
    preferred_contact: payload.preferredContact || ["Phone"],
    message: payload.message || "",
    status: "new",
    archived: false,
    notes: "",
    payments: [],
  };

  const { data, error } = await supabase
    .from("leads")
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error("SUPABASE saveLead ERROR:", error.message);
    return null;
  }
  return dbToLead(data);
}

export async function updateLead(id, updates) {
  const { data, error } = await supabase
    .from("leads")
    .update(leadToDb(updates))
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("SUPABASE updateLead ERROR:", error.message);
    return null;
  }
  return data ? dbToLead(data) : null;
}

// ─── INVOICES ───
export async function getInvoices() {
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("SUPABASE getInvoices ERROR:", error.message);
    return [];
  }
  return (data || []).map(dbToInv);
}

export async function getNextInvoiceNumber() {
  const { data } = await supabase
    .from("invoices")
    .select("invoice_number")
    .order("invoice_number", { ascending: false })
    .limit(1);
  if (data && data.length > 0 && data[0].invoice_number) return data[0].invoice_number + 1;
  return 1000;
}

export async function saveInvoice(payload) {
  const invNum = payload.invoiceNumber || await getNextInvoiceNumber();
  const row = {
    client_id: payload.clientId,
    invoice_number: Number(invNum),
    invoice_date: payload.invoiceDate || new Date().toISOString(),
    notes: payload.notes || "",
    items: payload.items || [],
    subtotal: payload.subtotal || 0,
    tax: payload.tax || 0,
    tax_rate: payload.taxRate || 13,
    total: payload.total || 0,
    deposit: payload.deposit || 0,
    payments: payload.payments || [],
    client_data: payload.client || {},
    status: "draft",
  };

  const { data, error } = await supabase
    .from("invoices")
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error("SUPABASE saveInvoice ERROR:", error.message);
    return null;
  }
  return dbToInv(data);
}

export async function deleteInvoice(id) {
  const { error } = await supabase.from("invoices").delete().eq("id", id);
  if (error) console.error("SUPABASE deleteInvoice ERROR:", error.message);
}

export async function updateInvoice(id, updates) {
  const { error } = await supabase.from("invoices").update(updates).eq("id", id);
  if (error) console.error("SUPABASE updateInvoice ERROR:", error.message);
}

// ─── PAYMENTS & BALANCE ───
export async function addPayment(clientId, payment) {
  const lead = await getLeadById(clientId);
  if (!lead) return null;
  const payments = [...(lead.payments || []), { ...payment, id: `pay_${Date.now()}`, date: new Date().toISOString() }];
  return updateLead(clientId, { payments });
}

export function getClientBalance(lead, invoices) {
  const totalInvoiced = invoices.filter((i) => i.clientId === lead.id).reduce((s, i) => s + Number(i.total || 0), 0);
  const totalPaid = (lead.payments || []).reduce((s, p) => s + Number(p.amount || 0), 0);
  return { totalInvoiced, totalPaid, balance: totalInvoiced - totalPaid, paid: totalInvoiced > 0 && totalPaid >= totalInvoiced };
}

// ─── SETTINGS (localStorage only — admin preferences) ───
const canLS = () => typeof window !== "undefined";
const readLS = (k, d) => { if (!canLS()) return d; try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : d; } catch { return d; } };
const writeLS = (k, v) => { if (canLS()) localStorage.setItem(k, JSON.stringify(v)); };

const DEF_SET = {
  autoEmailEnabled: true,
  autoEmailSubject: "Thank you for contacting Steadfast Renovation",
  autoEmailBody: "Hi {name},\n\nThank you for reaching out to Steadfast Renovation. We have received your inquiry and our team will review your project details carefully.\n\nYou can expect a call or email from us within 24 hours to discuss your project further.\n\nBest regards,\nSteadfast Renovation Inc.\n+1 (416) 834-5484",
  smsEnabled: true,
  smsNumber: "+14168345484",
  smsTemplate: "NEW LEAD: {name} | {phone} | {services} | Budget: {budget} | {location}",
  taxRate: 13,
};
export const getSettings = () => ({ ...DEF_SET, ...readLS("steadfast_settings_v1", {}) });
export const saveSettings = (u) => { const n = { ...getSettings(), ...u }; writeLS("steadfast_settings_v1", n); return n; };

// ─── AUTH (sessionStorage — admin login) ───
export const loginAdmin = (e, p) => { const ok = e.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && p === ADMIN_PASSWORD; if (ok && canLS()) sessionStorage.setItem("steadfast_admin_session_v1", "true"); return ok; };
export const logoutAdmin = () => { if (canLS()) sessionStorage.removeItem("steadfast_admin_session_v1"); };
export const isAdminLoggedIn = () => canLS() && sessionStorage.getItem("steadfast_admin_session_v1") === "true";

// ─── FORMATTERS ───
export const formatDateTime = (v) => new Date(v).toLocaleString("en-CA", { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
export const formatDate = (v) => new Date(v).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });
export const currency = (n) => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 2 }).format(Number(n || 0));
