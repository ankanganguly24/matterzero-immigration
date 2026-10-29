import { NextRequest, NextResponse } from "next/server";
import { authorizeMatterWorkspace, isSameOrigin } from "@/lib/dashboard/matter-access";
import { getDb } from "@/lib/db";
import { matters } from "@/lib/db/schema";
import { createMatterSchema } from "@/lib/matters/validation";

function respond(status: number, error: string) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return respond(403, "Request origin was rejected.");
  const workspaceId = request.nextUrl.searchParams.get("workspace_id") ?? "";
  const access = await authorizeMatterWorkspace(workspaceId, "write");
  if (!access.ok) return respond(access.status, access.error);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return respond(400, "Enter valid matter details.");
  }
  const parsed = createMatterSchema.safeParse(body);
  if (!parsed.success)
    return respond(400, parsed.error.issues[0]?.message ?? "Check the matter details.");

  try {
    const [matter] = await getDb()
      .insert(matters)
      .values({
        workspaceId,
        firstName: parsed.data.first_name,
        lastName: parsed.data.last_name,
        email: parsed.data.email,
        petitionType: parsed.data.petition_type,
        sponsorEmployer: parsed.data.sponsor_employer,
        fieldOfEndeavor: parsed.data.field_of_endeavor,
        status: "intake",
        createdBy: access.userId,
      })
      .returning({ id: matters.id, updatedAt: matters.updatedAt });
    return NextResponse.json(
      { matter: { ...parsed.data, id: matter.id, status: "intake", updated_at: matter.updatedAt } },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return respond(
      503,
      "The matter could not be created. Check the database migration and try again.",
    );
  }
}
