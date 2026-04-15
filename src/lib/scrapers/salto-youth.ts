import * as cheerio from "cheerio";
import type { Scraper, ScrapedOpportunity } from "./types";
import { fetchPage, cleanText, truncate } from "./utils";

/**
 * SALTO-YOUTH European Training Calendar scraper.
 * Scrapes upcoming training courses, seminars, and study visits
 * from the SALTO-YOUTH training calendar.
 * Source: https://salto-youth.net/tools/european-training-calendar/
 */
export const saltoYouthScraper: Scraper = {
  name: "SALTO-YOUTH Training Calendar",
  sourceId: "salto-youth",

  async run(): Promise<ScrapedOpportunity[]> {
    const opportunities: ScrapedOpportunity[] = [];
    const baseUrl = "https://salto-youth.net";
    const calendarUrl = `${baseUrl}/tools/european-training-calendar/`;

    const html = await fetchPage(calendarUrl);
    const $ = cheerio.load(html);

    // SALTO lists trainings in .training-item or similar structured elements
    const trainingElements = $(
      ".tool-listing-results .tool-listing-results__item, .training-item, .tc-item, article.card, .event-card, tr.training-row"
    );

    trainingElements.each((_i, el) => {
      try {
        const $el = $(el);

        // Extract title from heading or link
        const titleEl =
          $el.find("h2 a, h3 a, .title a, .card-title a, a.training-title").first();
        const title = cleanText(titleEl.text());
        const href = titleEl.attr("href");

        if (!title || title.length < 5) return;

        // Build full URL
        const url = href
          ? href.startsWith("http")
            ? href
            : `${baseUrl}${href}`
          : "";

        if (!url) return;

        // Extract description
        const descEl = $el.find(
          ".description, .summary, .card-text, p, .teaser"
        ).first();
        const description = cleanText(descEl.text()) || title;

        // Extract date
        const dateEl = $el.find(
          ".date, .dates, .event-date, time, .card-date, .training-date"
        ).first();
        const date = cleanText(dateEl.text());

        // Extract location
        const locationEl = $el.find(
          ".location, .venue, .country, .card-location"
        ).first();
        const location = cleanText(locationEl.text()) || "Europa";

        // Extract deadline
        const deadlineEl = $el.find(".deadline, .apply-before").first();
        const deadline = cleanText(deadlineEl.text());

        // Determine category based on content
        let category: ScrapedOpportunity["category"] = "workshopuri";
        const lowerTitle = title.toLowerCase();
        if (
          lowerTitle.includes("seminar") ||
          lowerTitle.includes("conference") ||
          lowerTitle.includes("forum")
        ) {
          category = "evenimente";
        } else if (lowerTitle.includes("exchange") || lowerTitle.includes("youth exchange")) {
          category = "evenimente";
        }

        // Extract tags from title keywords
        const tags: string[] = ["international", "Erasmus+", "training"];
        if (lowerTitle.includes("youth")) tags.push("tineret");
        if (lowerTitle.includes("volunteer")) tags.push("voluntariat");
        if (lowerTitle.includes("sport")) tags.push("sport");
        if (lowerTitle.includes("inclusion")) tags.push("incluziune");
        if (lowerTitle.includes("digital")) tags.push("digital");
        if (lowerTitle.includes("environment") || lowerTitle.includes("green"))
          tags.push("mediu");

        opportunities.push({
          title: truncate(title, 200),
          description: truncate(description, 500),
          category,
          organization: "SALTO-YOUTH / Erasmus+",
          location,
          date: date || undefined,
          deadline: deadline || undefined,
          ageRange: "18-30 ani",
          tags,
          isFree: true,
          url,
          source: "salto-youth.net",
          difficulty: "mediu",
        });
      } catch {
        // Skip individual items that fail to parse
      }
    });

    return opportunities;
  },
};
