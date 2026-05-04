"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, BarChart3, Activity,
  Settings, Megaphone, Zap, FileText,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/analytics", icon: BarChart3, label: "Feature Analytics" },
  { href: "/admin/api-usage", icon: Activity, label: "API Usage" },
  { href: "/admin/announcements", icon: Megaphone, label: "Announcements" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border/50 bg-card/30 h-full">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-border/50">
        <div className="p-1.5 rounded-lg bg-red-500/10">
          <Zap className="h-5 w-5 text-red-500" />
        </div>
        <div>
          <span className="font-bold text-base">TrendPilot AI</span>
          <div className="flex items-center gap-1">
            <span className="text-xs text-red-500 font-medium">Admin Panel</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="px-3 mb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Management
          </p>
        </div>
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-red-500/10 text-red-500"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500" />}
            </Link>
          );
        })}

        <div className="px-3 mt-6 mb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            User
          </p>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent transition-all"
        >
          <FileText className="h-4 w-4 shrink-0" />
          Back to App
        </Link>
      </nav>
    </aside>
  );
}
