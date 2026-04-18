import { GITHUB_URL } from "../config";
import { PageSection, PageShell } from "../components/PageShell";

const SUPPORT_EMAIL =
  import.meta.env.VITE_SUPPORT_EMAIL ?? "support@newsphere.app";

const linkClass =
  "text-fg underline decoration-border underline-offset-4 transition-colors hover:decoration-fg-muted";

/**
 * Month-precision "last updated" timestamp. Keeping it coarse avoids churn on
 * every deploy while still surfacing meaningful revisions.
 */
const LAST_UPDATED = "April 2026";

export default function Privacy() {
  return (
    <PageShell
      eyebrow="Privacy"
      title="Privacy policy"
      lede="Newsphere is designed to work without collecting your reading habits. This page explains what the desktop app and this website do with data in practice."
    >
      <p className="text-fg-muted text-sm">Last updated: {LAST_UPDATED}</p>

      <PageSection heading="The short version">
        <ul className="ml-5 flex list-disc flex-col gap-2">
          <li>
            The Newsphere desktop app runs locally. Your feeds, subscriptions,
            bookmarks, history, and settings live on your device.
          </li>
          <li>
            When you read an article, the app requests it directly from the
            publisher. We don’t proxy, log, or store that traffic.
          </li>
          <li>
            We don’t use analytics, advertising, or third-party tracking
            scripts on this website.
          </li>
          <li>
            The project is open source — you can verify any of the above in the
            source code.
          </li>
        </ul>
      </PageSection>

      <PageSection heading="The desktop app">
        <p>
          The Newsphere app stores your data (feed list, read status, saved
          articles, reading history, preferences) locally on your computer. No
          account is required and no data is transmitted to Newsphere servers
          in the course of normal use.
        </p>
        <p>
          Network requests are made only to the sources you subscribe to
          (typically RSS/Atom feed URLs and their article pages) and, when
          enabled, to automatic update servers to check for new versions of the
          app.
        </p>
      </PageSection>

      <PageSection heading="This website">
        <p>
          This marketing site (newsphere.app and related domains) is served as
          static files. It does not set tracking cookies, does not embed
          analytics SDKs, and does not share visitor data with advertisers.
        </p>
        <p>
          Our hosting provider may record standard server logs (IP address,
          user agent, requested URL, timestamp) for the purpose of operating
          the site and detecting abuse. Those logs are retained for a short
          period and are not used to build profiles of visitors.
        </p>
      </PageSection>

      <PageSection heading="Crash reports & diagnostics">
        <p>
          If the app offers to send a crash report, it will ask for your
          explicit consent before doing so. Reports contain technical details
          needed to diagnose the crash (stack traces, app version, OS version)
          and never include the contents of articles, feeds, or bookmarks.
        </p>
      </PageSection>

      <PageSection heading="Your rights">
        <p>
          Because we don’t collect personal data, there is generally nothing
          for us to export or delete on your behalf. Your app data can be
          removed at any time by uninstalling Newsphere or deleting its
          application support folder.
        </p>
        <p>
          If you have questions about this policy or want to exercise a
          privacy-related right under GDPR, CCPA, or similar legislation,
          contact us at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className={linkClass}>
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </PageSection>

      <PageSection heading="Changes to this policy">
        <p>
          Material changes will be reflected in the “Last updated” date above
          and, where appropriate, announced on{" "}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            our GitHub
          </a>
          . Continued use of the app or website after changes are posted
          constitutes acceptance of the updated policy.
        </p>
      </PageSection>
    </PageShell>
  );
}
