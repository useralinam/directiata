import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const ADMIN_EMAIL = "alina.tomsa@techlayer.ro";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const required = ["internship_id", "full_name", "email", "motivation"];
    for (const field of required) {
      if (!body[field]?.trim()) {
        return NextResponse.json(
          { error: `Câmpul „${field}" este obligatoriu.` },
          { status: 400 }
        );
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { error: "Adresă de email invalidă." },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // Verify internship exists and is approved
    const { data: internship } = await supabase
      .from("internships")
      .select("id, title, company_name, company_email")
      .eq("id", body.internship_id)
      .eq("status", "approved")
      .single();

    if (!internship) {
      return NextResponse.json(
        { error: "Această practică nu mai este disponibilă." },
        { status: 404 }
      );
    }

    const { error: dbErr } = await supabase.from("applications").insert({
      internship_id: body.internship_id,
      full_name: body.full_name.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim() || null,
      university: body.university?.trim() || null,
      study_year: body.study_year?.trim() || null,
      field_of_study: body.field_of_study?.trim() || null,
      motivation: body.motivation.trim(),
      cv_url: body.cv_url || null,
      cover_letter_url: body.cover_letter_url || null,
      availability_date: body.availability_date || null,
      status: "new",
    });

    if (dbErr) {
      console.error("Supabase insert error:", dbErr);
      return NextResponse.json(
        { error: "Eroare la salvare. Încearcă din nou." },
        { status: 500 }
      );
    }

    // Notify company and admin
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const htmlBody = `
        <h2>Aplicație nouă pentru: ${internship.title}</h2>
        <p><strong>Candidat:</strong> ${body.full_name} (${body.email})</p>
        ${body.phone ? `<p><strong>Telefon:</strong> ${body.phone}</p>` : ""}
        ${body.university ? `<p><strong>Instituție:</strong> ${body.university}</p>` : ""}
        ${body.study_year ? `<p><strong>Anul:</strong> ${body.study_year}</p>` : ""}
        ${body.field_of_study ? `<p><strong>Domeniu:</strong> ${body.field_of_study}</p>` : ""}
        <hr />
        <p><strong>Motivație:</strong></p>
        <p>${body.motivation.replace(/\n/g, "<br />")}</p>
        ${body.cv_url ? `<p><strong>CV:</strong> <a href="${body.cv_url}">Descarcă CV</a></p>` : ""}
        ${body.cover_letter_url ? `<p><strong>Scrisoare:</strong> <a href="${body.cover_letter_url}">Descarcă</a></p>` : ""}
        <hr />
        <p style="color: #888; font-size: 12px;">Aplicație trimisă prin DirecțiaTa.ro</p>
      `;

      const recipients = [ADMIN_EMAIL];
      if (internship.company_email) {
        recipients.push(internship.company_email);
      }

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "DirecțiaTa <noreply@directiata.ro>",
          to: recipients,
          reply_to: body.email,
          subject: `Aplicație nouă: ${body.full_name} → ${internship.title}`,
          html: htmlBody,
        }),
      }).catch((err) => console.error("Email send error:", err));
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Apply API error:", err);
    return NextResponse.json(
      { error: "Eroare internă. Încearcă din nou." },
      { status: 500 }
    );
  }
}
