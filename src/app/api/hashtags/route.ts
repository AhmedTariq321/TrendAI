import { NextRequest, NextResponse } from "next/server";
import { generateWithClaude } from "@/lib/claude";
import { prisma } from "@/lib/prisma";
import { requireAuth, checkDailyLimit } from "@/lib/api-helpers";

export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const withinLimit = await checkDailyLimit(user.id);
  if (!withinLimit) {
    return NextResponse.json({ error: "Daily limit reached." }, { status: 429 });
  }

  const body = await req.json();
  const { niche, platform, postType } = body;

  if (!niche) {
    return NextResponse.json({ error: "niche is required" }, { status: 400 });
  }

  const systemPrompt = `You are a social media SEO expert who specializes in hashtag strategy. You know which hashtags drive discovery, reach, and engagement across different platforms and niches.`;

  const userPrompt = `Generate a comprehensive hashtag strategy for a ${niche} creator${platform ? ` on ${platform}` : ""}${postType ? ` posting ${postType}` : ""}.

Return ONLY valid JSON with this exact structure (no markdown):
{
  "groups": [
    {
      "category": "Mega (1M+ posts)",
      "tags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
    },
    {
      "category": "Large (100K-1M posts)",
      "tags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7"]
    },
    {
      "category": "Medium (10K-100K posts)",
      "tags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7"]
    },
    {
      "category": "Niche (<10K posts)",
      "tags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6"]
    },
    {
      "category": "Trending",
      "tags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
    }
  ]
}`;

  try {
    const { content, tokensUsed } = await generateWithClaude(systemPrompt, userPrompt);
    const cleaned = content.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    const allTags = parsed.groups.flatMap((g: { tags: string[] }) => g.tags);

    const generation = await prisma.generation.create({
      data: {
        userId: user.id,
        feature: "HASHTAGS",
        inputs: { niche, platform, postType },
        outputs: { results: allTags, groups: parsed.groups },
        tokensUsed,
      },
    });

    await prisma.usageLog.create({
      data: { userId: user.id, feature: "HASHTAGS", tokensUsed, success: true },
    });

    return NextResponse.json({ groups: parsed.groups, allTags, generationId: generation.id });
  } catch (e) {
    console.error("Hashtags error:", e);
    return NextResponse.json({ error: "Generation failed." }, { status: 500 });
  }
}
