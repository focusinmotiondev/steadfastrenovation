-- Run this in your Supabase SQL Editor (supabase.com > SQL Editor > New Query)

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  location TEXT DEFAULT '',
  how_found TEXT DEFAULT '',
  services JSONB DEFAULT '[]',
  areas JSONB DEFAULT '[]',
  timeline TEXT DEFAULT '',
  budget TEXT DEFAULT '',
  preferred_contact JSONB DEFAULT '["Phone"]',
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'new',
  archived BOOLEAN DEFAULT false,
  notes TEXT DEFAULT '',
  invoices JSONB DEFAULT '[]',
  payments JSONB DEFAULT '[]'
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  client_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  invoice_number INTEGER,
  notes TEXT DEFAULT '',
  items JSONB DEFAULT '[]',
  subtotal NUMERIC(12,2) DEFAULT 0,
  tax NUMERIC(12,2) DEFAULT 0,
  tax_rate NUMERIC(5,2) DEFAULT 13,
  total NUMERIC(12,2) DEFAULT 0,
  deposit NUMERIC(12,2) DEFAULT 0,
  payments JSONB DEFAULT '[]',
  client_data JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft'
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated and anon users (since this is admin-only)
CREATE POLICY "Allow all on leads" ON leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on invoices" ON invoices FOR ALL USING (true) WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_archived ON leads(archived);
CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_id);
