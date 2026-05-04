"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Crown, Check, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { UpgradeModal, type PlanType } from "./upgrade-modal";

const PLAN_CONFIG = {
  FREE: {
    icon: Sparkles,
    iconColor: "text-slate-300",
    iconBg: "bg-slate-500/20",
    gradient: "from-slate-500/10 via-slate-500/5 to-transparent",
    border: "border-slate-500/20",
    glow: "rgba(100,116,139,0.12)",
    badge: "bg-slate-500/15 text-slate-300 border-slate-500/25",
    label: "Free Plan",
    headline: "You're on the Free Plan",
    sub: "Upgrade to unlock unlimited generations and premium features.",
    perks: [
      "50 generations / day",
      "All 5 AI tools",
      "7-day history",
      "Basic export",
    ],
    cta: "Upgrade to Pro",
    ctaCls: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 shadow-md shadow-violet-500/25",
    showUpgrade: true,
  },
  PRO: {
    icon: Zap,
    iconColor: "text-violet-300",
    iconBg: "bg-violet-500/20",
    gradient: "from-violet-500/12 via-violet-500/5 to-transparent",
    border: "border-violet-500/25",
    glow: "rgba(139,92,246,0.12)",
    badge: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    label: "Pro Plan",
    headline: "You're on the Pro Plan ⚡",
    sub: "Enjoy unlimited generations and all premium features.",
    perks: [
      "Unlimited generations",
      "Priority AI speed",
      "Full history + search",
      "CSV & PDF export",
      "Saved library",
      "Email support",
    ],
    cta: "Manage Plan",
    ctaCls: "border border-violet-500/40 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20",
    showUpgrade: false,
  },
  ELITE: {
    icon: Crown,
    iconColor: "text-yellow-300",
    iconBg: "bg-yellow-500/20",
    gradient: "from-yellow-500/12 via-yellow-500/5 to-transparent",
    border: "border-yellow-500/25",
    glow: "rgba(234,179,8,0.10)",
    badge: "bg-yellow-500/15 text-yellow-300 border-yellow-500/25",
    label: "Elite Plan",
    headline: "You're on the Elite Plan 👑",
    sub: "You have full access to every feature including team seats and API.",
    perks: [
      "Everything in Pro",
      "10 team seats",
      "White-label exports",
      "API access",
      "Custom AI tones",
      "Dedicated manager",
    ],
    cta: "Manage Plan",
    ctaCls: "border border-yellow-500/40 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20",
    showUpgrade: false,
  },
} as const;

interface PlanBannerProps {
  plan: PlanType;
}

export function PlanBanner({ plan }: PlanBannerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PlanType>(plan);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const cfg = PLAN_CONFIG[currentPlan];
  const Icon = cfg.icon;

  return (
    <>
      <div
        className={cn(
          "relative rounded-2xl border overflow-hidden p-5",
          `bg-gradient-to-r ${cfg.gradient}`,
          cfg.border
        )}
        style={{ boxShadow: `0 0 40px 0 ${cfg.glow}` }}
      >
        {/* dismiss for free plan */}
        {currentPlan === "FREE" && (
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-3 right-3 p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Left: icon + text */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className={cn("p-2.5 rounded-xl shrink-0", cfg.iconBg)}>
              <Icon className={cn("h-5 w-5", cfg.iconColor)} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-base leading-none">{cfg.headline}</h3>
                <Badge variant="outline" className={cn("text-[10px] font-semibold shrink-0", cfg.badge)}>
                  {cfg.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{cfg.sub}</p>

              {/* Perks grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1.5">
                {cfg.perks.map((perk) => (
                  <div key={perk} className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-green-500/15 flex items-center justify-center shrink-0">
                      <Check className="h-2 w-2 text-green-400" />
                    </div>
                    <span className="text-xs text-foreground/70">{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: CTA */}
          <div className="shrink-0 sm:self-center">
            <Button
              size="sm"
              className={cn("h-9 px-4 text-xs font-bold gap-1.5 whitespace-nowrap", cfg.ctaCls)}
              onClick={() => setModalOpen(true)}
            >
              {cfg.cta}
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      <UpgradeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        currentPlan={currentPlan}
        onPlanChange={(p) => {
          setCurrentPlan(p);
          setModalOpen(false);
        }}
      />
    </>
  );
}
