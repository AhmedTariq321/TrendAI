import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { AnnouncementBanner } from "@/components/dashboard/announcement-banner";
import { getOrCreateUser } from "@/lib/user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await getOrCreateUser();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar plan={user?.plan ?? "FREE"} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AnnouncementBanner />
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
