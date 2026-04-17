import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const ADMIN_EMAIL = "alina.tomsa@techlayer.ro";

// Called daily by Vercel cron — checks trial expirations
export async function GET(request: Request) {
  // Verify cron secret (Vercel sets this automatically for cron routes)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();
  const today = new Date().toISOString().split("T")[0];

  // 1. Find trials expiring in 3 days — send warning email
  const threeDaysFromNow = new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0];
  const { data: expiringSoon } = await supabase
    .from("company_subscriptions")
    .select("id, company_name, company_email, trial_end")
    .eq("status", "trial")
    .eq("trial_end", threeDaysFromNow);

  let warningSent = 0;
  if (expiringSoon) {
    for (const sub of expiringSoon) {
      await sendEmail(
        sub.company_email,
        `${sub.company_name} — Perioada gratuită expiră în 3 zile`,
        `
          <h2>Perioada gratuită expiră în curând</h2>
          <p>Salut,</p>
          <p>Trialul gratuit pentru <strong>${sub.company_name}</strong> pe DirecțiaTa expiră pe <strong>${new Date(sub.trial_end).toLocaleDateString("ro-RO")}</strong>.</p>
          <p>Dacă ai adăugat o metodă de plată prin Stripe, abonamentul de <strong>149 RON/lună</strong> se va activa automat.</p>
          <p>Dacă nu ai adăugat încă, listările tale vor fi dezactivate la expirarea trial-ului.</p>
          <p><a href="https://directiata.ro/practica/pret" style="color: #3B82F6; font-weight: bold;">Activează abonamentul →</a></p>
          <p>Echipa DirecțiaTa</p>
        `
      );
      warningSent++;
    }
  }

  // 2. Expire trials that passed their end date without payment
  const { data: expired } = await supabase
    .from("company_subscriptions")
    .select("id, company_name, company_email")
    .eq("status", "trial")
    .lt("trial_end", today);

  let expiredCount = 0;
  if (expired) {
    for (const sub of expired) {
      // Mark subscription as expired
      await supabase
        .from("company_subscriptions")
        .update({ status: "expired", updated_at: new Date().toISOString() })
        .eq("id", sub.id);

      // Expire all associated internships
      await supabase
        .from("internships")
        .update({ status: "expired" })
        .eq("subscription_id", sub.id);

      await sendEmail(
        sub.company_email,
        `${sub.company_name} — Perioada gratuită a expirat`,
        `
          <h2>Perioada gratuită a expirat</h2>
          <p>Salut,</p>
          <p>Trialul gratuit pentru <strong>${sub.company_name}</strong> pe DirecțiaTa a expirat. Listările au fost dezactivate.</p>
          <p>Poți reactiva oricând abonamentul:</p>
          <p><a href="https://directiata.ro/practica/pret" style="color: #3B82F6; font-weight: bold;">Reactivează abonamentul →</a></p>
          <p>Echipa DirecțiaTa</p>
        `
      );
      expiredCount++;
    }
  }

  // 3. Notify admin summary
  if (warningSent > 0 || expiredCount > 0) {
    await sendEmail(
      ADMIN_EMAIL,
      `DirecțiaTa — Subscripții: ${warningSent} avertizări, ${expiredCount} expirate`,
      `
        <h2>Raport subscripții zilnic</h2>
        <p><strong>Avertizări trimise (expiră în 3 zile):</strong> ${warningSent}</p>
        <p><strong>Trialuri expirate azi:</strong> ${expiredCount}</p>
        <p><a href="https://directiata.ro/admin">Panoul de admin</a></p>
      `
    );
  }

  return NextResponse.json({
    ok: true,
    date: today,
    warnings_sent: warningSent,
    trials_expired: expiredCount,
  });
}

async function sendEmail(to: string, subject: string, html: string) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.log(`[DRY-RUN] Email to ${to}: ${subject}`);
    return;
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: "DirecțiaTa <noreply@directiata.ro>",
      to,
      subject,
      html,
    }),
  }).catch((err) => console.error("Email error:", err));
}
