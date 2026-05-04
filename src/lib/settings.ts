import { prisma } from "./prisma";

const DEFAULTS: Record<string, string> = {
  app_name: "TrendPilot AI",
  daily_limit: "50",
  maintenance_mode: "false",
  announcement_banner: "",
  feature_viral_ideas: "true",
  feature_captions: "true",
  feature_hooks: "true",
  feature_hashtags: "true",
  feature_planner: "true",
};

export async function getSetting(key: string): Promise<string> {
  try {
    const setting = await prisma.appSettings.findUnique({ where: { key } });
    return setting?.value ?? DEFAULTS[key] ?? "";
  } catch {
    return DEFAULTS[key] ?? "";
  }
}

export async function getAllSettings(): Promise<Record<string, string>> {
  try {
    const settings = await prisma.appSettings.findMany();
    const map: Record<string, string> = { ...DEFAULTS };
    for (const s of settings) map[s.key] = s.value;
    return map;
  } catch {
    return { ...DEFAULTS };
  }
}

export async function setSetting(key: string, value: string): Promise<void> {
  await prisma.appSettings.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}
