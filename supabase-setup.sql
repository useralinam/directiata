-- ================================================
-- DirecțiaTa -- Tabel oportunități + RLS policies
-- Rulează acest SQL în Supabase SQL Editor
-- ================================================

-- 1. Creează tabelul (doar dacă nu există deja)
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('voluntariat', 'evenimente', 'workshopuri', 'competitii', 'tabere', 'burse')),
  organization TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  date TEXT,
  deadline TEXT,
  age_range TEXT,
  tags TEXT[] DEFAULT '{}',
  image TEXT,
  is_free BOOLEAN NOT NULL DEFAULT true,
  price TEXT,
  url TEXT,
  source TEXT NOT NULL DEFAULT '',
  difficulty TEXT CHECK (difficulty IN ('ușor', 'mediu', 'avansat')),
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Activează RLS (Row Level Security)
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

-- 3. Permite CITIRE publică (doar dacă policy-ul nu există deja)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'opportunities' AND policyname = 'Public read approved opportunities') THEN
    CREATE POLICY "Public read approved opportunities"
      ON opportunities FOR SELECT
      USING (status = 'approved');
  END IF;
END $$;

-- 4. Permite INSERT public (doar dacă policy-ul nu există deja)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'opportunities' AND policyname = 'Public insert opportunities') THEN
    CREATE POLICY "Public insert opportunities"
      ON opportunities FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- 5. Index pentru performanță (doar dacă nu există deja)
CREATE INDEX IF NOT EXISTS idx_opportunities_category ON opportunities (category);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities (status);
CREATE INDEX IF NOT EXISTS idx_opportunities_created_at ON opportunities (created_at DESC);

-- 6. Unique index pe URL (necesar pentru ON CONFLICT)
DROP INDEX IF EXISTS idx_opportunities_url_unique;
DELETE FROM opportunities a USING opportunities b
  WHERE a.id > b.id AND a.url = b.url AND a.url IS NOT NULL;
CREATE UNIQUE INDEX idx_opportunities_url_unique ON opportunities(url);

-- ================================================
-- SEED: Importă cele 35 de oportunități existente
-- (dacă există deja, nu se adaugă din nou)
-- ================================================

INSERT INTO opportunities (title, description, category, organization, location, date, deadline, age_range, tags, is_free, price, url, source, difficulty, status, created_at) VALUES
('Let''s Do It, Romania! -- Ziua de Curatenie Nationala 2026', 'Cea mai mare miscare sociala din Romania. Pe 19 septembrie, alatura-te sutelor de mii de voluntari care curata parcuri, paduri, maluri de rauri in toate cele 41 de judete. Inscrie-te pe platforma app.letsdoitromania.ro.', 'voluntariat', 'Let''s Do It, Romania!', 'Toata Romania (41 judete)', '19 Septembrie 2026', NULL, '14+ ani', ARRAY['ecologie', 'curatenie', 'comunitate', 'natura'], true, NULL, 'https://letsdoitromania.ro/project/ziua-de-curatenie-nationala/', 'letsdoitromania.ro', 'ușor', 'approved', '2026-03-19'),

('Corpul European de Solidaritate -- International Countryside', 'Proiect ESC de voluntariat international in mediul rural. Activitati de dezvoltare comunitara, agricultura sustenabila si schimb intercultural. Cazare, masa, transport si bani de buzunar -- totul acoperit de UE.', 'voluntariat', 'Corpul European de Solidaritate / ANPCDEFP', 'Romania (diverse localitati rurale)', '8-12 Iunie 2026', '15 Mai 2026', '18-30 ani', ARRAY['international', 'europa', 'rural', 'sustenabilitate'], true, NULL, 'https://www.suntsolidar.eu/evenimente-det/vrs/IDev/2605', 'suntsolidar.eu', 'mediu', 'approved', '2026-04-01'),

