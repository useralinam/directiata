import Link from "next/link";
import { ArrowLeft, Search, Filter, ExternalLink, Star } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cum funcționează",
  description: "Află cum folosești DirecțiaTa pentru a descoperi oportunități de voluntariat, evenimente și burse.",
};

const steps = [
  {
    icon: Search,
    color: "bg-primary/10 text-primary",
    title: "1. Explorează",
    description:
      "Navighează prin cele 6 categorii de oportunități: voluntariat, evenimente, workshopuri, competiții, tabere și burse. Folosește bara de căutare pentru a găsi rapid ce te interesează.",
  },
  {
    icon: Filter,
    color: "bg-accent-green/10 text-accent-green",
    title: "2. Filtrează",
    description:
      "Restrânge rezultatele folosind filtrele: categorie, locație, nivel de dificultate, vârstă și dată. Poți alterna între vizualizarea grid și listă pentru a compara mai ușor.",
  },
  {
    icon: ExternalLink,
    color: "bg-secondary/10 text-secondary",
    title: "3. Înscrie-te",
    description:
      'Fiecare oportunitate are un buton "Detalii & Înscriere" care te duce direct pe site-ul oficial al organizatorului. Toate datele necesare — deadline, vârstă, locație — sunt afișate clar pe card.',
  },
  {
    icon: Star,
    color: "bg-accent-yellow/10 text-accent-yellow",
    title: "4. Contribuie",
    description:
      'Ai descoperit o oportunitate care nu e încă pe platformă? Apasă "Adaugă oportunitate" și completează formularul. Ajuți comunitatea de tineri să găsească mai mult.',
  },
];

export default function CumFunctioneazaPage() {
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

        <h1 className="text-3xl font-bold mb-2">Cum funcționează</h1>
        <p className="text-muted mb-10">
          DirecțiaTa e simplu de folosit. Iată pașii:
        </p>

        <div className="space-y-6 mb-12">
          {steps.map((step) => (
            <div
              key={step.title}
              className="flex gap-4 bg-surface rounded-xl border border-border p-5"
            >
              <div
                className={`w-10 h-10 rounded-lg ${step.color} flex items-center justify-center shrink-0`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold mb-1">{step.title}</h2>
                <p className="text-sm text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <h2 className="text-2xl font-bold mb-6">Întrebări frecvente</h2>
        <div className="space-y-4">
          {[
            {
              q: "Trebuie să-mi fac cont?",
              a: "Nu. DirecțiaTa funcționează fără cont. Poți explora și filtra toate oportunitățile liber.",
            },
            {
              q: "E gratuit?",
              a: "Da, platforma e complet gratuită. Nu avem reclame și nu cerem nicio plată.",
            },
            {
              q: "De unde vin oportunitățile?",
              a: "Agregăm din zeci de surse verificate: agenții naționale (ANPCDEFP), ONG-uri, fundații, programe europene. Fiecare oportunitate are sursa indicată.",
            },
            {
              q: "Pot adăuga oportunități?",
              a: 'Da! Apasă butonul "Adaugă oportunitate" din pagina de explorare sau din meniul de navigare.',
            },
            {
              q: "Cum mă înscriu la o oportunitate?",
              a: 'Înscrierea se face pe site-ul oficial al organizatorului. Apasă "Detalii & Înscriere" pe cardul oportunității pentru a fi redirecționat.',
            },
            {
              q: "Sunt minor. Pot folosi platforma?",
              a: "Da, platforma e destinată tinerilor de 14+ ani. Nu colectăm date personale. Pentru înscrierea la oportunități externe, recomandăm informarea unui părinte.",
            },
          ].map((faq) => (
            <div
              key={faq.q}
              className="bg-surface rounded-xl border border-border p-5"
            >
              <h3 className="font-semibold text-sm mb-1.5">{faq.q}</h3>
              <p className="text-sm text-muted">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
