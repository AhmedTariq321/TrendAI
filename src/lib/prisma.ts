import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL environment variable is not set");

  const isSupabase = connectionString.includes("supabase.com");
  const pool = new Pool({
    connectionString,
    // sslmode=require in URL causes pg to verify the cert chain (self-signed fails).
    // Handle SSL entirely here instead so rejectUnauthorized:false is respected.
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
