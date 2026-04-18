import { useCallback, useEffect, useRef, useState } from "react";
import { ExpandableFeaturePreview } from "./ExpandableFeaturePreview";
import { MediaPlaceholder } from "./MediaPlaceholder";

export type FeatureCell = {
  title: string;
  body: string;
  image: string;
  videoFrameSec: number;
  videoObjectPosition: string;
};

type ReaderShowcase = {
  imageSrc: string;
  label: string;
  title: string;
  body: string;
  videoFrameSec: number;
  videoObjectPosition: string;
};

type FeatureShowcaseScrollProps = {
  /** Stays visible in the sticky viewport while the row scrolls horizontally. */
  sectionTitle: string;
  reader: ReaderShowcase;
  features: FeatureCell[];
  onExpand: (src: string, title: string) => void;
};

const WHEEL_TO_PROGRESS = 0.0012;

export function FeatureShowcaseScroll({
  sectionTitle,
  reader,
  features,
  onExpand,
}: FeatureShowcaseScrollProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [tx, setTx] = useState(0);
  const rafRef = useRef<number | null>(null);

  const txFirstRef = useRef(0);
  const txLastRef = useRef(0);
  const horizontalProgressRef = useRef(0);
  const horizontalCompleteRef = useRef(false);
  /** Max `scrollY` allowed until horizontal scrub finishes (last card centered). */
  const scrollLockYRef = useRef<number | null>(null);

  const measureTxRange = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    const first = row.firstElementChild as HTMLElement | null;
    const last = row.lastElementChild as HTMLElement | null;
    if (!first || !last) return;

    const w = window.innerWidth;
    const prev = row.style.transform;
    row.style.transform = "translate3d(0,0,0)";
    void row.offsetHeight;
    const fr = first.getBoundingClientRect();
    const lr = last.getBoundingClientRect();
    row.style.transform = prev;

    txFirstRef.current = w / 2 - (fr.left + fr.width / 2);
    txLastRef.current = w / 2 - (lr.left + lr.width / 2);
  }, []);

  const txFromProgress = useCallback((p: number) => {
    const a = txFirstRef.current;
    const b = txLastRef.current;
    return a + p * (b - a);
  }, []);

  const applyProgress = useCallback(
    (p: number) => {
      const clamped = Math.min(1, Math.max(0, p));
      horizontalProgressRef.current = clamped;
      if (clamped >= 1) {
        horizontalCompleteRef.current = true;
        setTx(txFromProgress(1));
        return;
      }
      if (clamped <= 0) {
        horizontalCompleteRef.current = false;
        setTx(txFromProgress(0));
        return;
      }
      setTx(txFromProgress(clamped));
    },
    [txFromProgress],
  );

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      rafRef.current = null;
      const track = trackRef.current;
      const row = rowRef.current;
      if (!track || !row) return;

      if (reduceMotion.matches) {
        measureTxRange();
        horizontalCompleteRef.current = true;
        setTx(txLastRef.current);
        return;
      }

      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const inSticky = rect.top <= 0 && rect.bottom > vh * 0.25;

      if (!inSticky) {
        scrollLockYRef.current = null;
        if (rect.top > 0) {
          horizontalCompleteRef.current = false;
          horizontalProgressRef.current = 0;
          measureTxRange();
          setTx(txFromProgress(0));
        }
        return;
      }

      if (horizontalCompleteRef.current) {
        scrollLockYRef.current = null;
        setTx(txFromProgress(1));
        return;
      }

      const y = window.scrollY;
      if (scrollLockYRef.current === null) {
        scrollLockYRef.current = y;
      } else if (y > scrollLockYRef.current) {
        window.scrollTo({ top: scrollLockYRef.current, left: 0, behavior: "instant" });
      }

      setTx(txFromProgress(horizontalProgressRef.current));
    };

    const schedule = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(update);
    };

    const onWheel = (e: WheelEvent) => {
      if (reduceMotion.matches) return;
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const inSticky = rect.top <= 0 && rect.bottom > vh * 0.25;
      if (!inSticky) return;
      if (horizontalCompleteRef.current) return;

      const p = horizontalProgressRef.current;

      if (e.deltaY > 0 && p < 1) {
        e.preventDefault();
        applyProgress(p + e.deltaY * WHEEL_TO_PROGRESS);
      } else if (e.deltaY < 0 && p > 0) {
        e.preventDefault();
        applyProgress(p + e.deltaY * WHEEL_TO_PROGRESS);
      }
    };

    const onResize = () => {
      measureTxRange();
      schedule();
    };

    measureTxRange();
    update();
    window.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    reduceMotion.addEventListener("change", update);

    const rowEl = rowRef.current;
    const ro =
      typeof ResizeObserver !== "undefined" && rowEl
        ? new ResizeObserver(onResize)
        : null;
    if (ro && rowEl) ro.observe(rowEl);

    return () => {
      ro?.disconnect();
      window.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", onWheel, { capture: true });
      reduceMotion.removeEventListener("change", update);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [applyProgress, measureTxRange, txFromProgress]);

  const cardClass =
    "w-[min(28rem,calc(100vw-2rem))] shrink-0 flex flex-col gap-4 sm:w-[min(30rem,calc(100vw-2.5rem))] md:w-[min(34rem,calc(100vw-4rem))]";

  return (
    <div
      ref={trackRef}
      className="relative w-full min-h-[100svh] max-w-none"
    >
      <div className="bg-[linear-gradient(180deg,transparent_0%,var(--color-offwhite)_8%,var(--color-offwhite)_92%,transparent_100%)] sticky top-0 z-0 flex h-[100svh] min-h-[100svh] flex-col overflow-x-hidden py-0 motion-reduce:overflow-x-auto">
        {/* Title sits at its natural height, offset from the top of the sticky band. */}
        <div className="shrink-0 px-4 pt-24 sm:px-6 md:px-8 md:pt-32 lg:px-10 max-md:pt-16">
          <div className="mx-auto w-full max-w-[1080px] text-center">
            <h2
              id="features-heading"
              className="text-fg text-2xl leading-[1.2] tracking-[-0.02em] max-md:text-xl"
            >
              {sectionTitle}
            </h2>
          </div>
        </div>
        {/* pt here mirrors the title block's pt, so the heading has equal space above and below it. */}
        <div className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-hidden pt-24 md:pt-32 max-md:pt-16">
          <div
            ref={rowRef}
            style={{
              transform: `translate3d(${tx}px, 0, 0)`,
              willChange: "transform",
            }}
            className="flex flex-row gap-6 pl-4 sm:pl-6 md:gap-8 md:pl-8 lg:pl-10"
          >
            <div className={cardClass}>
              <div className="w-full">
                <MediaPlaceholder
                  backgroundVideoFrameSec={reader.videoFrameSec}
                  backgroundVideoObjectPosition={reader.videoObjectPosition}
                  imageSrc={reader.imageSrc}
                  label={reader.label}
                />
              </div>
              <div className="flex flex-col gap-1.5 px-1">
                <h3 className="text-fg text-lg leading-tight tracking-[-0.02em] max-md:text-base">
                  {reader.title}
                </h3>
                <p className="text-fg-muted text-base leading-tight break-words">
                  {reader.body}
                </p>
              </div>
            </div>

            {features.map((item) => (
              <div key={item.title} className={cardClass}>
                <ExpandableFeaturePreview
                  backgroundVideoFrameSec={item.videoFrameSec}
                  backgroundVideoObjectPosition={item.videoObjectPosition}
                  imageSrc={item.image}
                  title={item.title}
                  onExpand={() => onExpand(item.image, item.title)}
                />
                <div className="flex flex-col gap-1.5 px-1">
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
        </div>
      </div>
    </div>
  );
}
