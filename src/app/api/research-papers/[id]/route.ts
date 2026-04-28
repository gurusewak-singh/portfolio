import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ResearchPaper from "@/models/ResearchPaper";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET — single research paper, full document including pdfFile.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await dbConnect();
    const paper = await ResearchPaper.findById(id);
    if (!paper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }
    return NextResponse.json(paper);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    await dbConnect();
    const data = await request.json();
    const paper = await ResearchPaper.findByIdAndUpdate(id, data, { new: true });
    if (!paper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }
    return NextResponse.json(paper);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    await dbConnect();
    const paper = await ResearchPaper.findByIdAndDelete(id);
    if (!paper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Paper deleted" });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
