import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";

// Streams the resume PDF inline with a proper Content-Disposition.
// Browsers preview it (Content-Disposition: inline) and the suggested
// save filename is "Gurusewak_Resume.pdf" rather than a random
// blob:/data: identifier.
export async function GET() {
  try {
    await dbConnect();
    const setting = await SiteSettings.findOne({ key: "resume_file" });

    if (!setting?.value) {
      return NextResponse.json(
        { error: "Resume not configured" },
        { status: 404 },
      );
    }

    const value = setting.value as string;
    let buffer: Buffer;
    let contentType = "application/pdf";

    if (value.startsWith("data:")) {
      // data:application/pdf;base64,XXXX
      const match = value.match(/^data:([^;]+);base64,(.*)$/);
      if (!match) {
        return NextResponse.json(
          { error: "Invalid resume data" },
          { status: 500 },
        );
      }
      contentType = match[1] || "application/pdf";
      buffer = Buffer.from(match[2], "base64");
    } else {
      // Assume http(s) URL — proxy it through so the filename header sticks
      const upstream = await fetch(value);
      if (!upstream.ok) {
        return NextResponse.json(
          { error: "Failed to fetch upstream resume" },
          { status: 502 },
        );
      }
      const arrayBuffer = await upstream.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      const upstreamType = upstream.headers.get("content-type");
      if (upstreamType) contentType = upstreamType;
    }

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition":
          'inline; filename="Gurusewak_Resume.pdf"; filename*=UTF-8\'\'Gurusewak_Resume.pdf',
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