('Crucea Rosie Romana -- Devino Voluntar', 'Alatura-te familiei de peste 6.000 de voluntari Crucea Rosie din Romania. Activitati in prim ajutor, sprijin pentru varstnici, actiuni in cazuri de dezastre naturale si proiecte comunitare. Formari gratuite oferite.', 'voluntariat', 'Crucea Rosie Romana', 'Toate filialele din Romania', 'Program continuu -- inscrieri deschise', NULL, '16+ ani', ARRAY['sanatate', 'prim ajutor', 'umanitar', 'comunitate'], true, NULL, 'https://crucearosie.ro/implica-te/voluntariat/formularul-de-inscriere-pentru-voluntari/', 'crucearosie.ro', 'ușor', 'approved', '2026-01-15'),

('Teach for Romania -- Program de 2 Ani la Catedra', 'Recrutare deschisa pentru generatia 2026. Devino profesor in scoli publice din 30 de judete, ajutand peste 38.000 de copii. Training complet oferit, sustinere pe toata durata programului. 336 de scoli partenere.', 'voluntariat', 'Teach for Romania', '30 de judete, Romania', 'Anul scolar 2026-2027 (inscrieri deschise)', 'Inscrieri pe baza de runde', '18+ ani', ARRAY['educatie', 'mentorat', 'rural', 'impact social'], true, NULL, 'https://teachforromania.org/inscrieri/', 'teachforromania.org', 'mediu', 'approved', '2026-02-10'),

('Habitat for Humanity Romania -- Voluntariat pe Santier', 'Voluntariaza pe santierele Habitat for Humanity, construind locuinte si centre comunitare alaturi de familii vulnerabile. Program 08:00-17:00, echipament de protectie asigurat, supervizare de constructori profesionisti.', 'voluntariat', 'Habitat for Humanity Romania', 'Diverse localitati, Romania', 'Program continuu -- sesiuni disponibile', NULL, '18+ ani', ARRAY['constructii', 'comunitate', 'impact', 'echipa'], true, NULL, 'https://www.habitat.ro/implica-te/voluntariat/', 'habitat.ro', 'mediu', 'approved', '2026-01-20'),

('World Vision Romania -- Voluntar in Programe de Educatie', 'Implica-te in programe de educatie, protectia copilului si dezvoltare rurala. World Vision este prezenta in comunitatile cele mai vulnerabile din Romania, oferind copiilor sanse egale la educatie de calitate.', 'voluntariat', 'Fundatia World Vision Romania', 'Comunitati rurale, Romania', 'Program continuu', NULL, '18+ ani', ARRAY['educatie', 'copii', 'rural', 'dezvoltare'], true, NULL, 'https://worldvision.ro/ce-facem/', 'worldvision.ro', 'mediu', 'approved', '2026-02-01'),

('Ajungem Mari -- Program National de Voluntariat cu Copii', 'Peste 1.500 de voluntari merg saptamanal la 3.500+ copii din centre de plasament. Ajuti la pregatire scolara, sustii ateliere creative, devii prieten si model. Recrutari anuale, training inclus.', 'voluntariat', 'Asociatia Lindenfeld / Ajungem Mari', 'National (centre de plasament)', 'Program continuu -- inscrieri deschise anual', NULL, '18+ ani', ARRAY['copii', 'centre de plasament', 'mentorat', 'educatie'], true, NULL, 'https://www.ajungemmari.ro/voluntariat/', 'ajungemmari.ro', 'ușor', 'approved', '2026-04-10'),

('CONCORDIA -- Voluntar in Centre Educationale', 'Implica-te in programele CONCORDIA pentru copii si tineri din comunitati vulnerabile. 98% din copiii din Centrele de Zi termina ciclul de invatamant. Sustine educatia prin meditatie, activitati creative si mentorat.', 'voluntariat', 'Organizatia Umanitara CONCORDIA', 'Bucuresti, Timisoara, Prahova', 'Program continuu', NULL, '18+ ani', ARRAY['educatie', 'copii vulnerabili', 'centre de zi', 'mentorat'], true, NULL, 'https://www.concordia.org.ro/programe/tineri/', 'concordia.org.ro', 'mediu', 'approved', '2026-04-10'),

