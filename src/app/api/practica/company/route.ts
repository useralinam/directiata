import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const ADMIN_EMAIL = "alina.tomsa@techlayer.ro";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const required = ["company_name", "company_email", "title", "description", "domain", "location", "work_type"];
    for (const field of required) {
      if (!body[field]?.trim()) {
        return NextResponse.json(
          { error: `Câmpul „${field}" este obligatoriu.` },
          { status: 400 }
        );
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.company_email)) {
      return NextResponse.json(
        { error: "Adresă de email invalidă." },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    const { error: dbErr } = await supabase.from("internships").insert({
      company_name: body.company_name.trim(),
      company_email: body.company_email.trim(),
      company_website: body.company_website?.trim() || null,
      title: body.title.trim(),
      description: body.description.trim(),
      domain: body.domain.trim(),
      location: body.location.trim(),
      work_type: body.work_type,
      duration: body.duration?.trim() || null,
      schedule: body.schedule?.trim() || null,
      spots: body.spots ? parseInt(body.spots, 10) : 0,
      requirements: body.requirements?.trim() || null,
      benefits: body.benefits?.trim() || null,
      is_paid: !!body.is_paid,
      salary_info: body.salary_info?.trim() || null,
      start_date: body.start_date || null,
      deadline: body.deadline || null,
      status: "pending",
    });

    if (dbErr) {
      console.error("Supabase insert error:", dbErr);
      return NextResponse.json(
        { error: "Eroare la salvare. Încearcă din nou." },
        { status: 500 }
      );
    }

    // Notify admin via email
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
          to: ADMIN_EMAIL,
          subject: `Practică nouă: ${body.title} — ${body.company_name}`,
          html: `
            <h2>Listare nouă de practică pe DirecțiaTa</h2>
            <p><strong>Companie:</strong> ${body.company_name}</p>
            <p><strong>Email companie:</strong> ${body.company_email}</p>
            <p><strong>Titlu:</strong> ${body.title}</p>
            <p><strong>Domeniu:</strong> ${body.domain}</p>
            <p><strong>Locație:</strong> ${body.location} (${body.work_type})</p>
            <hr />
            <p>${body.description.replace(/\n/g, "<br />")}</p>
            <hr />
            <p>Intră în <a href="https://directiata.ro/admin">panoul de administrare</a> pentru a aproba listarea.</p>
          `,
        }),
      }).catch((err) => console.error("Email send error:", err));
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Company API error:", err);
    return NextResponse.json(
      { error: "Eroare internă. Încearcă din nou." },
      { status: 500 }
    );
  }
}
