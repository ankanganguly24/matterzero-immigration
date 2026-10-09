import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getSiteOrigin } from "@/lib/auth/site-origin";
import { getDb } from "@/lib/db";
import { accessGrants } from "@/lib/db/schema";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const authorization = await requireAdmin(request, true);
  if (authorization.error) return authorization.error;
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
  const appOrigin = getSiteOrigin(request.nextUrl.origin);
  if (!appOrigin)
    return NextResponse.json(
      { error: "The MatterZero site URL is not configured. Set NEXT_PUBLIC_SITE_URL before sending invitations." },
      { status: 503 },
    );
  try {
    await getDb()
      .insert(accessGrants)
      .values({
        email,
        grantedBy: String(authorization.claims.email ?? "admin").toLowerCase(),
      })
      .onConflictDoUpdate({
        target: accessGrants.email,
        set: {
          grantedBy: String(authorization.claims.email ?? "admin").toLowerCase(),
          grantedAt: new Date(),
        },
      });
  } catch {
    return NextResponse.json(
      {
        error:
          "The access grant could not be saved. Check DATABASE_URL before sending the invitation.",
      },
      { status: 503 },
    );
  }

  try {
    const admin = createAdminClient();
    const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: new URL("/auth/confirm", appOrigin).toString(),
    });
    if (inviteError)
      return NextResponse.json(
        {
          error: `Access is granted, but the invitation failed: ${inviteError.message} Check the email and retry.`,
        },
        { status: 503 },
      );
    return NextResponse.json(
      { message: `Invitation sent to ${email}.` },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "Access is granted, but invitations are not configured. Check the server-only Supabase secret key, then retry.",
      },
      { status: 503 },
    );
  }
}
