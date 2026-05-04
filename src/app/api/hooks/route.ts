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
  const { topic, platform, hookType } = body;

  if (!topic) {
    return NextResponse.json({ error: "topic is required" }, { status: 400 });
  }

  const systemPrompt = `You are a viral content strategist who specializes in writing scroll-stopping hook lines. You understand the psychology of attention and know exactly what makes someone stop scrolling and watch/read more. Your hooks are direct, intriguing, and optimized for ${platform || "social media"}.`;

  const userPrompt = `Create exactly 15 powerful hook lines for content about: "${topic}"
Platform: ${platform || "any social media"}
Hook style preference: ${hookType || "mix of different styles"}

Requirements for each hook:
- Maximum 1-2 sentences
- Must stop the scroll immediately
- Should create curiosity, urgency, or emotion
- Use different styles: questions, statements, statistics, story openers, etc.

Return ONLY a JSON array of 15 strings. No markdown, no extra text.
["hook 1", "hook 2", ...]`;

  try {
    const { content, tokensUsed } = await generateWithClaude(systemPrompt, userPrompt);
    const cleaned = content.replace(/```json\n?|\n?```/g, "").trim();
    const results: string[] = JSON.parse(cleaned);

    const generation = await prisma.generation.create({
      data: {
        userId: user.id,
        feature: "HOOKS",
        inputs: { topic, platform, hookType },
        outputs: { results },
        tokensUsed,
      },
    });

    await prisma.usageLog.create({
      data: { userId: user.id, feature: "HOOKS", tokensUsed, success: true },
    });

    return NextResponse.json({ results, generationId: generation.id });
  } catch (e) {
    console.error("Hooks error:", e);
    return NextResponse.json({ error: "Generation failed." }, { status: 500 });
  }
}
