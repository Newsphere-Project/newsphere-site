import { useEffect, useState, type SVGProps } from "react";
import { DOWNLOAD_URLS, GITHUB_URL } from "./config";
import { DitherFilterDefs } from "./components/DitherFilterDefs";
import { ExpandableFeaturePreview } from "./components/ExpandableFeaturePreview";
import { HeroGridCrossfade } from "./components/HeroGridCrossfade";
import { MediaPlaceholder } from "./components/MediaPlaceholder";

const githubPillClassName =
  "border-border text-fg-muted hover:border-[rgba(8,9,10,0.15)] hover:bg-hover hover:text-fg-secondary inline-flex cursor-pointer items-center gap-2 rounded-[99px] border bg-transparent px-2.5 py-2 text-sm transition-colors duration-200 no-underline [&_svg]:shrink-0 [&_svg]:text-current";

function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function GitHubPillLink() {
  return (
    <a
      href={GITHUB_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={githubPillClassName}
      aria-label="Newsphere on GitHub"
    >
      <GitHubIcon />
      <span>GitHub</span>
    </a>
  );
}

type FeatureCell = {
  title: string;
  body: string;
  image: string;
  /** Frozen background frame for this card (distinct per preview). */
  videoFrameSec: number;
  /** Distinct crop for the still frame (CSS `object-position`). */
  videoObjectPosition: string;
};

/** Newest reader hero asset in /public/images (filename from macOS screenshot). */
const READER_SECTION_IMAGE = `/images/${encodeURIComponent("Screenshot 2026-04-17 at 8.15.45\u202fPM.png")}`;

const FEATURE_ROWS: FeatureCell[][] = [
  [
    {
      title: "Skim the headline grid",
      body: "Topic pages show feeds in parallel columns, source stacks, and View more when you want the rest of a list.",
      image: "/images/screenshot-03.png",
      videoFrameSec: 0.5,
      videoObjectPosition: "0% 18%",
    },
    {
      title: "Shape each page’s grid",
      body: "In Settings, arrange pages and rows of feeds: section labels, drag-and-drop order, and columns you can edit until the home grid matches how you browse.",
      image: "/images/screenshot-09.png",
      videoFrameSec: 1,
      videoObjectPosition: "100% 22%",
    },
    {
      title: "History you can search",
      body: "Reopen articles from a chronological history—titles, sources, publish and viewed times, plus search so you can find that piece you read last week.",
      image: "/images/screenshot-07.png",
      videoFrameSec: 1.5,
      videoObjectPosition: "48% 0%",
    },
  ],
  [
    {
      title: "Latest across your page",
      body: "A single stream of the newest articles from every feed on the page—newest first, with snippets and one-tap actions on each row.",
      image: "/images/screenshot-05.png",
      videoFrameSec: 2,
      videoObjectPosition: "14% 72%",
    },
    {
      title: "Bookmarks in one list",
      body: "Save articles for later and browse them together—source, publish and saved times, plus search and quick actions on every item.",
      image: "/images/screenshot-06.png",
      videoFrameSec: 2.5,
      videoObjectPosition: "92% 58%",
    },
    {
      title: "Add feeds from the catalog",
      body: "Search by topic or name, pick from hundreds of listed feeds, or paste a custom URL when you need something that isn’t in the catalog.",
      image: "/images/screenshot-08.png",
      videoFrameSec: 3,
      videoObjectPosition: "52% 100%",
    },
  ],
];

export default function App() {
  const [expanded, setExpanded] = useState<{ src: string; title: string } | null>(
    null,
  );

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(null);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [expanded]);

  return (
    <div className="text-fg mx-auto flex w-full flex-col items-center gap-8 bg-[linear-gradient(180deg,#fff_0%,var(--color-offwhite)_100%)] px-4 sm:px-6 md:px-8 lg:px-10">
      <DitherFilterDefs />
      <section
        id="hero"
        className="flex w-full flex-col items-center gap-12 pt-20 pb-12 max-md:gap-6 max-md:pt-16 max-md:pb-12"
      >
        <div className="flex w-full flex-col items-center justify-center gap-16 max-md:gap-[88px]">
          <div className="flex w-full max-w-[1080px] flex-col items-center gap-6 text-center max-md:gap-8">
            <nav className="flex w-full items-center justify-center">
              <a
                href="/"
                className="text-fg flex items-center gap-4 no-underline"
                aria-label="Newsphere home"
              >
                <img
                  src="/logo.svg"
                  alt=""
                  width={56}
                  height={56}
                  className="block size-14 shrink-0 max-md:size-12"
                />
                <span className="font-serif text-3xl tracking-[-0.02em] max-md:text-2xl">
                  Newsphere
                </span>
              </a>
            </nav>

            <div className="flex w-full flex-col items-center gap-10 max-md:gap-8">
              <div className="flex w-full max-w-[640px] flex-col gap-4">
                <h1 className="text-[40px] leading-[1.08] tracking-[-0.03em] text-fg max-md:text-[32px]">
                  Your news, one calm surface.
                </h1>
                <p className="text-fg-secondary text-lg leading-[1.35] tracking-[-0.01em] max-md:text-base max-md:tracking-[-0.02em]">
                  Newsphere is a desktop reader and workspace for feeds and
                  focus—without the noise of the open web.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 max-md:gap-2.5">
                <a
                  href={DOWNLOAD_URLS.macos}
                  className="inline-flex cursor-pointer items-center justify-center rounded-full bg-black px-3.5 py-2.5 text-sm leading-none tracking-[-0.01em] whitespace-nowrap text-white transition-opacity duration-200 hover:opacity-85"
                >
                  Download for macOS
                </a>
                <GitHubPillLink />
              </div>
            </div>
          </div>

          <div className="flex w-full max-w-[1400px] flex-col items-center max-lg:max-w-full">
            <HeroGridCrossfade className="max-w-full" />
          </div>
        </div>
      </section>

      <div
        id="features"
        className="flex w-full max-w-[1440px] flex-col items-center gap-12 overflow-clip py-16 max-md:gap-12 max-md:py-12"
      >
        <section className="mb-4 flex w-full flex-col items-center gap-3 overflow-hidden p-0">
          <div className="flex w-full max-w-[1080px] flex-col items-start gap-4 text-left">
            <div className="flex w-full flex-col items-start gap-3">
              <p className="text-fg-muted bg-border-subtle inline-block rounded-full px-2.5 py-1 text-xs tracking-[-0.01em]">
                Reader
              </p>
              <h2 className="text-fg text-2xl leading-[1.2] tracking-[-0.02em] max-md:text-xl">
                Full articles in a centered column—minimal chrome, quiet type, and a toolbar that stays out of the text.
              </h2>
            </div>
          </div>
          <div className="mt-2 w-full max-w-[1080px]">
            <MediaPlaceholder
              backgroundVideoFrameSec={0}
              backgroundVideoObjectPosition="50% 42%"
              imageSrc={READER_SECTION_IMAGE}
              label="Article open in the reader with navigation and actions above the text"
            />
          </div>
        </section>

        <div className="flex w-full max-w-[1080px] flex-col items-start gap-2">
          <h2 className="text-fg text-2xl leading-[1.2] tracking-[-0.02em] max-md:text-xl">
            How your grid, feeds, bookmarks, and sources connect in one reader.
          </h2>
        </div>

        {FEATURE_ROWS.map((row, rowIndex) => (
          <section key={rowIndex} className="flex w-full justify-center">
            <div className="flex w-full max-w-[1080px] flex-row gap-9 max-lg:flex-col max-md:flex-col">
              {row.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-1 flex-col items-center gap-4 max-lg:w-full max-lg:flex-none max-md:w-full max-md:flex-none"
                >
                  <ExpandableFeaturePreview
                    backgroundVideoFrameSec={item.videoFrameSec}
                    backgroundVideoObjectPosition={item.videoObjectPosition}
                    imageSrc={item.image}
                    title={item.title}
                    onExpand={() =>
                      setExpanded({ src: item.image, title: item.title })
                    }
                  />
                  <div className="flex w-full flex-col items-start gap-1.5 px-1">
                    <h3 className="text-fg text-lg leading-tight tracking-[-0.02em] max-md:text-base">
                      {item.title}
                    </h3>
                    <p className="text-fg-muted text-base leading-tight break-words">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section
        id="downloads"
        className="flex w-full max-w-[1080px] flex-col items-center gap-8 pt-8 pb-16"
      >
        <h2 className="text-fg text-center text-2xl leading-none tracking-[-0.01em]">
          Download
        </h2>

        <div className="grid w-full max-w-[720px] gap-3 sm:grid-cols-2">
          <a
            href={DOWNLOAD_URLS.macos}
            className="border-border bg-raised flex flex-col gap-3 rounded-2xl border p-6 transition-shadow hover:shadow-sm"
          >
            <span className="text-fg-muted bg-hover inline-block w-fit rounded-full px-2.5 py-1 text-sm">
              macOS
            </span>
            <span className="text-fg text-lg">Apple Silicon & Intel</span>
            <span className="text-fg-secondary text-sm">
              .dmg installer — drag to Applications.
            </span>
          </a>
          <a
            href={DOWNLOAD_URLS.windows}
            className="border-border bg-raised flex flex-col gap-3 rounded-2xl border p-6 transition-shadow hover:shadow-sm"
          >
            <span className="text-fg-muted bg-hover inline-block w-fit rounded-full px-2.5 py-1 text-sm">
              Windows
            </span>
            <span className="text-fg text-lg">Windows 10 & 11</span>
            <span className="text-fg-secondary text-sm">
              Signed installer when available.
            </span>
          </a>
        </div>

        <p className="text-fg-muted hidden text-center text-sm">
          Prefer the browser?{" "}
          <a
            href={DOWNLOAD_URLS.web}
            className="text-fg-secondary underline-offset-4 hover:underline"
          >
            Open the web app
          </a>
          .
        </p>
      </section>

      <section
        id="open-source"
        className="flex w-full max-w-[1080px] flex-col items-start gap-6 py-16 max-md:py-12"
      >
        <div className="flex w-full flex-col gap-3">
          <p className="text-fg-muted bg-border-subtle inline-block w-fit rounded-full px-2.5 py-1 text-xs tracking-[-0.01em]">
            Open source
          </p>
          <h2 className="text-fg text-2xl leading-[1.2] tracking-[-0.02em] max-md:text-xl">
            Built in the open
          </h2>
          <p className="text-fg-secondary max-w-[640px] text-base leading-[1.35] tracking-[-0.01em]">
            Newsphere is developed in public—you can inspect the code, file
            issues, and follow along as the app evolves.
          </p>
        </div>
        <ul className="text-fg-secondary flex w-full max-w-[640px] list-none flex-col gap-3 text-base leading-tight tracking-[-0.01em]">
          {[
            "React and TypeScript for the interface",
            "Vite for fast local development and production builds",
            "Tauri 2 for a native desktop shell with a small footprint",
            "Rust in the backend for system integration and performance",
            "Tailwind CSS for a consistent, themeable design system",
          ].map((line) => (
            <li key={line} className="flex gap-3">
              <span className="text-fg-muted mt-[0.35em] h-1 w-1 shrink-0 rounded-full bg-current opacity-60" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-fg-secondary text-sm underline-offset-4 transition-colors hover:text-fg hover:underline"
        >
          View the repository on GitHub
        </a>
      </section>

      <section className="flex w-full max-w-[1080px] flex-col items-center gap-3 overflow-visible pt-8 pb-16 max-md:pb-12">
        <p className="text-fg-secondary max-w-full text-center text-2xl leading-[1.15] tracking-[-0.03em] max-lg:text-[22px] max-md:text-[20px]">
          The feed is endless.
          <br />
          Your reading doesn't have to be.
        </p>
      </section>

      <footer className="bg-hover -mx-4 w-[calc(100%+2rem)] max-w-none sm:-mx-6 sm:w-[calc(100%+3rem)] md:-mx-8 md:w-[calc(100%+4rem)] lg:-mx-10 lg:w-[calc(100%+5rem)] py-6 max-md:py-4">
        <div className="mx-auto flex w-full max-w-[1080px] items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10 max-md:flex-col max-md:items-center max-md:gap-3">
          <p className="text-fg-muted text-sm">
            © {new Date().getFullYear()} Newsphere
          </p>
          <div className="flex items-center gap-6">
            <a
              href="mailto:support@example.com"
              className="text-fg-muted hover:text-fg-secondary text-sm transition-colors duration-200"
            >
              Contact
            </a>
            <a
              href="#privacy"
              className="text-fg-muted hover:text-fg-secondary text-sm transition-colors duration-200"
            >
              Privacy
            </a>
            <a
              href="#terms"
              className="text-fg-muted hover:text-fg-secondary text-sm transition-colors duration-200"
            >
              Terms
            </a>
          </div>
        </div>
      </footer>

      {expanded ? (
        <div
          className="feature-lightbox-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-0 backdrop-blur-[2px]"
          onClick={() => setExpanded(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="feature-expand-title"
        >
          <p id="feature-expand-title" className="sr-only">
            {expanded.title}
          </p>
          <button
            type="button"
            className="text-fg bg-raised border-border hover:bg-zinc-200 active:bg-zinc-300 absolute top-[max(0.75rem,env(safe-area-inset-top))] right-[max(0.75rem,env(safe-area-inset-right))] z-[101] rounded-full border px-3 py-2 text-sm shadow-sm transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(null);
            }}
          >
            Close
          </button>
          <img
            src={expanded.src}
            alt=""
            className="feature-lightbox-image box-border h-auto max-h-[100dvh] w-auto max-w-[100dvw] rounded-none object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  );
}
