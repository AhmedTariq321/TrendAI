"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/dashboard/copy-button";
import { ExportButton } from "@/components/dashboard/export-button";
import { BookmarkCheck, Search, Trash2, BookmarkX } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
type SavedItem = {
  id: string;
  title: string;
  content: string;
  feature: string;
  createdAt: Date;
  userId: string;
  generationId: string;
};

const FEATURE_LABELS: Record<string, string> = {
  VIRAL_IDEAS: "Viral Ideas",
  CAPTIONS: "Captions",
  HOOKS: "Hooks",
  HASHTAGS: "Hashtags",
  GROWTH_PLANNER: "Planner",
};

export function SavedItemsClient({ initialItems }: { initialItems: SavedItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filtered = items.filter((item) => {
    const matchSearch = item.content.toLowerCase().includes(search.toLowerCase()) ||
      item.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "ALL" || item.feature === filter;
    return matchSearch && matchFilter;
  });

  const deleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/save/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        toast.success("Removed from saved");
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Saved Results</h2>
          <p className="text-muted-foreground mt-1">{items.length} items in your library</p>
        </div>
        <div className="ml-auto flex gap-2">
          <ExportButton
            data={filtered.map((i) => `[${FEATURE_LABELS[i.feature]}] ${i.title}\n${i.content}`)}
            filename="saved-items"
          />
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search saved items..."
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
          {items.length === 0 ? (
            <>
              <BookmarkX className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="font-medium">No saved items yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Click the bookmark icon on any result to save it here
              </p>
            </>
          ) : (
            <>
              <Search className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="font-medium">No results match your search</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <Card key={item.id} className="p-4 group hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="font-medium text-sm">{item.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(item.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CopyButton text={item.content} />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:text-destructive"
                    onClick={() => deleteItem(item.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <Badge variant="outline" className="text-xs mb-2">
                <BookmarkCheck className="h-3 w-3 mr-1" />
                {FEATURE_LABELS[item.feature]}
              </Badge>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                {item.content}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
