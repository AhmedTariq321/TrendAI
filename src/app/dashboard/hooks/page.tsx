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
import { Zap, Wand2 } from "lucide-react";
import { toast } from "sonner";

interface GenerateResponse {
  results: string[];
  generationId: string;
}

export default function HooksPage() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("");
  const [hookType, setHookType] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GenerateResponse | null>(null);

  const generate = async () => {
    if (!topic) {
      toast.error("Please enter a topic");
      return;
    }
    setLoading(true);
    setData(null);
    try {
      const res = await fetch("/api/hooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform, hookType }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      setData(await res.json());
      toast.success("15 powerful hooks generated!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AIToolWrapper
      icon={Zap}
      title="Hook Generator"
      description="Generate powerful opening lines that stop the scroll and pull viewers into your content."
      badge="15 hooks"
      iconColor="text-blue-500"
      iconBg="bg-blue-500/10"
      results={
        loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : data ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline">{data.results.length} hooks</Badge>
              <ExportButton data={data.results} filename="hooks" />
            </div>
            <div className="space-y-3">
              {data.results.map((hook, i) => (
                <ResultCard
                  key={i}
                  index={i}
                  content={hook}
                  generationId={data.generationId}
                  feature="HOOKS"
                  title={`Hook #${i + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed border-border/50 text-center p-8">
            <Zap className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="font-medium">Your hooks will appear here</p>
            <p className="text-sm text-muted-foreground mt-1">Fill in the form and click Generate</p>
          </div>
        )
      }
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="topic">Topic *</Label>
          <Input
            id="topic"
            placeholder="e.g. How I lost 20kg, 5 mistakes beginners make..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label>Platform</Label>
          <Select value={platform} onValueChange={(v) => setPlatform(v ?? "")}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Any platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TikTok">TikTok</SelectItem>
              <SelectItem value="Instagram Reels">Instagram Reels</SelectItem>
              <SelectItem value="YouTube Shorts">YouTube Shorts</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="X (Twitter)">X (Twitter)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Hook Style</Label>
          <Select value={hookType} onValueChange={(v) => setHookType(v ?? "")}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Any style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="question">Question Hook</SelectItem>
              <SelectItem value="shocking">Shocking Statement</SelectItem>
              <SelectItem value="story">Story Opener</SelectItem>
              <SelectItem value="controversy">Controversial</SelectItem>
              <SelectItem value="number">Number / List</SelectItem>
              <SelectItem value="challenge">Challenge</SelectItem>
              <SelectItem value="pain-point">Pain Point</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full mt-2" onClick={generate} disabled={loading}>
          {loading ? "Generating..." : (
            <><Wand2 className="h-4 w-4 mr-2" />Generate 15 Hooks</>
          )}
        </Button>
      </div>
    </AIToolWrapper>
  );
}
