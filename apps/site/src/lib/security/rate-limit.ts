import "server-only";
import { createHmac } from "node:crypto";
import { lt, sql } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { apiRateLimits } from "@/lib/db/schema";

const dayInMs = 24 * 60 * 60 * 1000;
const cleanupIntervalMs = 60 * 60 * 1000;
const globalForRateLimitCleanup = globalThis as typeof globalThis & {
  matterZeroRateLimitCleanupAt?: number;
};

type RateLimit = {
  scope: string;
  limit: number;
  windowMs: number;
};

function getClientIp(request: NextRequest) {
  const forwarded =
    request.headers.get("x-vercel-forwarded-for") ?? request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",", 1)[0]?.trim();
  if (ip) return ip;
  if (process.env.NODE_ENV === "development") return "local-development";
  throw new Error("Vercel client IP header is unavailable.");
}

export async function enforceRateLimit(
  request: NextRequest,
  { scope, limit, windowMs }: RateLimit,
) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowMs);
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("Set DATABASE_URL before using request throttling.");

  const identifier = createHmac("sha256", databaseUrl)
    .update(`${scope}:${getClientIp(request)}`)
    .digest("hex");
  const db = getDb();

  // Clean up at most hourly per warm instance; only HMACs, never raw IPs, are stored.
  if (
    !globalForRateLimitCleanup.matterZeroRateLimitCleanupAt ||
    now.getTime() - globalForRateLimitCleanup.matterZeroRateLimitCleanupAt >= cleanupIntervalMs
  ) {
    globalForRateLimitCleanup.matterZeroRateLimitCleanupAt = now.getTime();
    try {
      await db
        .delete(apiRateLimits)
        .where(lt(apiRateLimits.expiresAt, new Date(now.getTime() - dayInMs)));
    } catch (error) {
      globalForRateLimitCleanup.matterZeroRateLimitCleanupAt = 0;
      throw error;
    }
  }

  const [bucket] = await db
    .insert(apiRateLimits)
    .values({ key: identifier, requestCount: 1, expiresAt })
    .onConflictDoUpdate({
      target: apiRateLimits.key,
      set: {
        requestCount: sql`case
          when ${apiRateLimits.expiresAt} <= now() then 1
          else least(${apiRateLimits.requestCount} + 1, ${limit + 1})
        end`,
        expiresAt: sql`case
          when ${apiRateLimits.expiresAt} <= now()
            then now() + (${windowMs} * interval '1 millisecond')
          else ${apiRateLimits.expiresAt}
        end`,
      },
    })
    .returning({ requestCount: apiRateLimits.requestCount, expiresAt: apiRateLimits.expiresAt });

  if (!bucket) throw new Error("Could not update the request throttle.");
  if (bucket.requestCount <= limit) return null;

  const retryAfter = Math.max(1, Math.ceil((bucket.expiresAt.getTime() - now.getTime()) / 1000));
  return NextResponse.json(
    { error: "Too many requests. Please wait before trying again." },
    {
      status: 429,
      headers: {
        "Cache-Control": "no-store",
        "Retry-After": String(retryAfter),
      },
    },
  );
}
