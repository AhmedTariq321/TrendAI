"use client";

import { useState } from "react";
import { AIToolWrapper } from "@/components/dashboard/ai-tool-wrapper";
import { ResultCard } from "@/components/dashboard/result-card";
import { ExportButton } from "@/components/dashboard/export-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";

interface GenerateResponse {
  results: string[];
  generationId: string;
}

export default function CaptionsPage() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("");
  const [tone, setTone] = useState("");
  const [language, setLanguage] = useState("English");
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GenerateResponse | null>(null);

  const generate = async () => {
    if (!topic || !platform) {
      toast.error("Please fill in topic and platform");
      return;
    }
    setLoading(true);
    setData(null);
    try {
      const res = await fetch("/api/captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform, tone, language, includeEmojis }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Generation failed");
      }
      setData(await res.json());
      toast.success("10 captions generated!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AIToolWrapper
      icon={Sparkles}
      title="Caption Generator"
      description="Generate 10 high-converting captions with CTAs, platform-specific formatting, and emoji options."
      badge="10 captions"
      iconColor="text-purple-500"
      iconBg="bg-purple-500/10"
      results={
        loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : data ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline">{data.results.length} captions</Badge>
              <ExportButton data={data.results} filename="captions" />
            </div>
            <div className="space-y-3">
              {data.results.map((caption, i) => (
                <ResultCard
                  key={i}
                  index={i}
                  content={caption}
                  generationId={data.generationId}
                  feature="CAPTIONS"
                  title={`Caption #${i + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed border-border/50 text-center p-8">
            <Sparkles className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="font-medium">Your captions will appear here</p>
            <p className="text-sm text-muted-foreground mt-1">Fill in the form and click Generate</p>
          </div>
        )
      }
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="topic">Topic / Post Idea *</Label>
          <Input
            id="topic"
            placeholder="e.g. Morning workout routine, new product launch..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
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
          <Label>Tone</Label>
          <Select value={tone} onValueChange={(v) => setTone(v ?? "")}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Choose tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="casual">Casual & Friendly</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="funny">Funny & Witty</SelectItem>
              <SelectItem value="inspiring">Inspiring</SelectItem>
              <SelectItem value="urgent">Urgent / FOMO</SelectItem>
              <SelectItem value="educational">Educational</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Language</Label>
          <Select value={language} onValueChange={(v) => setLanguage(v ?? "")}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="French">French</SelectItem>
              <SelectItem value="German">German</SelectItem>
              <SelectItem value="Portuguese">Portuguese</SelectItem>
              <SelectItem value="Arabic">Arabic</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <Switch
            id="emojis"
            checked={includeEmojis}
            onCheckedChange={setIncludeEmojis}
          />
          <Label htmlFor="emojis" className="cursor-pointer">Include emojis</Label>
        </div>
        <Button className="w-full mt-2" onClick={generate} disabled={loading}>
          {loading ? "Generating..." : (
            <><Wand2 className="h-4 w-4 mr-2" />Generate 10 Captions</>
          )}
        </Button>
      </div>
    </AIToolWrapper>
  );
}
