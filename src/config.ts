/** Replace with your release URLs or set VITE_* in `.env`. */
export const DOWNLOAD_URLS = {
  macos:
    import.meta.env.VITE_DOWNLOAD_MACOS ??
    "https://github.com/your-org/newsphere/releases/latest",
  windows:
    import.meta.env.VITE_DOWNLOAD_WINDOWS ??
    "https://github.com/your-org/newsphere/releases/latest",
  web: import.meta.env.VITE_DOWNLOAD_WEB ?? "https://app.example.com",
} as const;

export const GITHUB_URL =
  import.meta.env.VITE_GITHUB_URL ??
  "https://github.com/your-org/newsphere";
