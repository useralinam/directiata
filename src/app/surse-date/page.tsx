"use client";

import { Database, CheckCircle2, XCircle, Globe, Rss, Code, ExternalLink, Calendar } from "lucide-react";
import { dataSources } from "@/lib/data";

const typeIcons = {
  api: Globe,
  rss: Rss,
  scraping: Code,
};

const typeLabels = {
  api: "API Oficială",
  rss: "RSS Feed",
  scraping: "Web Scraping",
};

const categoryColors: Record<string, string> = {
  voluntariat: "bg-primary/10 text-primary",
  evenimente: "bg-secondary/10 text-secondary",
  workshopuri: "bg-accent-green/10 text-accent-green",
  competitii: "bg-accent-yellow/10 text-accent-orange",
  tabere: "bg-accent-blue/10 text-accent-blue",
  burse: "bg-accent-purple/10 text-accent-purple",
};

export default function SurseDatePage() {
  const totalOpp = dataSources.reduce((sum, s) => sum + (s.opportunityCount || 0), 0);
  const activeSources = dataSources.filter((s) => s.isActive);
  const inactiveSources = dataSources.filter((s) => !s.isActive);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-green/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-accent-green" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Surse de <span className="text-primary">date</span>
            </h1>
          </div>
          <p className="text-muted text-lg max-w-2xl">
            Agregăm date din <strong className="text-foreground">{dataSources.length} surse de încredere</strong> —
            platforme de voluntariat, portale europene, ONG-uri, instituții de stat și organizații de tineri.
            Peste <strong className="text-foreground">{totalOpp.toLocaleString("ro-RO")} oportunități</strong> actualizate automat.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Active", count: activeSources.length, icon: CheckCircle2, color: "text-accent-green" },
            { label: "Inactive", count: inactiveSources.length, icon: XCircle, color: "text-muted" },
            { label: "Web Scraping", count: dataSources.filter((s) => s.type === "scraping").length, icon: Code, color: "text-primary" },
            { label: "Total oportunități", count: totalOpp, icon: Database, color: "text-accent-orange" },
          ].map((item) => (
            <div key={item.label} className="bg-surface rounded-xl border border-border p-4 text-center">
              <item.icon className={`w-5 h-5 mx-auto mb-2 ${item.color}`} />
              <p className={`text-2xl font-bold ${item.color}`}>{item.count.toLocaleString("ro-RO")}</p>
              <p className="text-xs text-muted">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Active sources */}
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-accent-green" />
          Surse active ({activeSources.length})
        </h2>
        <div className="space-y-3 mb-10">
          {activeSources.map((source) => {
            const TypeIcon = typeIcons[source.type];
            return (
              <div
                key={source.id}
                className="card-hover bg-surface rounded-xl border border-border p-4 sm:p-5"
              >
                {/* Top row */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Name + link */}
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-accent-green shrink-0" />
                      <h3 className="font-bold text-sm truncate">{source.name}</h3>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-dark transition-colors shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <p className="text-xs text-muted mb-2 line-clamp-2">{source.description}</p>

                    {/* Categories + meta */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex flex-wrap gap-1">
                        {source.category.map((cat) => (
                          <span
                            key={cat}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${categoryColors[cat] || ""}`}
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted">
                        <TypeIcon className="w-3 h-3" />
                        {typeLabels[source.type]}
                      </div>
                      {source.lastSync && (
                        <div className="flex items-center gap-1 text-[10px] text-muted">
                          <Calendar className="w-3 h-3" />
                          Sync: {source.lastSync}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Opportunity count */}
                  <div className="text-center shrink-0 sm:min-w-[80px]">
                    <p className="text-xl font-bold text-primary">{source.opportunityCount}</p>
                    <p className="text-[10px] text-muted">oportunități</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Inactive sources */}
        {inactiveSources.length > 0 && (
          <>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-muted">
              <XCircle className="w-4 h-4" />
              Surse inactive ({inactiveSources.length})
            </h2>
            <div className="space-y-3">
              {inactiveSources.map((source) => {
                const TypeIcon = typeIcons[source.type];
                return (
                  <div
                    key={source.id}
                    className="bg-surface rounded-xl border border-border p-4 sm:p-5 opacity-60"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <XCircle className="w-4 h-4 text-muted shrink-0" />
                          <h3 className="font-bold text-sm truncate">{source.name}</h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-500">
                            Indisponibil
                          </span>
                        </div>
                        <p className="text-xs text-muted mb-2">{source.description}</p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex flex-wrap gap-1">
                            {source.category.map((cat) => (
                              <span
                                key={cat}
                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-alt text-muted"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-muted">
                            <TypeIcon className="w-3 h-3" />
                            {typeLabels[source.type]}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
