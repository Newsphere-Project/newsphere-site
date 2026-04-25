# Newsphere site

The **public marketing and download site** for [Newsphere](https://newsphere.app) (or your deployed URL): a Vite + React + TypeScript single-page app. It is usually hosted on **GitHub Pages** and describes the product, legal pages (privacy, terms), contact, and **download** actions for the desktop app.

## Relationship to the desktop app

The **desktop application** (Tauri + React) is developed in a separate repository—commonly named **`Newsfeed`** under the same GitHub owner. That app repo:

- Publishes **macOS `.dmg`** files on branch **`main`** under `public/downloads/macos-arm64/` and `public/downloads/macos-x64/` (see its README and `/.github/workflows/`).
- Is the **canonical GitHub** link for code, issues, and building on **Windows** (self-build until a Windows release exists).

This site’s build wires download buttons to the **raw GitHub** URLs of those files. Set the app’s `owner/name` with environment variables (below) if your app repo is not `YOUR_ORG/Newsfeed`.

## Features (this repo)

- Landing page: hero, feature showcase, and download section.
- **macOS** — Two direct `.dmg` links (Apple Silicon and Intel) plus in-page copy.
- **Windows** — In-app page at `/download/windows` explaining how to **clone the repo and run `tauri build`** (no Windows installer is shipped yet).
- **GitHub Pages** — Workflow [`.github/workflows/deploy-github-pages.yml`](.github/workflows/deploy-github-pages.yml) builds and deploys on pushes to `main` (or manual dispatch). Configure the Pages source as **“GitHub Actions”** in the repository settings.
- **Base path** — If a `CNAME` file is present, the Vite `base` is `/` (custom domain at the site root). Otherwise it is `/<repository-name>/` for `username.github.io/<repo>/`.

## Environment variables (Vite)

| Variable | Purpose |
|----------|--------|
| `VITE_BASE_PATH` | Set by CI from `CNAME` / repo name; do not set locally unless you are debugging Pages paths. |
| `VITE_NEWSFEED_GITHUB_REPO` | `owner/name` of the app repo that hosts `public/downloads/.../Newsphere.dmg` on `main`. **CI default:** `NEWSFEED_GITHUB_REPO` **repository variable**, or `{{ owner }}/Newsfeed` from the site repo’s `github.repository_owner`. |
| `VITE_DOWNLOAD_MACOS_APPLE_SILICON` | Optional full URL; overrides the composed raw URL for the Apple Silicon DMG. |
| `VITE_DOWNLOAD_MACOS_INTEL` | Optional full URL; overrides the composed raw URL for the Intel DMG. |
| `VITE_GITHUB_URL` | Full `https://github.com/owner/repo` for “GitHub” links; **set in CI** to the app repository by default. |
| `VITE_DOWNLOAD_WEB` | Optional web app URL (placeholder in the home template). |
| `VITE_SUPPORT_EMAIL` | Shown on contact, privacy, and terms. |

For local dev without `.env`, `config.ts` uses placeholders such as `your-org/Newsfeed`—add a `.env` with `VITE_NEWSFEED_GITHUB_REPO=owner/Newsfeed` so download links resolve.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run build:gh   # `build` + copy `index.html` to `404.html` for GitHub Pages client-side routing
```

## Roadmap (site)

- Update download copy when **Windows** installers ship.
- Optional **release** channel links (e.g. GitHub Releases) if artifacts move out of `main`.
- Keep legal and contact information aligned with the product.

## License

Private / your choice; align with the Newsphere product and the desktop app repository.
