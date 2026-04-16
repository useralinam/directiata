"use client";

import { useState, useEffect, useCallback } from "react";
import { Shield, CheckCircle, XCircle, Clock, Trash2, Edit3, Eye, AlertTriangle, ChevronDown, Loader2 } from "lucide-react";
import { getSupabase } from "@/lib/supabase";

const ADMIN_PASSWORD = "directiata2026";

interface PendingOpp {
  id: string;
  title: string;
  description: string;
  category: string;
  organization: string;
  location: string;
  date: string | null;
  deadline: string | null;
  age_range: string | null;
  tags: string[];
  url: string | null;
  source: string;
  status: string;
  created_at: string;
}

interface Report {
  id: string;
  opportunity_id: string;
  opportunity_title: string;
  reason: string;
  details: string;
  reporter_email: string | null;
  status: string;
  admin_notes: string;
  created_at: string;
}

const reasonLabels: Record<string, string> = {
  wrong_category: "Categorie greșită",
  wrong_deadline: "Deadline incorect",
  broken_link: "Link stricat",
  wrong_info: "Info incorectă",
  duplicate: "Duplicat",
  inappropriate: "Nepotrivit",
  other: "Altceva",
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<"pending" | "reports">("pending");
  const [pending, setPending] = useState<PendingOpp[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PendingOpp>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const supabase = getSupabase();

    // Load pending opportunities
    const { data: pendingData } = await supabase
      .from("opportunities")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (pendingData) setPending(pendingData as PendingOpp[]);

    // Load reports
    const { data: reportsData } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (reportsData) setReports(reportsData as Report[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) loadData();
  }, [authed, loadData]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
    }
  }

  async function approveOpportunity(id: string) {
    setActionLoading(id);
    const supabase = getSupabase();
    await supabase.from("opportunities").update({ status: "approved" }).eq("id", id);
    setPending((prev) => prev.filter((o) => o.id !== id));
    setActionLoading(null);
  }

  async function rejectOpportunity(id: string) {
    setActionLoading(id);
    const supabase = getSupabase();
    await supabase.from("opportunities").delete().eq("id", id);
    setPending((prev) => prev.filter((o) => o.id !== id));
    setActionLoading(null);
  }

  async function saveEdit(id: string) {
    setActionLoading(id);
    const supabase = getSupabase();
    const updates: Record<string, unknown> = {};
    if (editForm.title !== undefined) updates.title = editForm.title;
    if (editForm.description !== undefined) updates.description = editForm.description;
    if (editForm.category !== undefined) updates.category = editForm.category;
    if (editForm.organization !== undefined) updates.organization = editForm.organization;
    if (editForm.location !== undefined) updates.location = editForm.location;
    if (editForm.url !== undefined) updates.url = editForm.url;
    if (editForm.deadline !== undefined) updates.deadline = editForm.deadline;

    await supabase.from("opportunities").update(updates).eq("id", id);
    setPending((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
    setEditingId(null);
    setEditForm({});
    setActionLoading(null);
  }

  async function resolveReport(reportId: string) {
    setActionLoading(reportId);
    const supabase = getSupabase();
    await supabase.from("reports").update({ status: "resolved" }).eq("id", reportId);
    setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status: "resolved" } : r)));
    setActionLoading(null);
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <form onSubmit={handleLogin} className="bg-surface p-8 rounded-2xl border border-border shadow-xl w-full max-w-sm">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-extrabold">Admin DirecțiaTa</h1>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Parola admin"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 mb-4"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm transition-colors"
          >
            Intră în admin
          </button>
        </form>
      </div>
    );
  }

  const newReports = reports.filter((r) => r.status === "new").length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-7 h-7 text-primary" />
          <h1 className="text-2xl font-extrabold">Admin DirecțiaTa</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("pending")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${
              tab === "pending" ? "bg-primary text-white" : "bg-surface border border-border hover:bg-surface-alt"
            }`}
          >
            <Clock className="w-4 h-4" />
            Așteaptă aprobare ({pending.length})
          </button>
          <button
            onClick={() => setTab("reports")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${
              tab === "reports" ? "bg-amber-500 text-white" : "bg-surface border border-border hover:bg-surface-alt"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Rapoarte ({newReports} noi)
          </button>
          <button
            onClick={loadData}
            disabled={loading}
            className="ml-auto px-4 py-2 rounded-xl text-sm font-bold bg-surface border border-border hover:bg-surface-alt transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reîncarcă"}
          </button>
        </div>

        {/* Pending opportunities */}
        {tab === "pending" && (
          <div className="space-y-3">
            {pending.length === 0 && (
              <div className="text-center py-12 text-muted text-sm">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                Nicio oportunitate în așteptare
              </div>
            )}
            {pending.map((opp) => (
              <div key={opp.id} className="bg-surface rounded-xl border border-border p-4">
                {editingId === opp.id ? (
                  /* Edit form */
                  <div className="space-y-3">
                    <input
                      value={editForm.title ?? opp.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                      placeholder="Titlu"
                    />
                    <textarea
                      value={editForm.description ?? opp.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm min-h-[80px]"
                      placeholder="Descriere"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={editForm.category ?? opp.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                      >
                        <option value="voluntariat">Voluntariat</option>
                        <option value="evenimente">Evenimente</option>
                        <option value="workshopuri">Workshopuri</option>
                        <option value="competitii">Competiții</option>
                        <option value="tabere">Tabere</option>
                        <option value="burse">Burse</option>
                      </select>
                      <input
                        value={editForm.organization ?? opp.organization}
                        onChange={(e) => setEditForm({ ...editForm, organization: e.target.value })}
                        className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                        placeholder="Organizație"
                      />
                      <input
                        value={editForm.location ?? opp.location}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                        placeholder="Locație"
                      />
                      <input
                        value={editForm.url ?? opp.url ?? ""}
                        onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                        className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                        placeholder="URL"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => { setEditingId(null); setEditForm({}); }}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-surface-alt"
                      >
                        Anulează
                      </button>
                      <button
                        onClick={() => saveEdit(opp.id)}
                        disabled={actionLoading === opp.id}
                        className="px-4 py-1.5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-dark disabled:opacity-50"
                      >
                        {actionLoading === opp.id ? "Se salvează..." : "Salvează"}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View mode */
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                            {opp.category}
                          </span>
                          <span className="text-[10px] text-muted">
                            {opp.source} • {new Date(opp.created_at).toLocaleDateString("ro-RO")}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm mb-1">{opp.title}</h3>
                        <p className="text-xs text-muted line-clamp-2 mb-2">{opp.description}</p>
                        <div className="flex gap-4 text-[11px] text-muted">
                          <span>{opp.organization}</span>
                          <span>{opp.location}</span>
                          {opp.url && (
                            <a href={opp.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate max-w-[200px]">
                              {opp.url}
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => { setEditingId(opp.id); setEditForm({}); }}
                          className="p-2 rounded-lg hover:bg-surface-alt transition-colors"
                          title="Editează"
                        >
                          <Edit3 className="w-4 h-4 text-muted" />
                        </button>
                        <button
                          onClick={() => approveOpportunity(opp.id)}
                          disabled={actionLoading === opp.id}
                          className="p-2 rounded-lg hover:bg-emerald-50 transition-colors"
                          title="Aprobă"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        </button>
                        <button
                          onClick={() => rejectOpportunity(opp.id)}
                          disabled={actionLoading === opp.id}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Respinge (șterge)"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Reports */}
        {tab === "reports" && (
          <div className="space-y-3">
            {reports.length === 0 && (
              <div className="text-center py-12 text-muted text-sm">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                Niciun raport
              </div>
            )}
            {reports.map((report) => (
              <div
                key={report.id}
                className={`bg-surface rounded-xl border p-4 ${
                  report.status === "new" ? "border-amber-300" : "border-border opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        report.status === "new" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {report.status === "new" ? "Nou" : "Rezolvat"}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
                        {reasonLabels[report.reason] || report.reason}
                      </span>
                      <span className="text-[10px] text-muted">
                        {new Date(report.created_at).toLocaleDateString("ro-RO")}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm mb-1">{report.opportunity_title}</h3>
                    {report.details && (
                      <p className="text-xs text-muted mb-1">{report.details}</p>
                    )}
                    {report.reporter_email && (
                      <p className="text-[11px] text-muted">
                        De la: <a href={`mailto:${report.reporter_email}`} className="text-primary">{report.reporter_email}</a>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {report.status === "new" && (
                      <button
                        onClick={() => resolveReport(report.id)}
                        disabled={actionLoading === report.id}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 disabled:opacity-50"
                      >
                        {actionLoading === report.id ? "..." : "Rezolvat ✓"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
