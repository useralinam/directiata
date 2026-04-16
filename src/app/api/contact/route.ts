import { NextResponse } from "next/server";

const ADMIN_EMAIL = "alina.tomsa@techlayer.ro";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: "Completează e-mail, subiect și mesaj." },
        { status: 400 }
      );
    }

    // Basic email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Adresă de e-mail invalidă." },
        { status: 400 }
      );
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.error("RESEND_API_KEY not set — contact email not sent");
      // Still return success — we log it server-side
      return NextResponse.json({ ok: true });
    }

    const emailSubject = `DirectiaTa - ${subject}`;
    const htmlBody = `
      <h2>Mesaj nou de pe DirecțiaTa</h2>
      <p><strong>De la:</strong> ${name || "Anonim"} (${email})</p>
      <p><strong>Subiect:</strong> ${subject}</p>
      <hr />
      <p>${message.replace(/\n/g, "<br />")}</p>
      <hr />
      <p style="color: #888; font-size: 12px;">
        Poți răspunde direct la acest e-mail pentru a contacta expeditorul.
      </p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: "DirecțiaTa <noreply@directiata.ro>",
        to: ADMIN_EMAIL,
        reply_to: email,
        subject: emailSubject,
        html: htmlBody,
      }),
    });

    if (!res.ok) {
      const errData = await res.text();
      console.error("Resend error:", errData);
      return NextResponse.json(
        { error: "Nu am putut trimite mesajul. Încearcă din nou." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Eroare internă. Încearcă din nou." },
      { status: 500 }
    );
  }
}
