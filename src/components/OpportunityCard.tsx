import { Heart, MapPin, Calendar, Users, Tag, ExternalLink, Clock, CheckCircle } from "lucide-react";
import type { Opportunity } from "@/lib/types";
import { isExpired } from "@/lib/types";

const categoryStyles: Record<string, string> = {
  voluntariat: "badge-voluntariat",
  evenimente: "badge-evenimente",
  workshopuri: "badge-workshopuri",
  competitii: "badge-competitii",
  tabere: "badge-tabere",
  burse: "badge-burse",
};

const categoryLabels: Record<string, string> = {
  voluntariat: "Voluntariat",
  evenimente: "Eveniment",
  workshopuri: "Workshop",
  competitii: "Competiție",
  tabere: "Tabără",
  burse: "Bursă / Grant",
};

const categoryEmojis: Record<string, string> = {
  voluntariat: "🤝",
  evenimente: "🎪",
  workshopuri: "💡",
  competitii: "🏆",
  tabere: "⛺",
  burse: "🎓",
};

const difficultyConfig: Record<string, { label: string; color: string }> = {
  "ușor": { label: "Ușor", color: "bg-emerald-50 text-emerald-700" },
  "mediu": { label: "Mediu", color: "bg-amber-50 text-amber-700" },
  "avansat": { label: "Avansat", color: "bg-red-50 text-red-700" },
};

interface Props {
  opportunity: Opportunity;
  variant?: "grid" | "list";
  showExpiredBadge?: boolean;
}

