import { prisma } from "@/lib/prisma";
import { UsersClient } from "./client";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { generations: true, savedItems: true } },
    },
  });

  return <UsersClient initialUsers={users} />;
}
