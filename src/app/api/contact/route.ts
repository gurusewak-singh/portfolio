import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";
import { buildContactNotificationEmail } from "@/lib/emailTemplate";

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    await dbConnect();
    await Message.create({ name, email, subject, message });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const html = buildContactNotificationEmail({
      name,
      email,
      subject,
      message,
    });

    const text =
      `New message from ${name} (${email})\n\n` +
      `Subject: ${subject}\n\n` +
      `${message}\n\n--\nSent from gurusewak.in`;

    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.CONTACT_EMAIL,
        replyTo: email,
        subject: `Portfolio Contact: ${subject}`,
        text,
        html,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the request if email fails — message is still saved.
    }

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
