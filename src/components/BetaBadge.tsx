type BetaBadgeProps = {
  /** Slightly larger on the home hero wordmark. */
  size?: "default" | "hero";
};

/**
 * Product beta label next to the Newsphere wordmark — black/white pill only.
 */
export function BetaBadge({ size = "default" }: BetaBadgeProps) {
  const dim =
    size === "hero"
      ? "px-[0.4rem] py-[0.1rem] text-[9px]"
      : "px-1 py-[0.1rem] text-[8px] leading-none";
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full bg-black font-semibold text-white uppercase tracking-wide ${dim}`}
    >
      Beta
    </span>
  );
}
