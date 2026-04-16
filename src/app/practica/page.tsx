"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase, MapPin, Clock, Calendar, Users, ExternalLink,
  Search, Building2, Plus, ChevronDown, Loader2, Filter
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";

interface Internship {
  id: string;
  company_name: string;
  company_website: string | null;
  title: string;
  description: string;
  domain: string;
  location: string;
  work_type: string;
  duration: string | null;
  schedule: string | null;
  spots: number;
  requirements: string | null;
  benefits: string | null;
  is_paid: boolean;
  salary_info: string | null;
  start_date: string | null;
  deadline: string | null;
  url: string | null;
  is_featured: boolean;
  created_at: string;
}

const domains = [
  "Toate", "IT & Programare", "Marketing", "Finanțe", "Inginerie",
  "HR & Resurse Umane", "Design", "Juridic", "Sănătate", "Educație", "Altele",
];

const workTypeLabels: Record<string, string> = {
  "on-site": "La sediu",
  "remote": "Remote",
  "hybrid": "Hibrid",
};

export default function PracticaPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("Toate");
  const [selectedWorkType, setSelectedWorkType] = useState("all");
  const [showCompanyForm, setShowCompanyForm] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = getSupabase();
      const { data } = await supabase
        .from("internships")
        .select("*")
        .eq("status", "approved")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });
      setInternships((data as Internship[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = internships.filter((i) => {
    if (selectedDomain !== "Toate" && i.domain !== selectedDomain) return false;
    if (selectedWorkType !== "all" && i.work_type !== selectedWorkType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        i.title.toLowerCase().includes(q) ||
        i.company_name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-3">
            <Briefcase className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Practică la <span className="text-primary">companii</span>
            </h1>
          </div>
          <p className="text-muted text-lg max-w-2xl mb-6">
            Găsește stagii de practică la companii de top din România. Aplică direct cu CV-ul tău 
            și câștigă experiență reală în domeniul care te pasionează.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowCompanyForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors"
            >
              <Building2 className="w-4 h-4" />
              Sunt companie — vreau să listez
            </button>
            <Link
              href="/feedback"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-xl font-semibold text-sm hover:border-primary hover:text-primary transition-all"
            >
              <Plus className="w-4 h-4" />
              Sugerează o companie
            </Link>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Caută după companie, rol sau domeniu..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-surface text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              />
            </div>

            {/* Domain filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="pl-10 pr-8 py-2 rounded-lg border border-border bg-surface text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-primary/30"
              >
                {domains.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            </div>

            {/* Work type filter */}
            <div className="flex gap-1 bg-surface rounded-lg border border-border p-0.5">
              {[
                { value: "all", label: "Toate" },
                { value: "on-site", label: "La sediu" },
                { value: "remote", label: "Remote" },
                { value: "hybrid", label: "Hibrid" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedWorkType(opt.value)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    selectedWorkType === opt.value
                      ? "bg-primary text-white"
                      : "hover:bg-surface-alt"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="w-12 h-12 text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {internships.length === 0
                ? "Încă nu sunt listări de practică"
                : "Nicio listare nu corespunde filtrelor"}
            </h3>
            <p className="text-sm text-muted mb-6">
              {internships.length === 0
                ? "Fii prima companie care listează o practică pe DirecțiaTa!"
                : "Încearcă alte filtre sau caută altceva."}
            </p>
            <button
              onClick={() => setShowCompanyForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm"
            >
              <Building2 className="w-4 h-4" />
              Listează o practică
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted">{filtered.length} {filtered.length === 1 ? "poziție" : "poziții"} disponibile</p>
            {filtered.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} />
            ))}
          </div>
        )}
      </section>

      {/* Company Form Modal */}
      {showCompanyForm && (
        <CompanyFormModal onClose={() => setShowCompanyForm(false)} />
      )}
    </main>
  );
}

function InternshipCard({ internship }: { internship: Internship }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-surface rounded-xl border ${internship.is_featured ? "border-primary/50 ring-1 ring-primary/20" : "border-border"} p-5 hover:shadow-md transition-shadow`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {internship.is_featured && (
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">Premium</span>
            )}
            <span className="text-[11px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">{internship.domain}</span>
            <span className="text-[11px] font-medium text-muted bg-surface-alt px-2 py-0.5 rounded-full">
              {workTypeLabels[internship.work_type] || internship.work_type}
            </span>
          </div>

          <h3 className="text-lg font-bold mb-0.5">{internship.title}</h3>
          <p className="text-sm text-primary font-medium flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            {internship.company_name}
          </p>
        </div>

        <Link
          href={`/practica/${internship.id}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors whitespace-nowrap"
        >
          Aplică acum
        </Link>
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-xs text-muted">
        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{internship.location}</span>
        {internship.duration && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{internship.duration}</span>}
        {internship.schedule && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{internship.schedule}</span>}
        {internship.spots > 0 && <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{internship.spots} {internship.spots === 1 ? "loc" : "locuri"}</span>}
        {internship.is_paid && internship.salary_info && <span className="flex items-center gap-1 text-green-600 font-medium">💰 {internship.salary_info}</span>}
      </div>

      {/* Description preview */}
      <p className={`text-sm text-muted mt-3 ${expanded ? "" : "line-clamp-2"}`}>
        {internship.description}
      </p>
      {internship.description.length > 150 && (
        <button onClick={() => setExpanded(!expanded)} className="text-xs text-primary mt-1 hover:underline">
          {expanded ? "Mai puțin" : "Mai mult..."}
        </button>
      )}

      {expanded && (
        <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
          {internship.requirements && (
            <div>
              <p className="font-medium text-xs uppercase text-muted mb-1">Cerințe</p>
              <p className="text-sm">{internship.requirements}</p>
            </div>
          )}
          {internship.benefits && (
            <div>
              <p className="font-medium text-xs uppercase text-muted mb-1">Ce câștigi</p>
              <p className="text-sm">{internship.benefits}</p>
            </div>
          )}
        </div>
      )}

      {internship.deadline && (
        <p className="text-xs text-muted mt-3">
          Deadline: <span className="font-medium">{new Date(internship.deadline).toLocaleDateString("ro-RO")}</span>
        </p>
      )}
    </div>
  );
}

function CompanyFormModal({ onClose }: { onClose: () => void }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const body = {
      company_name: fd.get("company_name") as string,
      company_email: fd.get("company_email") as string,
      company_website: fd.get("company_website") as string,
      title: fd.get("title") as string,
      description: fd.get("description") as string,
      domain: fd.get("domain") as string,
      location: fd.get("location") as string,
      work_type: fd.get("work_type") as string,
      duration: fd.get("duration") as string,
      schedule: fd.get("schedule") as string,
      spots: parseInt(fd.get("spots") as string) || 1,
      requirements: fd.get("requirements") as string,
      benefits: fd.get("benefits") as string,
      is_paid: fd.get("is_paid") === "da",
      salary_info: fd.get("salary_info") as string,
      deadline: fd.get("deadline") as string || null,
      url: fd.get("url") as string,
    };

    try {
      const res = await fetch("/api/practica/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Eroare la trimitere");
      setSent(true);
    } catch {
      setError("Nu am putut trimite. Încearcă din nou.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-8">
      <div className="bg-surface rounded-2xl border border-border w-full max-w-2xl mx-4 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Listează o practică
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-surface-alt rounded-lg">✕</button>
        </div>

        {sent ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">✅</div>
            <p className="font-semibold text-lg mb-1">Listare trimisă!</p>
            <p className="text-sm text-muted mb-4">Vom verifica datele și o vom publica în cel mult 24 ore.</p>
            <button onClick={onClose} className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-semibold">Închide</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <p className="text-sm text-muted bg-primary/5 border border-primary/20 rounded-lg p-3">
              Primele 30 de zile sunt gratuite. După aceea, contactează-ne la{" "}
              <a href="mailto:alina.tomsa@techlayer.ro" className="text-primary font-medium">alina.tomsa@techlayer.ro</a>{" "}
              pentru a menține listarea activă.
            </p>

            <fieldset className="border border-border rounded-lg p-4 space-y-3">
              <legend className="text-sm font-semibold px-2">Informații companie</legend>
              <div className="grid sm:grid-cols-2 gap-3">
                <input name="company_name" required placeholder="Numele companiei *" className="input-field" />
                <input name="company_email" type="email" required placeholder="Email contact companie *" className="input-field" />
                <input name="company_website" type="url" placeholder="Website companie (https://...)" className="input-field" />
                <input name="url" type="url" placeholder="Link direct la practică (opțional)" className="input-field" />
              </div>
            </fieldset>

            <fieldset className="border border-border rounded-lg p-4 space-y-3">
              <legend className="text-sm font-semibold px-2">Detalii practică</legend>
              <input name="title" required placeholder="Titlul poziției (ex: Intern Frontend Developer) *" className="input-field w-full" />
              <textarea name="description" required rows={3} placeholder="Descrierea activităților și a echipei *" className="input-field w-full resize-y" />

              <div className="grid sm:grid-cols-2 gap-3">
                <select name="domain" required className="input-field">
                  <option value="">Domeniu *</option>
                  {domains.slice(1).map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <select name="work_type" required className="input-field">
                  <option value="on-site">La sediu</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hibrid</option>
                </select>
                <input name="location" required placeholder="Locație (ex: București) *" className="input-field" />
                <input name="duration" placeholder="Durată (ex: 3 luni)" className="input-field" />
                <input name="schedule" placeholder="Program (ex: Full-time)" className="input-field" />
                <input name="spots" type="number" min={1} defaultValue={1} placeholder="Nr. locuri" className="input-field" />
              </div>

              <textarea name="requirements" rows={2} placeholder="Cerințe (ce trebuie să știe studentul)" className="input-field w-full resize-y" />
              <textarea name="benefits" rows={2} placeholder="Ce câștigă studentul (certificat, angajare, mentorat etc.)" className="input-field w-full resize-y" />

              <div className="grid sm:grid-cols-2 gap-3">
                <select name="is_paid" className="input-field">
                  <option value="nu">Practică neplătită</option>
                  <option value="da">Practică plătită</option>
                </select>
                <input name="salary_info" placeholder="Salariu/bursă (opțional)" className="input-field" />
                <input name="deadline" type="date" className="input-field" />
              </div>
            </fieldset>

            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
              {sending ? "Se trimite..." : "Trimite listarea"}
            </button>
          </form>
        )}

        <style jsx>{`
          .input-field {
            width: 100%;
            padding: 0.5rem 0.75rem;
            border-radius: 0.5rem;
            border: 1px solid var(--color-border);
            background: var(--color-surface);
            font-size: 0.875rem;
            outline: none;
            transition: border-color 0.2s;
          }
          .input-field:focus {
            border-color: var(--color-primary);
            box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb, 59, 130, 246), 0.1);
          }
        `}</style>
      </div>
    </div>
  );
}
