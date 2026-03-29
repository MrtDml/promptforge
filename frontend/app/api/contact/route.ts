import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = "PromptForge <noreply@promptforgeai.dev>";
const TO = "hello@promptforgeai.dev";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body as {
      name: string;
      email: string;
      subject?: string;
      message: string;
    };

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailSubject = subject?.trim() || `Contact from ${name}`;

    if (!resend) {
      // Dev fallback — log and pretend success
      console.log("[CONTACT FORM]", { name, email, subject: emailSubject, message });
      return NextResponse.json({ ok: true });
    }

    // Send notification to support inbox
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `[PromptForge Contact] ${emailSubject}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f1123;color:#e2e8f0;padding:32px;border-radius:12px;">
          <h2 style="margin:0 0 16px;color:white;">New contact message</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <tr><td style="padding:8px 0;color:#94a3b8;font-size:14px;width:100px;">Name</td><td style="padding:8px 0;font-size:14px;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;font-size:14px;">Email</td><td style="padding:8px 0;font-size:14px;"><a href="mailto:${email}" style="color:#6366f1;">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;font-size:14px;">Subject</td><td style="padding:8px 0;font-size:14px;">${emailSubject}</td></tr>
          </table>
          <div style="background:#0a0b14;border:1px solid #1e2235;border-radius:8px;padding:16px;">
            <p style="margin:0;font-size:14px;white-space:pre-wrap;line-height:1.6;">${message}</p>
          </div>
          <p style="margin-top:20px;font-size:12px;color:#475569;">Reply directly to this email to respond to ${name}.</p>
        </div>
      `,
    });

    // Send confirmation to the user
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "We received your message — PromptForge",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0f1123;color:#e2e8f0;padding:32px;border-radius:12px;">
          <h2 style="margin:0 0 8px;color:white;">Thanks for reaching out, ${name}!</h2>
          <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:12px 0;">We received your message and will get back to you within <strong style="color:#e2e8f0;">24 hours</strong>.</p>
          <div style="margin:20px 0;padding:16px;background:#0a0b14;border-left:3px solid #6366f1;border-radius:4px;">
            <p style="margin:0;font-size:13px;color:#64748b;margin-bottom:6px;">Your message:</p>
            <p style="margin:0;font-size:14px;color:#94a3b8;white-space:pre-wrap;line-height:1.6;">${message}</p>
          </div>
          <p style="color:#475569;font-size:13px;margin-top:20px;">— The PromptForge Team · <a href="https://promptforgeai.dev" style="color:#6366f1;text-decoration:none;">promptforgeai.dev</a></p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[contact route]", message);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
