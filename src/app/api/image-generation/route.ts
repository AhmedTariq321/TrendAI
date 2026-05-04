import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

async function fetchWithRetry(url: string, attempts = 3): Promise<Response> {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(50000),
      });
      if (res.ok) return res;
      // wait before retry
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
    } catch {
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
      else throw new Error("All retries exhausted");
    }
  }
  throw new Error("All retries exhausted");
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, width = 1024, height = 1024, delay = 0 } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // stagger parallel requests so Pollinations doesn't rate-limit
    if (delay > 0) await new Promise((r) => setTimeout(r, delay));

    const seed = Math.floor(Math.random() * 999999);
    const encoded = encodeURIComponent(prompt.trim());
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&nologo=true&seed=${seed}&enhance=true`;

    const res = await fetchWithRetry(url, 3);

    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const base64 = Buffer.from(buffer).toString("base64");
    const dataUrl = `data:${contentType};base64,${base64}`;

    return NextResponse.json({ dataUrl });
  } catch (err) {
    console.error("[image-generation]", err);
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }
}
