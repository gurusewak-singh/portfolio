import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";

export async function POST(request: Request) {
  try {
    await dbConnect();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin already exists" },
        { status: 400 },
      );
    }

    const body = await request.json();

    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 },
      );
    }

    const admin = await Admin.create({ email, password, name });

    return NextResponse.json(
      { message: "Admin created", id: admin._id },
      { status: 201 },
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error creating admin:", err.message);
    console.error("Stack:", err.stack);
    return NextResponse.json(
      { error: `Failed to create admin: ${err.message}` },
      { status: 500 },
    );
  }
}
