import { MediaPlaceholder } from "./MediaPlaceholder";

type ExpandableFeaturePreviewProps = {
  imageSrc: string;
  title: string;
  /** Distinct timestamp for the frozen video frame behind the screenshot. */
  backgroundVideoFrameSec: number;
  /** Distinct crop / focal point for that frame (`object-position`). */
  backgroundVideoObjectPosition: string;
  /** When true, the card's background plays; otherwise it stays frozen. */
  isActive?: boolean;
  onExpand: () => void;
};

export function ExpandableFeaturePreview({
  imageSrc,
  title,
  backgroundVideoFrameSec,
  backgroundVideoObjectPosition,
  isActive = false,
  onExpand,
}: ExpandableFeaturePreviewProps) {
  return (
    <button
      type="button"
      className="border-border group focus-visible:ring-fg/25 relative w-full cursor-zoom-in rounded-2xl border border-transparent bg-transparent p-0 text-left transition-[box-shadow,border-color] duration-[900ms] ease-[cubic-bezier(0.45,0,0.55,1)] hover:border-[color-mix(in_oklch,var(--color-fg)_14%,transparent)] hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none"
      onClick={onExpand}
      aria-label={`Expand ${title} preview`}
    >
      <MediaPlaceholder
        backgroundVideoFrameSec={backgroundVideoFrameSec}
        backgroundVideoObjectPosition={backgroundVideoObjectPosition}
        imageSrc={imageSrc}
        label={title}
        decorative
        scaleInnerOnHover
        isActive={isActive}
        backgroundOverlay={
          <span
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/35 via-black/10 to-transparent opacity-0 transition-opacity duration-[900ms] ease-[cubic-bezier(0.34,1.45,0.64,1)] group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
            aria-hidden
          />
        }
      />
      <span
        className="pointer-events-none absolute inset-0 z-[4] flex items-end justify-center rounded-2xl pb-3 opacity-0 transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.34,1.45,0.64,1)] group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
        aria-hidden
      >
        <span className="text-fg bg-raised/95 border-border rounded-full border px-2.5 py-1 text-xs tracking-[-0.02em] shadow-sm transition-transform duration-[900ms] ease-[cubic-bezier(0.34,1.45,0.64,1)] group-hover:scale-105 motion-reduce:group-hover:scale-100">
          Click to expand
        </span>
      </span>
    </button>
  );
}
