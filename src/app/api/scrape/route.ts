import { NextResponse } from "next/server";
import { allScrapers } from "@/lib/scrapers";
import type { ScraperResult } from "@/lib/scrapers/types";
import {
  getExistingUrls,
  insertScrapedOpportunities,
  logScraperRun,
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

  for (const scraper of allScrapers) {
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
  return NextResponse.json({
    endpoint: "/api/scrape",
    method: "POST",
    description:
      "Runs all scrapers, deduplicates, inserts new opportunities into Supabase.",
    scrapers: allScrapers.map((s) => ({ name: s.name, sourceId: s.sourceId })),
    security: "Requires Authorization: Bearer <CRON_SECRET> header",
    schedule: "Daily at 06:00 UTC (09:00 Romania time)",
  });
}