('AGLT -- Grupuri Locale de Tineret in Toata Romania', 'Asociatia Grupurilor Locale de Tineret reuneste 30+ GLT-uri din toata tara. Tabere, zile de joaca, ateliere creative si activitati de formare pentru animatori de tineret. Invata prin joaca si descoperire in comunitate.', 'voluntariat', 'AGLT -- Asociatia Grupurilor Locale de Tineret', 'National (30+ comunitati)', 'Program continuu', NULL, '14+ ani', ARRAY['tineret', 'comunitate', 'animatie', 'rural'], true, NULL, 'http://aglt.org/activitati/', 'aglt.org', 'ușor', 'approved', '2026-04-10'),

('United Way -- Aventura prin Lectura (Voluntar)', 'United Way Romania cauta parteneri ONG pentru proiectul Aventura prin lectura 2026. Previne analfabetismul functional in comunitati vulnerabile. Poti fi voluntar in activitati de lectura cu copiii.', 'voluntariat', 'United Way Romania', 'National (comunitati defavorizate)', 'Aprilie - Decembrie 2026', NULL, '16+ ani', ARRAY['educatie', 'lectura', 'copii', 'incluziune'], true, NULL, 'https://www.unitedway.ro/aventura-prin-lectura/', 'unitedway.ro', 'ușor', 'approved', '2026-04-10'),

('Innovation Labs 2026 -- Hackathon National (editia a 14-a)', 'Cel mai mare pre-accelerator de startupuri tech din Romania. Hackathon pe 21-22 martie in Bucuresti, urmat de 12 workshop-uri, 2 bootcamp-uri si Demo Day pe 25 mai. Premii investitionale de 500.000 EUR. Echipe din 25 universitati, 13 orase.', 'competitii', 'Innovation Labs / Tech Lounge', 'Bucuresti (Hackathon) + National', '21-22 Martie 2026 (Hackathon) -> 25 Mai 2026 (Demo Day)', NULL, '18-30 ani', ARRAY['tech', 'startup', 'hackathon', 'inovatie'], true, NULL, 'https://innovationlabs.ro/program', 'innovationlabs.ro', 'avansat', 'approved', '2026-01-10'),

('Olimpiada Nationala de Informatica 2026', 'Cea mai prestigioasa competitie de informatica din Romania, organizata de Ministerul Educatiei. Etape: locala -> judeteana -> nationala -> Lotul Olimpic. Rezolva probleme algoritmice complexe si califica-te pentru IOI.', 'competitii', 'Ministerul Educatiei', 'Centre judetene -> Finala Nationala', 'Aprilie - Mai 2026', NULL, '14-19 ani', ARRAY['informatica', 'algoritmi', 'programare', 'olimpiada'], true, NULL, 'https://edu.ro/olimpiada-informatica', 'edu.ro', 'avansat', 'approved', '2026-02-15'),

('BCR Scoala de Bani -- Concurs Scoala Banilor Bine Crescuti', 'Concurs anual de desene organizat de BCR pentru scolile din Romania. Completeaza volumele de povesti Scoala banilor bine-crescuti de Cristina Andone cu ilustratii originale. Premii pentru scoli si elevi.', 'competitii', 'BCR Scoala de Bani', 'Toata Romania (online + scoli)', '2026 -- inscrieri deschise', NULL, '14-18 ani', ARRAY['educatie financiara', 'creativitate', 'desene', 'premii'], true, NULL, 'https://www.scoaladebani.ro/scoala-banilor-bine-crescuti/concurs/', 'scoaladebani.ro', 'ușor', 'approved', '2026-03-01'),

