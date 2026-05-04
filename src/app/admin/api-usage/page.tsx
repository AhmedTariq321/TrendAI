import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";
import { formatDate, estimateCost } from "@/lib/utils";

export default async function AdminApiUsagePage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalTokensToday,
    totalTokensAllTime,
    requestsToday,
    failedToday,
    recentLogs,
  ] = await Promise.all([
    prisma.usageLog.aggregate({
      _sum: { tokensUsed: true },
      where: { createdAt: { gte: today } },
    }),
    prisma.usageLog.aggregate({ _sum: { tokensUsed: true } }),
    prisma.usageLog.count({ where: { createdAt: { gte: today } } }),
    prisma.usageLog.count({ where: { success: false, createdAt: { gte: today } } }),
    prisma.usageLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { user: { select: { email: true, name: true } } },
    }),
  ]);

  const tokensToday = totalTokensToday._sum.tokensUsed ?? 0;
  const tokensAll = totalTokensAllTime._sum.tokensUsed ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">API Usage</h2>
        <p className="text-muted-foreground mt-1">Claude API usage monitoring and cost tracking</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Requests Today" value={requestsToday} icon={Activity} />
        <StatCard
          title="Tokens Today"
          value={tokensToday.toLocaleString()}
          icon={Zap}
          trend={{ value: estimateCost(tokensToday) }}
        />
        <StatCard
          title="Failed Today"
          value={failedToday}
          icon={AlertTriangle}
          trend={{ value: failedToday > 0 ? "Errors detected" : "Clean", positive: failedToday === 0 }}
        />
        <StatCard
          title="Total Tokens (All Time)"
          value={(tokensAll / 1000).toFixed(0) + "K"}
          icon={Zap}
          trend={{ value: estimateCost(tokensAll) + " est. cost" }}
        />
      </div>

      {/* Cost breakdown */}
      <Card className="p-6">
        <h3 className="font-semibold mb-2">Estimated Cost Breakdown</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Based on Claude Sonnet pricing (~$9/1M tokens blended)
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="text-sm text-muted-foreground">Today</div>
            <div className="text-2xl font-bold mt-1">{estimateCost(tokensToday)}</div>
            <div className="text-xs text-muted-foreground mt-1">{tokensToday.toLocaleString()} tokens</div>
          </div>
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="text-sm text-muted-foreground">All Time</div>
            <div className="text-2xl font-bold mt-1">{estimateCost(tokensAll)}</div>
            <div className="text-xs text-muted-foreground mt-1">{tokensAll.toLocaleString()} tokens</div>
          </div>
        </div>
      </Card>

      {/* Recent logs */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <h3 className="font-semibold">Recent API Requests</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Feature</TableHead>
              <TableHead>Tokens</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentLogs.map((log: { id: string; feature: string; tokensUsed: number; success: boolean; createdAt: Date; user: { name: string | null; email: string } | null }) => (
              <TableRow key={log.id}>
                <TableCell className="text-sm">
                  {log.user?.name ?? log.user?.email ?? "Unknown"}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {log.feature.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{log.tokensUsed.toLocaleString()}</TableCell>
                <TableCell>
                  {log.success ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(log.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
