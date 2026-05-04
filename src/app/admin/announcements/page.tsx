import { getSetting } from "@/lib/settings";
import { AnnouncementsClient } from "./client";

export default async function AnnouncementsPage() {
  const current = await getSetting("announcement_banner");
  return <AnnouncementsClient currentBanner={current} />;
}