('Hackathon Unplugged 2025 -- Ora de Net / Salvati Copiii', 'Hackathon pentru adolescenti 15-18 ani organizat de Salvati Copiii Romania. 24-25 iulie la Universitatea Romano-Americana, Bucuresti. Participare gratuita. Rezolva provocari digitale in echipa.', 'competitii', 'Ora de Net / Salvati Copiii Romania', 'Bucuresti (Universitatea Romano-Americana)', '24-25 Iulie 2025', NULL, '15-18 ani', ARRAY['hackathon', 'digital', 'siguranta online', 'gratuit'], true, NULL, 'https://oradenet.ro/resurse/hackathon2025/', 'oradenet.ro', 'mediu', 'approved', '2026-04-10'),

('Turneul Bucurestiului -- Matematica de Performanta (Gimnaziu)', 'Concurs online de matematica de performanta pentru gimnaziu, organizat pe olimpiade.ro, cu etape lunare. Subiecte si bareme disponibile gratuit. Pregateste-te pentru olimpiadele nationale.', 'competitii', 'olimpiade.ro / SOFTWIN', 'Online', 'Etape lunare 2025-2026', NULL, '10-15 ani', ARRAY['matematica', 'olimpiada', 'concurs', 'online'], true, NULL, 'https://www.olimpiade.ro/stiri/lansam-turneul-bucure-tiului-la-matematica-de-performan-a-pentru-gimnaziu', 'olimpiade.ro', 'avansat', 'approved', '2026-04-10'),

('Scoala de Bani -- Curs Gratuit de Educatie Financiara (Online)', 'Webinar-uri online sustinute de experti financiari BCR, in fiecare joi 18:00-19:30. Cursuri disponibile: Inteligenta financiara, Securitate cibernetica, Ghid ecofinanciar, Mindfulness financiar. Platforma smart si gratuita.', 'workshopuri', 'BCR Scoala de Bani', 'Online (Zoom)', 'In fiecare joi, 18:00-19:30', NULL, '14+ ani', ARRAY['educatie financiara', 'online', 'bani', 'gratuit'], true, NULL, 'https://www.scoaladebani.ro/webinar/', 'scoaladebani.ro', 'ușor', 'approved', '2026-01-05'),

('SALTO-YOUTH -- Training: Strengthening Volunteering in Sport', 'Training Course Erasmus+ de 4 zile la Berlin. Dezvolta competente pentru a integra voluntariatul in activitatile sportive din comunitate. Transport, cazare si masa acoperite prin programul Erasmus+.', 'workshopuri', 'SALTO-YOUTH / Erasmus+', 'Berlin, Germania', '20-23 Mai 2026', '1 Mai 2026', '18-30 ani', ARRAY['sport', 'voluntariat', 'Erasmus+', 'international'], true, NULL, 'https://salto-youth.net/tools/european-training-calendar/', 'salto-youth.net', 'mediu', 'approved', '2026-03-10'),

('SALTO-YOUTH -- A Partnership Building Activity with Young People', 'Activitate de construire de parteneriate in Norvegia, pentru tineri care vor sa dezvolte proiecte europene impreuna cu organizatii din alte tari. 6 zile de networking, ateliere si planificare de proiecte.', 'workshopuri', 'SALTO-YOUTH / Erasmus+', 'Norvegia', '15-20 Iunie 2026', '10 Mai 2026', '18-30 ani', ARRAY['parteneriate', 'proiecte europene', 'networking', 'tineret'], true, NULL, 'https://salto-youth.net/tools/european-training-calendar/', 'salto-youth.net', 'mediu', 'approved', '2026-03-15'),

('BCR LifeLab -- Program Educational pentru Elevi', 'Program pilot de educatie financiara in scoli, realizat de Scoala de Bani si BCR. Elevii invata sa ia decizii financiare, sa lucreze in echipa si sa exerseze planificarea. Desfasurat pe parcursul anului scolar.', 'workshopuri', 'BCR Scoala de Bani', 'Scoli din Romania', 'An scolar 2025-2026', NULL, '14-18 ani', ARRAY['educatie financiara', 'scoala', 'planificare', 'echipa'], true, NULL, 'https://www.scoaladebani.ro/lifelab/', 'scoaladebani.ro', 'ușor', 'approved', '2026-02-05'),

