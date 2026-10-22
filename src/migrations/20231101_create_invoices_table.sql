-- Migration: Create invoices and allocations tables
-- ------------------------------------------------
-- Combined invoice stores total amount; allocations store per‑client split amounts.
-- ------------------------------------------------

CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    total_amount NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE allocations (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    client_identifier TEXT NOT NULL,
    split_amount NUMERIC(12, 2) NOT NULL CHECK (split_amount > 0)
);

-- Optional index to speed up lookups by invoice_id
CREATE INDEX idx_allocations_invoice_id ON allocations (invoice_id);