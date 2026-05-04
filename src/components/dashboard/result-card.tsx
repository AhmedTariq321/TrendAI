"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "./copy-button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  index?: number;
  content: string;
  badge?: string;
  generationId?: string;
  feature?: string;
  title?: string;
  className?: string;
}

const BADGE_COLORS: Record<string, string> = {
  Reel: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Story: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Carousel: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Post: "bg-green-500/10 text-green-400 border-green-500/20",
  Short: "bg-red-500/10 text-red-400 border-red-500/20",
  Tweet: "bg-sky-500/10 text-sky-400 border-sky-500/20",
};

export function ResultCard({
  index,
  content,
  badge,
  generationId,
  feature,
  title,
  className,
}: ResultCardProps) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!generationId || saving || saved) return;
    setSaving(true);
    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generationId,
          content,
          feature,
          title: title ?? (index !== undefined ? `${feature} #${index + 1}` : feature),
        }),
      });
      if (res.ok) {
        setSaved(true);
        toast.success("Saved to library!");
      }
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const badgeClass = badge ? (BADGE_COLORS[badge] ?? "bg-primary/10 text-primary border-primary/20") : "";

  return (
    <Card className={cn(
      "p-4 group transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5",
      className
    )}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {index !== undefined && (
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
              {index + 1}
            </span>
          )}
          {badge && (
            <Badge variant="outline" className={cn("text-xs font-medium", badgeClass)}>
              {badge}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <CopyButton text={content} />
          {generationId && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 w-7 p-0 rounded-lg",
                saved ? "text-primary" : "hover:text-primary"
              )}
              onClick={handleSave}
              disabled={saved || saving}
            >
              {saved ? (
                <BookmarkCheck className="h-3.5 w-3.5" />
              ) : (
                <Bookmark className="h-3.5 w-3.5" />
              )}
            </Button>
          )}
        </div>
      </div>
      <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">{content}</p>
    </Card>
  );
}
