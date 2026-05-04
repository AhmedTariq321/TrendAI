import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { HistoryClient } from "./client";

export default async function HistoryPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return null;

  const generations = await prisma.generation.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return <HistoryClient initialGenerations={generations} />;
}
