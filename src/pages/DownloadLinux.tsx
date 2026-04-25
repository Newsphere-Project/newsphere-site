import { Link } from "react-router-dom";
import { GITHUB_URL } from "../config";
import { PageSection, PageShell } from "../components/PageShell";

const linkClass =
  "text-fg underline decoration-border underline-offset-4 transition-colors hover:decoration-fg-muted";
const codeClass =
  "bg-hover text-fg border-border rounded-md border px-1.5 py-0.5 font-mono text-[0.9em]";

export default function DownloadLinux() {
  const cloneUrl = `${GITHUB_URL.replace(/\/$/, "")}.git`;

  return (
    <PageShell
      eyebrow="Download"
      title="Build Newsphere on Linux"
      lede="We do not ship a Linux AppImage or .deb yet. Build the open-source desktop app from the repository on GitHub—the same Tauri + Vite + Rust project as on macOS and Windows."
    >
      <PageSection heading="What you need">
        <p>
          Follow the official{" "}
          <a
            href="https://v2.tauri.app/start/prerequisites/"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Tauri prerequisites for Linux
          </a>{" "}
          (WebKit GTK, system libraries, Rust, and Node). Use an LTS version of{" "}
          <a
            href="https://nodejs.org/"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Node.js
          </a>{" "}
          (20+ is recommended; match whatever the repo uses).
        </p>
      </PageSection>

      <PageSection heading="Get the code">
        <p>Clone the public application repository:</p>
        <p>
          <code className={codeClass}>git clone {cloneUrl}</code>
        </p>
        <p>
          From the new folder, install dependencies with{" "}
          <code className={codeClass}>npm ci</code> (or{" "}
          <code className={codeClass}>npm install</code>).
        </p>
      </PageSection>

      <PageSection heading="Build the desktop app">
        <p>
          From the repository root, run the Tauri build. This compiles the Rust
          backend and bundles the Vite front end. Output usually appears under{" "}
          <code className={codeClass}>src-tauri/target/…/release/bundle</code> as
          an AppImage, <code className={codeClass}>.deb</code>, or other formats
          depending on your Tauri bundle config.
        </p>
        <p>
          <code className={codeClass}>npm run tauri build</code>
        </p>
        <p>
          For a faster dev loop, use{" "}
          <code className={codeClass}>npm run tauri dev</code> to run the app
          with the Vite dev server.
        </p>
      </PageSection>

      <PageSection heading="CI and other platforms">
        <p>
          The macOS <code className={codeClass}>.dmg</code> files on the home
          page are built in GitHub Actions. Windows and Linux release jobs can be
          added the same way when you are ready to publish installers.
        </p>
        <p>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Open the repository on GitHub
          </a>{" "}
          for workflows, issues, and the Windows self-build guide.
        </p>
      </PageSection>

      <PageSection heading="Back to downloads">
        <p>
          <Link to="/#downloads" className={linkClass}>
            Return to the download section
          </Link>{" "}
          on the home page.
        </p>
      </PageSection>
    </PageShell>
  );
}
