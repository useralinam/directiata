import Stripe from "stripe";

// Server-side only — Stripe secret key
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(key, { apiVersion: "2026-03-25.dahlia" });
}

// Plan config
export const PLAN = {
  name: "DirecțiaTa — Practică Companii",
  priceRon: 149, // RON/lună
  trialDays: 60, // 2 luni gratuit
  currency: "ron",
} as const;
