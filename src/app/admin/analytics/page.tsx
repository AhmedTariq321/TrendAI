export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Sparkles, Zap, Hash, BookOpen, Lightbulb } from "lucide-react";
import { formatDate } from "@/lib/utils";

const FEATURE_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  VIRAL_IDEAS: { label: "Viral Ideas", icon: Lightbulb, color: "text-yellow-500" },
  CAPTIONS: { label: "Captions", icon: Sparkles, color: "text-purple-500" },
  HOOKS: { label: "Hooks", icon: Zap, color: "text-blue-500" },
  HASHTAGS: { label: "Hashtags", icon: Hash, color: "text-green-500" },
  GROWTH_PLANNER: { label: "Growth Planner", icon: BookOpen, color: "text-orange-500" },
};

export default async function AdminAnalyticsPage() {
  const [featureStats, dailyStats, totalGenerations] = await Promise.all([
    prisma.generation.groupBy({
      by: ["feature"],
      _count: { feature: true },
      orderBy: { _count: { feature: "desc" } },
    }),
    prisma.$queryRaw<{ date: string; count: bigint }[]>`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM generations
      WHERE created_at > NOW() - INTERVAL '14 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 14
    `,
    prisma.generation.count(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Feature Analytics</h2>
        <p className="text-muted-foreground mt-1">Usage breakdown across all AI features</p>
      </div>

      {/* Feature breakdown */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureStats.map(({ feature, _count }: { feature: string; _count: { feature: number } }) => {
          const meta = FEATURE_META[feature];
          const Icon = meta?.icon ?? BarChart3;
          const pct = Math.round((_count.feature / totalGenerations) * 100);

          return (
            <Card key={feature} className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-muted">
                  <Icon className={`h-5 w-5 ${meta?.color ?? "text-primary"}`} />
                </div>
                <div>
                  <div className="font-semibold">{meta?.label ?? feature}</div>
                  <div className="text-2xl font-bold">{_count.feature.toLocaleString()}</div>
                </div>
                <Badge variant="outline" className="ml-auto">{pct}%</Badge>
              </div>
              <Progress value={pct} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                {_count.feature} of {totalGenerations} total generations
              </div>
            </Card>
          );
        })}
      </div>

      {/* Daily volume */}
      <Card className="p-6">
        <h3 className="font-semibold mb-6">Daily Generation Volume (Last 14 Days)</h3>
        {dailyStats.length === 0 ? (
          <p className="text-muted-foreground text-sm">No data yet</p>
        ) : (
          <div className="space-y-3">
            {dailyStats.map((row: { date: string; count: bigint }) => {
              const count = Number(row.count);
              const max = Math.max(...dailyStats.map((r: { date: string; count: bigint }) => Number(r.count)));
              const pct = max > 0 ? Math.round((count / max) * 100) : 0;
              return (
                <div key={row.date} className="flex items-center gap-4">
                  <div className="w-24 text-xs text-muted-foreground shrink-0">
                    {formatDate(row.date)}
                  </div>
                  <div className="flex-1">
                    <div className="h-6 bg-muted rounded-md overflow-hidden">
                      <div
                        className="h-full bg-primary/70 rounded-md transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-sm font-medium text-right shrink-0">{count}</div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
