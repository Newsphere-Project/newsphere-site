import { Link } from "react-router-dom";

const footerLinkClass =
  "text-fg-muted hover:text-fg-secondary text-sm transition-colors duration-200";

export function SiteFooter() {
  return (
    <footer className="bg-hover w-full py-6 max-md:py-4">
      <div className="mx-auto flex w-full max-w-[1080px] items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10 max-md:flex-col max-md:items-center max-md:gap-3">
        <p className="text-fg-muted text-sm">
          © {new Date().getFullYear()} Newsphere
        </p>
        <nav
          aria-label="Legal and contact"
          className="flex items-center gap-6"
        >
          <Link to="/contact" className={footerLinkClass}>
            Contact
          </Link>
          <Link to="/privacy" className={footerLinkClass}>
            Privacy
          </Link>
          <Link to="/terms" className={footerLinkClass}>
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
