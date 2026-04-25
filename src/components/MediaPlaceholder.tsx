import type { ReactNode } from "react";
// import { NoiseOverlay } from "./NoiseOverlay";
import { BackgroundVideoLayer } from "./BackgroundVideo";

type MediaPlaceholderProps = {
  label?: string;
  className?: string;
  aspectClassName?: string;
  /** Seconds into the shared background clip to freeze; use a different value per card. */
  backgroundVideoFrameSec: number;
  /** CSS `object-position` for the still frame so each card crops a different region under `cover`. */
  backgroundVideoObjectPosition: string;
  /** When set, shows this image centered over the sky background (e.g. cropped screenshots). */
  imageSrc?: string;
  /** Use when wrapped in a control (e.g. expand button) so the parent owns the accessible name. */
  decorative?: boolean;
  /** Only the screenshot scales on hover; sky frame stays fixed (requires ancestor with `group`). */
  scaleInnerOnHover?: boolean;
  /** When true, the background plays (loops); otherwise it stays frozen on `backgroundVideoFrameSec`. */
  isActive?: boolean;
  /** Optional overlay rendered between the background and the front image (z-[1]). */
  backgroundOverlay?: ReactNode;
};

export function MediaPlaceholder({
  label = "Media placeholder",
  className = "",
  aspectClassName = "aspect-[1.547]",
  backgroundVideoFrameSec,
  backgroundVideoObjectPosition,
  imageSrc,
  decorative = false,
  scaleInnerOnHover = false,
  isActive = false,
  backgroundOverlay,
}: MediaPlaceholderProps) {
  const imgTween = scaleInnerOnHover ? "media-inner-tween" : "";

  return (
    <div
      className={`relative flex w-full items-center justify-center overflow-hidden rounded-2xl ${aspectClassName} ${className}`}
      role={decorative ? "presentation" : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? true : undefined}
    >
      {/* Static sky was: style={{ backgroundImage: "url(/images/sky.jpg)" }} — now BackgroundVideoLayer */}
      <BackgroundVideoLayer
        mode={isActive ? "loop" : "still"}
        stillObjectPosition={backgroundVideoObjectPosition}
        stillTimeSec={backgroundVideoFrameSec}
      />
      {/* <NoiseOverlay /> */}
      {backgroundOverlay}
      {imageSrc ? (
        <img
          src={imageSrc}
          alt=""
          className={`absolute inset-0 z-[2] h-full w-full object-contain object-center p-[4%] sm:p-[5%] ${imgTween}`}
          draggable={false}
        />
      ) : null}
      {!decorative ? <span className="sr-only">{label}</span> : null}
    </div>
  );
}
