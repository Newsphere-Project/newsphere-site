import { useEffect, useState, type SVGProps } from "react";
import { DOWNLOAD_URLS, GITHUB_URL } from "../config";
import { BetaBadge } from "../components/BetaBadge";
import { DitherFilterDefs } from "../components/DitherFilterDefs";
import {
  FeatureShowcaseScroll,
  type FeatureCell,
} from "../components/FeatureShowcaseScroll";
import { HeroGridCrossfade } from "../components/HeroGridCrossfade";
import { OpenSourceTechLogos } from "../components/OpenSourceTechLogos";
import { SiteFooter } from "../components/SiteFooter";

const githubPillClassName =
  "border-border text-fg-muted hover:border-border-emphasis hover:bg-hover hover:text-fg-secondary inline-flex cursor-pointer items-center gap-2 rounded-[99px] border bg-transparent px-2.5 py-2 text-sm transition-colors duration-200 no-underline [&_svg]:shrink-0 [&_svg]:text-current";

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

function AppleLogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 814 1000"
      fill="currentColor"
      aria-hidden
      className="text-fg h-3.5 w-auto shrink-0"
      {...props}
    >
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
    </svg>
  );
}

function WindowsLogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 21 21"
      fill="currentColor"
      aria-hidden
      className="text-fg size-3.5 shrink-0"
      {...props}
    >
      <path d="M0 0h10v10H0z" />
      <path d="M11 0h10v10H11z" />
      <path d="M0 11h10v10H0z" />
      <path d="M11 11h10v10H11z" />
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

/** Newest reader hero asset in /public/images (filename from macOS screenshot). */
const READER_SECTION_IMAGE = `/images/${encodeURIComponent("Screenshot 2026-04-17 at 8.15.45\u202fPM.png")}`;

const READER_SHOWCASE = {
  imageSrc: READER_SECTION_IMAGE,
  label: "Article open in the reader with navigation and actions above the text",
  title: "Reader",
  body: "Full articles in a centered column—minimal chrome, quiet type, and a toolbar that stays out of the text.",
  videoFrameSec: 0,
  videoObjectPosition: "50% 42%",
};

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

