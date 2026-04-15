# DirecțiaTa — Platforma Națională pentru Tineri

## Stare Proiect: MVP Funcțional | Aprilie 2026

---

## Ce este DirecțiaTa

Un agregator național de oportunități pentru tineri (14+) din România: voluntariat, evenimente, workshopuri, competiții, tabere și burse. Toate datele sunt reale, verificate, din surse oficiale românești și europene.

---

## Stack Tehnic

| Tehnologie | Versiune | Rol |
|---|---|---|
| Next.js (App Router) | 16.2.2 | Framework frontend + backend |
| React | 19.2.4 | Interfață utilizator |
| TypeScript | 5 | Tipizare statică |
| Tailwind CSS | 4 | Stilizare |
| Supabase (PostgreSQL + RLS) | 2.101 | Baza de date cloud |
| Cheerio | 1.2 | Scraping HTML |
| Lucide React | 0.468 | Icoane |
| Hosting planificat | Vercel | Deployment + Cron |

---

## 19 Pagini Funcționale

| Pagină | Ce face |
|---|---|
| `/` | **Homepage** — hero animat, statistici live, grid 6 categorii, oportunități recente, how-it-works, CTA quiz |
| `/explorare` | **Hub principal** — filtrare avansată (categorie, locație, vârstă, gratuit/plătit, search), grid + list view, tab-uri Active/Desfășurate, modal de adăugare oportunitate |
| `/voluntariat` | **Voluntariat** — pagină dedicată cu search + tab-uri Active/Past |
| `/evenimente` | **Evenimente** — pagină dedicată cu search + tab-uri Active/Past |
| `/quiz` | **Quiz gamificat** — 5 întrebări, 2 min → 4 arhetipuri: Social, Creativ, Analitic, Aventurier |
| `/blog` | **Blog** — 5 articole (statice) despre voluntariat, programe UE, competiții, CV, tabere |
| `/comunitate` | **Comunitate** — "Coming Soon" — forum, review-uri, leaderboard |
| `/harta-mea` | **Harta Mea** — "Coming Soon" — portofoliu personal, badge-uri, traseu dezvoltare |
| `/despre` | **Despre** — misiunea platformei, public țintă, echipa |
| `/cum-functioneaza` | **Cum funcționează** — ghid 4 pași + FAQ (6 întrebări frecvente) |
| `/surse-date` | **Surse de date** — toate sursele afișate transparent cu tip (API/RSS/Scraping) |
| `/organizatii` | **Pentru organizații** — pagină B2B, beneficii listare, metode de trimitere |
| `/contact` | **Contact** — formular de contact (name, email, subject, message) |
| `/confidentialitate` | **Politica de confidențialitate** — GDPR-compliant, date minime |
| `/cookies` | **Politica de cookies** — esențiale vs opționale, consent management |
| `/termeni` | **Termeni și condiții** — drepturi, responsabilități, limitări |
| `/api/scrape` | **API Scraping** — endpoint securizat POST pentru cron automat |

---

## 12 Componente React

| Component | Ce face |
|---|---|
| `Navbar` | Header sticky — logo, 5 linkuri nav, buton Adaugă (→ modal), buton Quiz, meniu mobil |
| `HeroSection` | Landing hero — blob-uri animate, search bar, 6 filtre rapide, 2 CTA-uri |
| `StatsBar` | 4 statistici: oportunități, organizații verificate, categorii, surse |
| `CategoryGrid` | Grid 3×2 cu cele 6 categorii (voluntariat, evenimente, workshopuri, competiții, tabere, burse) |
| `OpportunityCard` | Card reutilizabil (grid + list view) — badge categorie, organizație, locație, dată, deadline, dificultate, tags, badge expirat |
| `FeaturedOpportunities` | Secțiune cu primele 6 oportunități din Supabase |
| `HowItWorks` | Proces 4 pași: Descoperă → Filtrează → Trăiește → Crești |
| `AddOpportunityModal` | Modal formular — titlu, descriere, categorie, organizație, locație, dată, deadline, vârstă, tags, gratuit/plătit, URL, dificultate. Inserare în Supabase cu status "pending" |
| `CTASection` | Call-to-action gradient cu butoane Quiz + Explorare |
| `DataSourcesPreview` | Grid 12 surse active cu badge tip (API/RSS/Scraping) |
| `Footer` | 4 coloane: brand, link-uri explorare, platformă, legal |
| `CookieConsent` | Banner cookie consent GDPR cu Accept/Reject |

---

## Date și Backend

### Baza de date (Supabase PostgreSQL)

**Tabel `opportunities`:**
- UUID id, title, description, category (6 tipuri), organization, location, date, deadline, age_range, tags[], image, is_free, price, url, source, difficulty (ușor/mediu/avansat), status (pending/approved/rejected), created_at
- RLS: SELECT doar `approved`, INSERT public (oricine poate propune)
- Indexuri: category, status, created_at DESC, UNIQUE pe URL

