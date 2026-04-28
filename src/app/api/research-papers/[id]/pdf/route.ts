import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ResearchPaper from "@/models/ResearchPaper";

// Streams the paper's PDF inline. Same pattern as /api/resume so the
// browser previews it and the suggested filename is the paper's
// configured pdfFilename (or a slug of the title).
function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await dbConnect();
    const paper = await ResearchPaper.findById(id);
    if (!paper?.pdfFile) {
      return NextResponse.json(
        { error: "PDF not available" },
        { status: 404 },
      );
    }

    const value = paper.pdfFile as string;
    let buffer: Buffer;
    let contentType = "application/pdf";

    if (value.startsWith("data:")) {
      const match = value.match(/^data:([^;]+);base64,(.*)$/);
      if (!match) {
        return NextResponse.json(
          { error: "Invalid PDF data" },
          { status: 500 },
        );
      }
      contentType = match[1] || "application/pdf";
      buffer = Buffer.from(match[2], "base64");
    } else {
      const upstream = await fetch(value);
      if (!upstream.ok) {
        return NextResponse.json(
          { error: "Failed to fetch upstream PDF" },
          { status: 502 },
        );
      }
      const arrayBuffer = await upstream.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      const upstreamType = upstream.headers.get("content-type");
      if (upstreamType) contentType = upstreamType;
    }

    const filename =
      paper.pdfFilename || `${slugify(paper.title || "paper")}.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(
          filename,
        )}`,
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