export default function Home() {
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
    <div className="text-fg mx-auto flex w-full flex-col items-center gap-0 bg-[linear-gradient(180deg,var(--color-raised)_0%,var(--color-offwhite)_100%)]">
      <DitherFilterDefs />
      <section
        id="hero"
        className="flex w-full flex-col items-center px-4 py-20 sm:px-6 md:px-8 lg:px-10 max-md:py-16"
      >
        <div className="flex w-full max-w-[1400px] flex-col gap-20 max-md:gap-16">
          <div className="mx-auto flex w-full max-w-[1080px] flex-col items-center gap-6 text-center max-md:gap-8">
            <nav className="flex w-full items-center justify-center">
              <a
                href="/"
                className="text-fg flex items-center gap-2 no-underline outline-none focus:outline-none focus-visible:outline-none"
                aria-label="Newsphere home, beta"
              >
                <img
                  src="/logo.svg"
                  alt=""
                  width={56}
                  height={56}
                  className="block size-14 shrink-0 max-md:size-12"
                />
                <span className="font-serif text-3xl italic tracking-[-0.02em] max-md:text-2xl">
                  Newsphere
                </span>
                <BetaBadge size="hero" />
              </a>
            </nav>

            <div className="flex w-full flex-col items-center gap-10 max-md:gap-8">
              <div className="flex w-full max-w-[640px] flex-col gap-4">
                <h1 className="text-[40px] leading-[1.08] tracking-[-0.03em] text-fg max-md:text-[32px]">
                  Built to read, not to scroll.
                </h1>
                <p className="text-fg-secondary text-lg leading-[1.35] tracking-[-0.01em] max-md:text-base max-md:tracking-[-0.02em]">
                  Newsphere is a desktop reader and workspace for feeds and
                  focus—without the noise of the open web.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 max-md:gap-2.5">
                <a
                  href={DOWNLOAD_URLS.macos}
                  className="bg-primary text-primary-foreground hover:opacity-85 inline-flex cursor-pointer items-center justify-center rounded-full px-3.5 py-2.5 text-sm leading-none tracking-[-0.01em] whitespace-nowrap transition-opacity duration-200"
                >
                  Download for macOS
                </a>
                <GitHubPillLink />
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-center max-lg:max-w-full">
            <HeroGridCrossfade className="max-w-full" />
          </div>
        </div>
      </section>

      <div
        id="features"
        className="flex w-full flex-col items-center gap-0 pb-8 max-md:pb-6"
        aria-labelledby="features-heading"
      >
        <FeatureShowcaseScroll
          sectionTitle="A news reader designed to keep focus and reduce distractions."
          reader={READER_SHOWCASE}
          features={FEATURE_ROWS.flat()}
          onExpand={(src, title) => setExpanded({ src, title })}
          scrollHintSuppressed={Boolean(expanded)}
        />
      </div>

      <section
        id="downloads"
        className="-mt-4 flex w-full max-w-[1080px] flex-col items-center gap-8 px-4 pt-0 pb-16 sm:px-6 md:px-8 lg:px-10"
      >
        <h2 className="text-fg text-center text-2xl leading-none tracking-[-0.01em]">
          Download
        </h2>

        <div className="grid w-full max-w-[720px] gap-3 sm:grid-cols-2">
          <a
            href={DOWNLOAD_URLS.macos}
            className="border-border bg-raised flex flex-col gap-3 rounded-2xl border p-6 transition-shadow hover:shadow-sm"
          >
            <span className="text-fg-muted bg-hover inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-sm">
              <AppleLogoIcon />
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
            <span className="text-fg-muted bg-hover inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-sm">
              <WindowsLogoIcon />
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
        className="flex w-full max-w-[1080px] flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 md:px-8 lg:px-10 max-md:py-12"
      >
        <div className="flex w-full flex-col items-center gap-3">
          <p className="text-fg-muted bg-border-subtle inline-block w-fit rounded-full px-2.5 py-1 text-xs tracking-[-0.01em]">
            Open source
          </p>
          <h2 className="text-fg text-2xl leading-[1.2] tracking-[-0.02em] max-md:text-xl">
            Built in the open
          </h2>
          <p className="text-fg-secondary mx-auto max-w-[640px] text-base leading-[1.35] tracking-[-0.01em]">
            Newsphere is developed in public—you can inspect the code, file
            issues, and follow along as the app evolves. Want to help?
            Contributions are welcome—open a pull request, pick up an issue, or
            suggest an improvement.
          </p>
        </div>
        <OpenSourceTechLogos />
        <div className="flex w-full justify-center">
          <GitHubPillLink />
        </div>
      </section>

      <div className="flex min-h-[100svh] w-full flex-col items-center justify-center gap-6 py-8 max-md:gap-4 max-md:py-6">
        <section className="flex w-full max-w-[1080px] flex-col items-center gap-3 overflow-visible px-4 sm:px-6 md:px-8 lg:px-10">
          <p className="text-fg max-w-full text-center text-4xl leading-[1.1] tracking-[-0.035em] max-lg:text-3xl max-md:text-2xl">
            The feed is endless.
            <br />
            But your attention isn’t.
          </p>
        </section>

        <section className="flex w-full max-w-[1080px] flex-col items-center px-4 sm:px-6 md:px-8 lg:px-10">
          <a
            href="/"
            className="text-fg focus-visible:ring-fg/25 block rounded-2xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label="Newsphere home"
          >
            <img
              src="/logo.svg"
              alt=""
              width={1024}
              height={1024}
              className="block h-auto w-[min(20rem,78vw)] max-w-full sm:w-[min(24rem,70vw)] md:w-[min(28rem,60vw)]"
              draggable={false}
            />
          </a>
        </section>
      </div>

      <SiteFooter />

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
            className="text-fg bg-raised border-border hover:bg-secondary active:bg-border absolute top-[max(0.75rem,env(safe-area-inset-top))] right-[max(0.75rem,env(safe-area-inset-right))] z-[101] rounded-full border px-3 py-2 text-sm shadow-sm transition-colors"
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
