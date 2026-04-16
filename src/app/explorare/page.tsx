"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, SlidersHorizontal, Plus, LayoutGrid, List } from "lucide-react";
import OpportunityCard from "@/components/OpportunityCard";
import AddOpportunityModal from "@/components/AddOpportunityModal";
import { fetchOpportunities } from "@/lib/opportunities";
import type { Opportunity, OpportunityCategory } from "@/lib/types";
import { isExpired } from "@/lib/types";

const categories: { value: OpportunityCategory | "all"; label: string }[] = [
  { value: "all", label: "Toate" },
  { value: "voluntariat", label: "Voluntariat" },
  { value: "evenimente", label: "Evenimente" },
  { value: "workshopuri", label: "Workshopuri" },
  { value: "competitii", label: "Competiții" },
  { value: "tabere", label: "Tabere" },
  { value: "burse", label: "Burse & Granturi" },
];

const locations = ["Toate locațiile", "București", "Cluj-Napoca", "Timișoara", "Online", "Internațional"];

const ageRanges = [
  { value: "all", label: "Toate vârstele" },
  { value: "14", label: "14+ ani" },
  { value: "16", label: "16+ ani" },
  { value: "18", label: "18+ ani" },
];

function parseMinAge(ageRange?: string): number {
  if (!ageRange) return 0;
  const m = ageRange.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

function stripDiacritics(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const STORAGE_KEY = "directia-ta-filters";

interface Filters {
  category: OpportunityCategory | "all";
  location: string;
  freeOnly: boolean;
  ageRange: string;
}

function loadFilters(): Filters {
  if (typeof window === "undefined") return { category: "all", location: "Toate locațiile", freeOnly: false, ageRange: "all" };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { category: "all", location: "Toate locațiile", freeOnly: false, ageRange: "all" };
}

function saveFilters(filters: Filters) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(filters)); } catch { /* ignore */ }
}

export default function ExplorarePage() {
  return (
    <Suspense>
      <ExplorareContent />
    </Suspense>
  );
}

function ExplorareContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<OpportunityCategory | "all">("all");
  const [selectedLocation, setSelectedLocation] = useState("Toate locațiile");
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [selectedAge, setSelectedAge] = useState("all");
  const [mounted, setMounted] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [showPast, setShowPast] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Auto-open modal when ?adauga=1 is in URL, read ?tag= and ?cat= params
  useEffect(() => {
    if (searchParams.get("adauga") === "1") {
      setShowAddModal(true);
    }
    const tagParam = searchParams.get("tag");
    if (tagParam) {
      setSelectedTag(tagParam);
    }
    const catParam = searchParams.get("cat");
    if (catParam && categories.some((c) => c.value === catParam)) {
      setSelectedCategory(catParam as OpportunityCategory | "all");
    }
  }, [searchParams]);

  // Load saved filters + opportunities from Supabase on mount
  useEffect(() => {
    const saved = loadFilters();
    // Only apply saved category if no ?cat= param
    if (!searchParams.get("cat")) {
      setSelectedCategory(saved.category);
    }
    setSelectedLocation(saved.location);
    setShowFreeOnly(saved.freeOnly);
    setSelectedAge(saved.ageRange);
    fetchOpportunities().then((data) => {
      setAllOpportunities(data);
      setLoading(false);
    });
    setMounted(true);
  }, []);

  // Persist filters on change
  useEffect(() => {
    if (!mounted) return;
    saveFilters({ category: selectedCategory, location: selectedLocation, freeOnly: showFreeOnly, ageRange: selectedAge });
  }, [selectedCategory, selectedLocation, showFreeOnly, selectedAge, mounted]);

  function handleAddOpportunity(opp: Opportunity) {
    setAllOpportunities((prev) => [opp, ...prev]);
  }

  // Filter all except active/past (used for consistent badge counts)
  const baseFiltered = useMemo(() => {
    return allOpportunities.filter((opp) => {
      const matchesCategory = selectedCategory === "all" || opp.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        stripDiacritics(opp.title.toLowerCase()).includes(stripDiacritics(searchQuery.toLowerCase())) ||
        stripDiacritics(opp.description.toLowerCase()).includes(stripDiacritics(searchQuery.toLowerCase())) ||
        opp.tags.some((t) => stripDiacritics(t.toLowerCase()).includes(stripDiacritics(searchQuery.toLowerCase())));
      const matchesLocation =
        selectedLocation === "Toate locațiile" ||
        stripDiacritics(opp.location.toLowerCase()).includes(stripDiacritics(selectedLocation.toLowerCase()));
      const matchesFree = !showFreeOnly || opp.isFree;
      const matchesAge =
        selectedAge === "all" || parseMinAge(opp.ageRange) <= parseInt(selectedAge, 10);
      const matchesTag = !selectedTag || opp.tags.some((t) => stripDiacritics(t.toLowerCase()) === stripDiacritics(selectedTag.toLowerCase()));
      return matchesCategory && matchesSearch && matchesLocation && matchesFree && matchesAge && matchesTag;
    });
  }, [searchQuery, selectedCategory, selectedLocation, showFreeOnly, selectedAge, selectedTag, allOpportunities]);

  // Apply active/past filter on top
  const filtered = useMemo(() => {
    return baseFiltered.filter((opp) => {
      const oppExpired = isExpired(opp);
      return showPast ? oppExpired : !oppExpired;
    });
  }, [baseFiltered, showPast]);

  // Badge counts reflect current filters (consistent with what's shown)
  const activeCount = useMemo(() => baseFiltered.filter((o) => !isExpired(o)).length, [baseFiltered]);
  const pastCount = useMemo(() => baseFiltered.filter(isExpired).length, [baseFiltered]);

  const activeFilters = [
    selectedCategory !== "all" && selectedCategory,
    selectedLocation !== "Toate locațiile" && selectedLocation,
    showFreeOnly && "Gratuit",
    selectedAge !== "all" && `${selectedAge}+ ani`,
    selectedTag && `🏷️ ${selectedTag}`,
  ].filter(Boolean);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            Explorează <span className="text-primary">oportunități</span>
          </h1>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-muted text-lg">
              {filtered.length} oportunități {showPast ? "încheiate" : "disponibile"} pentru tine
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Adaugă oportunitate
            </button>
          </div>

          {/* Active / Past tabs */}
          <div className="mt-4 flex gap-1 bg-background rounded-xl border border-border p-1 max-w-md">
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

          {/* Search */}
          <div className="mt-6 flex items-center bg-background rounded-xl border border-border p-2 max-w-2xl">
            <Search className="w-5 h-5 text-muted ml-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Caută după titlu, descriere sau tag..."
              className="flex-1 px-3 py-2 text-sm bg-transparent outline-none placeholder:text-muted/60"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="p-2 hover:bg-surface-alt rounded-lg">
                <X className="w-4 h-4 text-muted" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-surface border border-border rounded-xl text-sm font-bold"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {showMobileFilters ? "Ascunde filtrele" : "Filtre"}
            {activeFilters.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                {activeFilters.length}
              </span>
            )}
          </button>

          {/* Sidebar filters */}
          <aside className={`lg:w-56 shrink-0 ${showMobileFilters ? "block" : "hidden lg:block"}`}>
            <div className="lg:sticky lg:top-24 space-y-8">
              {/* Categories */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
                  Categorie
                </h3>
                <div className="flex flex-wrap gap-1.5 lg:flex-col lg:gap-0.5">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all lg:w-full lg:text-left ${
                        selectedCategory === cat.value
                          ? "bg-primary/8 text-primary font-bold"
                          : "text-foreground/70 hover:text-foreground hover:bg-surface-alt font-medium"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age range */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
                  Vârstă
                </h3>
                <div className="flex flex-wrap gap-1.5 lg:flex-col lg:gap-0.5">
                  {ageRanges.map((age) => (
                    <button
                      key={age.value}
                      onClick={() => setSelectedAge(age.value)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all lg:w-full lg:text-left ${
                        selectedAge === age.value
                          ? "bg-primary/8 text-primary font-bold"
                          : "text-foreground/70 hover:text-foreground hover:bg-surface-alt font-medium"
                      }`}
                    >
                      {age.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
                  Locație
                </h3>
                <div className="flex flex-wrap gap-1.5 lg:flex-col lg:gap-0.5">
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setSelectedLocation(loc)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all lg:w-full lg:text-left ${
                        selectedLocation === loc
                          ? "bg-primary/8 text-primary font-bold"
                          : "text-foreground/70 hover:text-foreground hover:bg-surface-alt font-medium"
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Free toggle */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer px-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={showFreeOnly}
                      onChange={(e) => setShowFreeOnly(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-border rounded-full peer-checked:bg-primary transition-colors" />
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-transform" />
                  </div>
                  <span className="text-sm font-bold">Doar gratuite</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Top bar: filters + view toggle */}
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                {activeFilters.length > 0 && (
                  <>
                    <span className="text-xs text-muted font-medium">Filtre active:</span>
                    {activeFilters.map((f) => (
                      <span
                        key={String(f)}
                        className="px-3 py-1 bg-primary/8 text-primary rounded-full text-xs font-bold"
                      >
                        {String(f)}
                      </span>
                    ))}
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setSelectedLocation("Toate locațiile");
                        setShowFreeOnly(false);
                        setSelectedAge("all");
                        setSearchQuery("");
                        setSelectedTag(null);
                        router.replace("/explorare", { scroll: false });
                      }}
                      className="text-xs text-muted hover:text-secondary font-medium underline"
                    >
                      Resetează
                    </button>
                  </>
                )}
              </div>

              {/* View toggle */}
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-white" : "bg-surface text-muted hover:text-foreground"}`}
                  title="Vizualizare grilă"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-white" : "bg-surface text-muted hover:text-foreground"}`}
                  title="Vizualizare listă"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Grid / List */}
            {filtered.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map((opp) => (
                    <OpportunityCard key={opp.id} opportunity={opp} variant="grid" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map((opp) => (
                    <OpportunityCard key={opp.id} opportunity={opp} variant="list" />
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2">Nicio oportunitate găsită</h3>
                <p className="text-muted">
                  Încearcă să modifici filtrele sau să cauți altceva.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Motivational banner */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white text-center py-5 mt-4">
        <p className="text-sm font-medium opacity-90">
          Fii printre primii care își găsesc direcția — suntem la început, dar creștem în fiecare zi
        </p>
      </div>

      {/* Add Opportunity Modal */}
      <AddOpportunityModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddOpportunity}
      />
    </div>
  );
}
