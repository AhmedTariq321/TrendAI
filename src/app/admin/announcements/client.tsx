"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Save, X } from "lucide-react";
import { toast } from "sonner";

export function AnnouncementsClient({ currentBanner }: { currentBanner: string }) {
  const [banner, setBanner] = useState(currentBanner);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ announcement_banner: banner }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("Banner updated!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold">Announcements</h2>
        <p className="text-muted-foreground mt-1">Broadcast messages to all users</p>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Megaphone className="h-4 w-4" />
          Announcement Banner
        </h3>

        {banner && (
          <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-start gap-2">
            <Badge variant="outline" className="border-primary/30 text-primary text-xs shrink-0">Live</Badge>
            <p className="text-sm">{banner}</p>
          </div>
        )}

        <div className="space-y-3">
          <Label>Banner Message</Label>
          <Textarea
            placeholder="Enter announcement text... Leave empty to hide the banner."
            value={banner}
            onChange={(e) => setBanner(e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            This banner will be displayed at the top of the dashboard for all users.
          </p>
          <div className="flex gap-2">
            <Button onClick={save} disabled={saving} className="gap-2">
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Banner"}
            </Button>
            {banner && (
              <Button
                variant="outline"
                onClick={() => { setBanner(""); save(); }}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear Banner
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
