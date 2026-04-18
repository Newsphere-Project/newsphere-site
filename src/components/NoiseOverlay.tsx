type NoiseOverlayProps = {
  className?: string;
};

/**
 * Tiled noise + stepped motion, composited on the sky only (sits under screenshots).
 */
export function NoiseOverlay({ className = "" }: NoiseOverlayProps) {
  return (
    <div
      className={`noise-wrapper pointer-events-none absolute inset-0 z-[1] overflow-hidden ${className}`}
      aria-hidden
    >
      <div className="noise" />
    </div>
  );
}
