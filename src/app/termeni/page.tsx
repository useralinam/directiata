import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermeniPage() {
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
          <FileText className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-bold">Termeni și condiții</h1>
        </div>
        <p className="text-sm text-muted mb-10">
          Ultima actualizare: 4 aprilie 2026
        </p>

        <div className="space-y-8 text-text leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Despre platformă</h2>
            <p>
              DirecțiaTa este o platformă online de agregare a oportunităților
              educaționale și de dezvoltare personală destinate tinerilor din
              România cu vârsta de 14 ani și peste. Platforma colectează și
              centralizează informații din surse publice verificate despre
              programe de voluntariat, evenimente, workshopuri, competiții,
              tabere și burse.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Acceptarea termenilor</h2>
            <p>
              Prin accesarea și utilizarea platformei DirecțiaTa, accepți
              prezentele termeni și condiții. Dacă nu ești de acord cu acești
              termeni, te rugăm să nu folosești platforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Servicii oferite</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Agregarea oportunităților din surse publice verificate din
                România și Uniunea Europeană
              </li>
              <li>
                Filtrarea și căutarea oportunităților după categorie, locație,
                vârstă și alte criterii
              </li>
              <li>
                Informații despre termene limită, condiții de participare și
                linkuri către organizatorii oficiali
              </li>
              <li>
                Posibilitatea de a adăuga oportunități noi prin formularul
                dedicat
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Rolul platformei</h2>
            <p>
              DirecțiaTa este un <strong>agregator de informații</strong> și nu
              organizează direct niciuna dintre oportunitățile listate.
              Înscrierea la oportunități se face pe site-urile oficiale ale
              organizatorilor. Nu suntem responsabili pentru conținutul,
              acuratețea sau disponibilitatea informațiilor de pe site-urile
              terțe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Utilizatori minori</h2>
            <p>
              Platforma este destinată tinerilor cu vârsta de 14 ani și peste.
              Pentru utilizatorii cu vârsta sub 16 ani, recomandăm utilizarea
              platformei cu informarea și acordul unui părinte sau tutore legal,
              în special pentru înscrierea la oportunități externe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Proprietate intelectuală</h2>
            <p>
              Conținutul, designul și codul platformei DirecțiaTa sunt protejate
              de dreptul de autor. Informațiile despre oportunități sunt preluate
              din surse publice și aparțin organizatorilor respectivi.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Limitarea răspunderii</h2>
            <p>
              DirecțiaTa depune eforturi rezonabile pentru a menține informațiile
              actualizate și corecte, însă nu garantăm completitudinea sau
              acuratețea datelor în orice moment. Utilizatorii sunt responsabili
              să verifice detaliile pe site-urile oficiale ale organizatorilor
              înainte de înscriere.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Modificări</h2>
            <p>
              Ne rezervăm dreptul de a modifica acești termeni oricând.
              Modificările vor fi publicate pe această pagină cu data actualizării.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Contact</h2>
            <p>
              Pentru întrebări despre acești termeni, ne poți contacta pe{" "}
              <Link href="/contact" className="text-primary hover:underline">
                pagina de contact
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
