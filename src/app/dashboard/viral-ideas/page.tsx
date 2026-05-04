"use client";

import { useState } from "react";
import { AIToolWrapper } from "@/components/dashboard/ai-tool-wrapper";
import { ResultCard } from "@/components/dashboard/result-card";
import { ExportButton } from "@/components/dashboard/export-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Wand2, Sparkles, TrendingUp, Zap, Target, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface IdeaResult {
  idea: string;
  postType: string;
  hook: string;
}

interface GenerateResponse {
  results: IdeaResult[];
  generationId: string;
}

const PLATFORMS = [
  { value: "TikTok", emoji: "🎵" },
  { value: "Instagram", emoji: "📸" },
  { value: "YouTube Shorts", emoji: "▶️" },
  { value: "Facebook", emoji: "👥" },
  { value: "X (Twitter)", emoji: "𝕏" },
];

const TONES = [
  { value: "entertaining", label: "🎭 Entertaining" },
  { value: "educational", label: "📚 Educational" },
  { value: "inspirational", label: "🌟 Inspirational" },
  { value: "funny", label: "😂 Funny" },
  { value: "professional", label: "💼 Professional" },
  { value: "controversial", label: "🔥 Controversial" },
];

const EXAMPLE_IDEAS = [
  { idea: "POV: I tried every protein source for 30 days — here's what happened to my gains", postType: "Reel", hook: "I thought I knew everything about protein until day 12 changed everything..." },
  { idea: "The 3 kitchen hacks Gordon Ramsay actually uses (that nobody talks about)", postType: "Carousel", hook: "Forget everything you learned in culinary school — these are the real secrets." },
  { idea: "How I grew from 0 to 10k followers in 30 days without spending a single dollar", postType: "Story", hook: "Everyone said it was impossible. Here's exactly what I did differently." },
];

const TIPS = [
  { icon: Target, text: "Be specific with your niche — 'vegan bodybuilding' beats 'fitness'" },
  { icon: TrendingUp, text: "Choose the platform where you post most consistently" },
  { icon: Zap, text: "Add your audience age & interests for hyper-targeted ideas" },
  { icon: BookOpen, text: "Generate multiple times with different tones for variety" },
];

function EmptyState() {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Example output preview */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold">Example Output</p>
          <Badge variant="outline" className="text-[10px] bg-primary/5 border-primary/20 text-primary ml-auto">Preview</Badge>
        </div>
        <div className="space-y-2.5 opacity-60 pointer-events-none select-none">
          {EXAMPLE_IDEAS.map((item, i) => (
            <div key={i} className="rounded-xl border border-border/40 bg-card/60 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">{i + 1}</span>
                <Badge variant="outline" className="text-[10px] bg-pink-500/10 text-pink-400 border-pink-500/20">{item.postType}</Badge>
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed mb-1.5">{item.idea}</p>
              <p className="text-[11px] text-muted-foreground">💡 Hook: {item.hook}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-[11px] text-muted-foreground mt-2 italic">Fill the form to generate real ideas for your niche ↑</p>
      </div>

      {/* Divider */}
      <div className="border-t border-border/40" />

      {/* Tips */}
      <div>
        <p className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4 text-yellow-400" />
          Tips for Better Results
        </p>
        <div className="grid grid-cols-1 gap-2">
          {TIPS.map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-card/40 border border-border/30">
              <Icon className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ViralIdeasPage() {
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GenerateResponse | null>(null);

  const generate = async () => {
    if (!niche || !platform) {
      toast.error("Please fill in niche and platform");
      return;
    }
    setLoading(true);
    setData(null);
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, platform, audience, tone }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Generation failed");
      }
      const json = await res.json();
      setData(json);
      toast.success(`${json.results.length} viral ideas generated! 🎉`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const flatContent = data?.results.map((r) => `${r.idea}\n[${r.postType}]\nHook: ${r.hook}`) ?? [];

  const resultsPanel = loading ? (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-4 w-4 text-primary animate-spin" />
        <p className="text-sm font-medium text-muted-foreground">Generating 30 viral ideas...</p>
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-xl" />
      ))}
    </div>
  ) : data ? (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 font-medium">
          ✅ {data.results.length} ideas generated
        </Badge>
        <ExportButton data={flatContent} filename="viral-ideas" />
      </div>
      <div className="space-y-3">
        {data.results.map((item, i) => (
          <ResultCard
            key={i}
            index={i}
            content={`${item.idea}\n\n💡 Hook: ${item.hook}`}
            badge={item.postType}
            generationId={data.generationId}
            feature="VIRAL_IDEAS"
            title={`Viral Idea #${i + 1}`}
          />
        ))}
      </div>
    </div>
  ) : (
    <EmptyState />
  );

  return (
    <AIToolWrapper
      icon={Lightbulb}
      title="Viral Idea Generator"
      description="Generate 30 trending content ideas tailored to your niche and platform."
      badge="30 ideas"
      iconColor="text-yellow-400"
      iconBg="bg-yellow-500/15"
      gradient="from-yellow-500/10 via-yellow-500/5 to-transparent"
      results={resultsPanel}
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="niche" className="text-sm font-medium">
            Your Niche <span className="text-red-400">*</span>
          </Label>
          <Input
            id="niche"
            placeholder="fitness, cooking, tech, fashion..."
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="bg-background/50"
            onKeyDown={(e) => e.key === "Enter" && generate()}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Platform <span className="text-red-400">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {PLATFORMS.map(({ value, emoji }) => (
              <button
                key={value}
                onClick={() => setPlatform(value)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all duration-150",
                  platform === value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/50 bg-background/40 text-muted-foreground hover:border-border hover:text-foreground"
                )}
              >
                <span>{emoji}</span>
                <span className="truncate">{value}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="audience" className="text-sm font-medium">Target Audience</Label>
          <Input
            id="audience"
            placeholder="women 25–35, college students..."
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="bg-background/50"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Content Tone</Label>
          <Select value={tone} onValueChange={(v) => setTone(v ?? "")}>
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Choose a tone..." />
            </SelectTrigger>
            <SelectContent>
              {TONES.map(({ value, label }) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25 text-white border-0 mt-2"
          onClick={generate}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 animate-spin" />
              Generating ideas...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Generate 30 Viral Ideas
            </span>
          )}
        </Button>
      </div>
    </AIToolWrapper>
  );
}
