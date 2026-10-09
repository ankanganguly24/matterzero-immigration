import "server-only";

export function getSiteOrigin(developmentOrigin?: string) {
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const origin =
    configuredOrigin ||
    (process.env.NODE_ENV === "development" ? developmentOrigin : undefined);
  if (!origin) return null;

  try {
    const url = new URL(origin);
    const isDevelopmentHttp = process.env.NODE_ENV === "development" && url.protocol === "http:";
    if (url.protocol !== "https:" && !isDevelopmentHttp) return null;
    return url.origin;
  } catch {
    return null;
  }
}
