"use client";

import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Sparkles, TrendingUp, Zap, Play } from "lucide-react";

const PLATFORMS = [
  { name: "TikTok", emoji: "🎵" },
  { name: "Instagram", emoji: "📸" },
  { name: "YouTube", emoji: "▶️" },
  { name: "Facebook", emoji: "👥" },
  { name: "X (Twitter)", emoji: "𝕏" },
];

const STATS = [
  { icon: Zap, value: "10x", label: "Faster content" },
  { icon: TrendingUp, value: "5+", label: "Platforms" },
  { icon: Sparkles, value: "30+", label: "Ideas per run" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(139,92,246,0.25),transparent)]" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[100px]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="text-center max-w-4xl mx-auto">

          {/* Top badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Content Growth Platform
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            Go Viral Faster with{" "}
            <span className="relative inline-block">
              <span className="gradient-text">AI Tools</span>
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" />
            </span>
            <br />
            Built for Creators
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Generate captions, hooks, viral ideas, and full content plans in seconds.
            Stop guessing — start growing on every platform.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <ButtonLink
              size="lg"
              href="/sign-up"
              className="h-12 px-8 text-base bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-xl shadow-violet-500/30 text-white border-0"
            >
              Start for Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </ButtonLink>
            <a
              href="#features"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 px-8 text-base border-border/60 hover:border-border"
              )}
            >
              <Play className="mr-2 h-4 w-4 fill-current" />
              See How It Works
            </a>
          </div>

          {/* Platform pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-14">
            <span className="text-xs text-muted-foreground font-medium">Works on:</span>
            {PLATFORMS.map(({ name, emoji }) => (
              <span
                key={name}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-border/50 bg-card/60 text-foreground/80"
              >
                {emoji} {name}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center p-4 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm">
                <Icon className="h-4 w-4 text-primary mx-auto mb-1.5" />
                <div className="text-2xl font-bold gradient-text">{value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
