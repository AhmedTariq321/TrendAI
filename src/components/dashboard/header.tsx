"use client";

import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DashboardSidebarMobile } from "./sidebar-mobile";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/viral-ideas": "Viral Ideas",
  "/dashboard/captions": "Caption Generator",
  "/dashboard/hooks": "Hook Generator",
  "/dashboard/hashtags": "Hashtag Generator",
  "/dashboard/planner": "Growth Planner",
  "/dashboard/image-generation": "Image Generation",
  "/dashboard/saved": "Saved Results",
  "/dashboard/history": "History",
  "/dashboard/settings": "Settings",
};

export function DashboardHeader() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const title = PAGE_TITLES[pathname] ?? "Dashboard";

  return (
    <header className="flex items-center gap-4 px-4 sm:px-6 h-16 border-b border-border/50 bg-card/30 shrink-0">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden h-9 w-9" />}>
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <DashboardSidebarMobile />
        </SheetContent>
      </Sheet>

      <h1 className="text-lg font-semibold">{title}</h1>

      <div className="ml-auto flex items-center gap-3">
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
