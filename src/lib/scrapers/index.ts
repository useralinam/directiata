import { saltoYouthScraper } from "./salto-youth";
import { eurodeskScraper } from "./eurodesk";
import { suntsolidarScraper } from "./suntsolidar";
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
  suntsolidarScraper,
  anpcdefpScraper,
];
