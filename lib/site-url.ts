export const productionSiteUrl = "https://lunaeria.vercel.app";

export function getSiteUrl() {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const isLocalhost =
    configuredSiteUrl?.includes("localhost") ||
    configuredSiteUrl?.includes("127.0.0.1");
  const siteUrl =
    process.env.NODE_ENV === "production" && isLocalhost
      ? productionSiteUrl
      : configuredSiteUrl || productionSiteUrl;

  return siteUrl.replace(/\/$/, "");
}
