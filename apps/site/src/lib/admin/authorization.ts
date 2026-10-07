import "server-only";

export function isMatterZeroAdmin(email: unknown) {
  const configuredEmail = process.env.MATTERZERO_ADMIN_EMAIL?.trim().toLowerCase();
  return (
    Boolean(configuredEmail) &&
    typeof email === "string" &&
    email.trim().toLowerCase() === configuredEmail
  );
}
