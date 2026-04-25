import { DOWNLOAD_URLS } from "../config";

export type ClientOsKind = "windows" | "mac" | "linux" | "other";

/**
 * Best-effort OS from `navigator` (no server / only runs in the browser).
 * iOS / iPadOS / Android are "other" so we do not offer a desktop .dmg or
 * a desktop-only build page on phones.
 */
export function getClientOsKind(): ClientOsKind {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  const platform = navigator.platform;
  if (/iPhone|iPad|iPod/i.test(ua)) return "other";
  if (/Android/i.test(ua)) return "other";
  if (/Win32|Win64|Windows|WV|Windows/i.test(ua) || /Win/i.test(platform)) {
    return "windows";
  }
  if (/Mac|Macintosh|Mac OS X/i.test(ua) || /Mac/.test(platform)) {
    return "mac";
  }
  if (
    /Linux|X11|Ubuntu|Debian|Fedora|openSUSE|CrOS/i.test(ua) ||
    /Linux/.test(platform)
  ) {
    return "linux";
  }
  return "other";
}

/**
 * Pick Apple Silicon vs Intel .dmg from the user agent. Defaults to the
 * arm64 build when unknown (most new Macs; Intel UA is still common on
 * Apple Silicon for compatibility, so "Intel Mac OS X" is the main signal
 * for the x64 DMG).
 */
export function getMacDmgUrl(): string {
  if (typeof navigator === "undefined") {
    return DOWNLOAD_URLS.macosAppleSilicon;
  }
  const ua = navigator.userAgent;
  if (/Intel Mac OS X/i.test(ua)) {
    return DOWNLOAD_URLS.macosIntel;
  }
  return DOWNLOAD_URLS.macosAppleSilicon;
}
