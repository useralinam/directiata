-- =========================================
-- Scraper Sources Management Table
-- =========================================
-- Allows configuring which sites to scan,
-- their priority, and scan frequency.
-- Manage via Supabase Dashboard > Table Editor.
-- =========================================

-- Table: scraper_sources
CREATE TABLE IF NOT EXISTS scraper_sources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  source_id TEXT NOT NULL UNIQUE,         -- matches scraper sourceId (e.g. 'salto-youth')
  url TEXT NOT NULL,                       -- base URL of the source
  enabled BOOLEAN DEFAULT true,           -- toggle source on/off
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('high', 'normal', 'low')),
  scrape_interval_hours INT DEFAULT 24,   -- how often to scrape (hours)
  last_scraped_at TIMESTAMPTZ,            -- last successful scrape time
  last_status TEXT,                        -- 'success' | 'error'
  last_error TEXT,                         -- last error message if any
  total_found INT DEFAULT 0,              -- total opportunities found last run
  total_inserted INT DEFAULT 0,           -- total inserted last run
  notes TEXT,                             -- admin notes about this source
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE scraper_sources ENABLE ROW LEVEL SECURITY;

-- Public read access (so the site can show source info)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read scraper sources' AND tablename = 'scraper_sources') THEN
    CREATE POLICY "Public read scraper sources" ON scraper_sources FOR SELECT USING (true);
  END IF;
END $$;

-- Seed with existing scrapers
INSERT INTO scraper_sources (name, source_id, url, enabled, priority, scrape_interval_hours, notes) VALUES
  ('SALTO-YOUTH Training Calendar', 'salto-youth', 'https://salto-youth.net/tools/european-training-calendar/', true, 'high', 12, 'European training courses, seminars, study visits. Erasmus+ related.'),
  ('Eurodesk Opportunities', 'eurodesk', 'https://eurodesk.eu/opportunities/', true, 'high', 12, 'European opportunities for young people. Very comprehensive.'),
  ('Sunt Solidar', 'suntsolidar', 'https://suntsolidar.eu/', true, 'normal', 24, 'European Solidarity Corps Romania. Volunteering projects.'),
  ('ANPCDEFP', 'anpcdefp', 'https://www.anpcdefp.ro/', true, 'normal', 24, 'Romanian National Agency for Erasmus+. Grants, trainings, events.')
ON CONFLICT (source_id) DO NOTHING;

-- Index for fast lookup by source_id
CREATE INDEX IF NOT EXISTS idx_scraper_sources_source_id ON scraper_sources(source_id);
CREATE INDEX IF NOT EXISTS idx_scraper_sources_enabled ON scraper_sources(enabled);
