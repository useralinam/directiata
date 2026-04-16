import Link from "next/link";
import { Cookie, Shield, BarChart3, Settings, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica cookies",
  description: "Ce cookie-uri folosește DirecțiaTa și cum le poți gestiona.",
};

export default function CookiesPage() {
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

        <h1 className="text-3xl font-bold mb-2">Politica de Cookie-uri</h1>
        <p className="text-sm text-muted mb-10">
          Ultima actualizare: 4 aprilie 2026
        </p>

        <div className="space-y-10 text-text leading-relaxed">
          {/* Ce sunt cookies */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Cookie className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Ce sunt cookie-urile?</h2>
            </div>
            <p>
              Cookie-urile sunt fișiere text mici, stocate pe dispozitivul tău
              (computer, telefon, tabletă) atunci când vizitezi un site web. Ele
              ajută site-ul să funcționeze corect, să-ți amintească preferințele
              și să ofere o experiență mai bună de navigare.
            </p>
          </section>

          {/* Cookies esențiale */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-accent-green" />
              <h2 className="text-xl font-semibold">Cookie-uri esențiale</h2>
            </div>
            <p className="mb-3">
              Aceste cookie-uri sunt necesare pentru funcționarea de bază a
              platformei DirecțiaTa. Fără ele, site-ul nu ar funcționa corect.
              Nu necesită consimțământul tău.
            </p>
            <div className="bg-surface rounded-xl border border-border p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted">
                    <th className="pb-2 font-medium">Cookie</th>
                    <th className="pb-2 font-medium">Scop</th>
                    <th className="pb-2 font-medium">Durată</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-2 font-mono text-xs">cookie-consent</td>
                    <td className="py-2">Stochează preferința ta despre cookie-uri</td>
                    <td className="py-2">1 an</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">directia-ta-filters</td>
                    <td className="py-2">Salvează filtrele alese în pagina de explorare</td>
                    <td className="py-2">Sesiune</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">directia-ta-user-opportunities</td>
                    <td className="py-2">Oportunități adăugate de tine (localStorage)</td>
                    <td className="py-2">Persistent</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Cookies analitice */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Cookie-uri analitice</h2>
            </div>
            <p className="mb-3">
              Ne ajută să înțelegem cum este folosit site-ul, ce pagini sunt
              cele mai vizitate și unde putem aduce îmbunătățiri. Datele sunt
              anonimizate.
            </p>
            <p>
              <strong>Momentan nu folosim cookie-uri analitice.</strong> Dacă vom
              implementa în viitor un serviciu de analiză (ex. Plausible,
              Umami), vom actualiza această politică și vei fi notificat prin
              bannerul de consimțământ.
            </p>
          </section>

          {/* Cookies de marketing */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-5 h-5 text-accent-yellow" />
              <h2 className="text-xl font-semibold">
                Cookie-uri de marketing
              </h2>
            </div>
            <p>
              <strong>Nu folosim cookie-uri de marketing sau de urmărire.</strong>{" "}
              DirecțiaTa nu afișează reclame și nu partajează date cu rețele
              publicitare. Platforma este destinată tinerilor și respectăm cu
              strictețe confidențialitatea utilizatorilor minori.
            </p>
          </section>

          {/* Cum gestionezi */}
          <section>
            <h2 className="text-xl font-semibold mb-3">
              Cum poți gestiona cookie-urile?
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Poți șterge cookie-urile din setările browserului tău oricând.
              </li>
              <li>
                Poți bloca cookie-urile, dar unele funcționalități ale site-ului
                ar putea să nu mai funcționeze corect.
              </li>
              <li>
                La prima vizită, îți cerem consimțământul printr-un banner. Poți
                modifica alegerea oricând revenind pe această pagină.
              </li>
            </ul>
          </section>

          {/* localStorage */}
          <section>
            <h2 className="text-xl font-semibold mb-3">
              Despre localStorage
            </h2>
            <p>
              DirecțiaTa folosește <code className="bg-surface px-1.5 py-0.5 rounded text-sm">localStorage</code> (stocare
              locală în browser) pentru a salva preferințele tale de filtrare și
              oportunitățile adăugate manual. Aceste date rămân exclusiv pe
              dispozitivul tău și nu sunt trimise către niciun server.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Întrebări?</h2>
            <p>
              Pentru orice întrebare legată de cookie-uri, ne poți contacta pe{" "}
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
