export type OpportunityCategory =
  | "voluntariat"
  | "evenimente"
  | "workshopuri"
  | "competitii"
  | "tabere"
  | "burse";

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: OpportunityCategory;
  organization: string;
  location: string;
  date?: string;
  deadline?: string;
  ageRange?: string;
  tags: string[];
  image?: string;
  isFree: boolean;
  price?: string;
  url?: string;
  source: string;
  difficulty?: "ușor" | "mediu" | "avansat";
  createdAt: string;
}

export interface DataSource {
  id: string;
  name: string;
  url: string;
  category: OpportunityCategory[];
  type: "api" | "rss" | "scraping";
  description: string;
  isActive: boolean;
  lastSync?: string;
  opportunityCount?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  interests: string[];
  explorerType?: string;
  experienceLevel: "beginner" | "intermediate" | "advanced";
  completedOpportunities: string[];
  savedOpportunities: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    label: string;
    value: string;
    emoji: string;
  }[];
}

/**
 * Determines if an opportunity's date or deadline has passed.
 * Parses Romanian date strings like "19 Septembrie 2026", "15 Mai 2026",
 * "24-25 Iulie 2025", "Aprilie - Mai 2026", ranges like "8-12 Iunie 2026".
 * Returns true if the latest date mentioned is before today.
 * Returns false for ongoing programs ("Program continuu", "inscrieri deschise", etc.)
 */
export function isExpired(opp: Opportunity): boolean {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Check deadline first, then date
  const text = opp.deadline || opp.date || "";
  if (!text) return false;

  const lower = text.toLowerCase();

  // Skip ongoing/continuous programs
  if (
    lower.includes("continuu") ||
    lower.includes("deschise") ||
    lower.includes("deschis") ||
    lower.includes("pe tot parcursul") ||
    lower.includes("periodic") ||
    lower.includes("vezi site") ||
    lower.includes("vezi suntsolidar") ||
    lower.includes("in fiecare") ||
    lower.includes("an scolar") ||
    lower.includes("inscrieri pe baza") ||
    lower.includes("de anuntat")
  ) {
    return false;
  }

  const months: Record<string, number> = {
    ianuarie: 0, februarie: 1, martie: 2, aprilie: 3,
    mai: 4, iunie: 5, iulie: 6, august: 7,
    septembrie: 8, octombrie: 9, noiembrie: 10, decembrie: 11,
  };

  // Try to extract the last/latest date from the string
  // Pattern: day? Month Year
  const datePattern = /(?:(\d{1,2})\s+)?(ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie)\s+(\d{4})/gi;
  let latestDate: Date | null = null;
  let match: RegExpExecArray | null;

  while ((match = datePattern.exec(text)) !== null) {
    const day = match[1] ? parseInt(match[1], 10) : 28; // default to end of month
    const month = months[match[2].toLowerCase()];
    const year = parseInt(match[3], 10);
    if (month !== undefined) {
      const d = new Date(year, month, day);
      if (!latestDate || d > latestDate) {
        latestDate = d;
      }
    }
  }

  if (latestDate) {
    return latestDate < now;
  }

  return false;
}
