"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart, Search, X } from "lucide-react";
import OpportunityCard from "@/components/OpportunityCard";
import { fetchOpportunitiesByCategory } from "@/lib/opportunities";
import type { Opportunity } from "@/lib/types";
import { isExpired } from "@/lib/types";

export default function VoluntariatPage() {
  const [search, setSearch] = useState("");
  const [allVoluntariat, setAllVoluntariat] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    fetchOpportunitiesByCategory("voluntariat").then((data) => {
      setAllVoluntariat(data);
      setLoading(false);
    });
  }, []);

  const opportunities = useMemo(() => {
    let list = allVoluntariat;
    // Filter by active vs past
    list = list.filter((o) => (showPast ? isExpired(o) : !isExpired(o)));
    if (!search) return list;
    return list.filter(
      (o) =>
        o.title.toLowerCase().includes(search.toLowerCase()) ||
        o.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, allVoluntariat, showPast]);

  const pastCount = useMemo(() => allVoluntariat.filter(isExpired).length, [allVoluntariat]);
  const activeCount = useMemo(() => allVoluntariat.filter((o) => !isExpired(o)).length, [allVoluntariat]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 to-accent-purple/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <span className="badge-voluntariat px-3 py-1 rounded-full text-xs font-semibold">
              Voluntariat
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            Oportunități de <span className="text-primary">voluntariat</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl mb-6">
            Descoperă proiecte de voluntariat local și internațional. Dă înapoi comunității,
            câștigă experiență și fă-ți prieteni pe viață.
          </p>

          <div className="flex items-center bg-surface rounded-xl border border-border p-2 max-w-lg">
            <Search className="w-5 h-5 text-muted ml-2 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Caută voluntariat..."
              className="flex-1 px-3 py-2 text-sm bg-transparent outline-none placeholder:text-muted/60"
            />
            {search && (
              <button onClick={() => setSearch("")} className="p-2 hover:bg-surface-alt rounded-lg">
                <X className="w-4 h-4 text-muted" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Active / Past tabs */}
        <div className="mb-6 flex gap-1 bg-surface rounded-xl border border-border p-1 max-w-md">
          <button
            onClick={() => setShowPast(false)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
              !showPast
                ? "bg-primary text-white shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            ✅ Active ({activeCount})
          </button>
          <button
            onClick={() => setShowPast(true)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
              showPast
                ? "bg-gray-600 text-white shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            📅 S-au desfășurat ({pastCount})
          </button>
        </div>

        <p className="text-sm text-muted mb-6">{opportunities.length} oportunități de voluntariat {showPast ? "încheiate" : ""}</p>
        {opportunities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">Nicio oportunitate găsită</h3>
            <p className="text-muted">Încearcă un alt termen de căutare.</p>
          </div>
        )}
      </div>

      {/* Motivational banner */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white text-center py-5 mt-4">
        <p className="text-sm font-medium opacity-90">
          Fii printre primii care își găsesc direcția — suntem la început, dar creștem în fiecare zi
        </p>
      </div>
    </div>
  );
}
