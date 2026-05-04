import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Hash, Lightbulb, BookOpen, Zap } from "lucide-react";

const PREVIEW_FEATURES = [
  { icon: Lightbulb, label: "Viral Ideas", color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { icon: Sparkles, label: "Captions", color: "text-purple-500", bg: "bg-purple-500/10" },
  { icon: Zap, label: "Hook Lines", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: Hash, label: "Hashtags", color: "text-green-500", bg: "bg-green-500/10" },
  { icon: BookOpen, label: "Growth Plan", color: "text-orange-500", bg: "bg-orange-500/10" },
  { icon: TrendingUp, label: "Analytics", color: "text-pink-500", bg: "bg-pink-500/10" },
];

export function DashboardPreview() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">
            Dashboard Preview
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Everything in one <span className="gradient-text">clean workspace</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A professional dashboard designed for creators who want speed, clarity, and powerful AI tools in one place.
          </p>
        </div>

        {/* Mock dashboard */}
        <div className="relative rounded-2xl border border-border/50 overflow-hidden shadow-2xl shadow-primary/10 glass">
          {/* Top bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-card/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <div className="mx-auto text-xs text-muted-foreground bg-muted/50 px-4 py-1 rounded-full">
              app.trendpilot.ai/dashboard
            </div>
          </div>

          <div className="flex min-h-[500px]">
            {/* Sidebar */}
            <div className="hidden sm:flex w-56 border-r border-border/50 bg-card/30 flex-col p-4 gap-1">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                Navigation
              </div>
              {[
                { icon: TrendingUp, label: "Overview", active: true },
                { icon: Lightbulb, label: "Viral Ideas" },
                { icon: Sparkles, label: "Captions" },
                { icon: Zap, label: "Hooks" },
                { icon: Hash, label: "Hashtags" },
                { icon: BookOpen, label: "Planner" },
              ].map(({ icon: Icon, label, active }) => (
                <div
                  key={label}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    active
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="flex-1 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">Welcome back, Creator! 👋</h3>
                <p className="text-sm text-muted-foreground">Here&apos;s your growth summary</p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Total Generations", value: "247", change: "+12%" },
                  { label: "Saved Items", value: "89", change: "+5%" },
                  { label: "AI Score", value: "94", change: "+2pts" },
                  { label: "This Week", value: "32", change: "+8%" },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 rounded-xl bg-card border border-border/50">
                    <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-green-500 mt-1">{stat.change}</div>
                  </div>
                ))}
              </div>

              {/* Feature grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {PREVIEW_FEATURES.map(({ icon: Icon, label, color, bg }) => (
                  <div key={label} className="p-4 rounded-xl bg-card border border-border/50 card-hover cursor-pointer">
                    <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center mb-3`}>
                      <Icon className={`h-4 w-4 ${color}`} />
                    </div>
                    <div className="text-sm font-medium">{label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">AI-powered</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
