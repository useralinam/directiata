"use client";

import Link from "next/link";
import { ArrowLeft, Mail, MessageCircle, MapPin, Send } from "lucide-react";

export default function ContactPage() {
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
          <MessageCircle className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-bold">Contact</h1>
        </div>
        <p className="text-muted mb-10">
          Ai o întrebare, o sugestie sau vrei să ne semnalezi o problemă? Ne
          bucurăm să auzim de la tine!
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Formular */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Scrie-ne un mesaj</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Nume (opțional)
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-colors"
                  placeholder="Numele tău"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-colors"
                  placeholder="adresa@email.com"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium mb-1"
                >
                  Subiect
                </label>
                <select
                  id="subject"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-colors"
                >
                  <option value="">Alege un subiect</option>
                  <option value="sugestie">Sugestie de oportunitate</option>
                  <option value="eroare">Raportare eroare</option>
                  <option value="organizatie">
                    Sunt organizație și vreau un parteneriat
                  </option>
                  <option value="feedback">Feedback general</option>
                  <option value="altele">Altele</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-1"
                >
                  Mesaj
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-colors resize-y"
                  placeholder="Scrie mesajul tău aici..."
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-dark transition-colors"
              >
                <Send className="w-4 h-4" />
                Trimite mesajul
              </button>
            </form>
          </div>

          {/* Info contact */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">
              Alte modalități de contact
            </h2>

            <div className="bg-surface rounded-xl border border-border p-5 space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">E-mail</p>
                  <p className="text-sm text-muted">contact@directia-ta.ro</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Adresă</p>
                  <p className="text-sm text-muted">Calea Grivitei 214, București, Sector 1</p>
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-xl border border-border p-5">
              <h3 className="font-semibold text-sm mb-2">Operator</h3>
              <p className="text-sm text-muted leading-relaxed">
                TECHLAYER SOFTWARE SRL · CUI 50975494
              </p>
            </div>

            <div className="bg-primary/5 rounded-xl border border-primary/20 p-5">
              <h3 className="font-semibold text-sm mb-2">
                Ești organizație?
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Dacă organizezi evenimente, programe de voluntariat sau alte
                oportunități pentru tineri și vrei să le promovezi gratuit pe
                platformă, contactează-ne și te vom lista în baza noastră de
                date.
              </p>
            </div>

            <div className="bg-surface rounded-xl border border-border p-5">
              <h3 className="font-semibold text-sm mb-2">Timp de răspuns</h3>
              <p className="text-sm text-muted leading-relaxed">
                Răspundem de obicei în 1-3 zile lucrătoare. Pentru solicitări
                urgente, te rugăm să menționezi în subiect.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
