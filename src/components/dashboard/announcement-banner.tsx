import { getSetting } from "@/lib/settings";
import { Megaphone, X } from "lucide-react";

export async function AnnouncementBanner() {
  const banner = await getSetting("announcement_banner");
  if (!banner) return null;

  return (
    <div className="bg-primary/10 border-b border-primary/20 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
        <Megaphone className="h-4 w-4 text-primary shrink-0" />
        <p className="flex-1 text-primary">{banner}</p>
      </div>
    </div>
  );
}
