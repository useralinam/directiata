import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    emoji: "🤝",
    title: "Voluntariat",
    description: "Dă înapoi comunității. Descoperă proiecte sociale, ecologie, educație și multe altele.",
    count: "1.200+",
    href: "/voluntariat",
  },
  {
    emoji: "🎪",
    title: "Evenimente",
    description: "Conferințe, festivaluri, hackathoane, TEDx — experimentează energie și inspirație.",
    count: "850+",
    href: "/evenimente",
  },
  {
    emoji: "💡",
    title: "Workshopuri",
    description: "Învață practic: public speaking, programare, antreprenoriat, fotografie și mult mai mult.",
    count: "420+",
    href: "/explorare?cat=workshopuri",
  },
  {
    emoji: "🏆",
    title: "Competiții",
    description: "Olimpiade, hackatoane, debate — pune-te la încercare și câștigă experiență reală.",
    count: "310+",
    href: "/explorare?cat=competitii",
  },
  {
    emoji: "⛺",
    title: "Tabere",
    description: "Tabere tematice de vară, natură, STEM, artă — aventuri care te transformă.",
    count: "180+",
    href: "/explorare?cat=tabere",
  },
  {
    emoji: "🎓",
    title: "Burse & Granturi",
    description: "Burse de studiu, granturi pentru proiecte, fonduri pentru idei — banii care te ajută să crești.",
    count: "540+",
    href: "/explorare?cat=burse",
  },
];

export default function CategoryGrid() {
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
                  <span className="text-xs font-bold text-muted bg-surface-alt px-2.5 py-1 rounded-full">
                    {cat.count}
                  </span>
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
