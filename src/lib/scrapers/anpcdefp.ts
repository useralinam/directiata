import * as cheerio from "cheerio";
import type { Scraper, ScrapedOpportunity } from "./types";
import { fetchPage, cleanText, truncate } from "./utils";

/**
 * ANPCDEFP scraper — Romanian National Agency for Erasmus+ and ESC.
 * Scrapes events, news, and opportunities.
 * Source: https://www.anpcdefp.ro
 */
export const anpcdefpScraper: Scraper = {
  name: "ANPCDEFP (Erasmus+ Romania)",
  sourceId: "anpcdefp",

  async run(): Promise<ScrapedOpportunity[]> {
    const opportunities: ScrapedOpportunity[] = [];
    const baseUrl = "https://www.anpcdefp.ro";

    // Scan events and news pages
    const pages = [
      `${baseUrl}/evenimente`,
      `${baseUrl}/stiri`,
      `${baseUrl}/erasmusplus/tineret`,
    ];

    for (const pageUrl of pages) {
      try {
        const html = await fetchPage(pageUrl);
        const $ = cheerio.load(html);

        // Look for event/news cards — ANPCDEFP uses various layouts
        const items = $(
          "article, .event-item, .news-item, .card, .listing-item, .views-row, .item-list li, .event-card"
        );

        items.each((_i, el) => {
          try {
            const $el = $(el);

            // Title
            const titleEl = $el.find(
              "h2 a, h3 a, h4 a, .title a, .field-title a, a.event-title"
            ).first();
            let title = cleanText(titleEl.text());
            const href = titleEl.attr("href") || $el.find("a").first().attr("href");

            if (!title || title.length < 8) {
              title = cleanText($el.find("h2, h3, h4, .title").first().text());
              if (!title || title.length < 8) return;
            }

            // Build URL
            let url = "";
            if (href) {
              url = href.startsWith("http") ? href : `${baseUrl}${href}`;
            }
            if (!url) return;

            // Skip nav/footer links
            if (url === baseUrl || url === `${baseUrl}/`) return;

            // Description
            const description =
              cleanText(
                $el.find(".description, .summary, .teaser, p, .field-body").first().text()
              ) || title;

            // Date
            const dateEl = $el.find(
              ".date, time, .event-date, .field-date, .created"
            ).first();
            const date = cleanText(dateEl.text());

            // Location
            const locationEl = $el.find(".location, .venue, .field-location").first();
            const location = cleanText(locationEl.text()) || "Romania";

            // Category detection
            const lower = `${title} ${description} ${pageUrl}`.toLowerCase();
            let category: ScrapedOpportunity["category"] = "evenimente";
            if (lower.includes("voluntar")) {
              category = "voluntariat";
            } else if (
              lower.includes("finant") ||
              lower.includes("bursa") ||
              lower.includes("grant")
            ) {
              category = "burse";
            } else if (lower.includes("training") || lower.includes("formare")) {
              category = "workshopuri";
            }

            // Tags
            const tags: string[] = ["Erasmus+", "ANPCDEFP"];
            if (lower.includes("tineret") || lower.includes("youth")) tags.push("tineret");
            if (lower.includes("solidar") || lower.includes("esc"))
              tags.push("Corpul European de Solidaritate");
            if (lower.includes("mobilit")) tags.push("mobilitate");
            if (lower.includes("partener")) tags.push("parteneriate");

            opportunities.push({
              title: truncate(title, 200),
              description: truncate(description, 500),
              category,
              organization: "ANPCDEFP",
              location,
              date: date || undefined,
              ageRange: "14-30 ani",
              tags,
              isFree: true,
              url,
              source: "anpcdefp.ro",
              difficulty: "mediu",
            });
          } catch {
            // Skip items that fail
          }
        });
      } catch (err) {
        console.error(`ANPCDEFP scraper error for ${pageUrl}:`, err);
      }
    }

    return opportunities;
  },
};
