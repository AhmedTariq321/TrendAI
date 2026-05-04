import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { SavedItemsClient } from "./client";

export default async function SavedPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return null;

  const saved = await prisma.savedItem.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return <SavedItemsClient initialItems={saved} />;
}
