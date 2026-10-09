import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { accessGrants } from "@/lib/db/schema";
import { enforceRateLimit } from "@/lib/security/rate-limit";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Request origin was rejected." }, { status: 403 });
  }

  try {
    const throttled = await enforceRateLimit(request, {
      scope: "auth-access-check",
      limit: 20,
      windowMs: 10 * 60 * 1000,
    });
    if (throttled) return throttled;
  } catch {
    return NextResponse.json(
      { error: "Request throttling is temporarily unavailable. Please try again shortly." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const email =
    typeof body === "object" && body !== null && "email" in body && typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";
  if (email.length > 254 || !emailPattern.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    const [grant] = await getDb()
      .select({ email: accessGrants.email })
      .from(accessGrants)
      .where(eq(accessGrants.email, email))
      .limit(1);

    if (!grant) {
      return NextResponse.json(
        { code: "access_not_configured" },
        { status: 403, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json({ allowed: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(
      { error: "We couldn’t verify access right now. Please try again shortly." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
