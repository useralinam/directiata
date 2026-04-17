import * as cheerio from "cheerio";
import type { Scraper, ScrapedOpportunity } from "./types";
import { fetchPage, cleanText, truncate } from "./utils";

/**
 * Eurodesk programme scraper.
 * Uses the RSS feed at https://programmes.eurodesk.eu/rss
 * which contains 500+ programme items with title, description, and URL.
 * The HTML version is JS-rendered and cannot be scraped with cheerio.
 */
export const eurodeskScraper: Scraper = {
  name: "Eurodesk Opportunity Finder",
  sourceId: "eurodesk",

  async run(): Promise<ScrapedOpportunity[]> {
    const opportunities: ScrapedOpportunity[] = [];
    const rssUrl = "https://programmes.eurodesk.eu/rss";

    const xml = await fetchPage(rssUrl);
    const $ = cheerio.load(xml, { xml: true });

    const items = $("item");

    items.each((_i, el) => {
      try {
        const $el = $(el);

        const title = cleanText($el.find("title").first().text());
        // <link> always points to /rss (useless), use <guid> as the real URL
        const url = cleanText($el.find("guid").first().text());
        const description = cleanText($el.find("description").first().text());

        if (!title || title.length < 5 || !url || !url.startsWith("http")) return;

        // Detect category from title + description
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

    return opportunities;
  },
};
