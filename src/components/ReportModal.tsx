"use client";

import { useState } from "react";
import { X, AlertTriangle, Loader2, CheckCircle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  opportunityId: string;
  opportunityTitle: string;
}

const REPORT_REASONS = [
  { value: "wrong_category", label: "Categorie greșită" },
  { value: "wrong_deadline", label: "Deadline incorect sau expirat" },
  { value: "broken_link", label: "Link-ul nu mai funcționează" },
  { value: "wrong_info", label: "Informații incorecte" },
  { value: "duplicate", label: "Duplicat (există deja)" },
  { value: "inappropriate", label: "Conținut nepotrivit" },
  { value: "other", label: "Altceva" },
];

const inputBase =
  "w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted/50";

export default function ReportModal({ isOpen, onClose, opportunityId, opportunityTitle }: Props) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) return;

    setSending(true);
    setResult(null);

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId,
          opportunityTitle,
          reason,
          details: details.trim(),
          reporterEmail: email.trim() || null,
        }),
      });

      if (res.ok) {
        setResult({ type: "success", text: "Mulțumim! Raportul a fost trimis și va fi analizat." });
        setTimeout(() => {
          setResult(null);
          setReason("");
          setDetails("");
          setEmail("");
          onClose();
        }, 2500);
      } else {
        setResult({ type: "error", text: "Eroare la trimitere. Încearcă din nou." });
      }
    } catch {
      setResult({ type: "error", text: "Eroare de rețea. Încearcă din nou." });
    } finally {
      setSending(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-surface rounded-2xl border border-border w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-extrabold">Raportează o problemă</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-alt transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-muted line-clamp-1">
            <span className="font-bold text-foreground">{opportunityTitle}</span>
          </p>

          <div>
            <label className="block text-xs font-bold text-foreground/70 mb-1.5 uppercase tracking-wider">
              Ce problemă ai observat? *
            </label>
            <div className="space-y-1.5">
              {REPORT_REASONS.map((r) => (
                <label key={r.value} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="reason"
                    value={r.value}
                    checked={reason === r.value}
                    onChange={() => setReason(r.value)}
                    className="accent-primary"
                  />
                  {r.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground/70 mb-1.5 uppercase tracking-wider">
              Detalii (opțional)
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className={`${inputBase} min-h-[60px] resize-none`}
              placeholder="Spune-ne mai multe..."
              maxLength={500}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground/70 mb-1.5 uppercase tracking-wider">
              Email-ul tău (opțional, pentru follow-up)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputBase}
              placeholder="email@exemplu.com"
            />
          </div>

          {result && (
            <div className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-xl ${
              result.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
            }`}>
              {result.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              {result.text}
            </div>
          )}

          <button
            type="submit"
            disabled={!reason || sending}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
            {sending ? "Se trimite..." : "Trimite raportul"}
          </button>
        </form>
      </div>
    </div>
  );
}
