import Link from "next/link";
import { Compass, Heart } from "lucide-react";

const footerLinks = {
  Explorează: [
    { label: "Voluntariat", href: "/voluntariat" },
    { label: "Evenimente", href: "/evenimente" },
    { label: "Workshopuri", href: "/explorare?cat=workshopuri" },
    { label: "Competiții", href: "/explorare?cat=competitii" },
    { label: "Tabere", href: "/explorare?cat=tabere" },
    { label: "Burse & Granturi", href: "/explorare?cat=burse" },
  ],
  Platformă: [
    { label: "Despre noi", href: "/despre" },
    { label: "Cum funcționează", href: "/cum-functioneaza" },
    { label: "Pentru organizații", href: "/organizatii" },
    { label: "Blog", href: "/blog" },
  ],
  Legal: [
    { label: "Termeni și condiții", href: "/termeni" },
    { label: "Politica de confidențialitate", href: "/confidentialitate" },
    { label: "Politica cookies", href: "/cookies" },
    { label: "Contact", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Compass className="w-7 h-7 text-primary" strokeWidth={1.8} />
              <span className="text-xl font-bold tracking-tight">
                Direcția<span className="text-primary">Ta</span>
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              Platforma națională unde tinerii 14+ descoperă oportunități reale
              de dezvoltare. Voluntariat, evenimente, experiențe care contează.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-sm mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} DirecțiaTa. Toate drepturile rezervate.
          </p>
          <p className="text-xs text-muted flex items-center gap-1">
            Făcut cu <Heart className="w-3 h-3 text-secondary fill-secondary" /> pentru tinerii din România
          </p>
        </div>
      </div>
    </footer>
  );
}
