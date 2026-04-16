import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { opportunityId, opportunityTitle, reason, details, reporterEmail } = body;

    if (!opportunityId || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = getSupabase();

    const { error } = await supabase.from("reports").insert({
      opportunity_id: opportunityId,
      opportunity_title: opportunityTitle || "",
      reason,
      details: details || "",
      reporter_email: reporterEmail || null,
      status: "new",
    });

    if (error) {
      console.error("Report insert error:", error.message);
      return NextResponse.json({ error: "Failed to save report" }, { status: 500 });
    }

    // Send email notification to admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      try {
        const resendKey = process.env.RESEND_API_KEY;
        if (resendKey) {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${resendKey}`,
            },
            body: JSON.stringify({
              from: "DirecțiaTa <noreply@directiata.ro>",
              to: adminEmail,
              subject: `[DirecțiaTa] Raport nou: ${reason}`,
              html: `
                <h2>Raport nou pe DirecțiaTa</h2>
                <p><strong>Oportunitate:</strong> ${opportunityTitle}</p>
                <p><strong>Motiv:</strong> ${reason}</p>
                <p><strong>Detalii:</strong> ${details || "N/A"}</p>
                <p><strong>Email reporter:</strong> ${reporterEmail || "Anonim"}</p>
                <hr />
                <p><a href="https://directiata.ro/admin">Gestionează rapoartele →</a></p>
              `,
            }),
          });
        }
      } catch (emailErr) {
        console.error("Email notification error:", emailErr);
        // Don't fail the report if email fails
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
