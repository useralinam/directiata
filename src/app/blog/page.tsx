import Link from "next/link";
import { ArrowLeft, BookOpen, Calendar } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Ghiduri, sfaturi și inspirație pentru tineri: voluntariat, oportunități europene, dezvoltare personală.",
};

const articles = [
  {
    id: 1,
    title: "Ghid: Cum să-ți alegi primul voluntariat",
    excerpt:
      "Nu știi de unde să începi? Iată 5 criterii simple care te ajută să alegi o experiență de voluntariat potrivită pentru tine.",
    date: "2 aprilie 2026",
    category: "Ghiduri",
    readTime: "4 min",
  },
  {
    id: 2,
    title: "Ce este Corpul European de Solidaritate și cum te înscrii",
    excerpt:
      "Programul UE care îți oferă oportunitatea să faci voluntariat în altă țară, cu toate cheltuielile acoperite. Ghid complet pas cu pas.",
    date: "28 martie 2026",
    category: "Programe UE",
    readTime: "6 min",
  },
  {
    id: 3,
    title: "Top 10 competiții pentru liceeni în 2026",
    excerpt:
      "De la olimpiadele naționale la hackathoane și concursuri creative — cele mai importante competiții la care te poți înscrie anul acesta.",
    date: "20 martie 2026",
    category: "Competiții",
    readTime: "5 min",
  },
  {
    id: 4,
    title: "Cum arată un CV bun pentru un elev de liceu",
    excerpt:
      "Voluntariatul, competițiile și workshopurile contează. Iată cum să le prezinți într-un CV care impresionează.",
    date: "14 martie 2026",
    category: "Dezvoltare",
    readTime: "4 min",
  },
  {
    id: 5,
    title: "5 tabere de vară gratuite pentru tineri din România",
    excerpt:
      "Tabere educaționale, de leadership și ecologie organizate de ONG-uri și finanțate integral. Află cum te înscrii.",
    date: "8 martie 2026",
    category: "Tabere",
    readTime: "3 min",
  },
];

export default function BlogPage() {
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
          <BookOpen className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-bold">Blog</h1>
        </div>
        <p className="text-muted mb-10">
          Ghiduri, sfaturi și noutăți despre oportunități pentru tineri din
          România.
        </p>

        <div className="space-y-4">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-surface rounded-xl border border-border p-5 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {article.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted">
                  <Calendar className="w-3 h-3" />
                  {article.date}
                </span>
                <span className="text-xs text-muted">
                  · {article.readTime} citire
                </span>
              </div>
              <h2 className="font-semibold mb-1.5">{article.title}</h2>
              <p className="text-sm text-muted leading-relaxed">
                {article.excerpt}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 bg-primary/5 rounded-xl border border-primary/20 p-6 text-center">
          <p className="text-sm text-muted">
            Blogul este în curs de dezvoltare. Articolele de mai sus sunt
            previzualizări ale conținutului viitor. Revino curând pentru ghiduri
            complete!
          </p>
        </div>
      </div>
    </main>
  );
}
