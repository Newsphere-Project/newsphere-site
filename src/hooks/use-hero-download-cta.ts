import { useState } from "react";

import { GITHUB_URL, SITE_ROUTES } from "../config";
import { getClientOsKind, getMacDmgUrl } from "../lib/client-os";

export type HeroDownloadCta =
  | { status: "ready"; kind: "windows"; label: string; to: string }
  | { status: "ready"; kind: "linux"; label: string; to: string }
  | { status: "ready"; kind: "mac"; label: string; href: string }
  | { status: "ready"; kind: "other"; label: string; href: string };

function buildHeroDownloadCta(): HeroDownloadCta {
  if (typeof window === "undefined") {
    return {
      status: "ready",
      kind: "other",
      label: "Get Newsphere",
      href: GITHUB_URL,
    };
  }
  const os = getClientOsKind();
  if (os === "windows") {
    return {
      status: "ready",
      kind: "windows",
      label: "Build for Windows",
      to: SITE_ROUTES.windowsBuild,
    };
  }
  if (os === "linux") {
    return {
      status: "ready",
      kind: "linux",
      label: "Build for Linux",
      to: SITE_ROUTES.linuxBuild,
    };
  }
  if (os === "mac") {
    return {
      status: "ready",
      kind: "mac",
      label: "Download for macOS",
      href: getMacDmgUrl(),
    };
  }
  return {
    status: "ready",
    kind: "other",
    label: "View on GitHub",
    href: GITHUB_URL,
  };
}

/**
 * Hero primary CTA: direct .dmg, in-app build route, or GitHub (never #downloads).
 * Initialized once on the client; no effect / layout shift.
 */
export function useHeroDownloadCta(): HeroDownloadCta {
  const [cta] = useState(() => buildHeroDownloadCta());
  return cta;
}
