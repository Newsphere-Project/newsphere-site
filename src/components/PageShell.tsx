import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { SiteFooter } from "./SiteFooter";

type PageShellProps = {
  /** Large display title at the top of the page content area. */
  title: string;
  /**
   * Optional short kicker displayed above the title (e.g. "Legal").
   * Keeps visual hierarchy consistent across inner pages.
   */
  eyebrow?: string;
  /** Optional supporting line rendered below the title. */
  lede?: string;
  /** Page body — typically prose sections. */
  children: ReactNode;
};

/**
 * Standard layout for non-home pages. Provides a consistent header with the
 * Newsphere wordmark linking home, a centered content column, and the shared
 * site footer. Keeps Contact / Privacy / Terms (and any future static pages)
 * visually native to the rest of the site.
 */
export function PageShell({ title, eyebrow, lede, children }: PageShellProps) {
  return (
    <div className="text-fg flex min-h-[100svh] w-full flex-col bg-[linear-gradient(180deg,var(--color-raised)_0%,var(--color-offwhite)_100%)]">
      <header className="flex w-full justify-center px-4 py-10 sm:px-6 md:px-8 lg:px-10 max-md:py-8">
        <div className="flex w-full max-w-[1080px] items-center justify-between">
          <Link
            to="/"
            aria-label="Newsphere home"
            className="text-fg flex items-center gap-2 no-underline outline-none focus:outline-none focus-visible:outline-none"
          >
            <img
              src="/logo.svg"
              alt=""
              width={40}
              height={40}
              className="block size-10 shrink-0 max-md:size-9"
            />
            <span className="font-serif text-2xl italic tracking-[-0.02em] max-md:text-xl">
              Newsphere
            </span>
          </Link>
        </div>
      </header>

      <main className="flex w-full flex-1 justify-center px-4 pb-16 sm:px-6 md:px-8 lg:px-10 max-md:pb-12">
        <article className="flex w-full max-w-[680px] flex-col gap-10 max-md:gap-8">
          <header className="flex flex-col gap-3">
            {eyebrow ? (
              <p className="text-fg-muted bg-border-subtle inline-block w-fit rounded-full px-2.5 py-1 text-xs tracking-[-0.01em]">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="text-fg text-[40px] leading-[1.08] tracking-[-0.03em] max-md:text-[32px]">
              {title}
            </h1>
            {lede ? (
              <p className="text-fg-secondary text-lg leading-[1.35] tracking-[-0.01em] max-md:text-base">
                {lede}
              </p>
            ) : null}
          </header>

          <div className="prose-custom flex flex-col gap-8 text-fg-secondary text-base leading-[1.55] tracking-[-0.005em] max-md:text-[15px]">
            {children}
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}

/** Section heading used inside `PageShell` bodies for consistent typography. */
export function PageSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-fg text-xl leading-[1.25] tracking-[-0.02em] max-md:text-lg">
        {heading}
      </h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}
