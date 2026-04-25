import { Link } from "react-router-dom";
import { GITHUB_URL } from "../config";
import { PageSection, PageShell } from "../components/PageShell";

const linkClass =
  "text-fg underline decoration-border underline-offset-4 transition-colors hover:decoration-fg-muted";
const codeClass =
  "bg-hover text-fg border-border rounded-md border px-1.5 py-0.5 font-mono text-[0.9em]";

export default function DownloadWindows() {
  const cloneUrl = `${GITHUB_URL.replace(/\/$/, "")}.git`;

  return (
    <PageShell
      eyebrow="Download"
      title="Build Newsphere on Windows"
      lede="We do not ship a Windows installer yet. Build the open-source desktop app from the repository on GitHub—it uses the same Tauri + Vite stack as the macOS app."
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
            Tauri prerequisites for Windows
          </a>{" "}
          (Microsoft C++ build tools, WebView2, Rust, and Node). Use an LTS
          version of{" "}
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
        <p>
          The application lives in the same public repo linked from this site. Clone it:
        </p>
        <p>
          <code className={codeClass}>git clone {cloneUrl}</code>
        </p>
        <p>
          Open the new folder, then install JavaScript dependencies with{" "}
          <code className={codeClass}>npm ci</code> (or <code className={codeClass}>npm install</code>).
        </p>
      </PageSection>

      <PageSection heading="Build the desktop app">
        <p>
          From the repository root, run the Tauri build. This compiles the Rust
          backend and bundles the Vite front end into a Windows installer under{" "}
          <code className={codeClass}>src-tauri/target/…/release/bundle</code>{" "}
          (e.g. <code className={codeClass}>.exe</code> or{" "}
          <code className={codeClass}>.msi</code> depending on your Tauri bundle settings).
        </p>
        <p>
          <code className={codeClass}>npm run tauri build</code>
        </p>
        <p>
          For a faster inner loop, use <code className={codeClass}>npm run tauri dev</code> to run
          the app with the dev server.
        </p>
      </PageSection>

      <PageSection heading="CI and updates">
        <p>
          The macOS builds you see on the home page are produced by a GitHub
          Actions workflow in that repository: it compiles for Apple Silicon and
          Intel, then commits the <code className={codeClass}>.dmg</code> files to{" "}
          <code className={codeClass}>public/downloads/</code> on{" "}
          <code className={codeClass}>main</code>. A Windows job can be added
          the same way when you are ready to publish installers.
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
          to browse workflows, file issues, or suggest changes.
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
