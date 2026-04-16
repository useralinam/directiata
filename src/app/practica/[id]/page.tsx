"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, Briefcase, Building2, MapPin, Clock, Calendar,
  Users, Upload, Send, Loader2, CheckCircle, ExternalLink
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

const workTypeLabels: Record<string, string> = {
  "on-site": "La sediu",
  "remote": "Remote",
  "hybrid": "Hibrid",
};

export default function ApplyPage() {
  const params = useParams();
  const internshipId = params.id as string;

  const [internship, setInternship] = useState<Internship | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [clFile, setClFile] = useState<File | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = getSupabase();
      const { data } = await supabase
        .from("internships")
        .select("*")
        .eq("id", internshipId)
        .eq("status", "approved")
        .single();
      setInternship(data as Internship | null);
      setLoading(false);
    }
    load();
  }, [internshipId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const supabase = getSupabase();

    let cvUrl = "";
    let clUrl = "";

    // Upload CV if provided
    if (cvFile) {
      const ext = cvFile.name.split(".").pop();
      const path = `cv/${internshipId}/${Date.now()}-cv.${ext}`;
      const { error: upErr } = await supabase.storage.from("cvs").upload(path, cvFile);
      if (upErr) {
        setError("Eroare la încărcarea CV-ului. Încearcă din nou.");
        setSending(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("cvs").getPublicUrl(path);
      cvUrl = urlData.publicUrl;
    }

    // Upload cover letter if provided
    if (clFile) {
      const ext = clFile.name.split(".").pop();
      const path = `cl/${internshipId}/${Date.now()}-cl.${ext}`;
      const { error: upErr } = await supabase.storage.from("cvs").upload(path, clFile);
      if (!upErr) {
        const { data: urlData } = supabase.storage.from("cvs").getPublicUrl(path);
        clUrl = urlData.publicUrl;
      }
    }

    const body = {
      internship_id: internshipId,
      full_name: fd.get("full_name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      university: fd.get("university") as string,
      study_year: fd.get("study_year") as string,
      field_of_study: fd.get("field_of_study") as string,
      motivation: fd.get("motivation") as string,
      cv_url: cvUrl,
      cover_letter_url: clUrl,
      availability_date: fd.get("availability_date") as string || null,
    };

    try {
      const res = await fetch("/api/practica/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Eroare la trimitere");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eroare la trimitere");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </main>
    );
  }

  if (!internship) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <Briefcase className="w-12 h-12 text-muted mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Poziție negăsită</h2>
          <p className="text-muted mb-6">Această listare nu există sau a fost retrasă.</p>
          <Link href="/practica" className="text-primary font-semibold hover:underline">← Înapoi la practici</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/practica"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Toate practicile
        </Link>

        {/* Internship details */}
        <div className="bg-surface rounded-xl border border-border p-6 mb-6">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-[11px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">{internship.domain}</span>
            <span className="text-[11px] font-medium text-muted bg-surface-alt px-2 py-0.5 rounded-full">
              {workTypeLabels[internship.work_type] || internship.work_type}
            </span>
            {internship.is_paid && <span className="text-[11px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">💰 Plătit</span>}
          </div>

          <h1 className="text-2xl font-bold mb-1">{internship.title}</h1>
          <p className="text-primary font-medium flex items-center gap-1.5 mb-4">
            <Building2 className="w-4 h-4" />
            {internship.company_name}
            {internship.company_website && (
              <a href={internship.company_website} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted mb-4">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{internship.location}</span>
            {internship.duration && <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{internship.duration}</span>}
            {internship.schedule && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{internship.schedule}</span>}
            {internship.spots > 0 && <span className="flex items-center gap-1"><Users className="w-4 h-4" />{internship.spots} locuri</span>}
            {internship.salary_info && <span className="flex items-center gap-1 text-green-600">💰 {internship.salary_info}</span>}
          </div>

          <p className="text-sm leading-relaxed mb-4 whitespace-pre-line">{internship.description}</p>

          {internship.requirements && (
            <div className="mb-3">
              <h3 className="text-sm font-semibold mb-1">Cerințe</h3>
              <p className="text-sm text-muted whitespace-pre-line">{internship.requirements}</p>
            </div>
          )}
          {internship.benefits && (
            <div className="mb-3">
              <h3 className="text-sm font-semibold mb-1">Ce câștigi</h3>
              <p className="text-sm text-muted whitespace-pre-line">{internship.benefits}</p>
            </div>
          )}
          {internship.deadline && (
            <p className="text-sm text-muted mt-3 border-t border-border pt-3">
              ⏰ Deadline aplicare: <span className="font-medium">{new Date(internship.deadline).toLocaleDateString("ro-RO")}</span>
            </p>
          )}
        </div>

        {/* Application form */}
        {sent ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="font-semibold text-green-800 text-lg mb-1">Aplicație trimisă!</p>
            <p className="text-sm text-green-700">
              Compania {internship.company_name} va primi datele tale. Succes!
            </p>
          </div>
        ) : (
          <div className="bg-surface rounded-xl border border-border p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              Aplică pentru această practică
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Nume complet *</label>
                  <input name="full_name" required className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm outline-none focus:border-primary" placeholder="Ion Popescu" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input name="email" type="email" required className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm outline-none focus:border-primary" placeholder="ion@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Telefon</label>
                  <input name="phone" type="tel" className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm outline-none focus:border-primary" placeholder="07XX XXX XXX" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Universitate / Liceu *</label>
                  <input name="university" required className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm outline-none focus:border-primary" placeholder="Universitatea din București" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Anul de studiu</label>
                  <input name="study_year" className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm outline-none focus:border-primary" placeholder="Anul 2 / Master Anul 1" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Domeniu de studiu</label>
                  <input name="field_of_study" className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm outline-none focus:border-primary" placeholder="Informatică / Economie" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">De ce vrei această practică? *</label>
                <textarea name="motivation" required rows={3} className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm outline-none focus:border-primary resize-y" placeholder="Spune pe scurt ce te motivează și ce aduci tu echipei..." />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Disponibilitate (data de start)</label>
                <input name="availability_date" type="date" className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm outline-none focus:border-primary" />
              </div>

              {/* File uploads */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">CV (PDF, max 5MB)</label>
                  <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border bg-surface hover:border-primary cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-muted" />
                    <span className="text-sm text-muted truncate">{cvFile ? cvFile.name : "Alege fișier..."}</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f && f.size <= 5 * 1024 * 1024) setCvFile(f);
                        else if (f) setError("CV-ul trebuie să fie max 5MB");
                      }}
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Scrisoare de intenție (opțional)</label>
                  <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border bg-surface hover:border-primary cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-muted" />
                    <span className="text-sm text-muted truncate">{clFile ? clFile.name : "Alege fișier..."}</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f && f.size <= 5 * 1024 * 1024) setClFile(f);
                      }}
                    />
                  </label>
                </div>
              </div>

              <p className="text-xs text-muted">
                Prin trimiterea aplicației ești de acord cu{" "}
                <Link href="/confidentialitate" className="text-primary hover:underline">politica de confidențialitate</Link>.
                Datele tale vor fi folosite exclusiv pentru procesul de recrutare.
              </p>

              {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {sending ? "Se trimite..." : "Trimite aplicația"}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
