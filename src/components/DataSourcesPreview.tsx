import { Database, ExternalLink, CheckCircle2, Globe } from "lucide-react";
import Link from "next/link";
import { dataSources } from "@/lib/data";

export default function DataSourcesPreview() {
  const activeSources = dataSources.filter((s) => s.isActive).slice(0, 12);
  const totalOpportunities = dataSources.reduce(
    (sum, s) => sum + (s.opportunityCount || 0),
    0
  );

  return (
    <section className="py-20 bg-surface-alt/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-green/10 text-accent-green text-sm font-semibold mb-4">
            <Database className="w-4 h-4" />
            Agregator de date verificate
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            De unde vin <span className="text-primary">oportunitățile</span>?
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Colectăm automat date din {dataSources.length} surse nationale și europene de încredere.
            Peste <strong className="text-foreground">{totalOpportunities.toLocaleString("ro-RO")}</strong> oportunități actualizate constant.
          </p>
        </div>

        {/* Sources grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mb-10">
          {activeSources.map((source) => (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover bg-surface rounded-xl border border-border p-3 sm:p-4 text-center group animate-fade-in-up block"
            >
              <div className="flex items-center justify-center gap-1 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent-green" />
                <span className="text-[10px] font-semibold text-accent-green uppercase tracking-wider">
                  {source.type}
                </span>
              </div>
              <h4 className="text-xs font-bold leading-snug mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                {source.name}
              </h4>
              <p className="text-[10px] text-muted mb-1">
                {source.opportunityCount} oport.
              </p>
              <Globe className="w-3 h-3 text-muted mx-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/surse-date"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-sm font-semibold hover:border-primary hover:text-primary transition-all"
          >
            Vezi toate cele {dataSources.length} de surse
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
