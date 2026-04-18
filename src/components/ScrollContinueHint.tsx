import { useEffect, useRef, useState } from "react";

function IconChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChevronUp({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M18 15l-6-6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type ScrollContinueHintProps = {
  /** Hide while overlays (e.g. lightbox) are open. */
  suppress?: boolean;
};

/** Must match Tailwind `duration-300` on the hint (ms). */
const FADE_MS = 300;

/**
 * Fixed hint at the bottom of the viewport: encourages scrolling down near the
 * top; switches to a “scroll up” hint when the user scrolls upward or nears
 * the document end.
 */
export function ScrollContinueHint({ suppress = false }: ScrollContinueHintProps) {
  const [mode, setMode] = useState<"down" | "up">("down");
  const lastY = useRef(0);
  /** Still in DOM (including while fading out). */
  const [show, setShow] = useState(!suppress);
  /** Visible opacity layer — false while entering/exiting. */
  const [opaque, setOpaque] = useState(!suppress);
  const prevSuppressRef = useRef(suppress);

  useEffect(() => {
    if (!suppress) {
      setShow(true);
      if (prevSuppressRef.current) {
        setOpaque(false);
        const id = requestAnimationFrame(() => {
          requestAnimationFrame(() => setOpaque(true));
        });
        prevSuppressRef.current = false;
        return () => cancelAnimationFrame(id);
      }
      setOpaque(true);
      prevSuppressRef.current = false;
      return;
    }
    prevSuppressRef.current = true;
    setOpaque(false);
    const t = window.setTimeout(() => setShow(false), FADE_MS);
    return () => window.clearTimeout(t);
  }, [suppress]);

  useEffect(() => {
    if (suppress || !show) return;
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const prev = lastY.current;
      const delta = y - prev;
      lastY.current = y;

      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const nearTop = y < 64;
      const nearBottom = maxScroll > 0 && y >= maxScroll - 64;

      if (nearTop) {
        setMode("down");
        return;
      }
      if (nearBottom) {
        setMode("up");
        return;
      }
      if (delta < 0) setMode("up");
      else if (delta > 0) setMode("down");
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [suppress, show]);

  if (!show) return null;

  return (
    <div
      className={`pointer-events-none fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-1 transition-opacity duration-300 ease-out motion-reduce:transition-none ${opaque ? "opacity-100" : "opacity-0"}`}
      role="status"
      aria-live="polite"
      aria-hidden={!opaque}
    >
      <p className="text-fg-muted flex items-center gap-2 text-sm tracking-[-0.01em]">
        {mode === "down" ? (
          <>
            <span>Scroll down to continue</span>
            <IconChevronDown className="text-fg-muted shrink-0 motion-safe:animate-bounce" />
          </>
        ) : (
          <>
            <IconChevronUp className="text-fg-muted shrink-0 motion-safe:animate-bounce" />
            <span>Scroll up to continue</span>
          </>
        )}
      </p>
    </div>
  );
}
