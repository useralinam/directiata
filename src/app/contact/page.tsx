"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, MessageCircle, MapPin, Send, Loader2, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !subject || !message) {
      setError("Completează e-mail, subiect și mesaj.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Eroare la trimitere");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eroare la trimitere");
    } finally {
      setSending(false);
    }
  }

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

            {sent ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <p className="font-semibold text-green-800 mb-1">Mesaj trimis!</p>
                <p className="text-sm text-green-700">Îți mulțumim. Revenim cu un răspuns cât mai curând.</p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Nume (opțional)
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-colors"
                    placeholder="Numele tău"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-colors"
                    placeholder="adresa@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">
                    Subiect *
                  </label>
                  <select
                    id="subject"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-colors"
                  >
                    <option value="">Alege un subiect</option>
                    <option value="Sugestie de oportunitate">Sugestie de oportunitate</option>
                    <option value="Raportare eroare">Raportare eroare</option>
                    <option value="Parteneriat organizație">Sunt organizație și vreau un parteneriat</option>
                    <option value="Feedback general">Feedback general</option>
                    <option value="Altele">Altele</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Mesaj *
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-colors resize-y"
                    placeholder="Scrie mesajul tău aici..."
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {sending ? "Se trimite..." : "Trimite mesajul"}
                </button>
              </form>
            )}
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
                  <p className="text-sm text-muted">alina.tomsa@techlayer.ro</p>
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
