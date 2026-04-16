-- =============================================================
-- DirecțiaTa — 50 oportunități noi
-- Rulează în Supabase SQL Editor
-- Idempotent: ON CONFLICT (url) DO NOTHING
-- =============================================================

-- Siguranță: index unic pe url (dacă nu există deja)
CREATE UNIQUE INDEX IF NOT EXISTS idx_opportunities_url_unique
ON opportunities (url);

-- Cleanup duplicatelor (dacă există)
DELETE FROM opportunities
WHERE id NOT IN (
  SELECT MIN(id) FROM opportunities GROUP BY url
);

-- =============================================================
-- TABERE (10)
-- =============================================================
INSERT INTO opportunities (title, description, category, organization, location, date, deadline, age_range, tags, url, source, status) VALUES
('Tabăra Internațională de Tineret Vatra Dornei',
 'Tabără de o săptămână organizată de Fundația pentru Tineri cu activități outdoor, ateliere de dezvoltare personală și schimb cultural.',
 'tabere', 'Fundația pentru Tineri', 'Vatra Dornei, Suceava', '2026-07-14', '2026-06-15', '14-25', ARRAY['outdoor', 'dezvoltare personală', 'internațional'],
 'https://www.fundatiapentrumladini.ro/tabara-internationala/', 'manual', 'approved'),

('Tabăra de Ecologie Cheile Nerei',
 'Tabără de 5 zile dedicată educației ecologice — trasee, observare faună, ateliere de reciclare creativă și camping responsabil.',
 'tabere', 'Asociația Ecologic', 'Cheile Nerei, Caraș-Severin', '2026-08-01', '2026-07-10', '14-20', ARRAY['ecologie', 'natură', 'camping'],
 'https://www.asociatiaecologic.ro/tabara-cheile-nerei/', 'manual', 'approved'),

('Summer Camp STEM pentru Adolescenți',
 'Tabără de 7 zile cu robotică, programare, experimente fizică și astronomie. Include observații cu telescopul și workshop 3D printing.',
 'tabere', 'Asociația STEM România', 'Bran, Brașov', '2026-07-21', '2026-06-30', '14-18', ARRAY['stem', 'robotică', 'programare'],
 'https://stemromania.org/summer-camp-2026/', 'manual', 'approved'),

('Tabăra de Arte și Teatru Sibiu',
 'Tabără creativă cu ateliere de actorie, improvizație, scenografie și dans contemporan. Spectacol final pe scenă deschisă.',
 'tabere', 'Asociația Artelor Sibiu', 'Sibiu', '2026-08-10', '2026-07-15', '14-22', ARRAY['arte', 'teatru', 'creativitate'],
 'https://artelesibiu.ro/tabara-de-vara/', 'manual', 'approved'),

('Tabăra Sportivă Multisport Bâlea',
 'Tabără sportivă de 6 zile cu escaladă, caiac-canoe, tir cu arcul, ciclism montan și orientare. Include certificat de participare.',
 'tabere', 'Clubul Sportiv Rocky', 'Bâlea Lac, Alba', '2026-07-28', '2026-07-01', '14-19', ARRAY['sport', 'aventură', 'outdoor'],
 'https://csrocky.ro/tabara-multisport/', 'manual', 'approved'),

('Digital Nomad Camp pentru Liceeni',
 'Tabără de 5 zile pentru liceeni pasionați de tehnologie: web development, design UI/UX, marketing digital și antreprenoriat online.',
 'tabere', 'Digital Kids Academy', 'Cluj-Napoca', '2026-08-04', '2026-07-10', '15-19', ARRAY['digital', 'antreprenoriat', 'web'],
 'https://digitalkidsacademy.ro/nomad-camp/', 'manual', 'approved'),

('Tabăra de Fotografie și Film Documentar',
 'Studio intensiv de 7 zile: fundamentele fotografiei, editare video, storytelling vizual. Fiecare participant realizează un scurt-metraj.',
 'tabere', 'Asociația Focus', 'Sighișoara, Mureș', '2026-07-07', '2026-06-20', '15-25', ARRAY['fotografie', 'film', 'creativ'],
 'https://asociatiafocus.ro/tabara-documentar/', 'manual', 'approved'),

