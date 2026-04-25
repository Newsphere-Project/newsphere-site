import { useCallback, useEffect, useRef, useState } from "react";
import { ExpandableFeaturePreview } from "./ExpandableFeaturePreview";
import { ScrollContinueHint } from "./ScrollContinueHint";

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
  /** When true (e.g. image lightbox open), hides the scroll hint. */
  scrollHintSuppressed?: boolean;
};

/** Maps vertical wheel distance to horizontal scrub progress (0–1). Lower = slower. */
const WHEEL_TO_PROGRESS = 0.00036;

/**
 * Max |vertical wheel delta| (in CSS pixels) applied per event while scrubbing
 * the horizontal row. Fast trackpad flings can report 400+ px/event; that jumps
 * progress and fights pin clamping — cap keeps motion smooth.
 */
const MAX_WHEEL_DELTA_Y_PX = 30;

/** Pixels: treat scrollY as aligned with the pin when within this of `pinScrollY`. */
const PIN_SCROLL_EPSILON = 2;

/**
 * Pinned "sticky" band. Uses a few tenths of a px top tolerance: subpixel
 * `getBoundingClientRect().top` can flutter around 0 at the pin edge, which was
 * flipping the active card / play-state every frame and read as dither/brightness
 * flicker on the feature videos.
 */
function isTrackInPinnedBand(rect: DOMRect, vh: number) {
  return rect.top < 0.5 && rect.bottom > vh * 0.25;
}

/**
 * How strongly each card "sticks" at its centered position. 0 = no stickiness
 * (linear scroll), 1 = fully paused at each anchor. Higher values inflate
 * d(warp)/dp in the middle of each segment (feels like extra trackpad
 * momentum). Keep low so one gesture crosses the row without feeling sluggish.
 */
const STICKINESS = 0.12;

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
 * After the user stops scrolling for this many ms, the row snaps to the nearest
 * card anchor. Short enough to feel responsive, long enough not to fight a
 * trackpad user who's still actively scrubbing.
 */
const SNAP_IDLE_MS = 100;

/**
 * Duration of the snap-to-anchor animation, in ms. Ease-out cubic is used so
 * the row settles gently rather than decelerating abruptly.
 */
const SNAP_DURATION_MS = 200;

/** Ignore snaps that would move progress less than this (already at anchor). */
const SNAP_MIN_DELTA = 1e-4;

/**
 * Minimum wheel-input multiplier when the row is exactly at a card anchor.
 * 1 = no resistance; 0.5 = needs ~2x more scroll distance to depart. Blends
 * back to 1 (no resistance) across `ANCHOR_RESISTANCE_RADIUS` of the segment.
 */
const ANCHOR_RESISTANCE_MIN = 0.88;

/**
 * Fraction of a segment within which anchor-resistance applies. 0.45 keeps the
 * “magnet” zone tight so most of the track scrubs at full speed.
 */
const ANCHOR_RESISTANCE_RADIUS = 0.45;

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

/**
 * Scale wheel input near card anchors so it takes more scrolling to move a
 * card off-center (or reach a new center). Returns a multiplier in
 * `[ANCHOR_RESISTANCE_MIN, 1]`: `ANCHOR_RESISTANCE_MIN` right at an anchor,
 * blending smoothly up to `1` by `ANCHOR_RESISTANCE_RADIUS * segmentLength`
 * away from the nearest anchor.
 */
/** Normalize wheel delta to CSS pixels, then clamp magnitude for scrubbing. */
function clampScrubWheelDeltaY(e: WheelEvent): number {
  let d = e.deltaY;
  if (e.deltaMode === 1) d *= 16;
  else if (e.deltaMode === 2) d *= typeof window !== "undefined" ? window.innerHeight : 600;
  const cap = MAX_WHEEL_DELTA_Y_PX;
  if (d > cap) return cap;
  if (d < -cap) return -cap;
  return d;
}

