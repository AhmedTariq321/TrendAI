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
import { Hash, Wand2 } from "lucide-react";
import { toast } from "sonner";

interface HashtagGroup {
  category: string;
  tags: string[];
}

interface GenerateResponse {
  groups: HashtagGroup[];
  allTags: string[];
  generationId: string;
}

export default function HashtagsPage() {
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("");
  const [postType, setPostType] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GenerateResponse | null>(null);

  const generate = async () => {
    if (!niche) {
      toast.error("Please enter your niche");
      return;
    }
    setLoading(true);
    setData(null);
    try {
      const res = await fetch("/api/hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, platform, postType }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      setData(await res.json());
      toast.success("Hashtags generated!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AIToolWrapper
      icon={Hash}
      title="Hashtag Generator"
      description="Get trending and niche-specific hashtags organized by reach category to maximize your discoverability."
      badge="Grouped sets"
      iconColor="text-green-500"
      iconBg="bg-green-500/10"
      results={
        loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : data ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline">{data.allTags.length} hashtags</Badge>
              <div className="flex gap-2">
                <CopyButton text={data.allTags.join(" ")} />
                <ExportButton data={[data.allTags.join(" ")]} filename="hashtags" />
              </div>
            </div>

            {/* Full set copy */}
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Complete Hashtag Set</span>
                <CopyButton text={data.allTags.join(" ")} />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed break-words">
                {data.allTags.join(" ")}
              </p>
            </Card>

            {/* By category */}
            {data.groups.map((group) => (
              <Card key={group.category} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary">{group.category}</Badge>
                  <CopyButton text={group.tags.join(" ")} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(tag);
                        toast.success(`Copied ${tag}`);
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed border-border/50 text-center p-8">
            <Hash className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="font-medium">Your hashtags will appear here</p>
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
            placeholder="e.g. fitness, travel, cooking..."
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
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
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="YouTube">YouTube</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="X (Twitter)">X (Twitter)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Post Type</Label>
          <Select value={postType} onValueChange={(v) => setPostType(v ?? "")}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Any post type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reel">Reel / Short</SelectItem>
              <SelectItem value="photo">Photo / Carousel</SelectItem>
              <SelectItem value="story">Story</SelectItem>
              <SelectItem value="blog-post">Blog / Long-form</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full mt-2" onClick={generate} disabled={loading}>
          {loading ? "Generating..." : (
            <><Wand2 className="h-4 w-4 mr-2" />Generate Hashtags</>
          )}
        </Button>
      </div>
    </AIToolWrapper>
  );
}
