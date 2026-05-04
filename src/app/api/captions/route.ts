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
  const { topic, platform, tone, language, includeEmojis } = body;

  if (!topic || !platform) {
    return NextResponse.json({ error: "topic and platform are required" }, { status: 400 });
  }

  const systemPrompt = `You are a world-class social media copywriter who specializes in writing high-converting captions for ${platform}. You understand what drives engagement, saves, shares, and follows. Your captions are always authentic, platform-native, and include strong CTAs.`;

  const userPrompt = `Write exactly 10 high-converting ${platform} captions about: "${topic}"
Tone: ${tone || "engaging and conversational"}
Language: ${language || "English"}
${includeEmojis ? "Include relevant emojis naturally throughout." : "Do NOT include emojis."}

Each caption must:
- Have a strong opening line
- Include a clear call-to-action
- Be optimized for ${platform}'s algorithm
- Feel authentic, not robotic

Return ONLY a JSON array of 10 strings. No markdown, no extra text.
["caption 1", "caption 2", ...]`;

  try {
    const { content, tokensUsed } = await generateWithClaude(systemPrompt, userPrompt);
    const cleaned = content.replace(/```json\n?|\n?```/g, "").trim();
    const results: string[] = JSON.parse(cleaned);

    const generation = await prisma.generation.create({
      data: {
        userId: user.id,
        feature: "CAPTIONS",
        inputs: { topic, platform, tone, language, includeEmojis },
        outputs: { results },
        tokensUsed,
      },
    });

    await prisma.usageLog.create({
      data: { userId: user.id, feature: "CAPTIONS", tokensUsed, success: true },
    });

    return NextResponse.json({ results, generationId: generation.id });
  } catch (e) {
    await prisma.usageLog.create({
      data: { userId: user.id, feature: "CAPTIONS", tokensUsed: 0, success: false,
        errorMsg: e instanceof Error ? e.message : "Unknown" },
    });
    console.error("Captions error:", e);
    return NextResponse.json({ error: "Generation failed. Please try again." }, { status: 500 });
  }
}
