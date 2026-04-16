import Link from "next/link";
import { ArrowLeft, Lock, Eye, Database, UserCheck, Trash2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de confidențialitate",
  description: "Cum protejăm datele tale pe DirecțiaTa. Nu colectăm date personale, nu avem conturi de utilizator.",
};

export default function ConfidentialitatePage() {
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
          <Lock className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-bold">Politica de confidențialitate</h1>
        </div>
        <p className="text-sm text-muted mb-10">
          Ultima actualizare: 4 aprilie 2026
        </p>

        <div className="space-y-8 text-text leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-3">Operator de date</h2>
            <p className="mb-3">
              Operatorul platformei DirecțiaTa este{" "}
              <strong>TECHLAYER SOFTWARE SRL</strong>, CUI 50975494, cu sediul
              în Calea Grivitei 214, București, Sector 1, România. Contact:{" "}
              alina.tomsa@techlayer.ro.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Angajamentul nostru</h2>
            <p>
              DirecțiaTa respectă confidențialitatea tuturor utilizatorilor, în
              special a minorilor. Această politică explică ce date colectăm, cum
              le folosim și care sunt drepturile tale conform Regulamentului
              General privind Protecția Datelor (GDPR).
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Ce date colectăm</h2>
            </div>
            <p className="mb-3">
              DirecțiaTa este proiectată să funcționeze cu{" "}
              <strong>minimum de date personale</strong>:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Nu colectăm date personale.</strong> Nu cerem nume,
                e-mail, telefon sau alte informații de identificare.
              </li>
              <li>
                <strong>Nu avem sistem de conturi.</strong> Nu este nevoie de
                înregistrare pentru a folosi platforma.
              </li>
              <li>
                <strong>Date stocate local.</strong> Preferințele de filtrare și
                oportunitățile adăugate de tine sunt salvate exclusiv în
                browserul tău (localStorage) și nu sunt transmise către niciun
                server.
              </li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-5 h-5 text-accent-green" />
              <h2 className="text-xl font-semibold">Cum folosim datele</h2>
            </div>
            <p>
              Singurele date pe care le stocăm sunt cele din browser (cookie de
              consimțământ și localStorage) pentru a-ți oferi o experiență mai
              bună. Nu le trimitem la servere externe, nu le analizăm și nu le
              partajăm cu terți.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <UserCheck className="w-5 h-5 text-accent-yellow" />
              <h2 className="text-xl font-semibold">Protecția minorilor</h2>
            </div>
            <p>
              Platforma este destinată tinerilor de 14+ ani. Ne angajăm să:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Nu colectăm date personale de la minori</li>
              <li>Nu folosim tehnici de urmărire (tracking)</li>
              <li>Nu afișăm publicitate targetată</li>
              <li>Nu partajăm nicio informație cu rețele publicitare</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Linkuri externe</h2>
            <p>
              Platforma conține linkuri către site-urile oficiale ale
              organizatorilor de oportunități. Odată ce părăsești DirecțiaTa,
              politica de confidențialitate a acelor site-uri se aplică. Te
              încurajăm să citești politicile de confidențialitate ale fiecărui
              site pe care îl vizitezi.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Trash2 className="w-5 h-5 text-secondary" />
              <h2 className="text-xl font-semibold">Drepturile tale</h2>
            </div>
            <p className="mb-3">Conform GDPR, ai dreptul la:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Ștergerea datelor locale</strong> — Poți șterge oricând
                cookie-urile și datele din localStorage din setările browserului
                tău.
              </li>
              <li>
                <strong>Informare</strong> — Această pagină îți oferă toate
                detaliile despre cum sunt gestionate datele.
              </li>
              <li>
                <strong>Retragerea consimțământului</strong> — Poți modifica
                oricând preferințele de cookie-uri.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Modificări</h2>
            <p>
              Această politică poate fi actualizată periodic. Versiunea curentă
              va fi mereu disponibilă pe această pagină.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Contact</h2>
            <p>
              Pentru întrebări legate de confidențialitate, ne poți scrie la{" "}
              alina.tomsa@techlayer.ro sau pe{" "}
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
