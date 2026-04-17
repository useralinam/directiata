import { NextResponse } from "next/server";
import { getStripe, PLAN } from "@/lib/stripe";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { company_name, company_email, contact_person, cui, billing_address, company_website } = body;

    if (!company_name?.trim() || !company_email?.trim()) {
      return NextResponse.json(
        { error: "Numele companiei și emailul sunt obligatorii." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(company_email)) {
      return NextResponse.json(
        { error: "Adresă de email invalidă." },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const supabase = getSupabase();

    // Check if company already has a subscription
    const { data: existing } = await supabase
      .from("company_subscriptions")
      .select("id, status, stripe_customer_id")
      .eq("company_email", company_email.trim())
      .in("status", ["trial", "active"])
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Există deja o subscripție activă pentru acest email." },
        { status: 409 }
      );
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      name: company_name.trim(),
      email: company_email.trim(),
      metadata: {
        contact_person: contact_person?.trim() || "",
        cui: cui?.trim() || "",
        platform: "directiata",
      },
    });

    // Create Stripe price (or use existing product)
    // In production, create the product+price once in Stripe dashboard
    // and use STRIPE_PRICE_ID env var. For now, create inline:
    const priceId = process.env.STRIPE_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: "Configurare plăți incompletă. Contactează-ne." },
        { status: 500 }
      );
    }

    // Create Stripe Checkout session with trial
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://directiata.ro";

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: PLAN.trialDays,
        metadata: {
          company_name: company_name.trim(),
          company_email: company_email.trim(),
        },
      },
      success_url: `${baseUrl}/practica/pret?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/practica/pret?status=cancelled`,
    });

    // Save subscription record in Supabase (status: trial)
    await supabase.from("company_subscriptions").insert({
      company_name: company_name.trim(),
      company_email: company_email.trim(),
      company_website: company_website?.trim() || null,
      contact_person: contact_person?.trim() || null,
      cui: cui?.trim() || null,
      billing_address: billing_address?.trim() || null,
      stripe_customer_id: customer.id,
      status: "trial",
      trial_start: new Date().toISOString().split("T")[0],
      trial_end: new Date(Date.now() + PLAN.trialDays * 86400000).toISOString().split("T")[0],
      price_ron: PLAN.priceRon * 100,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe checkout error:", message, err);
    return NextResponse.json(
      { error: `Eroare la procesare: ${message}` },
      { status: 500 }
    );
  }
}
