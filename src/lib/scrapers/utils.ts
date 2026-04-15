import { supabase } from "../supabase";
import type { ScrapedOpportunity, ScraperResult } from "./types";

/**
 * Fetch a URL with a timeout and a reasonable User-Agent.
 * Returns the HTML string or throws on failure.
 */
export async function fetchPage(url: string, timeoutMs = 15_000): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "DirectiaTa-Bot/1.0 (+https://directiata.ro; aggregator educativ pentru tineri)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ro-RO,ro;q=0.9,en;q=0.5",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} for ${url}`);
    }

    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Check which URLs already exist in Supabase to avoid duplicates.
 * Returns a Set of existing URLs.
 */
export async function getExistingUrls(): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("opportunities")
    .select("url")
    .not("url", "is", null);

  if (error) {
    console.error("Error fetching existing URLs:", error.message);
    return new Set();
  }

  return new Set(
    (data as { url: string }[])
      .map((row) => row.url)
      .filter(Boolean)
      .map((u) => u.toLowerCase().replace(/\/+$/, ""))
  );
}

/**
 * Normalise a URL for comparison (lowercase, strip trailing slashes).
 */
export function normalizeUrl(url: string): string {
  return url.toLowerCase().replace(/\/+$/, "");
}

/**
 * Insert scraped opportunities into Supabase, skipping duplicates.
 * Trusted sources get status 'approved'; unknown sources get 'pending'.
 */
export async function insertScrapedOpportunities(
  opportunities: ScrapedOpportunity[],
  existingUrls: Set<string>,
  autoApprove = true
): Promise<{ inserted: number; skipped: number }> {
  let inserted = 0;
  let skipped = 0;

  for (const opp of opportunities) {
    const normUrl = normalizeUrl(opp.url);
    if (existingUrls.has(normUrl)) {
      skipped++;
      continue;
    }

    const { error } = await supabase.from("opportunities").insert({
      title: opp.title,
      description: opp.description,
      category: opp.category,
      organization: opp.organization,
      location: opp.location,
      date: opp.date || null,
      deadline: opp.deadline || null,
      age_range: opp.ageRange || null,
      tags: opp.tags,
      is_free: opp.isFree,
      price: opp.price || null,
      url: opp.url,
      source: opp.source,
      difficulty: opp.difficulty || null,
      status: autoApprove ? "approved" : "pending",
    });

    if (error) {
      console.error(`Insert error for "${opp.title}":`, error.message);
      skipped++;
    } else {
      existingUrls.add(normUrl); // prevent duplicates within same batch
      inserted++;
    }
  }

  return { inserted, skipped };
}

/**
 * Log a scraper run result into the scraper_logs table.
 */
export async function logScraperRun(results: ScraperResult[]): Promise<void> {
  const { error } = await supabase.from("scraper_logs").insert({
    results: JSON.stringify(results),
    total_found: results.reduce((s, r) => s + r.found, 0),
    total_inserted: results.reduce((s, r) => s + r.inserted, 0),
    total_skipped: results.reduce((s, r) => s + r.skipped, 0),
    total_errors: results.reduce((s, r) => s + r.errors.length, 0),
  });

  if (error) {
    console.error("Error logging scraper run:", error.message);
  }
}

/**
 * Truncate text to a max length, appending "..." if needed.
 */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 3) + "...";
}

/**
 * Clean scraped text: remove extra whitespace, trim.
 */
export function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}
