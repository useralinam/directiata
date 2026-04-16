"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchCategoryCounts, type CategoryCounts } from "@/lib/opportunities";

const categories = [
  {
    emoji: "🤝",
    title: "Voluntariat",
    key: "voluntariat" as const,
    description: "Dă înapoi comunității. Descoperă proiecte sociale, ecologie, educație și multe altele.",
    href: "/voluntariat",
  },
  {
    emoji: "🎪",
    title: "Evenimente",
    key: "evenimente" as const,
    description: "Conferințe, festivaluri, hackathoane, TEDx — experimentează energie și inspirație.",
    href: "/evenimente",
  },
  {
    emoji: "💡",
    title: "Workshopuri",
    key: "workshopuri" as const,
    description: "Învață practic: public speaking, programare, antreprenoriat, fotografie și mult mai mult.",
    href: "/explorare?cat=workshopuri",
  },
  {
    emoji: "🏆",
    title: "Competiții",
    key: "competitii" as const,
    description: "Olimpiade, hackatoane, debate — pune-te la încercare și câștigă experiență reală.",
    href: "/explorare?cat=competitii",
  },
  {
    emoji: "⛺",
    title: "Tabere",
    key: "tabere" as const,
    description: "Tabere tematice de vară, natură, STEM, artă — aventuri care te transformă.",
    href: "/explorare?cat=tabere",
  },
  {
    emoji: "🎓",
    title: "Burse & Granturi",
    key: "burse" as const,
    description: "Burse de studiu, granturi pentru proiecte, fonduri pentru idei — banii care te ajută să crești.",
    href: "/explorare?cat=burse",
  },
];

export default function CategoryGrid() {
  const [counts, setCounts] = useState<CategoryCounts | null>(null);

  useEffect(() => {
    fetchCategoryCounts().then(setCounts);
  }, []);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Ce vrei să <span className="text-primary">descoperi</span>?
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Alege categoria care te atrage. Fiecare experiență te duce mai aproape de cine vrei să fii.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="animate-fade-in-up"
            >
              <Link
                href={cat.href}
                className="card-hover h-full flex flex-col p-6 rounded-2xl border border-border bg-surface hover:border-primary/40 transition-all group"
              >
                <span className="text-5xl mb-4 block" role="img">{cat.emoji}</span>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold">{cat.title}</h3>
                  {counts && (
                    <span className="text-xs font-bold text-foreground bg-surface-alt px-2.5 py-1 rounded-full">
                      {counts[cat.key]}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted leading-relaxed mb-4 flex-1">
                  {cat.description}
                </p>
                <span className="text-sm font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explorează
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