**Tabel `scraper_logs`** (de rulat SQL):
- Loguri de performanță per cron run (found, inserted, skipped, errors)

### Oportunități
- **35 oportunități seed** în baza de date (din `supabase-setup.sql`)
- **27 oportunități noi** pregătite (din `supabase-new-opportunities.sql` — de rulat)
- **Total planificat: 62+** oportunități reale

### 23+ Surse de Date Verificate

**Voluntariat:** Voluntariat.ro, World Vision, Habitat for Humanity, Crucea Roșie, UNICEF, SOS Satele Copiilor, Teach for Romania, Ajungem Mari, CONCORDIA, AGLT, United Way, AIESEC

**Programe UE/Internaționale:** European Youth Portal, Erasmus+, European Solidarity Corps, SALTO-YOUTH, Eurodesk, eTwinning, Corpul European de Solidaritate

**Evenimente/Competiții:** Eventbrite, Competiții.ro, Innovation Labs, Olimpiade.ro

**Educație:** Ed.ro, ANER, BursaDeStudiu.ro, Coursera

**Tabere & Granturi:** Tabere.ro, WWF, Let's Do It Romania, Fundația pentru Comunitate

### Funcții Backend (`src/lib/opportunities.ts`)
- `fetchOpportunities()` — toate oportunitățile aprobate, ordonate descrescător
- `fetchOpportunitiesByCategory(category)` — filtrate pe categorie
- `addOpportunity(opp)` — inserare cu status `pending` (necesită aprobare)

---

## Sistem de Scraping Automat

### 4 Scrapere Web

| Scraper | Sursă | Ce adună |
|---|---|---|
| SALTO-YOUTH | salto-youth.net/tools/european-training-calendar | Training-uri și evenimente Erasmus+ |
| Eurodesk | programmes.eurodesk.eu + eurodesk.eu/opportunity-finder | Burse, voluntariat, evenimente, workshopuri UE |
| Sunt Solidar | suntsolidar.eu/evenimente + /proiecte | Evenimente și proiecte ESC (Corpul European de Solidaritate) |
| ANPCDEFP | anpcdefp.ro/evenimente + /stiri + /erasmusplus/tineret | Evenimente, știri, programe Erasmus+ România |

### Cum funcționează
1. **Cron zilnic** (Vercel) la 06:00 UTC (09:00 România) → `POST /api/scrape`
2. Securizat cu `CRON_SECRET` (Bearer token)
3. Fiecare scraper: fetch HTML → parse cu Cheerio → extrage titlu, descriere, locație, dată, URL
4. **Deduplicare** — verifică URL-uri existente în DB, nu inserează duplicate
5. **Auto-aprobare** — oportunitățile scraped intră direct ca `approved`
6. **Logging** — fiecare run se salvează în `scraper_logs` cu statistici

---

## Funcționalități Cheie

### Implementate ✅
1. **Filtrare avansată** — 5 criterii simultane (categorie, locație, vârstă, gratuit, search)
2. **Grid + List view** — toggle între moduri de afișare
3. **Persistență filtre** — se salvează în localStorage
4. **Quiz gamificat** — 5 întrebări → 4 personalități, cu recomandări de categorii
5. **Crowdsourcing** — oricine propune oportunități, echipa aprobă din Supabase
6. **Buton "Adaugă"** — din navbar deschide direct modalul (`?adauga=1`)
7. **Scraping automat** — 4 scrapere din surse europene, cron zilnic
8. **Tab-uri Active / S-au desfășurat** — pe explorare, voluntariat, evenimente (SEO-friendly)
9. **Detecție expirate** — parsare inteligentă date românești ("19 Septembrie 2026", intervale, "Program continuu")
10. **Cookie consent GDPR** — accept/reject cu persistență
11. **Responsive complet** — mobile-first, funcționează pe toate dispozitivele
12. **Pagini legale complete** — confidențialitate, cookies, termeni

### Coming Soon (placeholder-e în interfață) 🔮
- **Harta Mea** — profil personal, portofoliu experiențe, badge-uri, nivel
- **Comunitate** — forum, review-uri, leaderboard, grupuri pe interese

---

## Fișiere SQL (Supabase)

| Fișier | Conține | Status |
|---|---|---|
| `supabase-setup.sql` | Tabel `opportunities` + RLS + 35 seed | ✅ Rulat |
| `supabase-scraper-setup.sql` | Tabel `scraper_logs` + index unic URL | ⚠️ De rulat |
| `supabase-new-opportunities.sql` | 27 oportunități noi | ⚠️ De rulat |

---

## Structura Proiectului

