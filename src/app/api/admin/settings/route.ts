import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-helpers";
import { getAllSettings, setSetting } from "@/lib/settings";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const settings = await getAllSettings();
  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();

  const ALLOWED_KEYS = [
    "app_name", "daily_limit", "maintenance_mode",
    "announcement_banner", "feature_viral_ideas",
    "feature_captions", "feature_hooks", "feature_hashtags", "feature_planner",
  ];

  for (const [key, value] of Object.entries(body)) {
    if (ALLOWED_KEYS.includes(key) && typeof value === "string") {
      await setSetting(key, value);
    }
  }

  return NextResponse.json({ success: true });
}
