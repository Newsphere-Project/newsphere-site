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
/** Pixels: treat scrollY as aligned with the pin when within this of `pinScrollY`. */
const PIN_SCROLL_EPSILON = 2;

/**
 * How strongly each card "sticks" at its centered position. 0 = no stickiness
 * (linear scroll), 1 = fully paused at each anchor. Values around 0.55 read as
 * a confident dwell without feeling stalled.
 */
const STICKINESS = 0.55;

/**
 * A card counts as "in the center" (and therefore animates its background) only
 * while its on-screen center is within `CENTERED_ENTER_RATIO * cardWidth` px of
 * the viewport center. At 0.2, that's the middle 40% of one card width.
 */
const CENTERED_ENTER_RATIO = 0.2;

/**
 * Hysteresis: once a card is active, keep it active until it drifts beyond
 * `CENTERED_EXIT_RATIO * cardWidth` from center. Larger than the enter ratio so
 * minor wobble during the stickiness dwell doesn't flicker the background
 * play/pause state.
 */
const CENTERED_EXIT_RATIO = 0.35;

/**
 * Smoothly warp a linear scrub progress so that card-centered anchor points
 * (`i / (numAnchors - 1)`) act as "sticky" positions: near an anchor the
 * horizontal motion slows, between anchors it accelerates. Anchor values are
 * preserved (`warp(anchor) === anchor`), so card alignment at each anchor
 * stays exact. The warp is C¹ across segment boundaries (smoothstep has zero
 * derivative at its endpoints), giving a continuous, smooth feel.
 */
function warpProgress(p: number, numAnchors: number): number {
  if (numAnchors < 2) return p;
  const clamped = Math.max(0, Math.min(1, p));
  const segCount = numAnchors - 1;
  const seg = Math.min(segCount - 1, Math.floor(clamped * segCount));
  const segStart = seg / segCount;
  const segEnd = (seg + 1) / segCount;
  const t = (clamped - segStart) / (segEnd - segStart);
  const smoothstep = t * t * (3 - 2 * t);
  const eased = STICKINESS * smoothstep + (1 - STICKINESS) * t;
  return segStart + eased * (segEnd - segStart);
}

