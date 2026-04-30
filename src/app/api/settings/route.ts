import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Public-readable settings keys that should be cached at the edge.
// Listed by name so we can't accidentally leak a sensitive future key
// just because somebody fetches it without auth.
const PUBLIC_CACHED_KEYS = new Set([
  "profile_image",
  "hero_background",
  "hero_photo",
  "resume_file",
]);

// GET - Fetch all settings or specific setting by key (public for resume access)
export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (key) {
      const setting = await SiteSettings.findOne({ key });
      const body =
        setting ?? { key, value: null, type: null, label: null };

      // Cache public asset keys at the edge for ~5 minutes and on the
      // browser. Eliminates the cold-MongoDB roundtrip on repeat
      // visits (which is what was causing the profile image to
      // sometimes render as the 'G' fallback). 'stale-while-revalidate'
      // keeps the page snappy even after the cache window expires.
      const headers: Record<string, string> = {};
      if (PUBLIC_CACHED_KEYS.has(key)) {
        headers["Cache-Control"] =
          "public, max-age=300, s-maxage=300, stale-while-revalidate=86400";
      }

      return NextResponse.json(body, { headers });
    }

    const settings = await SiteSettings.find({});
    return NextResponse.json(settings);
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST - Create or update a setting (protected)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { key, value, type, label } = body;

    if (!key || !value) {
      return NextResponse.json(
        { error: "Key and value are required" },
        { status: 400 },
      );
    }

    const setting = await SiteSettings.findOneAndUpdate(
      { key },
      { key, value, type: type || "text", label: label || key },
      { upsert: true, new: true },
    );

    return NextResponse.json(setting, { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE - Delete a setting (protected)
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    await SiteSettings.findOneAndDelete({ key });
    return NextResponse.json({ message: "Setting deleted" });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
