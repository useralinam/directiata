import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-accent-purple p-10 md:p-16 text-center text-white animate-fade-in-up"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <Compass className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Pregătit să-ți găsești direcția?
            </h2>

            <p className="text-lg text-white/80 max-w-xl mx-auto mb-8 leading-relaxed">
              Explorează sute de oportunități de voluntariat, evenimente, burse, tabere și practică
              la companii de top. <strong className="text-white">Totul e gratuit.</strong>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/explorare"
                className="group px-8 py-4 bg-white text-primary font-bold rounded-2xl hover:bg-white/90 transition-all shadow-lg flex items-center gap-2"
              >
                Explorează Acum
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/practica"
                className="px-8 py-4 border-2 border-white/30 rounded-2xl font-bold hover:bg-white/10 transition-all"
              >
                Practică la companii
              </Link>
            </div>

            <p className="text-sm text-white/50 mt-6">
              Fii printre primii care își găsesc direcția — suntem la început, dar creștem în fiecare zi
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
