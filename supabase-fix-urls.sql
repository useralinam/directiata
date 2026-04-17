-- =============================================================
-- DirecțiaTa — Corectare oportunități (source='manual')
-- Rulează în Supabase SQL Editor
-- 1. ȘTERGE oportunitățile cu organizații fictive (24)
-- 2. CORECTEAZĂ URL-urile celor cu organizații reale (26)
-- =============================================================

-- =============================================
-- 1. ȘTERGERE — organizații fictive (nu există)
-- =============================================

DELETE FROM opportunities WHERE url IN (
  -- TABERE (toate 10 — organizații inventate complet)
  'https://www.fundatiapentrumladini.ro/tabara-internationala/',
  'https://www.asociatiaecologic.ro/tabara-cheile-nerei/',
  'https://stemromania.org/summer-camp-2026/',
  'https://artelesibiu.ro/tabara-de-vara/',
  'https://csrocky.ro/tabara-multisport/',
  'https://digitalkidsacademy.ro/nomad-camp/',
  'https://asociatiafocus.ro/tabara-documentar/',
  'https://fundatiadunarea.ro/tabara-leadership/',
  'https://astromm.ro/tabara-astronomie/',
  'https://folkviu.ro/tabara-folk-2026/',

  -- BURSE (3 — organizații inventate)
  'https://fundatiaprogresiv.ro/burse-merit/',
  'https://womenintech.ro/burse-stem-fete/',
  'https://greenfuture.org.ro/bursa-2026/',

  -- COMPETIȚII (1 — domeniu inexistent)
  'https://debateromania.ro/concurs-national/',

  -- EVENIMENTE (3 — organizații inventate sau domenii expirate/spam)
  'https://youthforum.ro/summit-2026/',
  'https://noapteamuzeelor.ro/tineri-ghizi/',
  'https://streetartiasi.ro/festival-2026/',

  -- WORKSHOPURI (4 — organizații inventate)
  'https://analogromania.ro/workshop-film/',
  'https://srsf.ro/workshop-ficiune-2026/',
  'https://centrudemediere.ro/cnv-tineri/',
  'https://creativehub.ro/workshop-procreate/',

  -- VOLUNTARIAT (3 — organizații inventate)
  'https://sperantaanimala.ro/voluntariat/',
  'https://inimadecopil.ro/voluntariat-tutoriat/',
  'https://fundatiageneratii.ro/bunicii-digitali/'
);


-- =============================================
-- 2. CORECTARE URL-uri — organizații reale verificate
--    (path inventat → homepage-ul real al organizației)
-- =============================================

-- BURSE (6 rămân)
UPDATE opportunities SET url = 'https://youth.europa.eu/home_en'
WHERE url = 'https://youth.europa.eu/burse-tineri/';

UPDATE opportunities SET url = 'https://www.icr.ro/categorii/burse'
WHERE url = 'https://www.icr.ro/pagini/burse-si-rezidente';

UPDATE opportunities SET url = 'https://teachforromania.org/'
WHERE url = 'https://teachforromania.org/aplica-bursa/';

UPDATE opportunities SET url = 'https://cji.ro/'
WHERE url = 'https://cji.ro/program-burse-tineri/';

UPDATE opportunities SET url = 'https://mts.gov.ro/'
WHERE url = 'https://mts.ro/burse-sportive-juniori/';

-- MEXT / Ambasada Japoniei — URL deja corect, păstrăm
-- https://www.ro.emb-japan.go.jp/itpr_ro/burse.html

-- COMPETIȚII (6 rămân — Code4Romania deja există cu code4.ro, ștergem duplicatul)
DELETE FROM opportunities WHERE url = 'https://code4.ro/hackathon-civic-2026/';

UPDATE opportunities SET url = 'https://edu.ro/olimpiade-si-concursuri'
WHERE url = 'https://edu.ro/olimpiada-biologie';

UPDATE opportunities SET url = 'https://www.techstars.com/communities/startup-weekend'
WHERE url = 'https://startupweekend.ro/youth-2026/';

UPDATE opportunities SET url = 'https://www.undp.org/romania'
WHERE url = 'https://undp.org/romania/climate-hackathon/';

UPDATE opportunities SET url = 'https://www.europarl.europa.eu/romania/ro/'
WHERE url = 'https://europarl.europa.eu/romania/concurs-eseuri/';

UPDATE opportunities SET url = 'https://robochallenge.ro/'
WHERE url = 'https://robochallenge.ro/inscrieri-2026/';

-- European Statistics Competition — URL deja corect
-- https://www.european-statistics-competition.eu/

-- EVENIMENTE (5 rămân)
UPDATE opportunities SET url = 'https://bjbv.ro/'
WHERE url = 'https://bjbv.ro/salon-carte-voluntariat/';

UPDATE opportunities SET url = 'https://bookland.ro/'
WHERE url = 'https://bookland.ro/maraton-lectura-2026/';

UPDATE opportunities SET url = 'https://tedxtimisoara.com/'
WHERE url = 'https://tedxtimisoara.com/youth-2026/';

UPDATE opportunities SET url = 'https://www.anpcdefp.ro/'
WHERE url = 'https://erasmusplus.ro/ziua-limbilor-2026/';

UPDATE opportunities SET url = 'https://impacthub.ro/'
WHERE url = 'https://impacthub.ro/24h-change-2026/';

-- WORKSHOPURI (4 rămân)
UPDATE opportunities SET url = 'https://gdg.community.dev/gdg-bucharest/'
WHERE url = 'https://gdg.community.dev/gdg-bucharest/ai-101/';

UPDATE opportunities SET url = 'https://activewatch.ro/'
WHERE url = 'https://activewatch.ro/atelier-fact-checking/';

UPDATE opportunities SET url = 'https://www.jaromania.org/'
WHERE url = 'https://jaromania.org/money-smart-2026/';

UPDATE opportunities SET url = 'https://www.toastmasters.org/'
WHERE url = 'https://toastmasters.ro/workshop-youth-2026/';

-- VOLUNTARIAT (4 rămân)
UPDATE opportunities SET url = 'https://www.fundatiacomunitaraiasi.ro/'
WHERE url = 'https://fundatiacomunitaraiasi.ro/voluntariat-digital/';

UPDATE opportunities SET url = 'https://parcnaturalvacaresti.ro/'
WHERE url = 'https://parcnaturalvacaresti.ro/voluntariat/';

UPDATE opportunities SET url = 'https://tiff.ro/de-ce-sa-devii-voluntar-la-tiff'
WHERE url = 'https://tfriff.ro/voluntari/';

UPDATE opportunities SET url = 'https://plantamfaptebune.ro/'
WHERE url = 'https://plantamfaptebune.ro/campanie-toamna-2026/';


-- =============================================
-- 3. Verificare — ce a rămas din source='manual'
-- =============================================
SELECT
  category,
  title,
  organization,
  url
FROM opportunities
WHERE source = 'manual'
ORDER BY category, title;
