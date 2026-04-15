import * as cheerio from "cheerio";
import type { Scraper, ScrapedOpportunity } from "./types";
import { fetchPage, cleanText, truncate } from "./utils";

/**
 * suntsolidar.eu scraper — European Solidarity Corps (ESC) Romania portal.
 * Scrapes volunteering and solidarity projects.
 * Source: https://www.suntsolidar.eu/evenimente
 */
export const suntsolidarScraper: Scraper = {
  name: "Sunt Solidar (ESC Romania)",
  sourceId: "suntsolidar",

  async run(): Promise<ScrapedOpportunity[]> {
    const opportunities: ScrapedOpportunity[] = [];
    const baseUrl = "https://www.suntsolidar.eu";

    // Scan the events page and the main page
    const pages = [
      `${baseUrl}/evenimente`,
      `${baseUrl}/proiecte`,
      baseUrl,
    ];

    for (const pageUrl of pages) {
      try {
        const html = await fetchPage(pageUrl);
        const $ = cheerio.load(html);

        // Look for event/project cards
        const items = $(
          ".event-card, .project-card, article, .card, .item, .listing-item, .news-item, a.event-link, .views-row"
        );

        items.each((_i, el) => {
          try {
            const $el = $(el);

            // Title
            const titleEl = $el.find(
              "h2 a, h3 a, h4 a, .title a, .card-title, a"
            ).first();
            let title = cleanText(titleEl.text());
            const href = titleEl.attr("href") || $el.find("a").first().attr("href");

            if (!title || title.length < 8) {
              title = cleanText($el.find("h2, h3, h4, .title").first().text());
              if (!title || title.length < 8) return;
            }

            // URL
            let url = "";
            if (href) {
              url = href.startsWith("http") ? href : `${baseUrl}${href}`;
            }
            if (!url) return;

            // Don't re-scrape navigation links
            if (url.includes("#") && !url.includes("/evenimente") && !url.includes("/proiecte"))
              return;

            // Description
            const description =
              cleanText(
                $el.find(".description, .summary, p, .field-body, .teaser").first().text()
              ) || title;

            // Date
            const dateEl = $el.find(".date, time, .event-date, .field-date").first();
            const date = cleanText(dateEl.text());

            // Location
            const locationEl = $el.find(".location, .venue, .field-location").first();
            const location = cleanText(locationEl.text()) || "Romania";

            // Determine category
            const lower = `${title} ${description}`.toLowerCase();
            let category: ScrapedOpportunity["category"] = "voluntariat";
            if (lower.includes("solidaritate") || lower.includes("solidarity")) {
              category = "burse";
            } else if (lower.includes("eveniment") || lower.includes("event")) {
              category = "evenimente";
            }

            const tags: string[] = [
              "ESC",
              "Corpul European de Solidaritate",
              "UE",
              "voluntariat",
            ];
            if (lower.includes("international")) tags.push("international");
            if (lower.includes("rural")) tags.push("rural");

            opportunities.push({
              title: truncate(title, 200),
              description: truncate(description, 500),
              category,
              organization: "Corpul European de Solidaritate / ANPCDEFP",
              location,
              date: date || undefined,
              ageRange: "18-30 ani",
              tags,
              isFree: true,
              url,
              source: "suntsolidar.eu",
              difficulty: "mediu",
            });
          } catch {
            // Skip items that fail
          }
        });
      } catch (err) {
        console.error(`suntsolidar scraper error for ${pageUrl}:`, err);
      }
    }

    return opportunities;
  },
};
