-- ================================================
-- DirecțiaTa — Tabel rapoarte (reports)
-- Rulează acest SQL în Supabase SQL Editor
-- ================================================

CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  opportunity_title TEXT NOT NULL DEFAULT '',
  reason TEXT NOT NULL,
  details TEXT DEFAULT '',
  reporter_email TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'resolved')),
  admin_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: permite INSERT public (oricine poate raporta)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reports' AND policyname = 'Public insert reports') THEN
    CREATE POLICY "Public insert reports"
      ON reports FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- Admin poate citi rapoartele (folosind service key, nu anon key)
-- Pentru acum, permitem SELECT public ca admin page sa mearga cu anon key
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reports' AND policyname = 'Public read reports') THEN
    CREATE POLICY "Public read reports"
      ON reports FOR SELECT
      USING (true);
  END IF;
END $$;

-- Admin poate actualiza rapoartele
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reports' AND policyname = 'Public update reports') THEN
    CREATE POLICY "Public update reports"
      ON reports FOR UPDATE
      USING (true);
  END IF;
END $$;

-- Permite UPDATE si pe opportunities (pentru admin edit)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'opportunities' AND policyname = 'Public update opportunities') THEN
    CREATE POLICY "Public update opportunities"
      ON opportunities FOR UPDATE
      USING (true);
  END IF;
END $$;

-- Permite DELETE pe opportunities (pentru admin)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'opportunities' AND policyname = 'Public delete opportunities') THEN
    CREATE POLICY "Public delete opportunities"
      ON opportunities FOR DELETE
      USING (true);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_reports_status ON reports (status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports (created_at DESC);
