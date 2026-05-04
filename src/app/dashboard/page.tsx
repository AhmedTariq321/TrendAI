import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Sparkles, Lightbulb, Zap, Hash, BookOpen,
  TrendingUp, Clock, ArrowRight, Star, Flame,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

const QUICK_ACTIONS = [
  { href: "/dashboard/viral-ideas", icon: Lightbulb, label: "Viral Ideas", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "hover:border-yellow-500/30" },
  { href: "/dashboard/captions", icon: Sparkles, label: "Captions", color: "text-purple-400", bg: "bg-purple-500/10", border: "hover:border-purple-500/30" },
  { href: "/dashboard/hooks", icon: Zap, label: "Hooks", color: "text-blue-400", bg: "bg-blue-500/10", border: "hover:border-blue-500/30" },
  { href: "/dashboard/hashtags", icon: Hash, label: "Hashtags", color: "text-green-400", bg: "bg-green-500/10", border: "hover:border-green-500/30" },
  { href: "/dashboard/planner", icon: BookOpen, label: "Planner", color: "text-orange-400", bg: "bg-orange-500/10", border: "hover:border-orange-500/30" },
];

const FEATURE_LABELS: Record<string, string> = {
  VIRAL_IDEAS: "Viral Ideas",
  CAPTIONS: "Captions",
  HOOKS: "Hooks",
  HASHTAGS: "Hashtags",
  GROWTH_PLANNER: "Planner",
};

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return null;

  const [totalGenerations, savedCount, recentGenerations, featureBreakdown] = await Promise.all([
    prisma.generation.count({ where: { userId: user.id } }),
    prisma.savedItem.count({ where: { userId: user.id } }),
    prisma.generation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.generation.groupBy({
      by: ["feature"],
      where: { userId: user.id },
      _count: { feature: true },
      orderBy: { _count: { feature: "desc" } },
      take: 1,
    }),
  ]);

  const firstName = user.name?.split(" ")[0] ?? "Creator";
  const topFeature = featureBreakdown[0]?.feature ?? null;
  const aiScore = Math.min(100, Math.round(40 + totalGenerations * 0.8 + savedCount * 0.5));

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative rounded-2xl border border-border/50 overflow-hidden p-6 bg-gradient-to-r from-violet-500/10 via-primary/5 to-transparent">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15),transparent_70%)] pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {firstName}! 👋</h2>
            <p className="text-muted-foreground mt-1 text-sm">Here&apos;s your content growth summary</p>
          </div>
          <Badge variant="outline" className="self-start sm:self-auto border-primary/30 bg-primary/10 text-primary px-4 py-2 text-sm font-semibold">
            <Star className="h-3.5 w-3.5 mr-1.5 fill-current" />
            AI Score: {aiScore}/100
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Generations"
          value={totalGenerations}
          icon={Sparkles}
          iconColor="text-violet-400"
          iconBg="bg-violet-500/10"
          trend={{ value: "All time" }}
        />
        <StatCard
          title="Saved Items"
          value={savedCount}
          icon={Star}
          iconColor="text-yellow-400"
          iconBg="bg-yellow-500/10"
          trend={{ value: "In library" }}
        />
        <StatCard
          title="Growth Score"
          value={`${aiScore}`}
          subtitle="Out of 100"
          icon={TrendingUp}
          iconColor="text-green-400"
          iconBg="bg-green-500/10"
          trend={{ value: "↑ Growing", positive: true }}
        />
        <StatCard
          title="Top Tool"
          value={topFeature ? FEATURE_LABELS[topFeature] : "—"}
          subtitle="Most used"
          icon={Flame}
          iconColor="text-orange-400"
          iconBg="bg-orange-500/10"
        />
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {QUICK_ACTIONS.map(({ href, icon: Icon, label, color, bg, border }) => (
            <Link key={href} href={href}>
              <Card className={`p-4 text-center cursor-pointer transition-all duration-200 hover:shadow-md h-full flex flex-col items-center justify-center gap-3 border-border/50 ${border}`}>
                <div className={`w-11 h-11 ${bg} rounded-2xl flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <span className="text-xs font-semibold">{label}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent generations */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Recent Generations
          </h3>
          <ButtonLink variant="ghost" size="sm" href="/dashboard/history" className="gap-1 text-xs">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </ButtonLink>
        </div>

        {recentGenerations.length === 0 ? (
          <Card className="p-10 text-center border-dashed border-border/50 bg-card/20">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <p className="font-semibold mb-1">No generations yet</p>
            <p className="text-sm text-muted-foreground mb-4">Start with one of the AI tools above</p>
            <ButtonLink href="/dashboard/viral-ideas" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 hover:from-violet-700 hover:to-indigo-700">
              Generate First Ideas
            </ButtonLink>
          </Card>
        ) : (
          <div className="space-y-2">
            {recentGenerations.map((gen: { id: string; outputs: unknown; feature: string; createdAt: Date }) => {
              const outputs = gen.outputs as { results?: string[] } | null;
              const preview = outputs?.results?.[0] ?? "Generation complete";
              return (
                <Card key={gen.id} className="p-3.5 flex items-center gap-3 border-border/50 hover:border-primary/20 transition-colors">
                  <div className="p-2 rounded-xl bg-primary/10 shrink-0">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {FEATURE_LABELS[gen.feature] ?? gen.feature}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">{formatDate(gen.createdAt)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{preview}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Suggested next steps */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-5">
        <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
          <TrendingUp className="h-4 w-4 text-primary" />
          Suggested Next Steps
        </h3>
        <div className="grid sm:grid-cols-3 gap-2">
          {[
            { label: "Generate viral ideas for this week", href: "/dashboard/viral-ideas", emoji: "💡" },
            { label: "Create a 7-day content plan", href: "/dashboard/planner", emoji: "📅" },
            { label: "Build your hashtag collection", href: "/dashboard/hashtags", emoji: "#️⃣" },
          ].map(({ label, href, emoji }) => (
            <Link key={href} href={href}>
              <div className="flex items-center gap-2.5 p-3 rounded-xl border border-border/40 bg-card/40 hover:border-primary/30 hover:bg-card/70 transition-all cursor-pointer">
                <span className="text-base">{emoji}</span>
                <span className="text-xs font-medium">{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