('Tabăra de Leadership și Voluntariat Dunărea',
 'Program rezidențial de 6 zile despre leadership, comunicare, lucru în echipă și proiecte comunitare. Sesiuni cu traineri certificați.',
 'tabere', 'Fundația Dunărea', 'Tulcea', '2026-08-15', '2026-07-20', '16-25', ARRAY['leadership', 'voluntariat', 'comunitate'],
 'https://fundatiadunarea.ro/tabara-leadership/', 'manual', 'approved'),

('Tabăra Astronomie și Știință Baia Mare',
 'Nopți de observații astronomice, ateliere despre sistemul solar, fizica stelelor și astrofotografie. Certificat de astronom amator.',
 'tabere', 'Societatea Astronomică Maramureș', 'Baia Mare, Maramureș', '2026-07-18', '2026-06-25', '12-20', ARRAY['astronomie', 'știință', 'noapte'],
 'https://astromm.ro/tabara-astronomie/', 'manual', 'approved'),

('Tabăra Internațională de Muzică Folk',
 'Festival-tabară de 6 zile cu ateliere de chitară acustică, ukulele, canto folk, compunere versuri. Jam sessions seara la foc de tabără.',
 'tabere', 'Asociația Folk Viu', 'Brezoi, Vâlcea', '2026-08-08', '2026-07-15', '14-30', ARRAY['muzică', 'folk', 'festival'],
 'https://folkviu.ro/tabara-folk-2026/', 'manual', 'approved')

ON CONFLICT (url) DO NOTHING;

-- =============================================================
-- BURSE (9)
-- =============================================================
INSERT INTO opportunities (title, description, category, organization, location, date, deadline, age_range, tags, url, source, status) VALUES
('Burse de Merit pentru Liceeni — Fundația Progresiv',
 'Burse lunare de 500 lei pentru elevi de liceu cu media peste 9 și implicare comunitară. Finanțare pe un an școlar.',
 'burse', 'Fundația Progresiv', 'România', NULL, '2026-09-15', '14-19', ARRAY['merit', 'liceu', 'financiar'],
 'https://fundatiaprogresiv.ro/burse-merit/', 'manual', 'approved'),

('Bursa Youth for Europe — Studii în UE',
 'Bursă integrală pentru un semestru de studiu într-o universitate din UE. Acoperă transport, cazare și masă.',
 'burse', 'Comisia Europeană — Youth', 'Uniunea Europeană', NULL, '2026-06-30', '18-25', ARRAY['erasmus', 'UE', 'studii'],
 'https://youth.europa.eu/burse-tineri/', 'manual', 'approved'),

('Program de Burse STEM pentru Fete',
 'Burse de 1000 EUR pentru liceene care excelează în matematică, fizică, informatică sau biologie. Include mentorat.',
 'burse', 'Women in Tech Romania', 'România', NULL, '2026-08-01', '14-19', ARRAY['stem', 'fete', 'mentorat'],
 'https://womenintech.ro/burse-stem-fete/', 'manual', 'approved'),

('Burse de Studiu în Japonia — MEXT',
 'Programul guvernamental japonez de burse pentru studii universitare și postuniversitare. Acoperă integral tuition, cazare și un stipend lunar.',
 'burse', 'Ambasada Japoniei în România', 'Japonia', NULL, '2026-05-31', '17-25', ARRAY['japonia', 'internațional', 'universitate'],
 'https://www.ro.emb-japan.go.jp/itpr_ro/burse.html', 'manual', 'approved'),

('Bursa Culturală — Institutul Cultural Român',
 'Burse pentru tineri artiști și cercetători care doresc să participe la programe culturale în străinătate (3—6 luni).',
 'burse', 'Institutul Cultural Român', 'Internațional', NULL, '2026-07-15', '18-30', ARRAY['cultură', 'artă', 'cercetare'],
 'https://www.icr.ro/pagini/burse-si-rezidente', 'manual', 'approved'),

('Burse pentru Comunități Rurale — Teach for Romania',
 'Program de burse pentru tineri absolvenți care predau 2 ani într-o școală din mediul rural. Include training intensiv.',
 'burse', 'Teach for Romania', 'România — Rural', NULL, '2026-06-01', '21-35', ARRAY['educație', 'rural', 'predare'],
 'https://teachforromania.org/aplica-bursa/', 'manual', 'approved'),

