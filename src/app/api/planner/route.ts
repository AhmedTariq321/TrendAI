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
  const { niche, platform, duration, goal } = body;

  if (!niche || !platform) {
    return NextResponse.json({ error: "niche and platform are required" }, { status: 400 });
  }

  const days = parseInt(duration ?? "7", 10);

  const systemPrompt = `You are an elite social media growth strategist who has helped hundreds of creators go viral. You create data-driven content calendars that maximize engagement, reach, and follower growth. Your plans are strategic, varied, and always include a healthy mix of content types.`;

  const userPrompt = `Create a complete ${days}-day content calendar for a ${niche} creator on ${platform}.
${goal ? `Growth goal: ${goal}` : ""}

Return ONLY a valid JSON object (no markdown) with this structure:
{
  "duration": "${days}-Day Plan",
  "platform": "${platform}",
  "days": [
    {
      "day": 1,
      "theme": "...",
      "postType": "...",
      "idea": "...",
      "caption": "...",
      "bestTime": "..."
    }
  ]
}

For each day:
- "theme": The daily content theme (e.g., "Motivation Monday", "Tutorial", "Behind the scenes")
- "postType": One of: Reel, Story, Carousel, Post, Short, Tweet
- "idea": A specific, actionable content idea (1 sentence)
- "caption": A ready-to-use caption with CTA (2-4 sentences)
- "bestTime": Best posting time (e.g., "6-8 PM")

Generate all ${days} days.`;

  try {
    const { content, tokensUsed } = await generateWithClaude(systemPrompt, userPrompt);
    const cleaned = content.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    const generation = await prisma.generation.create({
      data: {
        userId: user.id,
        feature: "GROWTH_PLANNER",
        inputs: { niche, platform, duration, goal },
        outputs: { results: parsed.days.map((d: { idea: string }) => d.idea), days: parsed.days },
        tokensUsed,
      },
    });

    await prisma.usageLog.create({
      data: { userId: user.id, feature: "GROWTH_PLANNER", tokensUsed, success: true },
    });

    return NextResponse.json({ ...parsed, generationId: generation.id });
  } catch (e) {
    console.error("Planner error:", e);
    return NextResponse.json({ error: "Generation failed." }, { status: 500 });
  }
}
