import { GITHUB_URL } from "../config";
import { PageSection, PageShell } from "../components/PageShell";

const SUPPORT_EMAIL =
  import.meta.env.VITE_SUPPORT_EMAIL ?? "support@newsphere.app";

const linkClass =
  "text-fg underline decoration-border underline-offset-4 transition-colors hover:decoration-fg-muted";

export default function Contact() {
  return (
    <PageShell
      eyebrow="Contact"
      title="Get in touch"
      lede="Questions, feedback, bug reports, or ideas for what to build next — we’d love to hear from you."
    >
      <PageSection heading="Email">
        <p>
          For general questions and support, reach us at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className={linkClass}>
            {SUPPORT_EMAIL}
          </a>
          . We read every message and try to reply within a couple of business
          days.
        </p>
      </PageSection>

      <PageSection heading="Bug reports & feature requests">
        <p>
          Newsphere is developed in the open. The fastest path for reproducible
          issues or concrete feature ideas is a GitHub issue — it keeps the
          conversation searchable and lets other users chime in.
        </p>
        <p>
          Open or browse issues on{" "}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            GitHub
          </a>
          .
        </p>
      </PageSection>

      <PageSection heading="Security">
        <p>
          If you believe you’ve found a security vulnerability, please do not
          open a public issue. Email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className={linkClass}>
            {SUPPORT_EMAIL}
          </a>{" "}
          with details so we can triage and address it responsibly.
        </p>
      </PageSection>
    </PageShell>
  );
}
