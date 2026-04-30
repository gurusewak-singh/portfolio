import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";
import { buildReplyEmail } from "@/lib/emailTemplate";

/**
 * POST /api/messages/[id]/reply
 *
 * Sends an email reply to the original sender of the contact-form
 * message identified by `id`. Auth-gated (admin session required).
 *
 * Body shape:  { body: string }
 *   body — the admin's reply text (plain). Newlines preserved in the
 *          rendered email via white-space: pre-wrap.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { body } = (await request.json()) as { body?: string };

    if (!body || !body.trim()) {
      return NextResponse.json(
        { error: "Reply body is required" },
        { status: 400 },
      );
    }

    await dbConnect();
    const message = await Message.findById(id);
    if (!message) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const replySubject = message.subject?.toLowerCase().startsWith("re:")
      ? message.subject
      : `Re: ${message.subject ?? "Your message"}`;

    const html = buildReplyEmail({
      toName: message.name,
      originalSubject: message.subject ?? "",
      originalMessage: message.message ?? "",
      replyMessage: body.trim(),
      fromName: session.user?.name ?? "Gurusewak",
      portfolioUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://gurusewak.in",
    });

    const text =
      `Hi ${message.name},\n\n${body.trim()}\n\nBest,\n${session.user?.name ?? "Gurusewak"}\n\n` +
      `--\n` +
      `In reply to: ${message.subject ?? ""}\n` +
      `${message.message ?? ""}\n`;

    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: message.email,
        // Replies should land in the contact email, not the SMTP user.
        replyTo: process.env.CONTACT_EMAIL ?? process.env.SMTP_USER,
        subject: replySubject,
        text,
        html,
      });
    } catch (mailErr) {
      console.error("Reply email send failed:", mailErr);
      return NextResponse.json(
        { error: "Failed to send reply email" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const err = error as Error;
    console.error("Reply route error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
