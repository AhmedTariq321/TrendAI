"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Settings, Save } from "lucide-react";

export function AdminSettingsClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);

  const update = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("Settings saved!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">App Settings</h2>
          <p className="text-muted-foreground mt-1">Control app-wide configuration</p>
        </div>
        <Button onClick={save} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* General */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Settings className="h-4 w-4" />
          General
        </h3>
        <div className="space-y-4">
          <div>
            <Label>App Name</Label>
            <Input
              value={settings.app_name ?? "TrendPilot AI"}
              onChange={(e) => update("app_name", e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Daily Generation Limit (per user)</Label>
            <Input
              type="number"
              value={settings.daily_limit ?? "50"}
              onChange={(e) => update("daily_limit", e.target.value)}
              className="mt-1.5"
              min="1"
              max="1000"
            />
          </div>
        </div>
      </Card>

      {/* Maintenance & Announcement */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Status & Announcements</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <Label className="cursor-pointer">Maintenance Mode</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Block all user access (admin still works)
              </p>
            </div>
            <Switch
              checked={settings.maintenance_mode === "true"}
              onCheckedChange={(v) => update("maintenance_mode", v ? "true" : "false")}
            />
          </div>
          <div>
            <Label>Announcement Banner</Label>
            <Input
              placeholder="Leave empty to hide. e.g. 'We're upgrading our systems on Sunday...'"
              value={settings.announcement_banner ?? ""}
              onChange={(e) => update("announcement_banner", e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>
      </Card>

      {/* Feature toggles */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Feature Toggles</h3>
        <div className="space-y-3">
          {[
            { key: "feature_viral_ideas", label: "Viral Ideas Generator" },
            { key: "feature_captions", label: "Caption Generator" },
            { key: "feature_hooks", label: "Hook Generator" },
            { key: "feature_hashtags", label: "Hashtag Generator" },
            { key: "feature_planner", label: "Growth Planner" },
          ].map(({ key, label }) => (
            <div key={key}>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <Label className="cursor-pointer">{label}</Label>
                <Switch
                  checked={settings[key] !== "false"}
                  onCheckedChange={(v) => update(key, v ? "true" : "false")}
                />
              </div>
              <Separator className="my-1 opacity-0" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
