import { NextResponse, type NextRequest } from "next/server";
import { isMatterZeroAdmin } from "@/lib/admin/authorization";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(body: object, status: number) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return jsonResponse({ error: "Request origin was rejected." }, 403);
  }

  const sessionClient = await createClient();
  const { data, error: claimsError } = await sessionClient.auth.getClaims();
  const claims = data?.claims;

  if (claimsError || !claims?.sub) {
    return jsonResponse({ error: "Sign in to continue." }, 401);
  }
  if (!isMatterZeroAdmin(claims.email)) {
    return jsonResponse({ error: "You are not authorized to invite users." }, 404);
  }
  if (claims.aal !== "aal2") {
    return jsonResponse({ error: "Complete authenticator verification to continue." }, 403);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Enter a valid email address." }, 400);
  }

  const email =
    typeof body === "object" && body !== null && "email" in body && typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";
  if (email.length > 254 || !emailPattern.test(email)) {
    return jsonResponse({ error: "Enter a valid email address." }, 400);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    return jsonResponse({ error: "The MatterZero site URL is not configured." }, 503);
  }

  try {
    const adminClient = createAdminClient();
    const { error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      redirectTo: new URL("/auth/confirm", siteUrl).toString(),
    });

    if (inviteError) {
      return jsonResponse({ error: inviteError.message }, 400);
    }
  } catch {
    return jsonResponse(
      { error: "Invitations are not configured. Check the server-only Supabase secret key." },
      503,
    );
  }

  return jsonResponse({ message: `Invitation sent to ${email}.` }, 200);
}