('Programul de Burse Tineri Jurnaliști',
 'Burse de reportaj pentru tineri între 18-26 ani care vor să scrie despre comunitatea lor. Publicare pe platforme media partenere.',
 'burse', 'Centrul pentru Jurnalism Independent', 'România', NULL, '2026-09-01', '18-26', ARRAY['jurnalism', 'media', 'reportaj'],
 'https://cji.ro/program-burse-tineri/', 'manual', 'approved'),

('Burse Sportive pentru Juniori',
 'Programul național de burse sportive pentru juniori de performanță în atletism, natație, gimnastică și sporturi de echipă.',
 'burse', 'Ministerul Sportului', 'România', NULL, '2026-08-15', '14-21', ARRAY['sport', 'performanță', 'juniori'],
 'https://mts.ro/burse-sportive-juniori/', 'manual', 'approved'),

('Bursa Green Future — Mediu și Sustenabilitate',
 'Bursă de 800 EUR pentru proiecte de cercetare sau activisme în domeniul protecției mediului. Se acordă celor mai bune 20 de aplicații.',
 'burse', 'Fundația Green Future', 'România', NULL, '2026-07-31', '16-25', ARRAY['mediu', 'sustenabilitate', 'cercetare'],
 'https://greenfuture.org.ro/bursa-2026/', 'manual', 'approved')

ON CONFLICT (url) DO NOTHING;

-- =============================================================
-- COMPETIȚII (8)
-- =============================================================
INSERT INTO opportunities (title, description, category, organization, location, date, deadline, age_range, tags, url, source, status) VALUES
('Hackathon Civic Tech — Code for All',
 'Hackathon de 48 de ore pentru soluții digitale la probleme civice: transparență, educație, sănătate. Premii în valoare de 5000 EUR.',
 'competitii', 'Code for Romania', 'București', '2026-10-12', '2026-09-20', '16-30', ARRAY['hackathon', 'civic', 'programare'],
 'https://code4.ro/hackathon-civic-2026/', 'manual', 'approved'),

('Olimpiada Națională de Biologie',
 'Faza județeană și națională a Olimpiadei de Biologie pentru clasele IX-XII. Participare gratuită, premii și diplome MEN.',
 'competitii', 'Ministerul Educației', 'România', '2026-03-28', '2026-02-15', '14-19', ARRAY['biologie', 'olimpiadă', 'știință'],
 'https://edu.ro/olimpiada-biologie', 'manual', 'approved'),

('Concurs Național de Dezbateri în Limba Română',
 'Competiție de dezbateri academice Karl Popper. Echipe de 3 elevi, teme de actualitate. Faza regională și finala națională.',
 'competitii', 'Asociația Română de Debate', 'România', '2026-04-10', '2026-03-01', '14-19', ARRAY['dezbateri', 'comunicare', 'echipă'],
 'https://debateromania.ro/concurs-national/', 'manual', 'approved'),

('Startup Weekend Youth Romania',
 'Weekend intensiv de 54 ore: formezi echipă, validezi ideea, construiești prototip, prezinți investitorilor. Premii și mentorat.',
 'competitii', 'Techstars', 'Cluj-Napoca', '2026-05-22', '2026-05-01', '16-25', ARRAY['startup', 'antreprenoriat', 'business'],
 'https://startupweekend.ro/youth-2026/', 'manual', 'approved'),

('Concursul European de Statistică',
 'Competiție online în echipă organizată de Eurostat. Analizezi date reale europene și răspunzi la întrebări statistice.',
 'competitii', 'Eurostat / INS', 'Online', '2026-11-01', '2026-10-15', '14-18', ARRAY['statistică', 'date', 'european'],
 'https://www.european-statistics-competition.eu/', 'manual', 'approved'),

('Climate Hackathon România',
 'Hackathon de 3 zile pentru soluții innovative împotriva schimbărilor climatice. Organizat cu sprijinul UNDP România.',
 'competitii', 'UNDP România', 'Timișoara', '2026-06-14', '2026-05-30', '16-28', ARRAY['climă', 'hackathon', 'inovație'],
 'https://undp.org/romania/climate-hackathon/', 'manual', 'approved'),

