import * as cheerio from "cheerio";
import type { Scraper, ScrapedOpportunity } from "./types";
import { fetchPage, cleanText, truncate } from "./utils";

/**
 * ANPCDEFP scraper — Romanian National Agency for Erasmus+ and ESC.
 * Scrapes events from the /evenimente page which uses .C_Event divs.
 * Source: https://www.anpcdefp.ro/evenimente
 */
export const anpcdefpScraper: Scraper = {
  name: "ANPCDEFP (Erasmus+ Romania)",
  sourceId: "anpcdefp",

  async run(): Promise<ScrapedOpportunity[]> {
    const opportunities: ScrapedOpportunity[] = [];
    const baseUrl = "https://www.anpcdefp.ro";
    const eventsUrl = `${baseUrl}/evenimente`;

    const html = await fetchPage(eventsUrl);
    const $ = cheerio.load(html);

    // Each event is a div.C_Event
    const items = $(".C_Event");

    items.each((_i, el) => {
      try {
        const $el = $(el);

        // Title: .C_BoxTitle > a
        const titleLink = $el.find(".C_BoxTitle a").first();
        const title = cleanText(titleLink.text());
        const href = titleLink.attr("href") || "";

        if (!title || title.length < 8) return;

        // Build absolute URL (hrefs are like /evenimente-det/vrs/IDev/1894)
        const url = href.startsWith("http") ? href : `${baseUrl}${href}`;

        // Period and location are in .C_BoxHalf divs
        const boxHalves = $el.find(".C_BoxHalf");
        let period = "";
        let location = "Romania";

        boxHalves.each((_j, half) => {
          const text = cleanText($(half).text());
          // Period usually starts with "Perioadă" or contains date patterns
          if (text.toLowerCase().includes("perioad") || text.match(/\d{2}\.\d{2}\.\d{4}/)) {
            period = text.replace(/^Perioad[aă]:\s*/i, "");
          }
          // Location usually starts with "Locul desfășurării" or "Loc"
          if (text.toLowerCase().includes("loc")) {
            location = text.replace(/^Locul\s+desf[aă][sș]ur[aă]rii:\s*/i, "").replace(/^Loc:\s*/i, "") || "Romania";
          }
        });

        // Deadline: .C_BoxTerm
        const deadlineText = cleanText($el.find(".C_BoxTerm").first().text());
        const deadline = deadlineText.replace(/^Termen\s+[^\d]*/i, "");

        // Organizer: .C_BoxFull that contains "Organizator"
        let organizer = "ANPCDEFP";
        $el.find(".C_BoxFull").each((_j, box) => {
          const text = cleanText($(box).text());
          if (text.toLowerCase().includes("organizator")) {
            organizer = text.replace(/^Organizator:\s*/i, "") || "ANPCDEFP";
          }
        });

        // Category detection
        const lower = title.toLowerCase();
        let category: ScrapedOpportunity["category"] = "evenimente";
        if (lower.includes("voluntar")) {
          category = "voluntariat";
        } else if (lower.includes("training") || lower.includes("formare")) {
          category = "workshopuri";
        } else if (lower.includes("bursa") || lower.includes("grant") || lower.includes("finant")) {
          category = "burse";
        }

        // Tags
        const tags: string[] = ["Erasmus+", "ANPCDEFP"];
        if (lower.includes("tineret") || lower.includes("youth")) tags.push("tineret");
        if (lower.includes("solidar") || lower.includes("esc"))
          tags.push("Corpul European de Solidaritate");
        if (lower.includes("mobilit")) tags.push("mobilitate");

        opportunities.push({
          title: truncate(title, 200),
          description: truncate(title, 500), // Events page has no separate description
          category,
          organization: organizer,
          location,
          date: period || undefined,
          deadline: deadline || undefined,
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

    return opportunities;
  },
};
