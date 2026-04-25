import { GITHUB_URL } from "../config";
import { PageSection, PageShell } from "../components/PageShell";

const SUPPORT_EMAIL =
  import.meta.env.VITE_SUPPORT_EMAIL ?? "support@newsphere.app";

const linkClass =
  "text-fg underline decoration-border underline-offset-4 transition-colors hover:decoration-fg-muted";

const LAST_UPDATED = "April 2026";

export default function Terms() {
  return (
    <PageShell
      eyebrow="Terms"
      title="Terms of use"
      lede="By downloading or using Newsphere, you agree to the terms below. They’re written in plain English, but they are still legally binding."
    >
      <p className="text-fg-muted text-sm">Last updated: {LAST_UPDATED}</p>

      <PageSection heading="The service">
        <p>
          Newsphere is a desktop application that lets you subscribe to RSS/
          Atom feeds and read articles from their publishers. “The service”
          refers to the Newsphere desktop app, this website, and any related
          materials we distribute.
        </p>
      </PageSection>

      <PageSection heading="Your license">
        <p>
          Newsphere is distributed as open-source software under the terms
          published alongside the source code in our{" "}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            GitHub repository
          </a>
          . The repository LICENSE file governs your rights to use, copy,
          modify, and redistribute the software and takes precedence over this
          page where the two differ.
        </p>
      </PageSection>

      <PageSection heading="Acceptable use">
        <p>
          You agree to use Newsphere only for lawful purposes and in a manner
          that does not infringe the rights of, restrict, or inhibit anyone
          else’s use of the service. In particular, you agree not to:
        </p>
        <ul className="ml-5 flex list-disc flex-col gap-2">
          <li>
            Attempt to overload, attack, or otherwise interfere with the
            publishers whose feeds you request through the app.
          </li>
          <li>
            Use Newsphere to systematically scrape or redistribute copyrighted
            content in violation of the source’s terms.
          </li>
          <li>
            Misrepresent the app’s origin or present modified versions as
            official Newsphere releases.
          </li>
        </ul>
      </PageSection>

      <PageSection heading="Third-party content">
        <p>
          Articles, images, and other content you view through Newsphere are
          owned by their respective publishers. Newsphere displays that
          content on your behalf but does not license, sponsor, or endorse
          it. Your use of third-party content is subject to the terms and
          copyright of each source.
        </p>
      </PageSection>

      <PageSection heading="No warranty">
        <p>
          The service is provided “as is” and “as available” without warranty
          of any kind, express or implied, including warranties of
          merchantability, fitness for a particular purpose, and
          non-infringement. We do not guarantee uninterrupted availability,
          freedom from bugs, or that any particular feed will continue to
          work.
        </p>
      </PageSection>

      <PageSection heading="Limitation of liability">
        <p>
          To the maximum extent permitted by applicable law, Newsphere and its
          contributors will not be liable for any indirect, incidental,
          special, consequential, or punitive damages arising out of or
          relating to your use of the service. Your sole remedy for
          dissatisfaction with the service is to stop using it.
        </p>
      </PageSection>

      <PageSection heading="Changes">
        <p>
          We may update these terms from time to time. Material changes will
          be reflected in the “Last updated” date above. Continued use of the
          service after changes are posted constitutes acceptance of the
          updated terms.
        </p>
      </PageSection>

      <PageSection heading="Contact">
        <p>
          Questions about these terms can be sent to{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className={linkClass}>
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </PageSection>
    </PageShell>
  );
}