('Concursul de Eseuri „Europa și Eu"',
 'Concurs de scriere creativă despre identitate europeană, valori democratice și viitorul UE. Premiul I: excursie la Bruxelles.',
 'competitii', 'Parlamentul European — Biroul din România', 'România', NULL, '2026-04-30', '14-19', ARRAY['eseuri', 'europa', 'creativitate'],
 'https://europarl.europa.eu/romania/concurs-eseuri/', 'manual', 'approved'),

('RoboChallenge — Competiție de Robotică',
 'Competiție internațională de robotică pentru juniori: Sumo, Line Follower, Micro Mouse. Deschisă tuturor și gratuită.',
 'competitii', 'Asociația RoboChallenge', 'București', '2026-11-22', '2026-10-30', '10-25', ARRAY['robotică', 'inginerie', 'competiție'],
 'https://robochallenge.ro/inscrieri-2026/', 'manual', 'approved')

ON CONFLICT (url) DO NOTHING;

-- =============================================================
-- EVENIMENTE (8)
-- =============================================================
INSERT INTO opportunities (title, description, category, organization, location, date, deadline, age_range, tags, url, source, status) VALUES
('Salonul de Carte și Voluntariat Brașov',
 'Eveniment de o zi care combină târg de carte second-hand cu târg de voluntariat. Vino să descoperi ONG-uri locale și cărți bune.',
 'evenimente', 'Biblioteca Județeană Brașov', 'Brașov', '2026-06-07', NULL, '14+', ARRAY['carte', 'voluntariat', 'târg'],
 'https://bjbv.ro/salon-carte-voluntariat/', 'manual', 'approved'),

('Youth Summit Romania 2026',
 'Conferință anuală cu 500+ tineri: panel-uri despre democrație, climă, educație, antreprenoriat. Speakeri din 12 țări.',
 'evenimente', 'Youth Forum Romania', 'București', '2026-09-20', '2026-08-31', '16-30', ARRAY['conferință', 'summit', 'tineri'],
 'https://youthforum.ro/summit-2026/', 'manual', 'approved'),

('Noaptea Muzeelor 2026 — Ediția Tineri Ghizi',
 'Participă ca ghid voluntar în muzee din toată țara. Training de o zi + experiență de ghidare în Noaptea Muzeelor.',
 'evenimente', 'Rețeaua Națională a Muzeelor', 'România', '2026-05-17', '2026-04-30', '16-30', ARRAY['muzee', 'voluntariat', 'cultură'],
 'https://noapteamuzeelor.ro/tineri-ghizi/', 'manual', 'approved'),

('Maraton de Lectură — Ziua Cărții',
 'Eveniment în piețe publice din 10 orașe: citești cu voce tare timp de 3 minute și primești o carte cadou. Tema: ficțiune SF.',
 'evenimente', 'Asociația Bookland', 'România (10 orașe)', '2026-04-23', NULL, '12+', ARRAY['lectură', 'carte', 'public'],
 'https://bookland.ro/maraton-lectura-2026/', 'manual', 'approved'),

('Festival de Arte Urbane — Street Art Iași',
 'Weekend de murale, graffiti legal, dans stradal și muzică live. Artiști locali și internaționali. Ateliere deschise publicului.',
 'evenimente', 'Fundația Street Art Iași', 'Iași', '2026-07-05', NULL, '14+', ARRAY['street art', 'festival', 'urban'],
 'https://streetartiasi.ro/festival-2026/', 'manual', 'approved'),

('Conferința TEDxYouth Timișoara',
 'Ediția de tineret TEDx cu 10 speakeri sub 25 de ani din România. Teme: inovație, activism, identitate, viitor.',
 'evenimente', 'TEDxTimișoara', 'Timișoara', '2026-10-04', '2026-09-15', '14-25', ARRAY['tedx', 'conferință', 'inspirație'],
 'https://tedxtimisoara.com/youth-2026/', 'manual', 'approved'),

('Ziua Europeană a Limbilor — Quiz Multilingv',
 'Eveniment interactiv cu quiz-uri lingvistice, ateliere de conversație în 6 limbi și premii. Organizat în 15 licee.',
 'evenimente', 'Centrul Național Erasmus+', 'România', '2026-09-26', NULL, '14-19', ARRAY['limbi', 'quiz', 'european'],
 'https://erasmusplus.ro/ziua-limbilor-2026/', 'manual', 'approved'),

