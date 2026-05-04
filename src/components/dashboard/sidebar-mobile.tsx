"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Lightbulb, Sparkles, Zap, Hash,
  BookOpen, BookmarkCheck, Clock, Settings, Zap as ZapIcon,
} from "lucide-react";

const ALL_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/viral-ideas", icon: Lightbulb, label: "Viral Ideas" },
  { href: "/dashboard/captions", icon: Sparkles, label: "Caption Generator" },
  { href: "/dashboard/hooks", icon: Zap, label: "Hook Generator" },
  { href: "/dashboard/hashtags", icon: Hash, label: "Hashtags" },
  { href: "/dashboard/planner", icon: BookOpen, label: "Growth Planner" },
  { href: "/dashboard/saved", icon: BookmarkCheck, label: "Saved Results" },
  { href: "/dashboard/history", icon: Clock, label: "History" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function DashboardSidebarMobile() {
  const pathname = usePathname();
  return (
    <div className="flex flex-col h-full bg-card">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-border/50">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <ZapIcon className="h-5 w-5 text-primary" />
        </div>
        <span className="font-bold text-lg gradient-text">TrendPilot AI</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {ALL_ITEMS.map(({ href, icon: Icon, label }) => {
          const active =
            href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
