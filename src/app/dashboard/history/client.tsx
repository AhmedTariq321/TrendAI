"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/dashboard/copy-button";
import { Clock, Search, ChevronDown, ChevronUp } from "lucide-react";
import { formatDate } from "@/lib/utils";
type Generation = {
  id: string;
  feature: string;
  outputs: unknown;
  tokensUsed: number;
  createdAt: Date;
  userId: string;
};

const FEATURE_LABELS: Record<string, string> = {
  VIRAL_IDEAS: "Viral Ideas",
  CAPTIONS: "Captions",
  HOOKS: "Hooks",
  HASHTAGS: "Hashtags",
  GROWTH_PLANNER: "Planner",
};

const FEATURE_COLORS: Record<string, string> = {
  VIRAL_IDEAS: "border-yellow-500/30 bg-yellow-500/5",
  CAPTIONS: "border-purple-500/30 bg-purple-500/5",
  HOOKS: "border-blue-500/30 bg-blue-500/5",
  HASHTAGS: "border-green-500/30 bg-green-500/5",
  GROWTH_PLANNER: "border-orange-500/30 bg-orange-500/5",
};

function HistoryItem({ gen }: { gen: Generation }) {
  const [expanded, setExpanded] = useState(false);
  const outputs = gen.outputs as { results?: string[] } | null;
  const results = outputs?.results ?? [];
  const preview = results[0] ?? "No preview";
  const allText = results.join("\n\n---\n\n");

  return (
    <Card className={`p-4 ${FEATURE_COLORS[gen.feature] ?? ""}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-background/50 shrink-0 mt-0.5">
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {FEATURE_LABELS[gen.feature] ?? gen.feature}
            </Badge>
            <span className="text-xs text-muted-foreground">{formatDate(gen.createdAt)}</span>
            <span className="text-xs text-muted-foreground">
              {results.length} results · {gen.tokensUsed} tokens
            </span>
          </div>
          <p className="text-sm text-muted-foreground truncate">{preview}</p>

          {expanded && results.length > 1 && (
            <div className="mt-3 space-y-2">
              {results.slice(0, 10).map((r, i) => (
                <div key={i} className="p-2 rounded-lg bg-background/50 text-sm">
                  <span className="text-muted-foreground text-xs mr-2">#{i + 1}</span>
                  {r}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <CopyButton text={allText} />
          {results.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export function HistoryClient({ initialGenerations }: { initialGenerations: Generation[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filtered = initialGenerations.filter((gen) => {
    const outputs = gen.outputs as { results?: string[] } | null;
    const text = (outputs?.results ?? []).join(" ").toLowerCase();
    const matchSearch = text.includes(search.toLowerCase());
    const matchFilter = filter === "ALL" || gen.feature === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Generation History</h2>
        <p className="text-muted-foreground mt-1">{initialGenerations.length} total generations</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["ALL", "VIRAL_IDEAS", "CAPTIONS", "HOOKS", "HASHTAGS", "GROWTH_PLANNER"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === "ALL" ? "All" : FEATURE_LABELS[f]}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed border-border/50 text-center p-8">
          <Clock className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="font-medium">No history yet</p>
          <p className="text-sm text-muted-foreground mt-1">Your generations will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((gen) => (
            <HistoryItem key={gen.id} gen={gen} />
          ))}
        </div>
      )}
    </div>
  );
}