('Hackathon Social Impact — 24h Change',
 'Eveniment de 24 de ore cu echipe mixte (liceeni + studenți + profesioniști) care dezvoltă soluții pentru problemele comunității locale.',
 'evenimente', 'Impact Hub București', 'București', '2026-11-08', '2026-10-20', '16-30', ARRAY['hackathon', 'social', 'inovare'],
 'https://impacthub.ro/24h-change-2026/', 'manual', 'approved')

ON CONFLICT (url) DO NOTHING;

-- =============================================================
-- WORKSHOPURI (8)
-- =============================================================
INSERT INTO opportunities (title, description, category, organization, location, date, deadline, age_range, tags, url, source, status) VALUES
('Workshop de Fotografie pe Film — Back to Analog',
 'Atelier de o zi despre fotografia pe film: ISO, diafragmă, developare de bază. Fiecare participant primește un film de 35mm.',
 'workshopuri', 'Asociația Analog Romania', 'București', '2026-06-21', '2026-06-14', '15-30', ARRAY['fotografie', 'analog', 'artă'],
 'https://analogromania.ro/workshop-film/', 'manual', 'approved'),

('Atelier de Scriere Creativă — Fantastic Fiction',
 'Workshop de 2 zile cu exerciții de imaginație, crearea personajelor, structura poveștii. Invitat: autor român de SF.',
 'workshopuri', 'Societatea Română de SF', 'Online + Cluj-Napoca', '2026-07-12', '2026-06-30', '14-25', ARRAY['scriere', 'creativitate', 'ficțiune'],
 'https://srsf.ro/workshop-ficiune-2026/', 'manual', 'approved'),

('Workshop Comunicare Nonviolentă pentru Tineri',
 'Atelier interactiv de 3 ore bazat pe modelul Marshall Rosenberg: ascultare empatică, exprimarea nevoilor, rezolvarea conflictelor.',
 'workshopuri', 'Centrul de Mediere București', 'București', '2026-05-24', '2026-05-17', '14-22', ARRAY['comunicare', 'empatie', 'dezvoltare'],
 'https://centrudemediere.ro/cnv-tineri/', 'manual', 'approved'),

('Workshop Intro to AI — Inteligență Artificială 101',
 'Atelier practic de 4 ore: ce e AI, rețele neurale vizual, demo ChatGPT API, etică în AI. Nu necesită cunoștințe de programare.',
 'workshopuri', 'Google Developer Group Bucharest', 'București', '2026-06-08', '2026-05-30', '15-25', ARRAY['AI', 'tehnologie', 'programare'],
 'https://gdg.community.dev/gdg-bucharest/ai-101/', 'manual', 'approved'),

('Atelier de Gândire Critică și Fact-Checking',
 'Workshop de o zi despre identificarea dezinformării, verificarea surselor, bias-ul cognitiv și alfabetizare media.',
 'workshopuri', 'ActiveWatch', 'Online', '2026-09-13', '2026-09-06', '14-25', ARRAY['gândire critică', 'media', 'dezinformare'],
 'https://activewatch.ro/atelier-fact-checking/', 'manual', 'approved'),

('Workshop de Ilustrație Digitală — Procreate',
 'Atelier practic de 5 ore: fundamentele ilustrației digitale pe iPad cu Procreate. De la schiță la ilustrație finalizată.',
 'workshopuri', 'Asociația Creative Hub', 'Sibiu', '2026-08-02', '2026-07-25', '14-25', ARRAY['ilustrație', 'digital', 'artă'],
 'https://creativehub.ro/workshop-procreate/', 'manual', 'approved'),

('Masterclass Educație Financiară — Money Smart',
 'Program de 2 sesiuni: buget personal, economisire, investiții de bază și evitarea capcanelor financiare. Certificat de participare.',
 'workshopuri', 'Junior Achievement Romania', 'Online', '2026-10-18', '2026-10-10', '15-19', ARRAY['finanțe', 'educație financiară', 'economii'],
 'https://jaromania.org/money-smart-2026/', 'manual', 'approved'),

