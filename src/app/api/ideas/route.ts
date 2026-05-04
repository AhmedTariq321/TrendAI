import { NextRequest, NextResponse } from "next/server";
import { generateWithClaude } from "@/lib/claude";
import { prisma } from "@/lib/prisma";
import { requireAuth, checkDailyLimit } from "@/lib/api-helpers";

export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const withinLimit = await checkDailyLimit(user.id);
  if (!withinLimit) {
    return NextResponse.json({ error: "Daily limit reached. Try again tomorrow." }, { status: 429 });
  }

  const body = await req.json();
  const { niche, platform, audience, tone } = body;

  if (!niche || !platform) {
    return NextResponse.json({ error: "niche and platform are required" }, { status: 400 });
  }

  const systemPrompt = `You are an elite social media strategist and viral content expert with deep expertise in ${platform}. You specialize in creating content ideas that generate massive engagement, views, and follower growth. Your ideas are always current, platform-native, and optimized for the algorithm.`;

  const userPrompt = `Generate exactly 30 viral content ideas for a ${niche} creator on ${platform}.
${audience ? `Target audience: ${audience}` : ""}
${tone ? `Content tone: ${tone}` : ""}

Return ONLY a valid JSON array with exactly 30 objects. No markdown, no extra text.
Each object must have:
- "idea": (string) The content idea (1-2 sentences, specific and actionable)
- "postType": (string) One of: Reel, Story, Carousel, Post, Short, Tweet
- "hook": (string) A powerful opening line for this content (one sentence)

Example format:
[{"idea":"...","postType":"Reel","hook":"..."}]`;

  try {
    const { content, tokensUsed } = await generateWithClaude(systemPrompt, userPrompt);
    const cleaned = content.replace(/```json\n?|\n?```/g, "").trim();
    const results = JSON.parse(cleaned);

    const generation = await prisma.generation.create({
      data: {
        userId: user.id,
        feature: "VIRAL_IDEAS",
        inputs: { niche, platform, audience, tone },
        outputs: { results: results.map((r: { idea: string }) => r.idea) },
        tokensUsed,
      },
    });

    await prisma.usageLog.create({
      data: { userId: user.id, feature: "VIRAL_IDEAS", tokensUsed, success: true },
    });

    return NextResponse.json({ results, generationId: generation.id });
  } catch (e) {
    await prisma.usageLog.create({
      data: {
        userId: user.id,
        feature: "VIRAL_IDEAS",
        tokensUsed: 0,
        success: false,
        errorMsg: e instanceof Error ? e.message : "Unknown error",
      },
    });
    console.error("Ideas generation error:", e);
    return NextResponse.json({ error: "Generation failed. Please try again." }, { status: 500 });
  }
}