('Cantus Mundi -- Ateliere Gratuite de Cor si Percutie', 'Cel mai mare program de integrare sociala prin muzica din Romania. 84.000+ copii, 2.500+ coruri. Atelierele corale si de percutie sunt 100% gratuite. Preselectii deschise in Bucuresti si in toata tara.', 'workshopuri', 'Cantus Mundi / Corul Madrigal', 'Bucuresti + National (2.500+ coruri)', 'Program continuu -- preselectii deschise', NULL, '6-18 ani', ARRAY['muzica', 'cor', 'percutie', 'gratuit'], true, NULL, 'https://www.cantusmundi.com/preselectii', 'cantusmundi.com', 'ușor', 'approved', '2026-04-10'),

('Ora de Net -- Cursuri Online de Educatie Media (11-17 ani)', 'Cursuri gratuite de educatie media si siguranta online pentru copii si adolescenti, organizate de Salvati Copiii Romania. Invata sa navighezi in siguranta, sa recunosti fake news si sa-ti protejezi imaginea online.', 'workshopuri', 'Ora de Net / Salvati Copiii Romania', 'Online', '2026 -- sesiuni periodice', NULL, '11-17 ani', ARRAY['educatie media', 'siguranta online', 'digital', 'gratuit'], true, NULL, 'https://oradenet.ro/copii-si-tineri/cursuri-si-evenimente/', 'oradenet.ro', 'ușor', 'approved', '2026-04-10'),

('Young Initiative -- Ambasadorii Incluziunii 2025-2026', 'Program dedicat promovarii empatiei si incluziunii in scoli, cu 130+ cadre didactice implicate. Tinerii participa la workshop-uri de educatie non-formala, gandire critica si actiune civica. Acreditat Erasmus+.', 'workshopuri', 'Asociatia Young Initiative (AYI)', 'National (scoli din Romania)', 'An scolar 2025-2026', NULL, '14-25 ani', ARRAY['incluziune', 'empatie', 'educatie non-formala', 'scoala'], true, NULL, 'https://www.younginitiative.org/opportunities/', 'younginitiative.org', 'ușor', 'approved', '2026-04-10'),

('Fundatia Calea Victoriei -- Cursuri pentru Adolescenti', 'Ateliere de arta, gandire critica, debate, public speaking, design interior si fotografie. 18+ ani de activitate, certificat de participare la cerere. Sediul: Bd. Dacia 78, Bucuresti. Domenii: arte, stiinte umaniste, dezvoltare personala.', 'workshopuri', 'Fundatia Calea Victoriei', 'Bucuresti (Bd. Dacia 78) + Online', 'Program continuu -- vezi calendarul pe site', NULL, '14+ ani', ARRAY['arta', 'cultura', 'dezvoltare personala', 'debate'], false, 'Variate (unele gratuite, altele cu taxa)', 'https://www.fundatiacaleavictoriei.ro/category/domenii/cursuri-pentru-copii-adolescenti/', 'fundatiacaleavictoriei.ro', 'ușor', 'approved', '2026-04-10'),

('Saptamana Europeana a Tineretului 2026', 'Eveniment organizat de ANPCDEFP la nivel national, 24 aprilie - 1 mai 2026. Activitati, dezbateri si evenimente despre participarea tinerilor la viata comunitatii si oportunitatile europene. Editie Erasmus+.', 'evenimente', 'ANPCDEFP', 'Bucuresti + Toata tara', '24 Aprilie - 1 Mai 2026', NULL, '14-30 ani', ARRAY['tineret', 'europa', 'ANPCDEFP', 'participare civica'], true, NULL, 'https://www.anpcdefp.ro/evenimente-det/vrs/IDev/2597', 'anpcdefp.ro', 'ușor', 'approved', '2026-03-20'),

