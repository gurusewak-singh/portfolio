import { NextResponse, after } from "next/server";
import nodemailer from "nodemailer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";
import { buildReplyEmail } from "@/lib/emailTemplate";

/**
 * POST /api/messages/[id]/reply
 *
 * Sends an email reply to the original sender. Auth-gated.
 * The actual SMTP send is deferred to next/server's after() so the
 * admin gets an instant 'Sent ✓' state instead of waiting on the
 * 2-3 second SMTP handshake. If the send fails, it's logged
 * server-side; the original message is still in Mongo so nothing
 * is lost.
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

    // Snapshot everything we need so the closure isn't holding the
    // mongoose document past the response.
    const trimmedBody = body.trim();
    const recipientEmail = message.email;
    const recipientName = message.name;
    const originalSubject = message.subject ?? "";
    const originalMessage = message.message ?? "";
    const fromName = session.user?.name ?? "Gurusewak";

    const replySubject = originalSubject.toLowerCase().startsWith("re:")
      ? originalSubject
      : `Re: ${originalSubject || "Your message"}`;

    after(async () => {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });

        const html = buildReplyEmail({
          toName: recipientName,
          originalSubject,
          originalMessage,
          replyMessage: trimmedBody,
          fromName,
          portfolioUrl:
            process.env.NEXT_PUBLIC_SITE_URL ?? "https://gurusewak.in",
        });

        const text =
          `Hi ${recipientName},\n\n${trimmedBody}\n\nBest,\n${fromName}\n\n` +
          `--\n` +
          `In reply to: ${originalSubject}\n` +
          `${originalMessage}\n`;

        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: recipientEmail,
          replyTo: process.env.CONTACT_EMAIL ?? process.env.SMTP_USER,
          subject: replySubject,
          text,
          html,
        });
      } catch (mailErr) {
        console.error("Background reply email send failed:", mailErr);
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const err = error as Error;
    console.error("Reply route error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