```
app/
├── src/
│   ├── app/                          # Next.js App Router (19 rute)
│   │   ├── page.tsx                  # Homepage
│   │   ├── layout.tsx                # Layout global (Navbar + Footer)
│   │   ├── globals.css               # Stiluri globale + sistem culori
│   │   ├── explorare/page.tsx        # Hub explorare cu filtre
│   │   ├── voluntariat/page.tsx      # Pagină voluntariat
│   │   ├── evenimente/page.tsx       # Pagină evenimente
│   │   ├── quiz/page.tsx             # Quiz personalitate
│   │   ├── blog/page.tsx             # Blog articole
│   │   ├── comunitate/page.tsx       # Coming soon
│   │   ├── harta-mea/page.tsx        # Coming soon
│   │   ├── despre/page.tsx           # Despre platformă
│   │   ├── cum-functioneaza/page.tsx  # Ghid + FAQ
│   │   ├── surse-date/page.tsx       # Surse de date
│   │   ├── organizatii/page.tsx      # Pentru organizații
│   │   ├── contact/page.tsx          # Formular contact
│   │   ├── confidentialitate/page.tsx # Privacy policy
│   │   ├── cookies/page.tsx          # Cookie policy
│   │   ├── termeni/page.tsx          # Terms & conditions
│   │   └── api/scrape/route.ts       # API endpoint scraping
│   │
│   ├── components/                    # 12 componente React
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── StatsBar.tsx
│   │   ├── CategoryGrid.tsx
│   │   ├── OpportunityCard.tsx
│   │   ├── FeaturedOpportunities.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── AddOpportunityModal.tsx
│   │   ├── CTASection.tsx
│   │   ├── DataSourcesPreview.tsx
│   │   ├── Footer.tsx
│   │   └── CookieConsent.tsx
│   │
│   └── lib/                           # Logică business
│       ├── types.ts                   # Interfețe TypeScript + isExpired()
│       ├── data.ts                    # Date mock + registru 23+ surse
│       ├── opportunities.ts           # Funcții CRUD Supabase
│       ├── supabase.ts                # Client Supabase
│       └── scrapers/                  # Sistem scraping
│           ├── index.ts               # Registru scrapere
│           ├── types.ts               # Interfețe scraper
│           ├── utils.ts               # fetchPage, dedup, insert, log
│           ├── salto-youth.ts         # Scraper SALTO-YOUTH
│           ├── eurodesk.ts            # Scraper Eurodesk
│           ├── suntsolidar.ts         # Scraper Sunt Solidar
│           └── anpcdefp.ts            # Scraper ANPCDEFP
│
├── public/                            # Fișiere statice
├── supabase-setup.sql                 # SQL principal (✅ rulat)
├── supabase-scraper-setup.sql         # SQL scrapere (⚠️ de rulat)
├── supabase-new-opportunities.sql     # SQL oportunități noi (⚠️ de rulat)
├── vercel.json                        # Cron config (zilnic 06:00 UTC)
├── package.json                       # Dependențe
├── tsconfig.json                      # TypeScript config
└── next.config.ts                     # Next.js config
```

---

## Sistem de Culori

| Variabilă | Culoare | Hex |
|---|---|---|
| Primary | Albastru | `#0EA5E9` |
| Primary Dark | Albastru închis | `#0284C7` |
| Primary Light | Albastru deschis | `#38BDF8` |
| Secondary | Roșu-roz | `#F43F5E` |

---

## Costuri Actuale

| Serviciu | Cost | Limită free tier |
|---|---|---|
| Vercel (hosting) | 0 lei | 100GB bandwidth/lună |
| Supabase (DB) | 0 lei | 500MB storage, 50K requests/lună |
| Domeniu (.ro) | ~50 lei/an | — |
| **Total** | **~50 lei/an** | |

---

## Posibile Dezvoltări Viitoare

| Prioritate | Feature | Complexitate |
|---|---|---|
| 🔴 Critică | **Pagini individuale** per oportunitate (`/oportunitate/[id]`) — SEO, sharing, Open Graph | Medie |
| 🔴 Critică | **Formular contact funcțional** — backend email (Resend/SendGrid) | Mică |
| 🟠 Înaltă | **Admin panel** — dashboard moderare (în loc de Supabase Table Editor) | Medie |
| 🟠 Înaltă | **Newsletter** — colectare email-uri, notificare oportunități noi | Medie |
| 🟠 Înaltă | **Open Graph / Social cards** — preview frumos la share pe social media | Mică |
| 🟡 Medie | **Harta Mea** — profil utilizator, salvare oportunități, istoric | Mare |
| 🟡 Medie | **Comunitate** — forum, review-uri, leaderboard | Mare |
| 🟡 Medie | **Blog dinamic** — articole din Supabase, nu hardcoded | Medie |
| 🟡 Medie | **Notificări** — alerte email/push pentru categoriile tale | Medie |
| 🟡 Medie | **Listări promovate** — organizații plătesc pentru vizibilitate (monetizare) | Medie |
| 🟢 Nice-to-have | **PWA** — instalare pe telefon ca aplicație | Mică |
| 🟢 Nice-to-have | **Hartă interactivă** — oportunități pe harta României | Medie |
| 🟢 Nice-to-have | **Analytics** — Plausible/Umami (GDPR-friendly) | Mică |
| 🟢 Nice-to-have | **Multi-limbă** (RO + EN) | Mare |

---

*Ultima actualizare: 16 Aprilie 2026*
