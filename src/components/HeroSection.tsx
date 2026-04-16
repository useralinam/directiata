"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Search, MapPin } from "lucide-react";
import { fetchCategoryCounts } from "@/lib/opportunities";

export default function HeroSection() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    fetchCategoryCounts().then((c) => setTotal(c.total));
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float [animation-delay:2s]" />
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-accent-green/5 rounded-full blur-3xl animate-float [animation-delay:4s]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              Platforma Națională pentru Tineri 14+
            </span>
          </div>

          {/* Heading */}
          <h1 className="animate-fade-in-up [animation-delay:100ms] text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Descoperă-ți{" "}
            <span className="text-primary">direcția</span>
            <br />
            prin experiențe reale
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up [animation-delay:200ms] text-lg md:text-xl text-muted leading-relaxed mb-10 max-w-2xl mx-auto">
            Voluntariat, evenimente, workshopuri, competiții și tabere — toate într-un singur loc.
            Descoperă <strong className="text-foreground">{total ? `peste ${total} de oportunități` : "oportunități"}</strong> din zeci de surse verificate.
          </p>

          {/* Search bar */}
          <div className="animate-fade-in-up [animation-delay:300ms] max-w-xl mx-auto mb-8">
            <div className="flex items-center bg-surface rounded-2xl border border-border shadow-lg shadow-primary/5 p-2">
              <Search className="w-5 h-5 text-muted ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Ce vrei să descoperi? (ex: voluntariat, robotică, artă...)"
                className="flex-1 px-3 py-3 text-sm bg-transparent outline-none placeholder:text-muted/60"
              />
              <button className="px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors shrink-0">
                Caută
              </button>
            </div>
          </div>

          {/* Quick filters */}
          <div className="animate-fade-in-up [animation-delay:400ms] flex flex-wrap justify-center gap-2 mb-10">
            {[
              { label: "🤝 Voluntariat", href: "/voluntariat" },
              { label: "🎪 Evenimente", href: "/evenimente" },
              { label: "💡 Workshopuri", href: "/explorare?cat=workshopuri" },
              { label: "🏆 Competiții", href: "/explorare?cat=competitii" },
              { label: "⛺ Tabere", href: "/explorare?cat=tabere" },
              { label: "🎓 Burse", href: "/explorare?cat=burse" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-full bg-surface border border-border text-sm font-medium hover:border-primary hover:text-primary transition-all"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="animate-fade-in-up [animation-delay:500ms] flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/quiz"
              className="group px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              Ce tip de explorator ești?
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/explorare"
              className="px-8 py-4 border-2 border-border rounded-2xl font-bold hover:border-primary hover:text-primary transition-all flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Explorează oportunități
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
