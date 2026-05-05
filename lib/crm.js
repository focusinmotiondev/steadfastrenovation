export const CRM_STORAGE_KEY = "steadfast_crm_clients_v1";
export const CRM_INVOICE_KEY = "steadfast_crm_invoices_v1";
export const CRM_ADMIN_SESSION_KEY = "steadfast_admin_session_v1";
export const CRM_SETTINGS_KEY = "steadfast_settings_v1";
export const CRM_NEXT_INV_KEY = "steadfast_next_inv";

export const ADMIN_EMAIL = "steadfastrenovation@gmail.com";
export const ADMIN_PASSWORD = "steadfast-admin";

export const COMPANY = {
  name: "STEADFAST RENOVATION INC",
  phone: "+1 4168345484",
  email: "steadfastrenovation@gmail.com",
  hst: "771520079RT0001",
};

export const HOW_FOUND_OPTIONS = ["Instagram","TikTok","YouTube","Facebook","Pinterest","Google Search","Referral","Lawn Sign","Mobile Car","Advertisement","Houzz","Other"];
export const SERVICE_OPTIONS = ["General Renovation","Kitchen Renovation","Bathroom Renovation","Basement Renovation","Full Home Renovation","Backyard / Outdoor Living","Flooring","Painting","Drywall / Framing","Electrical","Plumbing","Tile Work","Finish Carpentry","Custom Cabinetry","Additions / Rebuilds","Repairs / Upgrades"];
export const AREA_OPTIONS = ["Kitchen","Washroom","Basement","Entire Home","Backyard","Living Room","Bedroom","Laundry Room","Garage","Exterior","Office","Other"];
export const BUDGET_OPTIONS = ["Under $10,000","$10,000 - $25,000","$25,000 - $50,000","$50,000 - $100,000","$100,000 - $250,000","$250,000+","Not sure yet"];
export const TIMELINE_OPTIONS = ["ASAP","Within 1 month","1 - 3 months","3 - 6 months","6 - 12 months","Just planning / researching"];
export const CONTACT_METHODS = ["Phone","Email","Text"];
export const LEAD_STATUSES = ["new","contacted","quoted","in progress","closed"];
export const STATUS_COLORS = {
  new:{bg:"#DEEBFF",text:"#0065FF"},
  contacted:{bg:"#FFF0D6",text:"#FF8B00"},
  quoted:{bg:"#EAE6FF",text:"#5243AA"},
  "in progress":{bg:"#E3FCEF",text:"#22A06B"},
  closed:{bg:"#F4F5F7",text:"#6B778C"},
};

const canUseStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";
const readJson = (key, fallback) => { if (!canUseStorage()) return fallback; try { const raw = window.localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } };
const writeJson = (key, value) => { if (!canUseStorage()) return; window.localStorage.setItem(key, JSON.stringify(value)); };

const normalizeLead = (payload) => ({ id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, createdAt: new Date().toISOString(), status: "new", archived: false, notes: "", invoices: [], ...payload });

export const getLeads = () => readJson(CRM_STORAGE_KEY, []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
export const getLeadById = (id) => getLeads().find((l) => l.id === id) || null;
export const saveLead = (payload) => { const leads = getLeads(); const lead = normalizeLead(payload); leads.unshift(lead); writeJson(CRM_STORAGE_KEY, leads); return lead; };
export const updateLead = (id, updates) => { const leads = getLeads().map((l) => l.id === id ? { ...l, ...updates } : l); writeJson(CRM_STORAGE_KEY, leads); return leads.find((l) => l.id === id) || null; };

export const getNextInvoiceNumber = () => { const n = readJson(CRM_NEXT_INV_KEY, 1000); writeJson(CRM_NEXT_INV_KEY, n + 1); return n; };
export const getInvoices = () => readJson(CRM_INVOICE_KEY, []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
export const saveInvoice = (payload) => { const invoices = getInvoices(); const invoice = { id: `inv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, createdAt: new Date().toISOString(), status: "draft", invoiceNumber: payload.invoiceNumber || getNextInvoiceNumber(), invoiceDate: payload.invoiceDate || new Date().toISOString(), subtotal: payload.subtotal || 0, tax: payload.tax || 0, taxRate: payload.taxRate || 13, total: payload.total || 0, deposit: payload.deposit || 0, ...payload }; invoices.unshift(invoice); writeJson(CRM_INVOICE_KEY, invoices); const lead = getLeadById(payload.clientId); if (lead) { updateLead(payload.clientId, { status: lead.status === "new" ? "quoted" : lead.status, invoices: [...(lead.invoices || []), invoice.id] }); } return invoice; };
export const deleteInvoice = (invoiceId) => { writeJson(CRM_INVOICE_KEY, getInvoices().filter((i) => i.id !== invoiceId)); };

export const loginAdmin = (email, password) => { const valid = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD; if (valid && canUseStorage()) { window.sessionStorage.setItem(CRM_ADMIN_SESSION_KEY, "true"); } return valid; };
export const logoutAdmin = () => { if (typeof window === "undefined") return; window.sessionStorage.removeItem(CRM_ADMIN_SESSION_KEY); };
export const isAdminLoggedIn = () => { if (typeof window === "undefined") return false; return window.sessionStorage.getItem(CRM_ADMIN_SESSION_KEY) === "true"; };

const DEFAULT_SETTINGS = { autoEmailEnabled: true, autoEmailSubject: "Thank you for contacting Steadfast Renovation", autoEmailBody: "Hi {name},\n\nThank you for reaching out to Steadfast Renovation. We have received your inquiry and our team will review your project details carefully.\n\nYou can expect a call or email from us within 24 hours to discuss your project further.\n\nBest regards,\nSteadfast Renovation Inc.\n+1 (416) 820-5048", smsEnabled: true, smsNumber: "+14168205048", smsTemplate: "NEW LEAD: {name} | {phone} | {services} | Budget: {budget} | {location}", taxRate: 13 };
export const getSettings = () => ({ ...DEFAULT_SETTINGS, ...readJson(CRM_SETTINGS_KEY, {}) });
export const saveSettings = (updates) => { const next = { ...getSettings(), ...updates }; writeJson(CRM_SETTINGS_KEY, next); return next; };

export const formatDateTime = (v) => new Date(v).toLocaleString("en-CA", { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
export const formatDate = (v) => new Date(v).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });
export const currency = (n) => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 2 }).format(Number(n || 0));
