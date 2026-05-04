import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "No webhook secret" }, { status: 500 });
  }

  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let event: { type: string; data: { id: string; email_addresses: { email_address: string }[]; first_name?: string; last_name?: string; image_url?: string } };
  try {
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as typeof event;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { type, data } = event;
  const email = data.email_addresses?.[0]?.email_address ?? "";
  const name = [data.first_name, data.last_name].filter(Boolean).join(" ");

  if (type === "user.created") {
    await prisma.user.upsert({
      where: { clerkId: data.id },
      update: { email, name, imageUrl: data.image_url },
      create: { clerkId: data.id, email, name, imageUrl: data.image_url },
    });
  } else if (type === "user.updated") {
    await prisma.user.update({
      where: { clerkId: data.id },
      data: { email, name, imageUrl: data.image_url },
    });
  } else if (type === "user.deleted") {
    await prisma.user.delete({ where: { clerkId: data.id } }).catch(() => {});
  }

  return NextResponse.json({ success: true });
}
