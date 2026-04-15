import { Compass } from "lucide-react";
import Link from "next/link";

export default function HartaMeaPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-accent-green/5 to-accent-blue/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent-green/10 flex items-center justify-center">
              <Compass className="w-5 h-5 text-accent-green" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            Harta <span className="text-primary">Mea</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl">
            Parcursul tău personal de dezvoltare. Aici vezi unde ești, unde ai fost și încotro te îndrepți.
          </p>
        </div>
      </div>

      {/* Coming soon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-6">🗺️</div>
          <h2 className="text-2xl font-extrabold mb-3">Vine în curând</h2>
          <p className="text-muted leading-relaxed mb-8">
            Harta Mea va include profilul tău de explorator, portofoliul de experiențe,
            badge-uri câștigate și parcursul personalizat de dezvoltare.
          </p>

          <div className="bg-surface rounded-2xl border border-border p-6 text-left space-y-4 mb-8">
            <h3 className="font-bold text-sm">Ce va include:</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-center gap-2">✅ Test de interese gamificat</li>
              <li className="flex items-center gap-2">✅ Profil de explorator personalizat</li>
              <li className="flex items-center gap-2">✅ Portofoliu de experiențe completate</li>
              <li className="flex items-center gap-2">✅ Badge-uri și niveluri</li>
              <li className="flex items-center gap-2">✅ Parcurs recomandat de dezvoltare</li>
              <li className="flex items-center gap-2">✅ Statistici și progres vizual</li>
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
