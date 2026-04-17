import { saltoYouthScraper } from "./salto-youth";
import { eurodeskScraper } from "./eurodesk";
// suntsolidar.eu is a 100% JS SPA (61 bytes HTML) — cannot be scraped with cheerio.
// Disabled until a headless browser solution (Playwright/Browserless) is added.
// import { suntsolidarScraper } from "./suntsolidar";
import { anpcdefpScraper } from "./anpcdefp";
import type { Scraper } from "./types";

/**
 * Registry of all scrapers.
 * Add new scrapers here and they'll be automatically included
 * in the cron scraping job.
 */
export const allScrapers: Scraper[] = [
  saltoYouthScraper,
  eurodeskScraper,
  // suntsolidarScraper, // disabled — JS SPA, needs Playwright
  anpcdefpScraper,
];
