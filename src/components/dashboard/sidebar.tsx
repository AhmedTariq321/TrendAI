"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Lightbulb, Sparkles, Zap, Hash,
  BookOpen, BookmarkCheck, Clock, Settings, Crown, ChevronRight,
} from "lucide-react";
import { UpgradeModal, type PlanType } from "./upgrade-modal";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview", color: "text-violet-400" },
  { href: "/dashboard/viral-ideas", icon: Lightbulb, label: "Viral Ideas", color: "text-yellow-400" },
  { href: "/dashboard/captions", icon: Sparkles, label: "Captions", color: "text-purple-400" },
  { href: "/dashboard/hooks", icon: Zap, label: "Hooks", color: "text-blue-400" },
  { href: "/dashboard/hashtags", icon: Hash, label: "Hashtags", color: "text-green-400" },
  { href: "/dashboard/planner", icon: BookOpen, label: "Growth Planner", color: "text-orange-400" },
];

const BOTTOM_ITEMS = [
  { href: "/dashboard/saved", icon: BookmarkCheck, label: "Saved Results", color: "text-pink-400" },
  { href: "/dashboard/history", icon: Clock, label: "History", color: "text-slate-400" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings", color: "text-slate-400" },
];

const PLAN_META: Record<PlanType, { label: string; sub: string; icon: React.ElementType; iconColor: string; bg: string; border: string }> = {
  FREE: {
    label: "Free Plan",
    sub: "50 generations / day",
    icon: Sparkles,
    iconColor: "text-slate-400",
    bg: "bg-slate-500/8",
    border: "border-slate-500/20",
  },
  PRO: {
    label: "Pro Plan",
    sub: "Unlimited generations",
    icon: Zap,
    iconColor: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
  },
  ELITE: {
    label: "Elite Plan",
    sub: "Agencies & teams",
    icon: Crown,
    iconColor: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
  },
};

interface DashboardSidebarProps {
  plan?: PlanType;
}

export function DashboardSidebar({ plan: initialPlan = "FREE" }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [modalOpen, setModalOpen] = useState(false);
  const [plan, setPlan] = useState<PlanType>(initialPlan);

  const meta = PLAN_META[plan];
  const PlanIcon = meta.icon;

  return (
    <>
      <aside className="hidden lg:flex w-64 flex-col border-r border-border/40 bg-card/20 h-full">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border/40">
          <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-base gradient-text">TrendPilot</span>
            <span className="ml-1 text-xs text-muted-foreground font-medium">AI</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-3">
            AI Tools
          </p>

          {NAV_ITEMS.map(({ href, icon: Icon, label, color }) => {
            const active =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : color)} />
                {label}
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
              </Link>
            );
          })}

          <div className="my-4 border-t border-border/40" />
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-3">
            Library
          </p>

          {BOTTOM_ITEMS.map(({ href, icon: Icon, label, color }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : color)} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Plan pill — clickable */}
        <div className="p-3 border-t border-border/40">
          <button
            onClick={() => setModalOpen(true)}
            className={cn(
              "w-full rounded-xl border p-3 flex items-center gap-3 transition-all duration-200 hover:shadow-md group",
              meta.bg,
              meta.border
            )}
          >
            <div className={cn("p-1.5 rounded-lg", plan === "FREE" ? "bg-slate-500/15" : plan === "PRO" ? "bg-violet-500/20" : "bg-yellow-500/20")}>
              <PlanIcon className={cn("h-3.5 w-3.5", meta.iconColor)} />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-xs font-semibold leading-none">{meta.label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{meta.sub}</p>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
          </button>
        </div>
      </aside>

      <UpgradeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        currentPlan={plan}
        onPlanChange={setPlan}
      />
    </>
  );
}
