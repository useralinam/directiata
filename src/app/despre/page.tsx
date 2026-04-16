import Link from "next/link";
import {
  ArrowLeft,
  Compass,
  Target,
  Heart,
  Users,
  Shield,
} from "lucide-react";

export default function DesprePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Înapoi la pagina principală
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <Compass className="w-7 h-7 text-primary" strokeWidth={1.8} />
          <h1 className="text-3xl font-bold">Despre DirecțiaTa</h1>
        </div>
        <p className="text-muted mb-10">
          Platforma națională unde tinerii 14+ descoperă oportunități reale de
          dezvoltare.
        </p>

        <div className="space-y-10 text-text leading-relaxed">
          {/* Misiune */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Misiunea noastră</h2>
            </div>
            <p>
              DirecțiaTa a apărut dintr-o nevoie simplă: oportunitățile pentru
              tineri în România există, dar sunt împrăștiate pe zeci de site-uri,
              pagini de Facebook și newslettere. Le pierzi dacă nu știi unde să
              cauți.
            </p>
            <p className="mt-3">
              Misiunea noastră este să aducem toate aceste oportunități într-un
              singur loc — un fel de <strong>catalog național</strong> pentru
              voluntariat, evenimente, workshopuri, competiții, tabere și burse,
              accesibil oricărui tânăr din România.
            </p>
          </section>

          {/* Ce facem */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-secondary" />
              <h2 className="text-xl font-semibold">Ce facem concret</h2>
            </div>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Agregăm oportunități din <strong>zeci de surse verificate</strong>{" "}
                — agenții naționale (ANPCDEFP), ONG-uri, fundații, programe UE
              </li>
              <li>
                Listăm doar <strong>oportunități reale</strong>, cu link direct
                către organizatorul oficial
              </li>
              <li>
                Oferim filtre clare: categorie, locație, vârstă, dificultate,
                termen limită
              </li>
              <li>
                Permitem oricui să adauge oportunități noi prin formularul
                dedicat
              </li>
              <li>
                Menținem transparența totală — fiecare oportunitate are sursa
                indicată
              </li>
            </ul>
          </section>

          {/* Pentru cine */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-accent-green" />
              <h2 className="text-xl font-semibold">Pentru cine este?</h2>
            </div>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Tineri de 14+ ani</strong> care vor să se implice, să
                învețe sau să călătorească
              </li>
              <li>
                <strong>Elevi și studenți</strong> care caută voluntariat,
                competiții sau burse
              </li>
              <li>
                <strong>Părinți</strong> care vor să găsească activități
                educaționale pentru copiii lor
              </li>
              <li>
                <strong>Profesori și consilieri</strong> care recomandă
                oportunități elevilor
              </li>
              <li>
                <strong>Organizații</strong> care vor să-și promoveze gratuit
                programele
              </li>
            </ul>
          </section>

          {/* Valori */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-accent-yellow" />
              <h2 className="text-xl font-semibold">Valorile noastre</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Transparență",
                  desc: "Fiecare oportunitate are sursa indicată. Nu inventăm date.",
                },
                {
                  title: "Accesibilitate",
                  desc: "Platforma e gratuită, fără cont obligatoriu, fără reclame.",
                },
                {
                  title: "Confidențialitate",
                  desc: "Nu colectăm date personale. Protejăm intimitatea minorilor.",
                },
                {
                  title: "Calitate",
                  desc: "Listăm doar oportunități verificate de la organizații reale.",
                },
              ].map((val) => (
                <div
                  key={val.title}
                  className="bg-surface rounded-xl border border-border p-4"
                >
                  <h3 className="font-semibold text-sm mb-1">{val.title}</h3>
                  <p className="text-sm text-muted">{val.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Open source */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Tehnologie</h2>
            <p>
              DirecțiaTa este construită cu Next.js, React și Tailwind CSS.
              Datele sunt colectate din surse publice din România și UE. Platforma
              este optimizată pentru viteză și funcționează excelent pe telefon.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Contact</h2>
            <p>
              Vrei să propui o sursă de date, să raportezi o problemă sau pur și
              simplu să ne saluti? Vizitează{" "}
              <Link href="/contact" className="text-primary hover:underline">
                pagina de contact
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