export function FeatureShowcaseScroll({
  sectionTitle,
  reader,
  features,
  onExpand,
}: FeatureShowcaseScrollProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [tx, setTx] = useState(0);
  /** -1 when none are centered (section off-screen); otherwise index into row children. */
  const [activeIdx, setActiveIdx] = useState(-1);
  const activeIdxRef = useRef(-1);
  const rafRef = useRef<number | null>(null);

  const txFirstRef = useRef(0);
  const txLastRef = useRef(0);
  const horizontalProgressRef = useRef(0);
  /** `scrollY` pinned while sticky and horizontal scrub not finished (p < 1), including p === 0. */
  const scrollLockYRef = useRef<number | null>(null);
  /** Viewport-X of each card's center when the row transform is 0; used to detect centered card. */
  const cardCentersRef = useRef<number[]>([]);
  /** Width of a card in px (cards are uniformly sized); used to scale the "centered" threshold. */
  const cardWidthRef = useRef(0);

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
    const centers: number[] = [];
    for (let i = 0; i < row.children.length; i++) {
      const child = row.children[i] as HTMLElement;
      const cr = child.getBoundingClientRect();
      centers.push(cr.left + cr.width / 2);
    }
    row.style.transform = prev;

    txFirstRef.current = w / 2 - (fr.left + fr.width / 2);
    txLastRef.current = w / 2 - (lr.left + lr.width / 2);
    cardCentersRef.current = centers;
    cardWidthRef.current = fr.width;
  }, []);

  /**
   * Return the index of the card that is actually *in the center* of the viewport
   * at the given tx, or -1 if no card is close enough. Uses hysteresis: a card
   * must enter the tight enter-zone to become active, and stays active until it
   * drifts past the wider exit-zone. Prevents flicker when the card wobbles near
   * a threshold boundary during the stickiness dwell.
   */
  const centeredIndexForTx = useCallback((currentTx: number) => {
    const centers = cardCentersRef.current;
    const cardW = cardWidthRef.current;
    if (centers.length === 0 || cardW <= 0) return -1;
    const viewportCenter = window.innerWidth / 2;
    const enterThreshold = cardW * CENTERED_ENTER_RATIO;
    const exitThreshold = cardW * CENTERED_EXIT_RATIO;
    const current = activeIdxRef.current;

    // Hysteresis: if a card is currently active and still within the exit zone,
    // keep it unless another card comes all the way into the (tighter) enter zone.
    if (current >= 0 && current < centers.length) {
      const dCurrent = Math.abs(centers[current] + currentTx - viewportCenter);
      if (dCurrent <= exitThreshold) {
        for (let i = 0; i < centers.length; i++) {
          if (i === current) continue;
          const di = Math.abs(centers[i] + currentTx - viewportCenter);
          if (di <= enterThreshold && di < dCurrent) {
            return i;
          }
        }
        return current;
      }
    }

    // No active card (or active card has exited): pick one only if it's within
    // the tight enter zone.
    let bestIdx = -1;
    let bestDist = Infinity;
    for (let i = 0; i < centers.length; i++) {
      const d = Math.abs(centers[i] + currentTx - viewportCenter);
      if (d <= enterThreshold && d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    return bestIdx;
  }, []);

  const txFromProgress = useCallback((p: number) => {
    const a = txFirstRef.current;
    const b = txLastRef.current;
    // Warp first so anchor points are exact and motion "sticks" near each card.
    const warped = warpProgress(p, cardCentersRef.current.length);
    return a + warped * (b - a);
  }, []);

  const applyProgress = useCallback(
    (p: number) => {
      const clamped = Math.min(1, Math.max(0, p));
      horizontalProgressRef.current = clamped;
      setTx(txFromProgress(clamped));
    },
    [txFromProgress],
  );

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    /**
     * Keep scrollY pinned to the track top until horizontal scrub finishes (p === 1).
     *
     * Runs synchronously on every scroll (capture phase) so fast flings that overshoot
     * the entire sticky band in a single frame still get snapped back. We intentionally
     * do NOT gate on `inSticky` here: `rect.bottom > vh * 0.25` can be false after a
     * big overshoot, which would otherwise release the lock and let the user escape.
     *
     * `pinScrollY = rect.top + scrollY` is the absolute document scroll position at
     * which the track's top edge aligns with the viewport top — i.e., where the
     * browser would naturally pin the sticky element.
     */
    const clampScrollWhileScrubIncomplete = () => {
      const track = trackRef.current;
      if (!track) return;
      const p = horizontalProgressRef.current;
      if (p >= 1 - 1e-6) {
        scrollLockYRef.current = null;
        return;
      }
      const rect = track.getBoundingClientRect();
      const y = window.scrollY;
      const pinScrollY = rect.top + y;
      // Not yet reached the pin (scrolling down toward section, or scrolled fully above it).
      if (y < pinScrollY) {
        scrollLockYRef.current = null;
        return;
      }
      scrollLockYRef.current = pinScrollY;
      if (y > pinScrollY) {
        window.scrollTo({ top: pinScrollY, left: 0, behavior: "instant" });
      }
    };

    /** Update active (centered) card index; only triggers state change when it changes. */
    const syncActiveIndex = (nextIdx: number) => {
      if (activeIdxRef.current !== nextIdx) {
        activeIdxRef.current = nextIdx;
        setActiveIdx(nextIdx);
      }
    };

    const update = () => {
      rafRef.current = null;
      const track = trackRef.current;
      const row = rowRef.current;
      if (!track || !row) return;

      if (reduceMotion.matches) {
        measureTxRange();
        horizontalProgressRef.current = 1;
        setTx(txLastRef.current);
        syncActiveIndex(centeredIndexForTx(txLastRef.current));
        return;
      }

      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const inSticky = rect.top <= 0 && rect.bottom > vh * 0.25;

      if (!inSticky) {
        scrollLockYRef.current = null;
        // No card is visually centered when the section isn't pinned — pause all backgrounds.
        syncActiveIndex(-1);
        // Do not reset progress when off-screen (e.g. scrolling back up); only remeasure on resize.
        return;
      }

      const p = horizontalProgressRef.current;

      if (p >= 1 - 1e-6) {
        scrollLockYRef.current = null;
        const nextTx = txFromProgress(1);
        setTx(nextTx);
        syncActiveIndex(centeredIndexForTx(nextTx));
        return;
      }

      clampScrollWhileScrubIncomplete();
      const nextTx = txFromProgress(p);
      setTx(nextTx);
      syncActiveIndex(centeredIndexForTx(nextTx));
    };

    const schedule = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(update);
    };

    const onScrollClamp = () => {
      if (reduceMotion.matches) return;
      clampScrollWhileScrubIncomplete();
      schedule();
    };

    const onWheel = (e: WheelEvent) => {
      if (reduceMotion.matches) return;
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const inSticky = rect.top <= 0 && rect.bottom > vh * 0.25;
      if (!inSticky) return;

      const p = horizontalProgressRef.current;
      const dy = e.deltaY;
      if (dy === 0) return;

      const pinScrollY = rect.top + window.scrollY;
      const scrollY = window.scrollY;
      const atEnd = p >= 1 - 1e-6;

      if (dy > 0 && p < 1) {
        e.preventDefault();
        applyProgress(p + dy * WHEEL_TO_PROGRESS);
        // `preventDefault` blocks the scroll event, so we must schedule the
        // rAF-driven update ourselves — otherwise `activeIdx` (centered card)
        // never advances past whatever value it held from the last scroll.
        schedule();
        return;
      }

      if (dy < 0 && p > 0) {
        // At the end: move the page up until the pin, then reverse the row.
        if (atEnd && scrollY > pinScrollY + PIN_SCROLL_EPSILON) {
          return;
        }
        e.preventDefault();
        applyProgress(p + dy * WHEEL_TO_PROGRESS);
        schedule();
      }
    };

    const onResize = () => {
      measureTxRange();
      setTx(txFromProgress(horizontalProgressRef.current));
      schedule();
    };

    measureTxRange();
    update();
    window.addEventListener("scroll", onScrollClamp, { passive: true, capture: true });
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
      window.removeEventListener("scroll", onScrollClamp, { capture: true });
      window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", onWheel, { capture: true });
      reduceMotion.removeEventListener("change", update);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [applyProgress, centeredIndexForTx, measureTxRange, txFromProgress]);

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
                  isActive={activeIdx === 0}
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

            {features.map((item, i) => (
              <div key={item.title} className={cardClass}>
                <ExpandableFeaturePreview
                  backgroundVideoFrameSec={item.videoFrameSec}
                  backgroundVideoObjectPosition={item.videoObjectPosition}
                  imageSrc={item.image}
                  title={item.title}
                  isActive={activeIdx === i + 1}
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
