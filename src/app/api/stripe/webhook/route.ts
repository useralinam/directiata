import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabase } from "@/lib/supabase";

const ADMIN_EMAIL = "alina.tomsa@techlayer.ro";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getSupabase();

  switch (event.type) {
    // Subscription becomes active (payment succeeded after trial)
    case "customer.subscription.updated": {
      const subscription = event.data.object as unknown as Record<string, unknown>;
      const customerId = subscription.customer as string;
      const status = subscription.status as string;

      const mappedStatus =
        status === "active" ? "active" :
        status === "past_due" ? "past_due" :
        status === "canceled" ? "cancelled" :
        status === "trialing" ? "trial" :
        "expired";

      const updateData: Record<string, string> = {
        status: mappedStatus,
        stripe_subscription_id: subscription.id as string,
        updated_at: new Date().toISOString(),
      };

      if (typeof subscription.current_period_start === "number") {
        updateData.current_period_start = new Date(subscription.current_period_start * 1000).toISOString().split("T")[0];
      }
      if (typeof subscription.current_period_end === "number") {
        updateData.current_period_end = new Date(subscription.current_period_end * 1000).toISOString().split("T")[0];
      }

      await supabase
        .from("company_subscriptions")
        .update(updateData)
        .eq("stripe_customer_id", customerId);

      break;
    }

    // Trial will end soon — notify company
    case "customer.subscription.trial_will_end": {
      const subscription = event.data.object as unknown as Record<string, unknown>;
      const customerId = subscription.customer as string;

      const { data: sub } = await supabase
        .from("company_subscriptions")
        .select("company_name, company_email")
        .eq("stripe_customer_id", customerId)
        .single();

      if (sub) {
        await sendExpirationEmail(sub.company_email, sub.company_name, "trial_ending");
      }
      break;
    }

    // Payment failed
    case "invoice.payment_failed": {
      const invoice = event.data.object as unknown as Record<string, unknown>;
      const customerId = invoice.customer as string;

      const { data: sub } = await supabase
        .from("company_subscriptions")
        .select("company_name, company_email")
        .eq("stripe_customer_id", customerId)
        .single();

      if (sub) {
        await sendExpirationEmail(sub.company_email, sub.company_name, "payment_failed");

        // Notify admin too
        await sendAdminNotification(
          `Plată eșuată: ${sub.company_name} (${sub.company_email})`
        );
      }

      await supabase
        .from("company_subscriptions")
        .update({ status: "past_due", updated_at: new Date().toISOString() })
        .eq("stripe_customer_id", customerId);

      break;
    }

    // Subscription cancelled
    case "customer.subscription.deleted": {
      const subscription = event.data.object as unknown as Record<string, unknown>;
      const customerId = subscription.customer as string;

      await supabase
        .from("company_subscriptions")
        .update({
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_customer_id", customerId);

      // Expire associated internships
      const { data: sub } = await supabase
        .from("company_subscriptions")
        .select("id, company_name, company_email")
        .eq("stripe_customer_id", customerId)
        .single();

      if (sub) {
        await supabase
          .from("internships")
          .update({ status: "expired" })
          .eq("subscription_id", sub.id);

        await sendExpirationEmail(sub.company_email, sub.company_name, "cancelled");
      }
      break;
    }

    // Invoice paid successfully — send invoice by email
    case "invoice.paid": {
      const invoice = event.data.object as unknown as Record<string, unknown>;
      const customerId = invoice.customer as string;
      const amountPaid = typeof invoice.amount_paid === "number" ? invoice.amount_paid / 100 : 0;

      // Stripe sends invoice emails automatically if enabled in Stripe Dashboard
      // But we also notify admin
      await sendAdminNotification(
        `Factură plătită: ${amountPaid} RON — Client: ${customerId}`
      );
      break;
    }
  }

  return NextResponse.json({ received: true });
}

async function sendExpirationEmail(
  email: string,
  companyName: string,
  type: "trial_ending" | "payment_failed" | "cancelled"
) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const subjects: Record<string, string> = {
    trial_ending: `${companyName} — Perioada gratuită se termină în curând`,
    payment_failed: `${companyName} — Plata nu a fost procesată`,
    cancelled: `${companyName} — Subscripție anulată pe DirecțiaTa`,
  };

  const messages: Record<string, string> = {
    trial_ending: `
      <h2>Perioada gratuită se termină în curând</h2>
      <p>Salut,</p>
      <p>Perioada de trial gratuit pentru <strong>${companyName}</strong> pe DirecțiaTa se termină în 3 zile.</p>
      <p>Pentru a menține listările active, metoda de plată asociată va fi debitată automat cu <strong>149 RON/lună</strong>.</p>
      <p>Dacă nu dorești să continui, poți anula oricând din contul tău Stripe sau contactându-ne.</p>
      <p>Mulțumim că folosești DirecțiaTa!</p>
    `,
    payment_failed: `
      <h2>Plata nu a fost procesată</h2>
      <p>Salut,</p>
      <p>Plata lunară pentru <strong>${companyName}</strong> pe DirecțiaTa nu a putut fi procesată.</p>
      <p>Te rugăm să verifici metoda de plată. Listările vor fi dezactivate dacă plata nu se realizează în 7 zile.</p>
      <p>Contactează-ne dacă ai întrebări: <a href="mailto:alina.tomsa@techlayer.ro">alina.tomsa@techlayer.ro</a></p>
    `,
    cancelled: `
      <h2>Subscripție anulată</h2>
      <p>Salut,</p>
      <p>Subscripția pentru <strong>${companyName}</strong> pe DirecțiaTa a fost anulată.</p>
      <p>Listările asociate au fost dezactivate. Poți reactiva oricând prin crearea unei noi subscripții.</p>
      <p>Ne pare rău să te vedem plecând. Feedback-ul tău ne ajută să ne îmbunătățim!</p>
    `,
  };

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: "DirecțiaTa <noreply@directiata.ro>",
      to: email,
      subject: subjects[type],
      html: messages[type],
    }),
  }).catch((err) => console.error("Email send error:", err));
}

async function sendAdminNotification(message: string) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: "DirecțiaTa <noreply@directiata.ro>",
      to: ADMIN_EMAIL,
      subject: `DirecțiaTa Admin — ${message}`,
      html: `<p>${message}</p><p><a href="https://directiata.ro/admin">Panoul de admin</a></p>`,
    }),
  }).catch((err) => console.error("Admin email error:", err));
}
