import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-helpers";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    activeToday,
    totalGenerations,
    generationsToday,
    tokenData,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { lastActiveAt: { gte: today } } }),
    prisma.generation.count(),
    prisma.generation.count({ where: { createdAt: { gte: today } } }),
    prisma.usageLog.aggregate({
      _sum: { tokensUsed: true },
      where: { createdAt: { gte: today } },
    }),
  ]);

  return NextResponse.json({
    totalUsers,
    activeToday,
    totalGenerations,
    generationsToday,
    tokensToday: tokenData._sum.tokensUsed ?? 0,
  });
}
