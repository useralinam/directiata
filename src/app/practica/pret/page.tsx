"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Building2, Check, ChevronRight, CreditCard, Gift, Loader2,
  Mail, Shield, Star, Zap
} from "lucide-react";

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <PricingContent />
    </Suspense>
  );
}

function PricingContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"info" | "checkout">(status === "success" ? "checkout" : "info");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const body = {
      company_name: fd.get("company_name") as string,
      company_email: fd.get("company_email") as string,
      contact_person: fd.get("contact_person") as string,
      company_website: fd.get("company_website") as string,
      cui: fd.get("cui") as string,
      billing_address: fd.get("billing_address") as string,
    };

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Eroare la procesare");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eroare la procesare");
      setLoading(false);
    }
  }

  // Success page
  if (status === "success") {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
            <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-green-800 mb-2">Subscripție activată!</h1>
            <p className="text-green-700 mb-4">
              Contul companiei tale a fost creat. Ai <strong>60 de zile gratuite</strong> pentru a lista practici pe DirecțiaTa.
            </p>
            <div className="bg-white border border-green-100 rounded-xl p-4 mb-6 text-sm text-left">
              <p className="font-medium mb-2">Ce urmează:</p>
              <ul className="space-y-1 text-muted">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />Poți lista practici folosind butonul „Sunt companie" de pe pagina <Link href="/practica" className="text-primary font-medium">Practică</Link></li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />Listările sunt verificate și publicate în max 24h</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />Vei primi aplicațiile studenților direct pe email</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />Cu 3 zile înainte de expirarea trial-ului, primești notificare</li>
              </ul>
            </div>
            <Link
              href="/practica"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors"
            >
              Listează prima practică
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Cancelled
  if (status === "cancelled") {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8">
            <CreditCard className="w-12 h-12 text-orange-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-2">Checkout anulat</h2>
            <p className="text-muted mb-4">Nu s-a efectuat nicio plată. Poți încerca din nou oricând.</p>
            <button
              onClick={() => { setStep("info"); window.history.replaceState({}, "", "/practica/pret"); }}
              className="text-primary font-semibold hover:underline"
            >
              ← Înapoi la abonament
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <Building2 className="w-10 h-10 text-primary mx-auto mb-3" />
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Listează practici pe <span className="text-primary">DirecțiaTa</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Ajungi la mii de studenți din toată România. Un singur abonament, listări nelimitate.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Plan card */}
          <div className="bg-surface rounded-2xl border-2 border-primary p-6 relative">
            <div className="absolute -top-3 left-6 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Gift className="w-3 h-3" />
              60 zile gratuit
            </div>

            <h2 className="text-xl font-bold mt-3 mb-1">Abonament Standard</h2>
            <p className="text-muted text-sm mb-5">Tot ce ai nevoie pentru a recruta stagiari.</p>

            <div className="flex items-baseline gap-1 mb-5">
              <span className="text-4xl font-extrabold">149</span>
              <span className="text-lg font-semibold text-muted">RON</span>
              <span className="text-muted text-sm">/ lună</span>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-5">
              <p className="text-sm text-green-800 font-medium flex items-center gap-1.5">
                <Gift className="w-4 h-4" />
                Primele 2 luni sunt complet gratuite!
              </p>
              <p className="text-xs text-green-700 mt-1">
                Nu se face nicio debitare în perioada de trial. Poți anula oricând.
              </p>
            </div>

            <ul className="space-y-2.5 mb-6">
              {[
                "Listări de practică nelimitate",
                "Vizibilitate pentru mii de studenți",
                "Aplicații cu CV direct pe email",
                "Badge «Verificat» pe listări",
                "Suport prioritar",
                "Statistici vizualizări (în curând)",
                "Factură fiscală automată",
                "Anulare oricând, fără penalități",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted mb-1">
                <Shield className="w-3.5 h-3.5" />
                Plată securizată prin Stripe
              </div>
              <div className="flex items-center gap-2 text-xs text-muted">
                <Mail className="w-3.5 h-3.5" />
                Factură electronică pe email
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-surface rounded-2xl border border-border p-6">
            <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Activează abonamentul
            </h2>
            <p className="text-sm text-muted mb-5">
              Completează datele companiei, apoi vei fi redirecționat către Stripe pentru confirmare.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Numele companiei *</label>
                <input name="company_name" required className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm outline-none focus:border-primary" placeholder="SC Exemplu SRL" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email companie *</label>
                <input name="company_email" type="email" required className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm outline-none focus:border-primary" placeholder="contact@companie.ro" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Persoană de contact</label>
                <input name="contact_person" className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm outline-none focus:border-primary" placeholder="Ion Popescu" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Website companie</label>
                <input name="company_website" type="url" className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm outline-none focus:border-primary" placeholder="https://companie.ro" />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">CUI / Cod fiscal</label>
                  <input name="cui" className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm outline-none focus:border-primary" placeholder="RO12345678" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Adresa de facturare</label>
                  <input name="billing_address" className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm outline-none focus:border-primary" placeholder="Str. Exemplu nr. 1, București" />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CreditCard className="w-4 h-4" />
                )}
                {loading ? "Redirecționare..." : "Începe 60 zile gratuit →"}
              </button>

              <p className="text-xs text-center text-muted mt-2">
                Nu ți se va debita nimic acum. Vei fi redirecționat către Stripe pentru a adăuga metoda de plată.
              </p>
            </form>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h3 className="text-lg font-bold text-center mb-6">Întrebări frecvente</h3>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              {
                q: "Ce se întâmplă după cele 60 de zile gratuite?",
                a: "Cardul asociat va fi debitat automat cu 149 RON/lună. Primești notificare cu 3 zile înainte. Poți anula oricând.",
              },
              {
                q: "Câte listări pot publica?",
                a: "Nelimitate! Un singur abonament acoperă toate pozițiile de practică ale companiei tale.",
              },
              {
                q: "Primesc factură fiscală?",
                a: "Da, Stripe emite automat factură electronică la fiecare plată. O primești pe email.",
              },
              {
                q: "Cum primesc aplicațiile studenților?",
                a: "Fiecare aplicație este trimisă direct pe emailul companiei, cu CV-ul atașat și mesajul de motivație.",
              },
              {
                q: "Pot anula oricând?",
                a: "Da, fără penalități. Listările rămân active până la sfârșitul perioadei plătite.",
              },
              {
                q: "Cine verifică listările?",
                a: "Echipa DirecțiaTa verifică manual fiecare listare înainte de publicare (max 24h).",
              },
            ].map(({ q, a }) => (
              <div key={q} className="bg-surface border border-border rounded-xl p-4">
                <p className="font-semibold text-sm mb-1 flex items-start gap-2">
                  <Star className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  {q}
                </p>
                <p className="text-sm text-muted pl-6">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
