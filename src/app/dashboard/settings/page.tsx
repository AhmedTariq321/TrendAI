import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { User, Mail, Calendar, BarChart3, BookmarkCheck, Shield } from "lucide-react";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user || !clerkUser) return null;

  const [totalGenerations, savedCount, usageByFeature] = await Promise.all([
    prisma.generation.count({ where: { userId: user.id } }),
    prisma.savedItem.count({ where: { userId: user.id } }),
    prisma.generation.groupBy({
      by: ["feature"],
      where: { userId: user.id },
      _count: { feature: true },
      orderBy: { _count: { feature: "desc" } },
    }),
  ]);

  const FEATURE_LABELS: Record<string, string> = {
    VIRAL_IDEAS: "Viral Ideas",
    CAPTIONS: "Captions",
    HOOKS: "Hooks",
    HASHTAGS: "Hashtags",
    GROWTH_PLANNER: "Planner",
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your account and view your usage</p>
      </div>

      {/* Profile card */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <User className="h-4 w-4" /> Profile
        </h3>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.imageUrl ?? ""} />
            <AvatarFallback className="text-lg bg-primary/10 text-primary">
              {user.name?.charAt(0) ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-lg">{user.name}</div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
              <Mail className="h-3.5 w-3.5" />
              {user.email}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Calendar className="h-3 w-3" />
              Joined {formatDate(user.createdAt)}
            </div>
          </div>
          <Badge
            variant="outline"
            className={`ml-auto ${user.role === "ADMIN" ? "border-primary text-primary" : ""}`}
          >
            <Shield className="h-3 w-3 mr-1" />
            {user.role}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-4 p-3 rounded-lg bg-muted/50">
          To update your name, email, or profile photo, use the account button in the top-right corner of your dashboard.
        </p>
      </Card>

      {/* Usage stats */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-4 w-4" /> Usage Statistics
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-muted/50 text-center">
            <div className="text-3xl font-bold text-primary">{totalGenerations}</div>
            <div className="text-sm text-muted-foreground">Total Generations</div>
          </div>
          <div className="p-4 rounded-xl bg-muted/50 text-center">
            <div className="text-3xl font-bold text-primary">{savedCount}</div>
            <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <BookmarkCheck className="h-3.5 w-3.5" /> Saved Items
            </div>
          </div>
        </div>

        <h4 className="text-sm font-medium mb-3">Usage by Feature</h4>
        <div className="space-y-2">
          {usageByFeature.length === 0 ? (
            <p className="text-sm text-muted-foreground">No usage yet</p>
          ) : (
            usageByFeature.map(({ feature, _count }: { feature: string; _count: { feature: number } }) => {
              const pct = Math.round((_count.feature / totalGenerations) * 100);
              return (
                <div key={feature}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>{FEATURE_LABELS[feature] ?? feature}</span>
                    <span className="text-muted-foreground">{_count.feature} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
