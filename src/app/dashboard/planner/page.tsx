"use client";

import { useState } from "react";
import { AIToolWrapper } from "@/components/dashboard/ai-tool-wrapper";
import { ExportButton } from "@/components/dashboard/export-button";
import { CopyButton } from "@/components/dashboard/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BookOpen, Wand2, Calendar } from "lucide-react";
import { toast } from "sonner";

interface DayPlan {
  day: number;
  theme: string;
  postType: string;
  idea: string;
  caption: string;
  bestTime: string;
}

interface GenerateResponse {
  duration: string;
  platform: string;
  days: DayPlan[];
  generationId: string;
}

const POST_TYPE_COLORS: Record<string, string> = {
  Reel: "bg-purple-500/10 text-purple-600",
  Story: "bg-blue-500/10 text-blue-600",
  Carousel: "bg-orange-500/10 text-orange-600",
  Post: "bg-green-500/10 text-green-600",
  Short: "bg-red-500/10 text-red-600",
  Tweet: "bg-sky-500/10 text-sky-600",
};

export default function PlannerPage() {
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("");
  const [duration, setDuration] = useState("7");
  const [goal, setGoal] = useState("");
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
      const res = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, platform, duration, goal }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      setData(await res.json());
      toast.success(`${duration}-day content plan ready!`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const exportData = data?.days.map(
    (d) => `Day ${d.day} - ${d.theme}\nType: ${d.postType}\nIdea: ${d.idea}\nCaption: ${d.caption}\nBest Time: ${d.bestTime}`
  ) ?? [];

  return (
    <AIToolWrapper
      icon={BookOpen}
      title="Growth Planner"
      description="Generate a complete 7-day or 30-day content calendar with post ideas, captions, and optimal posting times."
      badge="7 or 30 days"
      iconColor="text-orange-500"
      iconBg="bg-orange-500/10"
      results={
        loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-36 w-full rounded-xl" />
            ))}
          </div>
        ) : data ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{data.duration} Plan</Badge>
                <Badge variant="secondary">{data.platform}</Badge>
              </div>
              <ExportButton data={exportData} filename="content-plan" />
            </div>
            <div className="space-y-3">
              {data.days.map((day) => (
                <Card key={day.day} className="p-4 hover:border-primary/30 transition-colors group">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {day.day}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{day.theme}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {day.bestTime}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${POST_TYPE_COLORS[day.postType] ?? "bg-muted text-muted-foreground"}`}>
                        {day.postType}
                      </span>
                      <CopyButton text={`${day.idea}\n\n${day.caption}`} />
                    </div>
                  </div>
                  <p className="text-sm font-medium mb-1">{day.idea}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{day.caption}</p>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed border-border/50 text-center p-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="font-medium">Your content plan will appear here</p>
            <p className="text-sm text-muted-foreground mt-1">Fill in the form and click Generate</p>
          </div>
        )
      }
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="niche">Your Niche *</Label>
          <Input
            id="niche"
            placeholder="e.g. personal finance, travel photography..."
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label>Platform *</Label>
          <Select value={platform} onValueChange={(v) => setPlatform(v ?? "")}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Choose platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TikTok">TikTok</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="YouTube Shorts">YouTube Shorts</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="X (Twitter)">X (Twitter)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Plan Duration</Label>
          <Select value={duration} onValueChange={(v) => setDuration(v ?? "")}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 Days</SelectItem>
              <SelectItem value="30">30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="goal">Growth Goal</Label>
          <Input
            id="goal"
            placeholder="e.g. reach 10K followers, boost engagement..."
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="mt-1.5"
          />
        </div>
        <Button className="w-full mt-2" onClick={generate} disabled={loading}>
          {loading ? "Planning..." : (
            <><Wand2 className="h-4 w-4 mr-2" />Generate {duration}-Day Plan</>
          )}
        </Button>
      </div>
    </AIToolWrapper>
  );
}
