-- =============================================================
-- DirecțiaTa — Corectare oportunități FAZA 2
-- Verificare: supabase-101-opportunities.sql + supabase-setup.sql
-- Rulează în Supabase SQL Editor DUPĂ supabase-fix-urls.sql
--
-- 1. ȘTERGE oportunitățile cu organizații/domenii inexistente (14)
-- 2. CORECTEAZĂ URL-urile greșite / path-uri inventate (2)
-- =============================================================

-- =============================================
-- 1. ȘTERGERE — domenii inexistente (verificat cu DNS + HTTP)
--    Toate aceste URL-uri returnează HTTP 000 (nu se rezolvă)
--    sau 404 (domeniu gol/mort)
-- =============================================

DELETE FROM opportunities WHERE url IN (
  -- itecromania.ro → HTTP 000 (domeniu inexistent)
  'https://itecromania.ro/inscrieri/',

  -- tedxyouthbucharest.com → HTTP 000 (domeniu inexistent)
  'https://tedxyouthbucharest.com/apply/',

  -- bucharest-science-festival.ro → HTTP 000 (domeniu inexistent)
  'https://www.bucharest-science-festival.ro/program/',

  -- makerfaire.ro → HTTP 000 (domeniu inexistent)
  'https://makerfaire.ro/participanti/',

  -- pedalez.ro → HTTP 000 (domeniu inexistent)
  'https://www.pedalez.ro/evenimente/',

  -- ovfreedomidia.ro → HTTP 000 (domeniu inexistent, source zice ovidiuro.ro care e tot mort)
  'https://ovfreedomidia.ro/programe/',

  -- bursadestudiu.ro → HTTP 000 (domeniu inexistent)
  'https://bursadestudiu.ro/burse-active/',

  -- digitalkids.ro → redirect la Google Form (nu e site real)
  'https://digitalkids.ro/cursuri/',

  -- generatiada.ro → HTTP 000 (domeniu inexistent)
  'https://generatiada.ro/inscrieri/',

  -- debateacademy.ro → HTTP 000 (domeniu inexistent)
  'https://debateacademy.ro/inscrieri/',

  -- artelier.ro → HTTP 404 (domeniu mort)
  'https://www.sibfest.ro/program/',

  -- languagelink.ro → HTTP 000 (domeniu inexistent)
  'https://www.languagelink.ro/cursuri/',

  -- robotech.ro → HTTP 000 (domeniu inexistent)
  'https://www.robotech.ro/competitii/',

  -- stradacarte.ro → HTTP 000 (domeniu inexistent, URL e Facebook)
  'https://www.facebook.com/stradacarte/'
);

-- =============================================
-- 2. CORECTARE URL — path inventat sau typo
-- =============================================

-- SALTO-YOUTH: path-ul /digital-tools-2026 nu există
-- Corectăm la training calendar-ul real
UPDATE opportunities
SET url = 'https://www.salto-youth.net/tools/european-training-calendar/'
WHERE url = 'https://salto-youth.net/tools/european-training-calendar/digital-tools-2026';

-- FRDS: typo în URL (frfrds.ro → frds.ro)
UPDATE opportunities
SET url = 'https://www.frds.ro/programe/'
WHERE url = 'https://www.frfrds.ro/programe/';

-- Ambasada Japoniei: /itpr_ro/burse.html → Not found
-- Corectăm la homepage-ul ambasadei
UPDATE opportunities
SET url = 'https://www.ro.emb-japan.go.jp/itprtop_ro/index.html'
WHERE url = 'https://www.ro.emb-japan.go.jp/itpr_ro/burse.html';

-- =============================================
-- 3. Verificare — ce a rămas
-- =============================================
SELECT
  category,
  title,
  organization,
  url,
  source
FROM opportunities
ORDER BY category, title;