('Ambasadori de Invatare -- Generatia 2026 (ANPCDEFP)', 'Vrei sa faci parte din Reteaua de Ambasadori de Invatare? ANPCDEFP cauta tineri motivati care sa promoveze oportunitatile Erasmus+ in comunitatile lor. Intalnire Nationala desfasurata 26-29 martie la Bucuresti.', 'evenimente', 'ANPCDEFP', 'Bucuresti + Comunitati locale', 'Inscrieri deschise 2026', NULL, '16-30 ani', ARRAY['Erasmus+', 'ambasador', 'invatare', 'retea'], true, NULL, 'https://www.anpcdefp.ro/stire/vrs/IDstire/1360', 'anpcdefp.ro', 'ușor', 'approved', '2026-04-02'),

('Erasmus+ Youth Exchange -- Schimb de Tineri International', 'Schimburi de tineret finantate 100% prin Erasmus+. Participanti din 5-6 tari europene se intalnesc 7-14 zile pentru activitati de educatie non-formala, dialog intercultural si dezvoltare personala. Transport, cazare, masa incluse.', 'evenimente', 'ANPCDEFP / Erasmus+', 'Diverse tari europene', 'Apeluri deschise pe tot parcursul anului', NULL, '16-25 ani', ARRAY['international', 'cultura', 'Erasmus+', 'calatorii'], true, NULL, 'https://www.erasmusplus.ro/proiecte-de-mobilitate', 'erasmusplus.ro', 'ușor', 'approved', '2026-02-20'),

('Runners for Humanity 2026 -- Habitat for Humanity', 'Eveniment sportiv de fundraising organizat de Habitat for Humanity Romania. Alergare caritabila -- fiecare kilometru contribuie la constructia de locuinte pentru familii vulnerabile. Participare si ca voluntar organizator.', 'evenimente', 'Habitat for Humanity Romania', 'Romania (diverse orase)', '2026 -- Date de anuntat', NULL, '14+ ani', ARRAY['sport', 'fundraising', 'caritate', 'alergare'], false, 'Taxa de participare (vezi site)', 'https://fundraiser.habitat.ro/eveniment/runners-for-humanity-2026', 'habitat.ro', 'ușor', 'approved', '2026-03-01'),

('Young Initiative -- Proiectul European SPROUT (Rezilienta Climatica)', 'Proiect Erasmus+ care pune tinerii in prim-planul adaptarii la schimbarile climatice. Practici sustenabile si oportunitati pentru tranzitia eco-sociala in comunitati urbane si rurale. Mobilitati internationale incluse.', 'evenimente', 'Asociatia Young Initiative (AYI)', 'Romania + Parteneri europeni', '2026 -- in derulare', NULL, '16-30 ani', ARRAY['mediu', 'clima', 'Erasmus+', 'sustenabilitate'], true, NULL, 'https://www.younginitiative.org/incepe-proiectul-european-sprout-dedicat-adaptarii-la-efectele-schimbarilor-climatice/', 'younginitiative.org', 'mediu', 'approved', '2026-04-10'),

('Opera Comica pentru Copii -- Future Leaders Get Together', 'Conferinta pentru tineri lideri, editia a III-a, organizata la Opera Comica pentru Copii din Bucuresti. Spectacole de opera, balet si musical adaptate tinerilor, plus ateliere Micul Artist si festivaluri culturale.', 'evenimente', 'Opera Comica pentru Copii', 'Bucuresti (Calea Giulesti nr. 16)', '2026 -- vezi programul pe site', NULL, '6-18 ani', ARRAY['cultura', 'opera', 'arta', 'leadership'], false, 'Bilete de la 20 lei', 'https://operacomica.ro/spectacole/program/', 'operacomica.ro', 'ușor', 'approved', '2026-04-10'),

('Eurodesk Romania -- DiscoverEU Meet-up Lyon 2026', 'Primul meet-up DiscoverEU de mare amploare! 16-18 iulie, Lyon, Franta. Calatoresti gratuit cu trenul prin Europa (18 ani), participi la activitati de invatare si networking cu tineri din toata UE.', 'evenimente', 'Eurodesk Romania / ANPCDEFP', 'Lyon, Franta (plecare din Romania)', '16-18 Iulie 2026', NULL, '18 ani', ARRAY['DiscoverEU', 'calatorie', 'europa', 'networking'], true, NULL, 'https://www.eurodesk.ro/stire/vrs/IDstire/1359', 'eurodesk.ro', 'ușor', 'approved', '2026-04-10'),

