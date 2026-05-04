"use client";

import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Admin Dashboard",
  "/admin/users": "User Management",
  "/admin/analytics": "Feature Analytics",
  "/admin/api-usage": "API Usage",
  "/admin/announcements": "Announcements",
  "/admin/settings": "App Settings",
};

export function AdminHeader({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const title = PAGE_TITLES[pathname] ?? "Admin";

  return (
    <header className="flex items-center gap-4 px-4 sm:px-6 h-16 border-b border-border/50 bg-card/30 shrink-0">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold">{title}</h1>
        <Badge variant="outline" className="border-red-500/30 text-red-500 text-xs">
          <Shield className="h-3 w-3 mr-1" />
          Admin
        </Badge>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <span className="text-sm text-muted-foreground hidden sm:block">
          {adminName}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-9 w-9"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        <UserButton  />
      </div>
    </header>
  );
}
