"use client";

import { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import type { OpportunityCategory } from "@/lib/types";
import { addOpportunity } from "@/lib/opportunities";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
}

const categoryOptions: { value: OpportunityCategory; label: string }[] = [
  { value: "voluntariat", label: "Voluntariat" },
  { value: "evenimente", label: "Eveniment" },
  { value: "workshopuri", label: "Workshop" },
  { value: "competitii", label: "Competitie" },
  { value: "tabere", label: "Tabara" },
  { value: "burse", label: "Bursa / Grant" },
];

const difficultyOptions = [
  { value: "ușor", label: "Ușor" },
  { value: "mediu", label: "Mediu" },
  { value: "avansat", label: "Avansat" },
];

const inputBase =
  "w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted/50";
const labelBase = "block text-xs font-bold text-foreground/70 mb-1.5 uppercase tracking-wider";

export default function AddOpportunityModal({ isOpen, onClose, onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<OpportunityCategory>("voluntariat");
  const [organization, setOrganization] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [tags, setTags] = useState("");
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState("");
  const [url, setUrl] = useState("");
  const [difficulty, setDifficulty] = useState("ușor");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Titlul este obligatoriu";
    if (!description.trim()) errs.description = "Descrierea este obligatorie";
    if (!organization.trim()) errs.organization = "Organizatia este obligatorie";
    if (!location.trim()) errs.location = "Locatia este obligatorie";
    if (url && !/^https?:\/\/.+/i.test(url)) errs.url = "URL-ul trebuie sa inceapa cu http(s)://";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setSubmitMessage(null);

    const result = await addOpportunity({
      title: title.trim(),
      description: description.trim(),
      category,
      organization: organization.trim(),
      location: location.trim(),
      date: date.trim() || undefined,
      deadline: deadline.trim() || undefined,
      ageRange: ageRange.trim() || undefined,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      isFree,
      price: !isFree && price.trim() ? price.trim() : undefined,
      url: url.trim() || undefined,
      source: "utilizator",
      difficulty: difficulty as "ușor" | "mediu" | "avansat",
    });

    setSaving(false);

    if (result) {
      onAdd();
      resetForm();
      setSubmitMessage({ type: "success", text: "Oportunitatea a fost trimisă și va fi vizibilă după aprobare!" });
      setTimeout(() => {
        setSubmitMessage(null);
        onClose();
      }, 2500);
    } else {
      setSubmitMessage({ type: "error", text: "Eroare la trimitere. Încearcă din nou." });
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setCategory("voluntariat");
    setOrganization("");
    setLocation("");
    setDate("");
    setDeadline("");
    setAgeRange("");
    setTags("");
    setIsFree(true);
    setPrice("");
    setUrl("");
    setDifficulty("ușor");
    setErrors({});
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm pt-8 pb-8 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface rounded-2xl border border-border w-full max-w-2xl mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-extrabold">Adauga oportunitate</h2>
            <p className="text-xs text-muted mt-0.5">
              Completează datele și oportunitatea va fi vizibilă după aprobare.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-alt transition-colors"
          >
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {submitMessage && (
            <div className={`px-4 py-3 rounded-xl text-sm font-medium ${submitMessage.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {submitMessage.text}
            </div>
          )}
          {/* Title */}
          <div>
            <label className={labelBase}>Titlu *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: Tabara de Voluntariat Green Summer 2026"
              className={`${inputBase} ${errors.title ? "border-red-400" : ""}`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Category + Difficulty row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelBase}>Categorie *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as OpportunityCategory)}
                className={inputBase}
              >
                {categoryOptions.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelBase}>Nivel dificultate</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className={inputBase}
              >
                {difficultyOptions.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Organization + Location row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelBase}>Organizatie *</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="ex: Crucea Rosie Romana"
                className={`${inputBase} ${errors.organization ? "border-red-400" : ""}`}
              />
              {errors.organization && <p className="text-xs text-red-500 mt-1">{errors.organization}</p>}
            </div>
            <div>
              <label className={labelBase}>Locatie *</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="ex: Bucuresti / Online / National"
                className={`${inputBase} ${errors.location ? "border-red-400" : ""}`}
              />
              {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
            </div>
          </div>

          {/* Date + Deadline row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelBase}>Data eveniment</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="ex: 15-20 Iulie 2026"
                className={inputBase}
              />
            </div>
            <div>
              <label className={labelBase}>Deadline inscriere</label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="ex: 1 Iulie 2026"
                className={inputBase}
              />
            </div>
          </div>

          {/* Age + Free/Paid row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelBase}>Varsta</label>
              <input
                type="text"
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                placeholder="ex: 14-18 ani  /  16+ ani"
                className={inputBase}
              />
            </div>
            <div>
              <label className={labelBase}>Participare</label>
              <div className="flex items-center gap-4 h-[42px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isFree"
                    checked={isFree}
                    onChange={() => setIsFree(true)}
                    className="accent-primary"
                  />
                  <span className="text-sm font-medium">Gratuit</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isFree"
                    checked={!isFree}
                    onChange={() => setIsFree(false)}
                    className="accent-primary"
                  />
                  <span className="text-sm font-medium">Cu taxa</span>
                </label>
              </div>
            </div>
          </div>

          {/* Price (conditional) */}
          {!isFree && (
            <div>
              <label className={labelBase}>Pret</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="ex: 50 lei / Variabil"
                className={inputBase}
              />
            </div>
          )}

          {/* URL */}
          <div>
            <label className={labelBase}>Link (URL)</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className={`${inputBase} ${errors.url ? "border-red-400" : ""}`}
            />
            {errors.url && <p className="text-xs text-red-500 mt-1">{errors.url}</p>}
          </div>

          {/* Tags */}
          <div>
            <label className={labelBase}>Taguri (separate prin virgula)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="ex: ecologie, voluntariat, tineret, gratuit"
              className={inputBase}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelBase}>Descriere *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrie pe scurt oportunitatea, ce activitati include si de ce ar fi relevanta pentru tineri..."
              rows={4}
              className={`${inputBase} resize-none ${errors.description ? "border-red-400" : ""}`}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-border hover:bg-surface-alt transition-colors"
            >
              Anuleaza
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary-dark transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Adauga oportunitate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
