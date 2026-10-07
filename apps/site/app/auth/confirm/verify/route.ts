import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const allowedTypes = new Set<EmailOtpType>(["email", "magiclink", "invite"]);

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const tokenHash = formData.get("token_hash");
  const rawType = formData.get("type");

  if (
    typeof tokenHash !== "string" ||
    typeof rawType !== "string" ||
    !allowedTypes.has(rawType as EmailOtpType)
  ) {
    return NextResponse.redirect(new URL("/login?error=link", request.url), 303);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: rawType as EmailOtpType,
  });
  if (error) {
    return NextResponse.redirect(new URL("/login?error=link", request.url), 303);
  }

  return NextResponse.redirect(new URL("/auth/complete", request.url), 303);
}
