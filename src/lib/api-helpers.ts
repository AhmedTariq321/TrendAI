import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { NextResponse } from "next/server";
import type { User } from "@prisma/client/index.js";

export async function requireAuth(): Promise<
  { user: User; error: null } | { user: null; error: NextResponse }
> {
  const { userId } = await auth();
  if (!userId) {
    return {
      user: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  let user = await prisma.user.findUnique({ where: { clerkId: userId } });

  // Auto-create user on first login if webhook hasn't fired (local dev)
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return {
        user: null,
        error: NextResponse.json({ error: "User not found" }, { status: 404 }),
      };
    }
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
        name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null,
        imageUrl: clerkUser.imageUrl ?? null,
      },
    });
  }

  if (user.status === "BANNED") {
    return {
      user: null,
      error: NextResponse.json({ error: "Account suspended" }, { status: 403 }),
    };
  }

  return { user, error: null };
}

export async function requireAdmin(): Promise<
  { user: User; error: null } | { user: null; error: NextResponse }
> {
  const result = await requireAuth();
  if (result.error) return result;

  if (result.user.role !== "ADMIN") {
    return {
      user: null,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return result;
}

export async function checkDailyLimit(userId: string, limit = 50): Promise<boolean> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const count = await prisma.generation.count({
    where: {
      userId,
      createdAt: { gte: today },
    },
  });

  return count < limit;
}
