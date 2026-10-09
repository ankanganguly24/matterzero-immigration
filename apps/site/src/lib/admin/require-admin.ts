import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { isMatterZeroAdmin } from "./authorization";
import { createClient } from "@/lib/supabase/server";

export type AdminAuthorization =
  { claims: Record<string, unknown>; error: null } | { claims: null; error: NextResponse };

export async function requireAdmin(
  request: NextRequest,
  requireOrigin = false,
): Promise<AdminAuthorization> {
  const json = (message: string, status: number) =>
    NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });

  if (requireOrigin && request.headers.get("origin") !== request.nextUrl.origin) {
    return { claims: null, error: json("Request origin was rejected.", 403) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (error || !claims?.sub) return { claims: null, error: json("Sign in to continue.", 401) };
  if (!isMatterZeroAdmin(claims.email)) return { claims: null, error: json("Not found.", 404) };
  if (claims.aal !== "aal2") {
    return { claims: null, error: json("Complete authenticator verification to continue.", 403) };
  }

  return { claims: claims as Record<string, unknown>, error: null };
}
