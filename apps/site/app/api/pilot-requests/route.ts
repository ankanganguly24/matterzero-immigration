import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getDb } from "@/lib/db";
import { pilotRequests } from "@/lib/db/schema";
import { getSupabaseConfig } from "@/lib/supabase/config";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Request origin was rejected." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter a work email and organization." }, { status: 400 });
  }

  const email =
    typeof body === "object" && body !== null && "email" in body && typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";
  const organization =
    typeof body === "object" &&
    body !== null &&
    "organization" in body &&
    typeof body.organization === "string"
      ? body.organization.trim()
      : "";
  if (
    email.length > 254 ||
    !emailPattern.test(email) ||
    !organization ||
    organization.length > 120
  ) {
    return NextResponse.json(
      { error: "Enter a valid work email and organization." },
      { status: 400 },
    );
  }

  try {
    const [existingRequest] = await getDb()
      .select({ id: pilotRequests.id })
      .from(pilotRequests)
      .where(eq(pilotRequests.email, email))
      .limit(1);
    if (existingRequest) {
      return NextResponse.json(
        { error: "A pilot request has already been submitted with this email. Contact MatterZero if you need to update it." },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    }

    const { url, key } = getSupabaseConfig();
    const supabase = createSupabaseClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error } = await supabase.from("pilot_requests").insert({ email, organization });
    if (error?.code === "23505") {
      return NextResponse.json(
        { error: "A pilot request has already been submitted with this email. Contact MatterZero if you need to update it." },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    }
    if (error) throw error;
    return NextResponse.json(
      { message: "Thanks. Your request has been received." },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Pilot requests are temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }
}
