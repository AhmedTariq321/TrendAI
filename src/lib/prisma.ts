import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function createPrismaClient() {
  let connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL environment variable is not set");

  // Strip sslmode from URL — pg v8 treats sslmode=require as verify-full which
  // rejects Supabase's self-signed cert. We handle SSL programmatically instead.
  connectionString = connectionString.replace(/[?&]sslmode=[^&]*/g, "").replace(/\?$/, "");

  const isSupabase = connectionString.includes("supabase.com");
  const pool = new Pool({
    connectionString,
    ssl: isSupabase ? ({ rejectUnauthorized: false } as object) : false,
    max: 1,
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
