import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ResearchPaper from "@/models/ResearchPaper";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET — list research papers (public). The pdfFile field is large
// (base64 PDF) so we strip it from the list response. Use the per-id
// preview route to actually stream the PDF.
export async function GET() {
  try {
    await dbConnect();
    const papers = await ResearchPaper.find({}, { pdfFile: 0 }).sort({
      order: 1,
      publishedYear: -1,
      createdAt: -1,
    });
    return NextResponse.json(papers);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();
    const paper = await ResearchPaper.create(data);
    return NextResponse.json(paper, { status: 201 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
