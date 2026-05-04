"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap, Crown, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type PlanType = "FREE" | "PRO" | "ELITE";

const PLANS = [
  {
    id: "FREE" as PlanType,
    popular: false,
    name: "Free",
    price: "$0",
    period: "forever",
    tagline: "Try it out",
    icon: Sparkles,
    accent: "slate",
    iconColor: "text-slate-400",
    iconBg: "bg-slate-400/10",
    cardBg: "bg-card/60",
    cardBorder: "border-border/60",
    ringColor: "ring-slate-400/30",
    badgeCls: "bg-slate-500/10 text-slate-300 border-slate-500/25",
    btnCls: "border border-border/70 bg-transparent text-foreground/70 hover:bg-muted/60",
    features: [
      "50 generations / day",
      "All 5 AI tools",
      "Basic export",
      "7-day history",
      "Community support",
    ],
  },
  {
    id: "PRO" as PlanType,
    name: "Pro",
    price: "$19",
    period: "/ mo",
    tagline: "Most popular",
    icon: Zap,
    accent: "violet",
    iconColor: "text-violet-300",
    iconBg: "bg-violet-500/20",
    cardBg: "bg-gradient-to-b from-violet-500/10 via-violet-500/5 to-card/40",
    cardBorder: "border-violet-500/50",
    ringColor: "ring-violet-500/40",
    badgeCls: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    btnCls: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-violet-500/30",
    popular: true,
    features: [
      "Unlimited generations",
      "All 5 AI tools",
      "Priority AI speed",
      "Full history + search",
      "CSV & PDF export",
      "Saved library",
      "Email support",
    ],
  },
  {
    id: "ELITE" as PlanType,
    popular: false,
    name: "Elite",
    price: "$49",
    period: "/ mo",
    tagline: "For teams",
    icon: Crown,
    accent: "yellow",
    iconColor: "text-yellow-300",
    iconBg: "bg-yellow-500/20",
    cardBg: "bg-gradient-to-b from-yellow-500/10 via-yellow-500/5 to-card/40",
    cardBorder: "border-yellow-500/40",
    ringColor: "ring-yellow-500/35",
    badgeCls: "bg-yellow-500/15 text-yellow-300 border-yellow-500/25",
    btnCls: "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-lg shadow-yellow-500/25",
    features: [
      "Everything in Pro",
      "10 team seats",
      "White-label exports",
      "API access",
      "Custom AI tones",
      "Dedicated manager",
      "Priority support",
    ],
  },
] as const;

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean, ...args: unknown[]) => void;
  currentPlan: PlanType;
  onPlanChange: (plan: PlanType) => void;
}

export function UpgradeModal({ open, onOpenChange, currentPlan, onPlanChange }: UpgradeModalProps) {
  const [loading, setLoading] = useState<PlanType | null>(null);

  const handleSelect = async (planId: PlanType) => {
    if (planId === currentPlan) return;
    setLoading(planId);
    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      if (!res.ok) throw new Error();
      onPlanChange(planId);
      toast.success(
        `Switched to ${planId.charAt(0) + planId.slice(1).toLowerCase()} plan! 🎉`,
        { description: "Your new plan is active immediately." }
      );
      onOpenChange(false);
    } catch {
      toast.error("Could not update plan — please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[780px] p-0 gap-0 overflow-hidden">

        {/* ── Header ── */}
        <div className="relative px-7 pt-7 pb-5 border-b border-border/40 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(139,92,246,0.14),transparent)] pointer-events-none" />
          <DialogHeader className="relative">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-yellow-500/15">
                <Crown className="h-4.5 w-4.5 text-yellow-400" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold leading-none">Choose Your Plan</DialogTitle>
                <p className="text-xs text-muted-foreground mt-1">Upgrade, downgrade or cancel anytime — no lock-ins.</p>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* ── Plans ── */}
        <div className="p-6 grid grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isCurrent = plan.id === currentPlan;
            const isLoading = loading === plan.id;

            return (
              <div
                key={plan.id}
                className={cn(
                  "relative rounded-2xl border flex flex-col overflow-hidden transition-all duration-200",
                  plan.cardBg,
                  plan.cardBorder,
                  isCurrent && `ring-2 ${plan.ringColor}`,
                  !isCurrent && "hover:scale-[1.01] hover:shadow-xl"
                )}
              >
                {/* Popular ribbon */}
                {plan.popular && (
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500" />
                )}

                <div className="p-5 flex flex-col gap-4 flex-1">
                  {/* Plan identity */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn("p-2 rounded-xl", plan.iconBg)}>
                        <Icon className={cn("h-4 w-4", plan.iconColor)} />
                      </div>
                      {isCurrent ? (
                        <Badge variant="outline" className={cn("text-[10px] font-semibold", plan.badgeCls)}>
                          Active
                        </Badge>
                      ) : plan.popular ? (
                        <Badge className="text-[10px] font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 shadow-sm">
                          Popular
                        </Badge>
                      ) : null}
                    </div>

                    <div className="font-bold text-sm text-foreground/60 uppercase tracking-wider mb-1">{plan.tagline}</div>
                    <div className="font-extrabold text-2xl leading-none">{plan.name}</div>
                    <div className="flex items-end gap-1 mt-2">
                      <span className="text-3xl font-black leading-none">{plan.price}</span>
                      <span className="text-xs text-muted-foreground mb-0.5">{plan.period}</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-border/40" />

                  {/* Features */}
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-500/15 flex items-center justify-center shrink-0">
                          <Check className="h-2.5 w-2.5 text-green-400" />
                        </div>
                        <span className="text-xs text-foreground/75 leading-tight">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA pinned to bottom */}
                <div className="px-5 pb-5">
                  <Button
                    className={cn("w-full h-9 text-xs font-bold gap-1.5", plan.btnCls)}
                    disabled={isCurrent || isLoading}
                    onClick={() => handleSelect(plan.id)}
                  >
                    {isLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : isCurrent ? (
                      "Current Plan"
                    ) : (
                      <>
                        {plan.id === "FREE" ? "Downgrade" : `Get ${plan.name}`}
                        <ArrowRight className="h-3 w-3" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 pb-5 flex items-center justify-center gap-6 text-[11px] text-muted-foreground">
          <span>🔒 Secure checkout</span>
          <span className="w-px h-3 bg-border/60" />
          <span>↩ Cancel anytime</span>
          <span className="w-px h-3 bg-border/60" />
          <span>✦ No hidden fees</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
