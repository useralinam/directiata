"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "all");
    setVisible(false);
  }

  function reject() {
    localStorage.setItem("cookie-consent", "essential");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 p-4">
      <div className="bg-surface rounded-2xl border border-border shadow-xl max-w-lg w-full p-6 sm:p-8 animate-fade-in-up">
        <h2 className="text-xl font-bold mb-1">
          Experiența ta e importantă pentru noi.
        </h2>
        <p className="text-muted text-sm mb-4">Ajută-ne să o perfecționăm!</p>

        <div className="text-sm text-text leading-relaxed space-y-2 mb-6">
          <p>
            Utilizăm cookie-uri pentru a îți oferi o mai bună navigare online,
            pentru a personaliza conținutul, pentru a analiza traficul și pentru a
            putea livra toate funcționalitățile site-ului nostru.
          </p>
          <p>
            Prin click pe <strong>&bdquo;Accept toate&rdquo;</strong>, ne oferi
            acordul pentru utilizarea cookie-urilor în scop de marketing,
            cercetare și analiză. Prin click pe{" "}
            <strong>&bdquo;Resping&rdquo;</strong>, se vor utiliza numai
            cookie-urile esențiale.
          </p>
          <p>
            Citește mai multe detalii despre cookie-uri în{" "}
            <Link
              href="/cookies"
              className="text-primary hover:underline font-medium"
            >
              Politica de cookie-uri
            </Link>
            .
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={reject}
            className="px-6 py-2.5 rounded-lg border-2 border-border font-semibold text-sm hover:bg-background transition-colors"
          >
            Resping
          </button>
          <button
            onClick={accept}
            className="px-6 py-2.5 rounded-lg bg-primary-dark text-white font-semibold text-sm hover:bg-primary transition-colors"
          >
            Accept toate
          </button>
        </div>
      </div>
    </div>
  );
}
