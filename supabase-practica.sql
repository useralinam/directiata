-- =============================================================
-- DirecțiaTa — Practică Companii
-- Tabele: internships (listări), applications (aplicări studenți)
-- Rulează în Supabase SQL Editor
-- =============================================================

-- =============================================================
-- 1. Tabela de listări practică (companii)
-- =============================================================
CREATE TABLE IF NOT EXISTS internships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  company_website TEXT,
  company_email TEXT NOT NULL,
  company_logo TEXT,
  
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  domain TEXT NOT NULL,  -- IT, Marketing, Finanțe, Inginerie, HR, Design, Juridic, Sănătate, Educație, Altele
  
  location TEXT NOT NULL DEFAULT 'România',
  work_type TEXT NOT NULL DEFAULT 'on-site',  -- on-site, remote, hybrid
  duration TEXT,          -- ex: "3 luni", "6 săptămâni"
  schedule TEXT,          -- ex: "Full-time", "Part-time (20h/săpt)"
  spots INTEGER DEFAULT 1,
  
  requirements TEXT,      -- ce trebuie să știe studentul
  benefits TEXT,          -- ce câștigă: certificat, posibilitate angajare etc.
  is_paid BOOLEAN DEFAULT false,
  salary_info TEXT,       -- ex: "500 RON/lună" sau "Neprecizat"
  
  start_date DATE,
  deadline DATE,
  url TEXT,               -- link extern dacă compania are pagină proprie
  
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  is_featured BOOLEAN DEFAULT false,  -- pentru listări plătite/premium
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pentru domeniu și status
CREATE INDEX IF NOT EXISTS idx_internships_domain ON internships (domain);
CREATE INDEX IF NOT EXISTS idx_internships_status ON internships (status);

-- =============================================================
-- 2. Tabela de aplicări studenți
-- =============================================================
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id UUID NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
  
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  university TEXT,          -- universitate / liceu
  study_year TEXT,          -- ex: "Anul 2", "Master Anul 1", "Clasa a XII-a"
  field_of_study TEXT,      -- ex: "Informatică", "Economie"
  
  motivation TEXT,          -- de ce vrea studentul această practică
  cv_url TEXT,              -- URL fișier uploadat în Supabase Storage
  cover_letter_url TEXT,    -- URL fișier uploadat (opțional)
  
  availability_date DATE,   -- când poate începe
  
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'seen', 'accepted', 'rejected')),
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_applications_internship ON applications (internship_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications (status);

-- =============================================================
-- 3. RLS Policies
-- =============================================================
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Internships: toată lumea vede cele aprobate
DO $$ BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'internships_public_read') THEN
  CREATE POLICY internships_public_read ON internships
    FOR SELECT USING (status = 'approved');
END IF;
END $$;

-- Internships: oricine poate propune o listare
DO $$ BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'internships_public_insert') THEN
  CREATE POLICY internships_public_insert ON internships
    FOR INSERT WITH CHECK (true);
END IF;
END $$;

-- Internships: admin poate totul
DO $$ BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'internships_admin_all') THEN
  CREATE POLICY internships_admin_all ON internships
    FOR ALL USING (
      current_setting('request.headers', true)::json->>'x-admin-key' = 'directiata2026'
      OR current_setting('role', true) = 'service_role'
    );
END IF;
END $$;

-- Applications: oricine poate aplica
DO $$ BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'applications_public_insert') THEN
  CREATE POLICY applications_public_insert ON applications
    FOR INSERT WITH CHECK (true);
END IF;
END $$;

-- Applications: admin poate vedea și gestiona
DO $$ BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'applications_admin_read') THEN
  CREATE POLICY applications_admin_read ON applications
    FOR SELECT USING (
      current_setting('request.headers', true)::json->>'x-admin-key' = 'directiata2026'
      OR current_setting('role', true) = 'service_role'
    );
END IF;
END $$;

-- =============================================================
-- 4. Storage bucket pentru CV-uri (rulează separat dacă e nevoie)
-- =============================================================
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('cvs', 'cvs', true)
-- ON CONFLICT (id) DO NOTHING;

-- Verificare
SELECT 'internships' as table_name, COUNT(*) as rows FROM internships
UNION ALL
SELECT 'applications', COUNT(*) FROM applications;
