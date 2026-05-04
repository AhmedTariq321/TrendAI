import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive?: boolean };
  gradient?: string;
  iconColor?: string;
  iconBg?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  gradient,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
}: StatCardProps) {
  return (
    <div className={cn(
      "p-5 rounded-2xl border border-border/50 bg-card/50 card-hover relative overflow-hidden",
      gradient
    )}>
      {/* subtle glow orb */}
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-2.5 rounded-xl", iconBg)}>
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            trend.positive
              ? "text-green-400 bg-green-500/10"
              : "text-muted-foreground bg-muted/50"
          )}>
            {trend.value}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold tracking-tight mb-0.5">{value}</div>
      <div className="text-sm font-medium text-foreground/80">{title}</div>
      {subtitle && <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>}
    </div>
  );
}
