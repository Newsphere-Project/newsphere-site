/**
 * `VITE_NEWSFEED_GITHUB_REPO` is the `owner/name` of the **desktop app** repo
 * that publishes installers under `public/downloads/` on `main` (the Newsfeed / Tauri app).
 * Override per environment or fork as needed. Defaults to this GitHub org/user + `Newsfeed`.
 */
const newsfeedRepo =
  import.meta.env.VITE_NEWSFEED_GITHUB_REPO ?? "your-org/Newsfeed";

const rawDownloadsBase = `https://raw.githubusercontent.com/${newsfeedRepo}/main/public/downloads`;

export const DOWNLOAD_URLS = {
  macosAppleSilicon:
    import.meta.env.VITE_DOWNLOAD_MACOS_APPLE_SILICON ??
    `${rawDownloadsBase}/macos-arm64/Newsphere.dmg`,
  macosIntel:
    import.meta.env.VITE_DOWNLOAD_MACOS_INTEL ??
    `${rawDownloadsBase}/macos-x64/Newsphere.dmg`,
  web: import.meta.env.VITE_DOWNLOAD_WEB ?? "https://app.example.com",
} as const;

/** In-app route (no host); use with `Link` for the Windows self-build guide. */
export const SITE_ROUTES = {
  windowsBuild: "/download/windows",
} as const;

export const GITHUB_URL =
  import.meta.env.VITE_GITHUB_URL ??
  "https://github.com/your-org/newsphere";
