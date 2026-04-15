import { Users, MessageSquare, Star, Award } from "lucide-react";
import Link from "next/link";

export default function ComunitatePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-accent-purple/5 to-primary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-accent-purple" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            <span className="text-primary">Comunitatea</span> DirecțiaTa
          </h1>
          <p className="text-muted text-lg max-w-2xl">
            Conectează-te cu alți tineri care vor să crească. Împărtășește experiențe, cere sfaturi
            și inspiră-te din poveștile celorlalți.
          </p>
        </div>
      </div>

      {/* Coming soon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-6">🌐</div>
          <h2 className="text-2xl font-extrabold mb-3">Vine în curând</h2>
          <p className="text-muted leading-relaxed mb-8">
            Comunitatea DirecțiaTa va fi spațiul unde tinerii se conectează, împărtășesc experiențe
            și se ajută reciproc să-și găsească drumul.
          </p>

          <div className="bg-surface rounded-2xl border border-border p-6 text-left space-y-4 mb-8">
            <h3 className="font-bold text-sm">Ce va include:</h3>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Forum pe categorii — pune întrebări, oferă răspunsuri, creează discuții</span>
              </li>
              <li className="flex items-start gap-3">
                <Star className="w-4 h-4 text-accent-yellow mt-0.5 shrink-0" />
                <span>Review-uri de la tineri care au participat deja la oportunități</span>
              </li>
              <li className="flex items-start gap-3">
                <Award className="w-4 h-4 text-accent-green mt-0.5 shrink-0" />
                <span>Leaderboard cu cei mai activi exploratori și mentori</span>
              </li>
              <li className="flex items-start gap-3">
                <Users className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                <span>Grupuri pe interese — STEM, artă, social, sport, antreprenoriat</span>
              </li>
            </ul>
          </div>

          <Link
            href="/quiz"
            className="inline-flex px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"
          >
            Între timp, fă quiz-ul de explorator →
          </Link>
        </div>
      </div>
    </div>
  );
}
