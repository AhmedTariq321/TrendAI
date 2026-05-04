"use client";

import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIToolWrapperProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  iconColor?: string;
  iconBg?: string;
  gradient?: string;
  children: ReactNode;
  results?: ReactNode;
}

export function AIToolWrapper({
  icon: Icon,
  title,
  description,
  badge,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  gradient = "from-primary/20 via-primary/5 to-transparent",
  children,
  results,
}: AIToolWrapperProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={cn(
        "relative rounded-2xl border border-border/50 overflow-hidden p-6",
        "bg-gradient-to-r",
        gradient,
      )}>
        <div className="flex items-center gap-4">
          <div className={cn("p-3 rounded-2xl shrink-0 shadow-lg", iconBg)}>
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold">{title}</h2>
              {badge && (
                <Badge variant="outline" className="text-xs border-primary/30 bg-primary/5 text-primary">
                  {badge}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6 items-start">
        {/* Form panel */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 sticky top-4 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
              Configure
            </p>
            {children}
          </div>
        </div>

        {/* Results panel */}
        <div className="lg:col-span-3 min-h-[200px]">
          {results}
        </div>
      </div>
    </div>
  );
}
