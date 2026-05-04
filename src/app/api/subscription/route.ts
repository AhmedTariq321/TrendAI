import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import type { Plan } from "@prisma/client";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const { user } = auth;

  const body = await req.json();
  const { plan } = body as { plan: string };

  if (!["FREE", "PRO", "ELITE"].includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { plan: plan as Plan },
  });

  return NextResponse.json({ success: true, plan });
}

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const { user } = auth;

  return NextResponse.json({ plan: user.plan });
}
