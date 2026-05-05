-- Run this in Supabase SQL Editor to add the invoice_date column
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS invoice_date TIMESTAMPTZ DEFAULT now();
