import { supabase } from "./supabase";
import type { Opportunity } from "./types";

interface DbOpportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  organization: string;
  location: string;
  date: string | null;
  deadline: string | null;
  age_range: string | null;
  tags: string[];
  image: string | null;
  is_free: boolean;
  price: string | null;
  url: string | null;
  source: string;
  difficulty: string | null;
  status: string;
  created_at: string;
}

function toOpportunity(row: DbOpportunity): Opportunity {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category as Opportunity["category"],
    organization: row.organization,
    location: row.location,
    date: row.date ?? undefined,
    deadline: row.deadline ?? undefined,
    ageRange: row.age_range ?? undefined,
    tags: row.tags ?? [],
    image: row.image ?? undefined,
    isFree: row.is_free,
    price: row.price ?? undefined,
    url: row.url ?? undefined,
    source: row.source,
    difficulty: row.difficulty as Opportunity["difficulty"],
    createdAt: row.created_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
  };
}

export async function fetchOpportunities(): Promise<Opportunity[]> {
  const { data, error } = await supabase
    .from("opportunities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase fetch error:", error.message);
    return [];
  }

  return (data as DbOpportunity[]).map(toOpportunity);
}

export async function fetchOpportunitiesByCategory(
  category: string
): Promise<Opportunity[]> {
  const { data, error } = await supabase
    .from("opportunities")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase fetch error:", error.message);
    return [];
  }

  return (data as DbOpportunity[]).map(toOpportunity);
}

export async function addOpportunity(
  opp: Omit<Opportunity, "id" | "createdAt">
): Promise<Opportunity | null> {
  const { error } = await supabase
    .from("opportunities")
    .insert({
      title: opp.title,
      description: opp.description,
      category: opp.category,
      organization: opp.organization,
      location: opp.location,
      date: opp.date || null,
      deadline: opp.deadline || null,
      age_range: opp.ageRange || null,
      tags: opp.tags,
      is_free: opp.isFree,
      price: opp.price || null,
      url: opp.url || null,
      source: opp.source || "utilizator",
      difficulty: opp.difficulty || null,
      status: "pending",
    });

  if (error) {
    console.error("Supabase insert error:", error.message);
    return null;
  }

  // Return a local object (the row has status 'pending' so SELECT RLS won't return it)
  return {
    id: crypto.randomUUID(),
    title: opp.title,
    description: opp.description,
    category: opp.category,
    organization: opp.organization,
    location: opp.location,
    date: opp.date,
    deadline: opp.deadline,
    ageRange: opp.ageRange,
    tags: opp.tags,
    image: opp.image,
    isFree: opp.isFree,
    price: opp.price,
    url: opp.url,
    source: opp.source || "utilizator",
    difficulty: opp.difficulty,
    createdAt: new Date().toISOString().slice(0, 10),
  };
}

export interface CategoryCounts {
  voluntariat: number;
  evenimente: number;
  workshopuri: number;
  competitii: number;
  tabere: number;
  burse: number;
  total: number;
  organizations: number;
}

export async function fetchCategoryCounts(): Promise<CategoryCounts> {
  const counts: CategoryCounts = {
    voluntariat: 0, evenimente: 0, workshopuri: 0,
    competitii: 0, tabere: 0, burse: 0,
    total: 0, organizations: 0,
  };

  const { data, error } = await supabase
    .from("opportunities")
    .select("category, organization");

  if (error || !data) return counts;

  const orgs = new Set<string>();
  for (const row of data as { category: string; organization: string }[]) {
    const cat = row.category as keyof Omit<CategoryCounts, "total" | "organizations">;
    if (cat in counts) counts[cat]++;
    counts.total++;
    if (row.organization) orgs.add(row.organization);
  }
  counts.organizations = orgs.size;

  return counts;
}
