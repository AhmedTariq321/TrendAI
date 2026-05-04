export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users, Sparkles, Activity, TrendingUp, AlertTriangle,
  UserCheck, BarChart3, Zap,
} from "lucide-react";
import { formatDate, estimateCost } from "@/lib/utils";

export default async function AdminDashboard() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    activeToday,
    totalGenerations,
    generationsToday,
    tokenData,
    failedToday,
    newSignupsToday,
    topFeature,
    recentErrors,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { lastActiveAt: { gte: today } } }),
    prisma.generation.count(),
    prisma.generation.count({ where: { createdAt: { gte: today } } }),
    prisma.usageLog.aggregate({
      _sum: { tokensUsed: true },
      where: { createdAt: { gte: today } },
    }),
    prisma.usageLog.count({ where: { success: false, createdAt: { gte: today } } }),
    prisma.user.count({ where: { createdAt: { gte: today } } }),
    prisma.generation.groupBy({
      by: ["feature"],
      _count: { feature: true },
      orderBy: { _count: { feature: "desc" } },
      take: 1,
    }),
    prisma.usageLog.findMany({
      where: { success: false },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const tokensToday = tokenData._sum.tokensUsed ?? 0;
  const top = topFeature[0]?.feature ?? "—";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <p className="text-muted-foreground mt-1">Real-time overview of TrendPilot AI</p>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={totalUsers} icon={Users} trend={{ value: `+${newSignupsToday} today` }} />
        <StatCard title="Active Today" value={activeToday} icon={UserCheck} trend={{ value: "Unique sessions" }} />
        <StatCard title="Total Generations" value={totalGenerations} icon={Sparkles} />
        <StatCard title="Generated Today" value={generationsToday} icon={Activity} trend={{ value: "+today" }} />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tokens Used Today"
          value={tokensToday.toLocaleString()}
          icon={Zap}
          trend={{ value: estimateCost(tokensToday) }}
        />
        <StatCard
          title="Failed Requests Today"
          value={failedToday}
          icon={AlertTriangle}
          trend={{ value: failedToday > 0 ? "Needs attention" : "All good", positive: failedToday === 0 }}
        />
        <StatCard
          title="New Signups Today"
          value={newSignupsToday}
          icon={TrendingUp}
          trend={{ value: "Today" }}
        />
        <StatCard
          title="Top Feature"
          value={top.replace("_", " ")}
          icon={BarChart3}
          trend={{ value: "All time" }}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Error log */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Recent Errors
          </h3>
          {recentErrors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No errors — everything is running smoothly ✓
            </div>
          ) : (
            <div className="space-y-2">
              {recentErrors.map((e: { id: string; feature: string; errorMsg: string | null; createdAt: Date }) => (
                <div key={e.id} className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="destructive" className="text-xs">{e.feature}</Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(e.createdAt)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{e.errorMsg ?? "Unknown error"}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick links */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Quick Admin Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: "/admin/users", label: "Manage Users", icon: Users },
              { href: "/admin/analytics", label: "View Analytics", icon: BarChart3 },
              { href: "/admin/api-usage", label: "API Usage", icon: Activity },
              { href: "/admin/settings", label: "App Settings", icon: Zap },
            ].map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                className="flex items-center gap-2 p-3 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-colors text-sm font-medium"
              >
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </a>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