('Let''s Do It, Romania! -- Doers School', 'Program educational premiat la Gala Green Report pentru excelenta in educatia de mediu. Tabara de vara + ateliere sustenabile pe tot parcursul anului. Invata despre ecologie, reciclare si actiune civica.', 'tabere', 'Let''s Do It, Romania!', 'Diverse locatii, Romania', 'Vara 2026', NULL, '14-18 ani', ARRAY['ecologie', 'educatie', 'sustenabilitate', 'natura'], true, NULL, 'https://letsdoitromania.ro/doers-school/', 'letsdoitromania.ro', 'ușor', 'approved', '2026-02-04'),

('Ajungem Mari -- Tabere de Dezvoltare Personala', 'Tabere de dezvoltare personala si viata independenta pentru copii si tineri din centre de plasament si medii defavorizate. Drumetii, seri tematice, jocuri de echipa, improvizatie. Voluntarii sunt bineveniti.', 'tabere', 'Asociatia Lindenfeld / Ajungem Mari', 'Diverse locatii, Romania', 'Vara 2026', NULL, '14-24 ani', ARRAY['dezvoltare personala', 'viata independenta', 'campanie', 'echipa'], true, NULL, 'https://www.ajungemmari.ro/proiecte/evadare-pentru-dezvoltare/', 'ajungemmari.ro', 'ușor', 'approved', '2026-04-10'),

('Corpul European de Solidaritate -- Proiecte de Solidaritate 2026', 'Finantare UE pentru grupuri informale de tineri care vor sa initieze proiecte locale de solidaritate. Buget de pana la 500 EUR/luna/voluntar. Ghidul si Apelul ESC 2026 au fost lansate.', 'burse', 'Corpul European de Solidaritate / ANPCDEFP', 'Romania (proiecte locale)', 'Termen limita: runde multiple 2026', 'Vezi suntsolidar.eu pentru termene', '18-30 ani', ARRAY['finantare', 'proiecte locale', 'solidaritate', 'UE'], true, NULL, 'https://www.suntsolidar.eu/proiecte-de-solidaritate/', 'suntsolidar.eu', 'mediu', 'approved', '2026-01-25'),

('Erasmus+ -- Finantare Proiecte de Tineret 2026', 'Buget total UE de peste 14 miliarde euro. Romania a primit ~78 milioane euro/an pentru proiecte. Mobilitati, parteneriate strategice si dialog structurat pentru tineri. Aplicatii prin intermediul ANPCDEFP.', 'burse', 'ANPCDEFP / Erasmus+', 'Romania + International', 'Apeluri 2026 deschise', NULL, '16-30 ani', ARRAY['Erasmus+', 'finantare', 'proiecte', 'international'], true, NULL, 'https://www.anpcdefp.ro/erasmusplus/', 'anpcdefp.ro', 'mediu', 'approved', '2026-01-01'),

('Fundatia Calea Victoriei -- Burse pentru Elevi si Studenti', 'Burse educationale pentru elevi si studenti oferite de Fundatia Calea Victoriei. Acces la cursuri de arta, cultura, gandire critica, debate si dezvoltare personala. Candidaturile se depun pe site.', 'burse', 'Fundatia Calea Victoriei', 'Bucuresti (Bd. Dacia 78) + Online', 'Inscrieri periodice -- vezi site', NULL, '14-25 ani', ARRAY['bursa', 'educatie', 'cultura', 'dezvoltare'], true, NULL, 'https://www.fundatiacaleavictoriei.ro/burse/', 'fundatiacaleavictoriei.ro', 'mediu', 'approved', '2026-04-10')
ON CONFLICT (url) DO NOTHING;
