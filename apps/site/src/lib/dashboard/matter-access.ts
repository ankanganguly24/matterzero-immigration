import "server-only";
import { getDashboardAccess, getWorkspaceMembershipRole } from "@/lib/dashboard/access";

export type MatterPermission = "read" | "write";
export type MatterApiAccess =
  | { ok: true; userId: string; email: string; role: string }
  | { ok: false; status: 401 | 403 | 404 | 503; error: string };

const workspaceIdPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function authorizeMatterWorkspace(
  workspaceId: string,
  permission: MatterPermission,
): Promise<MatterApiAccess> {
  if (!workspaceIdPattern.test(workspaceId)) {
    return { ok: false, status: 404, error: "Workspace not found." };
  }

  const access = await getDashboardAccess();
  if (!access.ok) {
    if (access.reason === "unauthenticated") {
      return { ok: false, status: 401, error: "Sign in to continue." };
    }
    return {
      ok: false,
      status: access.reason === "not_granted" ? 404 : 503,
      error:
        access.reason === "not_granted"
          ? "Workspace not found."
          : "Workspace access could not be verified. Try again shortly.",
    };
  }

  if (access.user.isSuperAdmin && access.user.aal !== "aal2") {
    return { ok: false, status: 403, error: "Complete admin authenticator verification." };
  }

  try {
    const role = await getWorkspaceMembershipRole(access.user.userId, workspaceId);
    if (!role) return { ok: false, status: 404, error: "Workspace not found." };

    const canRead = ["owner", "admin", "attorney", "paralegal"].includes(role);
    const canWrite = ["owner", "admin", "attorney"].includes(role);
    if ((permission === "read" && !canRead) || (permission === "write" && !canWrite)) {
      return {
        ok: false,
        status: 403,
        error:
          permission === "read"
            ? "You do not have access to matters in this workspace."
            : "Only workspace owners, admins, and attorneys can manage matters.",
      };
    }

    return { ok: true, userId: access.user.userId, email: access.user.email, role };
  } catch {
    return { ok: false, status: 503, error: "Workspace access could not be verified." };
  }
}

export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}