export default function OpportunityCard({ opportunity, variant = "grid", showExpiredBadge }: Props) {
  const badgeClass = categoryStyles[opportunity.category] || "badge-voluntariat";
  const categoryLabel = categoryLabels[opportunity.category] || opportunity.category;
  const emoji = categoryEmojis[opportunity.category] || "✨";
  const diff = opportunity.difficulty ? difficultyConfig[opportunity.difficulty] : null;
  const expired = showExpiredBadge ?? isExpired(opportunity);

  if (variant === "list") {
    return (
      <div className={`card-hover bg-surface rounded-xl border border-border overflow-hidden group flex flex-col sm:flex-row ${expired ? "opacity-75" : ""}`}>
        {/* Main content */}
        <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Info block */}
          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeClass}`}>
                <span className="mr-0.5">{emoji}</span> {categoryLabel}
              </span>
              {expired && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 flex items-center gap-0.5">
                  <CheckCircle className="w-3 h-3" /> S-a desfășurat
                </span>
              )}
              {diff && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${diff.color}`}>
                  {diff.label}
                </span>
              )}
              {opportunity.isFree ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
                  Gratuit
                </span>
              ) : opportunity.price ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600">
                  {opportunity.price}
                </span>
              ) : null}
            </div>

            <h3 className="font-bold text-sm leading-snug mb-1 truncate group-hover:text-primary transition-colors">
              {opportunity.title}
            </h3>

            <p className="text-xs text-muted line-clamp-1 mb-1.5">
              {opportunity.description}
            </p>

            {/* Meta row */}
            <div className="flex items-center gap-3 text-[11px] text-muted flex-wrap">
              {opportunity.organization && (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span className="truncate max-w-[140px]">{opportunity.organization}</span>
                </span>
              )}
              {opportunity.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate max-w-[120px]">{opportunity.location}</span>
                </span>
              )}
              {opportunity.date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {opportunity.date}
                </span>
              )}
              {opportunity.deadline && (
                <span className="flex items-center gap-1 font-bold text-secondary">
                  <Clock className="w-3 h-3" />
                  {opportunity.deadline}
                </span>
              )}
              {opportunity.ageRange && (
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {opportunity.ageRange}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex sm:flex-col items-center gap-2 shrink-0">
            {opportunity.url ? (
              <a
                href={opportunity.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors flex items-center gap-1"
              >
                Detalii
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center gap-1">
                Detalii
                <ExternalLink className="w-3 h-3" />
              </span>
            )}
            <button className="p-2 rounded-lg hover:bg-surface-alt transition-colors group/fav">
              <Heart className="w-4 h-4 text-muted group-hover/fav:text-secondary transition-colors" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === GRID variant (default) ===
  return (
    <div className={`card-hover h-full flex flex-col bg-surface rounded-2xl border border-border overflow-hidden group ${expired ? "opacity-75" : ""}`}>
      {/* Badges row */}
      <div className="px-4 pt-4 pb-0 flex flex-wrap items-center gap-1.5 min-h-[52px]">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${badgeClass}`}>
            <span className="mr-0.5">{emoji}</span> {categoryLabel}
          </span>
          {expired && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 flex items-center gap-0.5">
              <CheckCircle className="w-3 h-3" /> S-a desfășurat
            </span>
          )}
          {diff && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${diff.color}`}>
              {diff.label}
            </span>
          )}
          {opportunity.isFree ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
              Gratuit
            </span>
          ) : opportunity.price ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 max-w-full">
              {opportunity.price}
            </span>
          ) : null}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-4 pt-3 pb-4">
        {/* Title — fixed 2-line height */}
        <h3 className="font-bold text-[15px] leading-snug mb-1.5 line-clamp-2 min-h-[2.6em] group-hover:text-primary transition-colors">
          {opportunity.title}
        </h3>

        {/* Description — fixed 2-line height */}
        <p className="text-xs text-muted leading-relaxed mb-3 line-clamp-2 min-h-[2.6em]">
          {opportunity.description}
        </p>

        {/* Structured meta — fixed 5-row grid, all values truncated */}
        <div className="grid grid-cols-[auto_1fr] gap-x-2.5 gap-y-1 mb-3 text-xs min-h-[110px]">
          {opportunity.organization && (
            <>
              <span className="flex items-center gap-1 text-muted whitespace-nowrap">
                <Users className="w-3 h-3" /> Organizație
              </span>
              <span className="font-medium text-foreground/80 truncate">{opportunity.organization}</span>
            </>
          )}
          {opportunity.location && (
            <>
              <span className="flex items-center gap-1 text-muted whitespace-nowrap">
                <MapPin className="w-3 h-3" /> Locație
              </span>
              <span className="font-medium text-foreground/80 truncate">{opportunity.location}</span>
            </>
          )}
          {opportunity.date && (
            <>
              <span className="flex items-center gap-1 text-muted whitespace-nowrap">
                <Calendar className="w-3 h-3" /> Dată
              </span>
              <span className="font-medium text-foreground/80 truncate">{opportunity.date}</span>
            </>
          )}
          {opportunity.deadline && (
            <>
              <span className="flex items-center gap-1 text-muted whitespace-nowrap">
                <Clock className="w-3 h-3" /> Deadline
              </span>
              <span className="font-bold text-secondary truncate">{opportunity.deadline}</span>
            </>
          )}
          {opportunity.ageRange && (
            <>
              <span className="flex items-center gap-1 text-muted whitespace-nowrap">
                <Tag className="w-3 h-3" /> Vârstă
              </span>
              <span className="font-medium text-foreground/80">{opportunity.ageRange}</span>
            </>
          )}
        </div>

        {/* Tags — fixed height */}
        <div className="min-h-[28px] mb-3">
          {opportunity.tags && opportunity.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {opportunity.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-surface-alt rounded text-[11px] text-muted font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions — pushed to bottom */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
          {opportunity.url ? (
            <a
              href={opportunity.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
            >
              Detalii
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="text-sm font-bold text-primary flex items-center gap-1">
              Detalii
              <ExternalLink className="w-3.5 h-3.5" />
            </span>
          )}
          <button className="p-2 rounded-lg hover:bg-surface-alt transition-colors group/fav">
            <Heart className="w-4 h-4 text-muted group-hover/fav:text-secondary transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}
