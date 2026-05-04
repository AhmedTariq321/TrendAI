import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-helpers";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const { action } = await req.json();

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  switch (action) {
    case "ban":
      await prisma.user.update({ where: { id }, data: { status: "BANNED" } });
      await prisma.adminLog.create({ data: { adminId: id, action: "ban_user", targetId: id, targetType: "user" } });
      return NextResponse.json({ status: "BANNED" });

    case "unban":
      await prisma.user.update({ where: { id }, data: { status: "ACTIVE" } });
      return NextResponse.json({ status: "ACTIVE" });

    case "make_admin":
      const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
      await prisma.user.update({ where: { id }, data: { role: newRole } });
      await prisma.adminLog.create({ data: { adminId: id, action: `set_role_${newRole}`, targetId: id, targetType: "user" } });
      return NextResponse.json({ role: newRole });

    case "reset_usage":
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      await prisma.generation.deleteMany({ where: { userId: id, createdAt: { gte: today } } });
      return NextResponse.json({ success: true });

    case "delete":
      await prisma.user.delete({ where: { id } });
      return NextResponse.json({ success: true });

    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
