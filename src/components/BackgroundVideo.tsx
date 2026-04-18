import { useEffect, useRef } from "react";
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
 * Implementation split into two independent effects so runtime mode flips
 * don't race with seeks:
 *   1) Initial still-frame seek — seeks `stillTimeSec` exactly once (and again
 *      only if `stillTimeSec` itself changes).
 *   2) Play/pause on mode flip — a single imperative `play()` or `pause()`.
 */
export function BackgroundVideoLayer({
  mode = "loop",
  stillTimeSec = 0,
  stillObjectPosition = "50% 50%",
}: BackgroundVideoLayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // 1) Seek to the desired still frame once after metadata loads. Never seeks
  //    again during runtime mode flips — prevents racing with pending play().
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

  // 2) Apply play/pause on mode change. Safe to call regardless of readyState;
  //    play() resolves once the video can play, and we swallow AbortError
  //    triggered by rapid pause/play toggles.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (mode === "loop") {
      el.playbackRate = BACKGROUND_VIDEO_PLAYBACK_RATE;
      void el.play().catch(() => {});
      return;
    }
    // still: pause wherever the loop left off. Do not seek here — the initial
    // seek effect already positioned the frame once; changing it per toggle
    // creates races.
    el.pause();
  }, [mode]);

  return (
    <video
      ref={videoRef}
      className={`bg-video-dither pointer-events-none absolute inset-0 z-0 h-full w-full object-cover ${mode === "loop" ? "object-center" : ""}`}
      style={{
        filter: `url(#${NS_DITHER_FILTER_ID})`,
        WebkitFilter: `url(#${NS_DITHER_FILTER_ID})`,
        imageRendering: "pixelated",
        // Stable compositor layer — reduces scroll flicker with SVG filters on video.
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        ...(mode === "still" ? { objectPosition: stillObjectPosition } : {}),
      }}
      src={BACKGROUND_VIDEO_SRC}
      muted
      playsInline
      loop={mode === "loop"}
      autoPlay={mode === "loop"}
      preload="auto"
      aria-hidden
    />
  );
}
