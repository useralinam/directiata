import { NextResponse } from "next/server";
import { allScrapers } from "@/lib/scrapers";
import type { ScraperResult } from "@/lib/scrapers/types";
import {
  getExistingUrls,
  insertScrapedOpportunities,
  logScraperRun,
  getEnabledSources,
  updateSourceStatus,
} from "@/lib/scrapers/utils";

/**
 * POST /api/scrape
 *
 * Secured cron endpoint that runs all scrapers, deduplicates results,
 * inserts new opportunities into Supabase, and logs the run.
 *
 * Security: Requires `Authorization: Bearer <CRON_SECRET>` header.
 * Vercel Cron sends this automatically when CRON_SECRET is set.
 */
export async function POST(request: Request) {
  // Verify authorization
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json(
      { error: "CRON_SECRET not configured" },
      { status: 500 }
    );
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const results: ScraperResult[] = [];

  // Get existing URLs once for deduplication across all scrapers
  const existingUrls = await getExistingUrls();

  // Get enabled sources from DB; filter scrapers that are due for a run
  const enabledSources = await getEnabledSources();
  const scrapersToRun = allScrapers.filter((scraper) => {
    const source = enabledSources.find((s) => s.source_id === scraper.sourceId);
    if (!source) return true; // no DB row yet = run by default
    if (!source.enabled) return false;

    // Check if enough time has passed since last scrape
    if (source.last_scraped_at) {
      const hoursSinceLast =
        (Date.now() - new Date(source.last_scraped_at).getTime()) / 3_600_000;
      if (hoursSinceLast < source.scrape_interval_hours) return false;
    }

    return true;
  });

  for (const scraper of scrapersToRun) {
    const scraperStart = Date.now();
    const result: ScraperResult = {
      source: scraper.name,
      found: 0,
      inserted: 0,
      skipped: 0,
      errors: [],
      durationMs: 0,
    };

    try {
      // Run the scraper
      const opportunities = await scraper.run();
      result.found = opportunities.length;

      // Insert new ones into Supabase
      const { inserted, skipped } = await insertScrapedOpportunities(
        opportunities,
        existingUrls,
        true // auto-approve from trusted sources
      );

      result.inserted = inserted;
      result.skipped = skipped;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error";
      result.errors.push(errorMessage);
      console.error(`Scraper "${scraper.name}" failed:`, errorMessage);
    }

    result.durationMs = Date.now() - scraperStart;
    results.push(result);

    // Update source status in DB
    await updateSourceStatus(scraper.sourceId, {
      last_scraped_at: new Date().toISOString(),
      last_status: result.errors.length > 0 ? "error" : "success",
      last_error: result.errors.length > 0 ? result.errors.join("; ") : null,
      total_found: result.found,
      total_inserted: result.inserted,
    });
  }

  // Log the entire run to Supabase
  await logScraperRun(results);

  const totalDuration = Date.now() - startTime;

  return NextResponse.json({
    success: true,
    duration: `${totalDuration}ms`,
    summary: {
      totalFound: results.reduce((s, r) => s + r.found, 0),
      totalInserted: results.reduce((s, r) => s + r.inserted, 0),
      totalSkipped: results.reduce((s, r) => s + r.skipped, 0),
      totalErrors: results.reduce((s, r) => s + r.errors.length, 0),
    },
    details: results,
  });
}

/**
 * GET /api/scrape — returns info about the scraper endpoint.
 * Does NOT run the scrapers (use POST for that).
 */
export async function GET() {
  const enabledSources = await getEnabledSources();
  return NextResponse.json({
    endpoint: "/api/scrape",
    method: "POST",
    description:
      "Runs all scrapers, deduplicates, inserts new opportunities into Supabase.",
    scrapers: allScrapers.map((s) => {
      const src = enabledSources.find((e) => e.source_id === s.sourceId);
      return {
        name: s.name,
        sourceId: s.sourceId,
        enabled: src ? src.enabled : true,
        priority: src?.priority || "normal",
        intervalHours: src?.scrape_interval_hours || 24,
        lastScraped: src?.last_scraped_at || null,
        lastStatus: src?.last_status || null,
      };
    }),
    security: "Requires Authorization: Bearer <CRON_SECRET> header",
    schedule: "Every 6 hours (00:00, 06:00, 12:00, 18:00 UTC)",
  });
}
