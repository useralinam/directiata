import * as cheerio from "cheerio";
import type { Scraper, ScrapedOpportunity } from "./types";
import { fetchPage, cleanText, truncate } from "./utils";

/**
 * SALTO-YOUTH European Training Calendar scraper.
 * Scrapes the /browse/ page which lists training offers as server-rendered HTML.
 * Each item is a .tool-item with structured sub-elements.
 * Source: https://www.salto-youth.net/tools/european-training-calendar/browse/
 */
export const saltoYouthScraper: Scraper = {
  name: "SALTO-YOUTH Training Calendar",
  sourceId: "salto-youth",

  async run(): Promise<ScrapedOpportunity[]> {
    const opportunities: ScrapedOpportunity[] = [];
    const calendarUrl =
      "https://www.salto-youth.net/tools/european-training-calendar/browse/";

    const html = await fetchPage(calendarUrl);
    const $ = cheerio.load(html);

    // Each training is a .tool-item div with .tool-item-description inside
    const items = $(".tool-item");

    items.each((_i, el) => {
      try {
        const $el = $(el);

        // Title: h2.tool-item-name > a
        const titleLink = $el.find("h2.tool-item-name a, h3.tool-item-name a").first();
        const title = cleanText(titleLink.text());
        const url = titleLink.attr("href") || "";

        if (!title || title.length < 5 || !url) return;

        // Category label (e.g. "Training Course", "Seminar")
        const categoryLabel = cleanText(
          $el.find(".tool-item-category").first().text()
        ).toLowerCase();

        // Description: paragraph inside .tool-item-description (3rd <p> usually)
        const descParagraphs = $el.find(".tool-item-description > p.mrgn-btm-22, .tool-item-description > p.h5");
        let description = "";
        descParagraphs.each((_j, p) => {
          const text = cleanText($(p).text());
          // The description paragraph is the longest one
          if (text.length > description.length && !text.match(/^\d/)) {
            description = text;
          }
        });
        if (!description) description = title;

        // Date: first .h5 paragraph (e.g. "25 May - 1 June 2026")
        const dateText = cleanText(
          $el.find(".tool-item-description > p.h5").first().text()
        );

        // Location: .microcopy.mrgn-btm-17 (e.g. "Olteni village, rural Romania, Romania")
        const location =
          cleanText($el.find("p.microcopy.mrgn-btm-17").first().text()) || "Europa";

        // Deadline: inside .callout-module, the .h3 element
        const deadline = cleanText(
          $el.find(".callout-module .h3").first().text()
        );

        // Determine category
        let category: ScrapedOpportunity["category"] = "workshopuri";
        if (
          categoryLabel.includes("seminar") ||
          categoryLabel.includes("conference") ||
          categoryLabel.includes("forum") ||
          categoryLabel.includes("youth exchange")
        ) {
          category = "evenimente";
        }

        // Tags
        const lowerTitle = title.toLowerCase();
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
          date: dateText || undefined,
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
