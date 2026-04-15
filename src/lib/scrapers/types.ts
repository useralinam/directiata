import type { OpportunityCategory } from "../types";

/** Raw opportunity extracted by a scraper (before Supabase insert) */
export interface ScrapedOpportunity {
  title: string;
  description: string;
  category: OpportunityCategory;
  organization: string;
  location: string;
  date?: string;
  deadline?: string;
  ageRange?: string;
  tags: string[];
  isFree: boolean;
  price?: string;
  url: string;
  source: string;
  difficulty?: "ușor" | "mediu" | "avansat";
}

/** Result returned by each scraper after a run */
export interface ScraperResult {
  source: string;
  found: number;
  inserted: number;
  skipped: number;
  errors: string[];
  durationMs: number;
}

/** Interface every scraper must implement */
export interface Scraper {
  name: string;
  sourceId: string;
  run(): Promise<ScrapedOpportunity[]>;
}