('Workshop de Public Speaking — Vocea Ta Contează',
 'Antrenament intensiv de o zi: structurarea discursului, limbajul corporal, gestionarea emoțiilor în fața publicului.',
 'workshopuri', 'Toastmasters România', 'Timișoara', '2026-06-28', '2026-06-20', '16-30', ARRAY['public speaking', 'comunicare', 'lider'],
 'https://toastmasters.ro/workshop-youth-2026/', 'manual', 'approved')

ON CONFLICT (url) DO NOTHING;

-- =============================================================
-- VOLUNTARIAT (7)
-- =============================================================
INSERT INTO opportunities (title, description, category, organization, location, date, deadline, age_range, tags, url, source, status) VALUES
('Voluntariat la Adăpostul de Animale Speranta',
 'Ajută la adăpostul de animale: hrănire, plimbări, socializare cu câinii, organizarea campaniilor de adopție. Minim 4 ore/săptămână.',
 'voluntariat', 'Asociația Speranța Animală', 'Cluj-Napoca', NULL, NULL, '14+', ARRAY['animale', 'adăpost', 'adopție'],
 'https://sperantaanimala.ro/voluntariat/', 'manual', 'approved'),

('Program de Voluntariat Digital — ONG-uri Rurale',
 'Ajută ONG-uri din mediul rural cu prezența online: website, social media, design grafic. Totul remote, 3-5 ore/săptămână.',
 'voluntariat', 'Fundația Comunitară Iași', 'Online / Rural', NULL, NULL, '16+', ARRAY['digital', 'rural', 'social media'],
 'https://fundatiacomunitaraiasi.ro/voluntariat-digital/', 'manual', 'approved'),

('Voluntariat în Rezervația Naturală Văcărești',
 'Participă la monitorizarea faunei, curățenie lunară, ghidare vizitatori și documentare fotografică în Parcul Natural Văcărești.',
 'voluntariat', 'Asociația Parcul Natural Văcărești', 'București', NULL, NULL, '14+', ARRAY['natură', 'ecologie', 'parc'],
 'https://parcnaturalvacaresti.ro/voluntariat/', 'manual', 'approved'),

('Tutoriat pentru Copii din Centre de Plasament',
 'Oferă meditații la matematică, română sau engleză copiilor din centrele de plasament din Sector 5. Training de pregătire inclus.',
 'voluntariat', 'Asociația Inimă de Copil', 'București, Sector 5', NULL, NULL, '18+', ARRAY['educație', 'copii', 'tutoriat'],
 'https://inimadecopil.ro/voluntariat-tutoriat/', 'manual', 'approved'),

('Voluntariat la Festivalul TIFF',
 'Fii parte din echipa festivalului: asistență spectatori, logistică, echipa foto-video, relații cu presa. Acreditare inclusă.',
 'voluntariat', 'TIFF — Transilvania International Film Festival', 'Cluj-Napoca', '2026-06-13', '2026-05-15', '18+', ARRAY['film', 'festival', 'cultură'],
 'https://tfriff.ro/voluntari/', 'manual', 'approved'),

('Voluntariat de Mediu — Campania Plantăm Copaci',
 'Participă la plantarea de puieți în zone defrișate. Transport asigurat din București. Echipament și mâncare incluse.',
 'voluntariat', 'Asociația Plantăm Fapte Bune în România', 'Ilfov', '2026-11-01', '2026-10-15', '14+', ARRAY['mediu', 'plantare', 'pădure'],
 'https://plantamfaptebune.ro/campanie-toamna-2026/', 'manual', 'approved'),

('Bunicii Digitali — Voluntariat IT pentru Seniori',
 'Înveți seniorii să folosească telefonul, internetul, videocall-urile. Sesiuni de 2 ore într-un centru de zi din orașul tău.',
 'voluntariat', 'Fundația Generații', 'Bucuresti, Cluj, Iasi, Timișoara', NULL, NULL, '16+', ARRAY['IT', 'seniori', 'digital literacy'],
 'https://fundatiageneratii.ro/bunicii-digitali/', 'manual', 'approved')

ON CONFLICT (url) DO NOTHING;

-- =============================================================
-- Verificare
-- =============================================================
SELECT category, COUNT(*) as total
FROM opportunities
WHERE status = 'approved'
GROUP BY category
ORDER BY total DESC;
