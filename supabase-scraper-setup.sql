-- ================================================
-- DirecțiaTa -- Tabel scraper_logs + index unic pe URL
-- Rulează acest SQL în Supabase SQL Editor
-- ================================================

-- 1. Index unic pe URL în tabelul opportunities (previne duplicate la nivel de DB)
CREATE UNIQUE INDEX IF NOT EXISTS idx_opportunities_url_unique
  ON opportunities (url)
  WHERE url IS NOT NULL;

-- 2. Tabel pentru logarea rulărilor scraperului
CREATE TABLE IF NOT EXISTS scraper_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  results JSONB NOT NULL DEFAULT '[]',
  total_found INTEGER NOT NULL DEFAULT 0,
  total_inserted INTEGER NOT NULL DEFAULT 0,
  total_skipped INTEGER NOT NULL DEFAULT 0,
  total_errors INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: permite inserare publică (din API route) și citire
ALTER TABLE scraper_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert scraper_logs"
  ON scraper_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public read scraper_logs"
  ON scraper_logs FOR SELECT
  USING (true);

-- Permisiuni
GRANT ALL ON scraper_logs TO anon;

-- Index pe dată
CREATE INDEX idx_scraper_logs_created_at ON scraper_logs (created_at DESC);
