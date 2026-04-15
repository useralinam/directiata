import * as cheerio from "cheerio";
import type { Scraper, ScrapedOpportunity } from "./types";
import { fetchPage, cleanText, truncate } from "./utils";

/**
 * Eurodesk programme scraper.
 * Scrapes EU programmes and opportunities for young people.
 * Source: https://programmes.eurodesk.eu
 * Also: https://eurodesk.eu/opportunity-finder/
 */
export const eurodeskScraper: Scraper = {
  name: "Eurodesk Opportunity Finder",
  sourceId: "eurodesk",

  async run(): Promise<ScrapedOpportunity[]> {
    const opportunities: ScrapedOpportunity[] = [];

    // Try multiple Eurodesk pages for maximum coverage
    const urls = [
      "https://programmes.eurodesk.eu",
      "https://eurodesk.eu/opportunity-finder/",
    ];

    for (const pageUrl of urls) {
      try {
        const html = await fetchPage(pageUrl);
        const $ = cheerio.load(html);

        // Eurodesk lists programmes in cards or list items
        const items = $(
          ".programme-card, .opportunity-card, article, .card, .listing-item, .programme-item, .result-item"
        );

        items.each((_i, el) => {
          try {
            const $el = $(el);

            const titleEl = $el.find(
              "h2 a, h3 a, h4 a, .card-title a, .title a, a.programme-link"
            ).first();
            let title = cleanText(titleEl.text());
            const href = titleEl.attr("href");

            if (!title || title.length < 5) {
              // Fallback: try h2/h3 directly
              title = cleanText($el.find("h2, h3, h4, .card-title").first().text());
              if (!title || title.length < 5) return;
            }

            // Build URL
            let url = "";
            if (href) {
              if (href.startsWith("http")) {
                url = href;
              } else if (href.startsWith("/")) {
                const base = new URL(pageUrl);
                url = `${base.origin}${href}`;
              }
            }
            if (!url) return;

            // Description
            const description =
              cleanText(
                $el.find(".description, .excerpt, .summary, p, .card-text").first().text()
              ) || title;

            // Detect category
            const combined = `${title} ${description}`.toLowerCase();
            let category: ScrapedOpportunity["category"] = "burse";

            if (combined.includes("volunteer") || combined.includes("voluntar")) {
              category = "voluntariat";
            } else if (
              combined.includes("exchange") ||
              combined.includes("conference") ||
              combined.includes("event")
            ) {
              category = "evenimente";
            } else if (
              combined.includes("training") ||
              combined.includes("workshop") ||
              combined.includes("course")
            ) {
              category = "workshopuri";
            } else if (
              combined.includes("competition") ||
              combined.includes("contest") ||
              combined.includes("award")
            ) {
              category = "competitii";
            }

            // Deadline
            const deadlineEl = $el.find(
              ".deadline, .date, time, .apply-date, .closing-date"
            ).first();
            const deadline = cleanText(deadlineEl.text());

            // Tags
            const tags: string[] = ["Europa", "UE", "tineret"];
            if (combined.includes("erasmus")) tags.push("Erasmus+");
            if (combined.includes("mobility") || combined.includes("mobilit"))
              tags.push("mobilitate");
            if (combined.includes("fund") || combined.includes("grant"))
              tags.push("finantare");

            opportunities.push({
              title: truncate(title, 200),
              description: truncate(description, 500),
              category,
              organization: "Eurodesk / Comisia Europeana",
              location: "Europa",
              deadline: deadline || undefined,
              ageRange: "14-35 ani",
              tags,
              isFree: true,
              url,
              source: "eurodesk.eu",
              difficulty: "mediu",
            });
          } catch {
            // Skip items that fail
          }
        });
      } catch (err) {
        console.error(`Eurodesk scraper error for ${pageUrl}:`, err);
      }
    }

    return opportunities;
  },
};
