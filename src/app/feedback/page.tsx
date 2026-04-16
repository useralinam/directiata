"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Send, Loader2, CheckCircle } from "lucide-react";

export default function FeedbackPage() {
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!type || !message) {
      setError("Alege un tip de feedback și scrie mesajul.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Feedback anonim",
          email: email || "feedback@directiata.ro",
          subject: `Feedback: ${type}`,
          message,
        }),
      });
      if (!res.ok) throw new Error("Eroare la trimitere");
      setSent(true);
    } catch {
      setError("Nu am putut trimite. Încearcă din nou.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Înapoi
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-7 h-7 text-accent" />
          <h1 className="text-3xl font-bold">Dă-ne feedback</h1>
        </div>
        <p className="text-muted mb-8">
          Spune-ne ce ar fi util pe platformă, ce nu funcționează bine sau ce ți-ar plăcea să adăugăm. 
          Fiecare părere contează!
        </p>

        {sent ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="font-semibold text-green-800 text-lg mb-1">Mulțumim!</p>
            <p className="text-sm text-green-700">Feedback-ul tău ne ajută să facem platforma mai bună.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Ce tip de feedback ai? *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { value: "Funcție nouă", emoji: "💡" },
                  { value: "Bug / Eroare", emoji: "🐛" },
                  { value: "Design / UX", emoji: "🎨" },
                  { value: "Conținut lipsă", emoji: "📝" },
                  { value: "Pozitiv", emoji: "❤️" },
                  { value: "Altceva", emoji: "💬" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setType(opt.value)}
                    className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                      type === opt.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {opt.emoji} {opt.value}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Mesajul tău *
              </label>
              <textarea
                id="message"
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-colors resize-y"
                placeholder="Descrie ce ai observat sau ce ți-ar plăcea să adăugăm..."
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                E-mail (opțional — dacă vrei răspuns)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-colors"
                placeholder="adresa@email.com"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {sending ? "Se trimite..." : "Trimite feedback"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
