import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const body = await req.json();
  const { generationId, content, feature, title } = body;

  if (!generationId || !content || !feature) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const saved = await prisma.savedItem.create({
    data: {
      userId: user.id,
      generationId,
      content,
      feature,
      title: title ?? feature,
    },
  });

  return NextResponse.json(saved);
}
