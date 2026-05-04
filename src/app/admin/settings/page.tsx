import { getAllSettings } from "@/lib/settings";
import { AdminSettingsClient } from "./client";

export default async function AdminSettingsPage() {
  const settings = await getAllSettings();
  return <AdminSettingsClient initialSettings={settings} />;
}
