"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Compass, Search, Plus } from "lucide-react";

const navLinks = [
  { href: "/explorare", label: "Explorează" },
  { href: "/voluntariat", label: "Voluntariat" },
  { href: "/evenimente", label: "Evenimente" },
  { href: "/harta-mea", label: "Harta Mea" },
  { href: "/comunitate", label: "Comunitate" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Compass className="w-7 h-7 text-primary group-hover:rotate-45 transition-transform duration-300" strokeWidth={1.8} />
            <span className="text-xl font-bold tracking-tight">
              Direcția<span className="text-primary">Ta</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-surface-alt transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-surface-alt transition-colors">
              <Search className="w-5 h-5 text-muted" />
            </button>
            <Link
              href="/explorare?adauga=1"
              className="px-4 py-2.5 border border-border text-sm font-semibold rounded-xl hover:border-primary hover:text-primary transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Adaugă
            </Link>
            <Link
              href="/quiz"
              className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-sm"
            >
              Începe Quiz-ul
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/explorare" className="p-2 rounded-lg hover:bg-surface-alt">
              <Search className="w-5 h-5 text-muted" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-surface-alt"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-surface">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-surface-alt transition-all"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/quiz"
              onClick={() => setIsOpen(false)}
              className="block text-center mt-3 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl"
            >
              Începe Quiz-ul
            </Link>
            <Link
              href="/explorare?adauga=1"
              onClick={() => setIsOpen(false)}
              className="block text-center mt-2 px-5 py-3 border border-border text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Adaugă oportunitate
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
