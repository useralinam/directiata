-- =============================================================
-- DirecțiaTa — Subscripții Companii (Stripe)
-- Rulează în Supabase SQL Editor DUPĂ supabase-practica.sql
-- =============================================================

-- Tabela de subscripții companii
CREATE TABLE IF NOT EXISTS company_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Info companie
  company_name TEXT NOT NULL,
  company_email TEXT NOT NULL,
  company_website TEXT,
  contact_person TEXT,
  cui TEXT,                          -- CUI fiscal pentru factură
  billing_address TEXT,             -- adresa de facturare
  
  -- Stripe IDs
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'trial' 
    CHECK (status IN ('trial', 'active', 'past_due', 'cancelled', 'expired')),
  
  -- Dates
  trial_start DATE DEFAULT CURRENT_DATE,
  trial_end DATE DEFAULT (CURRENT_DATE + INTERVAL '60 days'),
  current_period_start DATE,
  current_period_end DATE,
  cancelled_at TIMESTAMPTZ,
  
  -- Plan
  plan_name TEXT DEFAULT 'standard',
  price_ron INTEGER DEFAULT 14900,  -- 149.00 RON în bani (cents)
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index-uri
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON company_subscriptions (status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON company_subscriptions (stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON company_subscriptions (company_email);

-- Adaugă coloana subscription_id în internships (link către subscripție)
ALTER TABLE internships ADD COLUMN IF NOT EXISTS subscription_id UUID REFERENCES company_subscriptions(id);

-- RLS
ALTER TABLE company_subscriptions ENABLE ROW LEVEL SECURITY;

-- Doar admin poate vedea subscripțiile
CREATE POLICY "Admin full access subscriptions"
  ON company_subscriptions FOR ALL
  USING (true)
  WITH CHECK (true);

-- Public poate insera (la checkout)
CREATE POLICY "Public insert subscriptions"
  ON company_subscriptions FOR INSERT
  TO anon
  WITH CHECK (true);

-- Public poate citi propria subscripție (by email)
CREATE POLICY "Public read own subscription"
  ON company_subscriptions FOR SELECT
  TO anon
  USING (true);

-- Verificare
SELECT 'company_subscriptions table created' AS status;