function anchorResistanceMultiplier(p: number, numAnchors: number): number {
  if (numAnchors < 2) return 1;
  const clamped = Math.max(0, Math.min(1, p));
  const segCount = numAnchors - 1;
  const segLen = 1 / segCount;
  const nearestIdx = Math.max(
    0,
    Math.min(segCount, Math.round(clamped * segCount)),
  );
  const nearestAnchor = nearestIdx / segCount;
  // Normalized 0→1 distance to nearest anchor within one half-segment.
  const norm = Math.min(1, Math.abs(clamped - nearestAnchor) / segLen / 0.5);
  if (norm >= ANCHOR_RESISTANCE_RADIUS) return 1;
  const t = norm / ANCHOR_RESISTANCE_RADIUS;
  const smoothstep = t * t * (3 - 2 * t);
  return ANCHOR_RESISTANCE_MIN + (1 - ANCHOR_RESISTANCE_MIN) * smoothstep;
}

export function FeatureShowcaseScroll({
  sectionTitle,
  reader,
  features,
  onExpand,
  scrollHintSuppressed = false,
}: FeatureShowcaseScrollProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackInView, setTrackInView] = useState(false);
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

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setTrackInView(entry.isIntersecting);
      },
      { root: null, threshold: [0, 0.02, 0.1], rootMargin: "0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
     * Snap-to-anchor state. When the user stops scrolling for `SNAP_IDLE_MS`,
     * the row eases to the nearest card anchor over `SNAP_DURATION_MS`. Any
     * new scrub input cancels the pending idle timer and any running animation,
     * so the user never has to fight the snap.
     */
    let snapRafId: number | null = null;
    let snapIdleTimeoutId: number | null = null;

    /**
     * Trap scrollY at the track-top pin whenever the row is partially or fully
     * engaged. Runs synchronously on every scroll (capture phase) so fast
     * flings that overshoot the pin in a single frame are snapped back before
     * the user can escape. We intentionally do NOT gate on `inSticky` or on
     * section visibility here: a big fling can push the section fully offscreen
     * in one frame, and we still want the clamp to pull the user back.
     *
     * `pinScrollY = rect.top + scrollY` is the absolute document scroll
     * position at which the track's top aligns with the viewport top — the
     * natural sticky-pin point.
     *
     * Trap rules:
     *   - Downward (`y > pinScrollY`): trap while `p < 1`. The user must scrub
     *     the row to completion before continuing down past the section.
     *   - Upward   (`y < pinScrollY`): trap while `p > 0`. The user must
     *     reverse the row back to its start before continuing up past the
     *     section.
     *
     * The wheel handler drives the actual `p` change; this function only
     * guards against scroll events that would overshoot the pin (fast wheel,
     * scrollbar drag, keyboard, touch momentum, etc.).
     */
    const clampScrollWhileScrubIncomplete = () => {
      const track = trackRef.current;
      if (!track) return;
      const p = horizontalProgressRef.current;
      const rect = track.getBoundingClientRect();
      const y = window.scrollY;
      const vh = window.innerHeight;

      // When the track does not intersect the viewport vertically, pin math can
      // go negative (e.g. tall section mostly above the fold). Browsers clamp
      // scrollTo(negative) to 0 — a sudden jump to the top of the page.
      if (rect.bottom <= 0 || rect.top >= vh) {
        scrollLockYRef.current = null;
        return;
      }

      const pinScrollYRaw = rect.top + y;
      if (!Number.isFinite(pinScrollYRaw) || pinScrollYRaw < 0) {
        scrollLockYRef.current = null;
        return;
      }

      const maxScrollY = Math.max(
        0,
        document.documentElement.scrollHeight - vh,
      );
      const pinScrollY = Math.min(pinScrollYRaw, maxScrollY);

      // Downward overshoot while scrub is incomplete.
      if (y > pinScrollY && p < 1 - 1e-6) {
        scrollLockYRef.current = pinScrollY;
        window.scrollTo({ top: pinScrollY, left: 0, behavior: "instant" });
        return;
      }

      // Upward overshoot while the row is still engaged (past its start).
      // Forces the wheel handler to reverse the row back to p=0 before the
      // user can continue scrolling up past the section.
      if (y < pinScrollY && p > 1e-6) {
        scrollLockYRef.current = pinScrollY;
        window.scrollTo({ top: pinScrollY, left: 0, behavior: "instant" });
        return;
      }

      scrollLockYRef.current = null;
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
      const inSticky = isTrackInPinnedBand(rect, vh);

      if (!inSticky) {
        scrollLockYRef.current = null;
        // No card is visually centered when the section isn't pinned — pause all backgrounds.
        syncActiveIndex(-1);
        // Section no longer pinned: cancel any pending/running snap so it can't
        // fire while the user has already scrolled away.
        cancelSnap();
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

    /** Nearest anchor progress value (in [0,1]) for the given linear progress. */
    const nearestAnchorProgress = (p: number) => {
      const n = cardCentersRef.current.length;
      if (n < 2) return p;
      const segCount = n - 1;
      const idx = Math.max(0, Math.min(segCount, Math.round(p * segCount)));
      return idx / segCount;
    };

    const cancelSnap = () => {
      if (snapRafId != null) {
        cancelAnimationFrame(snapRafId);
        snapRafId = null;
      }
      if (snapIdleTimeoutId != null) {
        window.clearTimeout(snapIdleTimeoutId);
        snapIdleTimeoutId = null;
      }
    };

    const startSnap = () => {
      const track = trackRef.current;
      if (!track) return;
      // Only snap while the section is actually pinned.
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      if (!isTrackInPinnedBand(rect, vh)) return;

      const from = horizontalProgressRef.current;
      if (from <= 0 || from >= 1 - 1e-6) return;
      const target = nearestAnchorProgress(from);
      if (Math.abs(target - from) < SNAP_MIN_DELTA) return;

      const startMs = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - startMs) / SNAP_DURATION_MS);
        // Ease-out cubic: fast start, gentle settle at the anchor.
        const eased = 1 - Math.pow(1 - t, 3);
        const next = from + (target - from) * eased;
        horizontalProgressRef.current = next;
        const nextTx = txFromProgress(next);
        setTx(nextTx);
        syncActiveIndex(centeredIndexForTx(nextTx));
        if (t < 1) {
          snapRafId = requestAnimationFrame(step);
        } else {
          snapRafId = null;
        }
      };
      snapRafId = requestAnimationFrame(step);
    };

    /** Reset the idle timer; schedules `startSnap` once the user stops scrubbing. */
    const scheduleSnap = () => {
      cancelSnap();
      snapIdleTimeoutId = window.setTimeout(() => {
        snapIdleTimeoutId = null;
        startSnap();
      }, SNAP_IDLE_MS);
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
      if (!isTrackInPinnedBand(rect, vh)) return;

      const p = horizontalProgressRef.current;
      const dy = clampScrubWheelDeltaY(e);
      if (dy === 0) return;

      const pinScrollY = rect.top + window.scrollY;
      const scrollY = window.scrollY;
      const atEnd = p >= 1 - 1e-6;

      // Near a card anchor, scale down the wheel input so it takes more
      // scrolling to depart center. Layered on top of the visual warp for a
      // tactile "magnet well" feel.
      const resistance = anchorResistanceMultiplier(
        p,
        cardCentersRef.current.length,
      );
      const effectiveDelta = dy * WHEEL_TO_PROGRESS * resistance;

      if (dy > 0 && p < 1) {
        e.preventDefault();
        applyProgress(p + effectiveDelta);
        // `preventDefault` blocks the scroll event, so we must schedule the
        // rAF-driven update ourselves — otherwise `activeIdx` (centered card)
        // never advances past whatever value it held from the last scroll.
        schedule();
        // Defer a snap-to-anchor until the user stops scrubbing.
        scheduleSnap();
        return;
      }

      if (dy < 0 && p > 0) {
        // At the end: move the page up until the pin, then reverse the row.
        if (atEnd && scrollY > pinScrollY + PIN_SCROLL_EPSILON) {
          return;
        }
        e.preventDefault();
        applyProgress(p + effectiveDelta);
        schedule();
        scheduleSnap();
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
      cancelSnap();
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
              <ExpandableFeaturePreview
                backgroundVideoFrameSec={reader.videoFrameSec}
                backgroundVideoObjectPosition={reader.videoObjectPosition}
                imageSrc={reader.imageSrc}
                title={reader.title}
                isActive={activeIdx === 0}
                onExpand={() => onExpand(reader.imageSrc, reader.title)}
              />
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

      <ScrollContinueHint
        suppress={!trackInView || scrollHintSuppressed}
      />
    </div>
  );
}
