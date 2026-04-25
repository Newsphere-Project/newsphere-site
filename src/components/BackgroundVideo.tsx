import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { drawVideoObjectFitCover } from "../lib/drawVideoObjectFitCover";
import { parseObjectPosition } from "../lib/parseObjectPosition";
import { NS_DITHER_FILTER_ID } from "./DitherFilterDefs";

/** Shared hero / card background clip (replaces static sky.jpg). */
export const BACKGROUND_VIDEO_SRC = "/images/14309025_640_360_30fps.mp4";

/** 1 = normal speed; lower = slower motion for the hero background. */
const BACKGROUND_VIDEO_PLAYBACK_RATE = 0.35;

export type BackgroundVideoLayerProps = {
  /** Looping motion (hero) vs one frozen frame (feature cards). */
  mode?: "loop" | "still";
  /** When `mode` is `still`, seek here (seconds), clamped to clip duration. */
  stillTimeSec?: number;
  /**
   * When `mode` is `still`, which region of the frame `object-fit: cover` shows
   * (CSS `object-position`, e.g. `"0% 0%"`, `"100% 50%"`).
   */
  stillObjectPosition?: string;
};

/**
 * Background video layer that can either loop continuously (`mode="loop"`) or
 * stay paused on a fixed frame (`mode="still"`).
 *
 * Video frames are composited to a 2D canvas and the dither is applied to the
 * canvas via SVG `filter: url(…)` so WebKit (Safari) applies the effect — it
 * does not reliably when the filter is applied directly to a `<video>` element.
 */
export function BackgroundVideoLayer({
  mode = "loop",
  stillTimeSec = 0,
  stillObjectPosition = "50% 50%",
}: BackgroundVideoLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  /** Coalesces ResizeObserver bursts to one rAF (scrollbars / layout). */
  const resizeRafRef = useRef(0);

  const syncCanvasSize = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const dpr = Math.min(window.devicePixelRatio ?? 1, 2.5);
    // `clientWidth` / `clientHeight` are layout integers — stable when the parent
    // is transformed (unlike getBoundingClientRect, which can subpixel-flicker
    // and flip canvas bitmap size by 1px, which shifts 1-bit dither = brightness).
    const cssW = container.clientWidth;
    const cssH = container.clientHeight;
    if (cssW < 1 || cssH < 1) return;
    const w = Math.max(1, Math.round(cssW * dpr));
    const h = Math.max(1, Math.round(cssH * dpr));
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w;
    canvas.height = h;
  }, []);

  const paint = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;

    const w = canvas.width;
    const h = canvas.height;
    if (w < 1 || h < 1) return;

    const op = mode === "still" ? stillObjectPosition : "50% 50%";
    const pos = parseObjectPosition(op);
    drawVideoObjectFitCover(ctx, video, w, h, pos);
  }, [mode, stillObjectPosition]);

  const syncAndPaint = useCallback(() => {
    syncCanvasSize();
    paint();
  }, [syncCanvasSize, paint]);

  const scheduleResizeSyncAndPaint = useCallback(() => {
    if (resizeRafRef.current) return;
    resizeRafRef.current = requestAnimationFrame(() => {
      resizeRafRef.current = 0;
      syncAndPaint();
    });
  }, [syncAndPaint]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      scheduleResizeSyncAndPaint();
    });
    ro.observe(el);
    scheduleResizeSyncAndPaint();
    return () => {
      ro.disconnect();
      if (resizeRafRef.current) {
        cancelAnimationFrame(resizeRafRef.current);
        resizeRafRef.current = 0;
      }
    };
  }, [scheduleResizeSyncAndPaint]);

  // 1) Seek to the desired still frame once after metadata loads.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const applySeek = () => {
      const dur = el.duration;
      const target =
        Number.isFinite(dur) && dur > 0
          ? Math.min(Math.max(0, stillTimeSec), Math.max(0, dur - 0.05))
          : Math.max(0, stillTimeSec);
      el.currentTime = target;
    };

    if (el.readyState >= HTMLMediaElement.HAVE_METADATA) {
      applySeek();
      return;
    }
    el.addEventListener("loadedmetadata", applySeek, { once: true });
    return () => {
      el.removeEventListener("loadedmetadata", applySeek);
    };
  }, [stillTimeSec]);

  // 2) play/pause on mode change
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (mode === "loop") {
      el.playbackRate = BACKGROUND_VIDEO_PLAYBACK_RATE;
      void el.play().catch(() => {});
      return;
    }
    el.pause();
  }, [mode]);

  // 3) Continuous rAF for loop; still frames use seek/loadeddata + one-shot paint
  useEffect(() => {
    if (mode !== "loop") {
      return;
    }
    const tick = () => {
      paint();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [mode, paint]);

  useEffect(() => {
    if (mode === "loop") {
      return;
    }
    syncAndPaint();
  }, [mode, stillObjectPosition, stillTimeSec, syncAndPaint]);

  const ditherStyle = {
    filter: `url(#${NS_DITHER_FILTER_ID})` as const,
    WebkitFilter: `url(#${NS_DITHER_FILTER_ID})` as const,
    imageRendering: "pixelated" as const,
    transform: "translateZ(0)",
    backfaceVisibility: "hidden" as const,
  };

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 isolate h-full w-full [contain:layout_paint]"
    >
      <video
        ref={videoRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-0"
        src={BACKGROUND_VIDEO_SRC}
        muted
        playsInline
        loop={mode === "loop"}
        autoPlay={mode === "loop"}
        preload="auto"
        aria-hidden
        onLoadedData={syncAndPaint}
        onSeeked={syncAndPaint}
      />
      <canvas
        ref={canvasRef}
        className="bg-video-dither pointer-events-none absolute inset-0 z-[1] h-full w-full"
        style={ditherStyle}
        aria-hidden
      />
    </div>
  );
}
