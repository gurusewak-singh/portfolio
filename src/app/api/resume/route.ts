import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";

/**
 * Streams or redirects to the resume PDF.
 *
 * Behaviour:
 *   - data:application/pdf;base64,…  → decode and serve inline with
 *     Content-Disposition filename "Gurusewak_Resume.pdf".
 *   - https://drive.google.com/file/d/<ID>/view…  → 302 redirect to
 *     https://drive.google.com/uc?export=view&id=<ID> so the
 *     browser opens the PDF directly in its viewer instead of the
 *     Drive HTML page.
 *   - Other public URLs → 302 redirect (let the browser fetch from
 *     the original host; that way we don't have to proxy potentially
 *     large files through this server).
 */
function googleDriveFileId(url: string): string | null {
  const m1 = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/i);
  if (m1) return m1[1];
  const m2 = url.match(/drive\.google\.com\/open\?id=([^&]+)/i);
  if (m2) return m2[1];
  const m3 = url.match(/[?&]id=([^&]+)/i);
  if (m3 && /drive\.google\.com/i.test(url)) return m3[1];
  return null;
}

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

    const value = (setting.value as string).trim();

    // Case 1: embedded PDF (base64 data URI). Decode and stream inline.
    if (value.startsWith("data:")) {
      const match = value.match(/^data:([^;]+);base64,(.*)$/);
      if (!match) {
        return NextResponse.json(
          { error: "Invalid resume data" },
          { status: 500 },
        );
      }
      const contentType = match[1] || "application/pdf";
      const buffer = Buffer.from(match[2], "base64");

      return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Disposition":
            'inline; filename="Gurusewak_Resume.pdf"; filename*=UTF-8\'\'Gurusewak_Resume.pdf',
          "Cache-Control": "private, max-age=300",
        },
      });
    }

    // Case 2: Google Drive viewer link. Convert to direct content URL
    // so the browser opens the PDF, not the Drive HTML page.
    const driveId = googleDriveFileId(value);
    if (driveId) {
      return NextResponse.redirect(
        `https://drive.google.com/uc?export=view&id=${driveId}`,
        302,
      );
    }

    // Case 3: any other URL — just redirect.
    if (/^https?:\/\//i.test(value)) {
      return NextResponse.redirect(value, 302);
    }

    return NextResponse.json(
      { error: "Resume value is not a valid PDF or URL" },
      { status: 500 },
    );
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
