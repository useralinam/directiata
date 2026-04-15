"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import OpportunityCard from "./OpportunityCard";
import { fetchOpportunities } from "@/lib/opportunities";
import type { Opportunity } from "@/lib/types";

export default function FeaturedOpportunities() {
  const [featured, setFeatured] = useState<Opportunity[]>([]);

  useEffect(() => {
    fetchOpportunities().then((data) => setFeatured(data.slice(0, 6)));
  }, []);

  return (
    <section className="py-20 bg-surface-alt/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
              Oportunități <span className="text-primary">recomandate</span>
            </h2>
            <p className="text-muted text-lg">
              Cele mai noi și relevante oportunități adăugate pe platformă.
            </p>
          </div>
          <Link
            href="/explorare"
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border hover:border-primary text-sm font-semibold hover:text-primary transition-all"
          >
            Vezi toate
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((opp) => (
            <div
              key={opp.id}
              className="animate-fade-in-up"
            >
              <OpportunityCard opportunity={opp} />
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/explorare"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-sm font-semibold hover:border-primary hover:text-primary transition-all"
          >
            Vezi toate oportunitățile
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
