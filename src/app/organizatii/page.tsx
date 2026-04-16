import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  TrendingUp,
  Users,
  Megaphone,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pentru organizații",
  description: "Promovează gratuit oportunitățile organizației tale pe DirecțiaTa — platforma de voluntariat pentru tineri.",
};

const benefits = [
  {
    icon: Users,
    title: "Acces la publicul țintă",
    desc: "Tinerii 14+ care caută activ oportunități de dezvoltare — exact publicul tău.",
  },
  {
    icon: Megaphone,
    title: "Promovare gratuită",
    desc: "Listarea oportunităților pe DirecțiaTa este complet gratuită. Fără taxe ascunse.",
  },
  {
    icon: TrendingUp,
    title: "Vizibilitate crescută",
    desc: "Oportunitățile tale apar alături de cele mai mari programe din România — ANPCDEFP, Crucea Roșie, Erasmus+.",
  },
  {
    icon: CheckCircle2,
    title: "Informații structurate",
    desc: "Prezentăm clar: categorie, locație, deadline, vârstă, dificultate, link direct către voi.",
  },
];

export default function OrganizatiiPage() {
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
          <Building2 className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-bold">Pentru organizații</h1>
        </div>
        <p className="text-muted mb-10">
          Organizezi oportunități pentru tineri? Te ajutăm să ajungi la ei.
        </p>

        <div className="space-y-10 text-text leading-relaxed">
          {/* Intro */}
          <section>
            <p>
              DirecțiaTa este o platformă gratuită de agregare a oportunităților
              educaționale pentru tineri din România. Obiectivul nostru e să
              conectăm organizatorii de programe pentru tineri cu publicul lor
              natural — adolescenți și tineri adulți care caută activ oportunități
              de voluntariat, evenimente, workshopuri, competiții, tabere și burse.
            </p>
          </section>

          {/* Beneficii */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              De ce să vă listați pe DirecțiaTa?
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="bg-surface rounded-xl border border-border p-4"
                >
                  <b.icon className="w-5 h-5 text-primary mb-2" />
                  <h3 className="font-semibold text-sm mb-1">{b.title}</h3>
                  <p className="text-sm text-muted">{b.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Cum */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              Cum vă adăugați oportunitățile?
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                  1
                </span>
                <div>
                  <h3 className="font-semibold text-sm">
                    Varianta rapidă — Formularul de pe platformă
                  </h3>
                  <p className="text-sm text-muted mt-1">
                    Mergeți pe{" "}
                    <Link
                      href="/explorare"
                      className="text-primary hover:underline"
                    >
                      pagina de explorare
                    </Link>{" "}
                    și apăsați &quot;Adaugă oportunitate&quot;. Completați formularul cu
                    detaliile programului și va fi listat imediat.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                  2
                </span>
                <div>
                  <h3 className="font-semibold text-sm">
                    Varianta completă — Contactați-ne
                  </h3>
                  <p className="text-sm text-muted mt-1">
                    Dacă aveți un volum mare de oportunități sau doriți un
                    parteneriat permanent, scrieți-ne pe{" "}
                    <Link
                      href="/contact"
                      className="text-primary hover:underline"
                    >
                      pagina de contact
                    </Link>
                    . Vom adăuga organizația voastră ca sursă de date verificată.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Organizații existente */}
          <section>
            <h2 className="text-xl font-semibold mb-3">
              Organizații deja listate
            </h2>
            <p className="mb-4">
              Agregăm oportunități de la 23 de organizații verificate, inclusiv:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "ANPCDEFP",
                "Crucea Roșie Română",
                "Let's Do It, Romania!",
                "Habitat for Humanity",
                "Teach for Romania",
                "World Vision România",
                "BCR Școala de Bani",
                "Eurodesk România",
                "Innovation Labs",
                "Cantus Mundi",
                "CONCORDIA",
                "United Way România",
              ].map((org) => (
                <span
                  key={org}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                >
                  {org}
                </span>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-primary/5 rounded-xl border border-primary/20 p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">
              Vreți să vă alăturați?
            </h2>
            <p className="text-sm text-muted mb-4">
              Listarea pe DirecțiaTa este gratuită și durează doar câteva minute.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/explorare"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-dark transition-colors"
              >
                Adaugă oportunitate
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-surface border border-border text-sm font-medium hover:bg-background transition-colors"
              >
                Contactează-ne
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
