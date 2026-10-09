import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getSiteOrigin } from "@/lib/auth/site-origin";
import { createAdminClient } from "@/lib/supabase/admin";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { accessGrants, pilotRequests } from "@/lib/db/schema";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const authorization = await requireAdmin(request, true);
  if (authorization.error) return authorization.error;
  const { id } = await context.params;
  if (!uuidPattern.test(id))
    return NextResponse.json({ error: "Request not found." }, { status: 404 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Choose approve or decline." }, { status: 400 });
  }
  const action =
    typeof body === "object" && body !== null && "action" in body ? body.action : undefined;
  if (action !== "approve" && action !== "decline") {
    return NextResponse.json({ error: "Choose approve or decline." }, { status: 400 });
  }
  const appOrigin = action === "approve" ? getSiteOrigin(request.nextUrl.origin) : null;
  if (action === "approve" && !appOrigin) {
    return NextResponse.json(
      { error: "The MatterZero site URL is not configured. Set NEXT_PUBLIC_SITE_URL before approving requests." },
      { status: 503 },
    );
  }

  let pilotRequest;
  try {
    [pilotRequest] = await getDb()
      .select({ id: pilotRequests.id, email: pilotRequests.email, status: pilotRequests.status })
      .from(pilotRequests)
      .where(eq(pilotRequests.id, id))
      .limit(1);
  } catch {
    return NextResponse.json({ error: "Could not load the pilot request." }, { status: 503 });
  }
  if (!pilotRequest || pilotRequest.status !== "pending") {
    return NextResponse.json({ error: "This request is no longer pending." }, { status: 409 });
  }

  try {
    await getDb().transaction(async (tx) => {
      if (action === "approve") {
        await tx
          .insert(accessGrants)
          .values({
            email: pilotRequest.email,
            grantedBy: String(authorization.claims.email ?? "admin").toLowerCase(),
          })
          .onConflictDoUpdate({
            target: accessGrants.email,
            set: {
              grantedBy: String(authorization.claims.email ?? "admin").toLowerCase(),
              grantedAt: new Date(),
            },
          });
      }

      const [updated] = await tx
        .update(pilotRequests)
        .set({
          status: action === "approve" ? "approved" : "declined",
          reviewedAt: new Date(),
          reviewedBy: String(authorization.claims.email ?? "admin").toLowerCase(),
        })
        .where(and(eq(pilotRequests.id, id), eq(pilotRequests.status, "pending")))
        .returning({ id: pilotRequests.id });

      if (!updated) throw new Error("Pilot request is no longer pending.");
    });
  } catch {
    return NextResponse.json(
      {
        error:
          action === "approve"
            ? "The access grant and request review could not be saved. No invitation was sent."
            : "The request status could not be updated. It may already have been reviewed.",
      },
      { status: 503 },
    );
  }

  if (action === "approve") {
    try {
      const admin = createAdminClient();
      const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(pilotRequest.email, {
        redirectTo: new URL("/auth/confirm", appOrigin!).toString(),
      });
      if (inviteError)
        return NextResponse.json(
          {
            error: `The request is approved and access is granted, but the invitation failed: ${inviteError.message} You can retry it from the Invitations page.`,
          },
          { status: 503 },
        );
    } catch {
      return NextResponse.json(
        {
          error:
            "The request is approved and access is granted, but invitations are not configured. Check the server-only Supabase secret key, then retry from the Invitations page.",
        },
        { status: 503 },
      );
    }
  }
  return NextResponse.json(
    {
      message:
        action === "approve"
          ? `Approved and invited ${pilotRequest.email}.`
          : "Pilot request declined.",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
