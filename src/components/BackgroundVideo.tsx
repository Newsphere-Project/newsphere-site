import { useLayoutEffect, useRef } from "react";
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

export function BackgroundVideoLayer({
  mode = "loop",
  stillTimeSec = 0,
  stillObjectPosition = "50% 50%",
}: BackgroundVideoLayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    if (mode !== "loop") return;
    const el = videoRef.current;
    if (!el) return;

    const applyRate = () => {
      el.playbackRate = BACKGROUND_VIDEO_PLAYBACK_RATE;
    };

    applyRate();
    el.addEventListener("loadedmetadata", applyRate);
    return () => el.removeEventListener("loadedmetadata", applyRate);
  }, [mode]);

  useLayoutEffect(() => {
    if (mode !== "still") return;
    const el = videoRef.current;
    if (!el) return;

    const applySeek = () => {
      const dur = el.duration;
      const target =
        Number.isFinite(dur) && dur > 0
          ? Math.min(Math.max(0, stillTimeSec), Math.max(0, dur - 0.05))
          : Math.max(0, stillTimeSec);
      el.pause();
      el.currentTime = target;
    };

    const onSeeked = () => {
      el.pause();
    };

    el.addEventListener("loadedmetadata", applySeek);
    el.addEventListener("seeked", onSeeked);
    if (el.readyState >= HTMLMediaElement.HAVE_METADATA) {
      applySeek();
    }
    return () => {
      el.removeEventListener("loadedmetadata", applySeek);
      el.removeEventListener("seeked", onSeeked);
    };
  }, [mode, stillTimeSec]);

  return (
    <video
      ref={videoRef}
      className={`bg-video-dither pointer-events-none absolute inset-0 z-0 h-full w-full object-cover ${mode === "loop" ? "object-center" : ""}`}
      style={{
        filter: `url(#${NS_DITHER_FILTER_ID})`,
        WebkitFilter: `url(#${NS_DITHER_FILTER_ID})`,
        imageRendering: "pixelated",
        ...(mode === "still" ? { objectPosition: stillObjectPosition } : {}),
      }}
      src={BACKGROUND_VIDEO_SRC}
      muted
      playsInline
      loop={mode === "loop"}
      autoPlay={mode === "loop"}
      preload={mode === "still" ? "auto" : undefined}
      aria-hidden
    />
  );
}
