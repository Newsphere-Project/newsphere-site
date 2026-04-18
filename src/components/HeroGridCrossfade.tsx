// import { NoiseOverlay } from "./NoiseOverlay";
// import { useEffect, useRef, useState } from "react";
import { BackgroundVideoLayer } from "./BackgroundVideo";

// Static sky (replaced by looping video for now):
// const sky = "/images/sky.jpg";
const lightGrid = "/images/screenshot-03.png";
const darkGrid = "/images/dark-mode-grid.png";

// /** Parallax on overlay only — video stays untransformed so SVG dither matches filter space. */
// const PARALLAX_OVERLAY_PER_SCROLL = 0.2;
// const PARALLAX_SCROLL_CAP = 900;
//
// function getDocumentScrollY(): number {
//   if (typeof window === "undefined") return 0;
//   const w = window.scrollY ?? window.pageYOffset;
//   if (Number.isFinite(w) && w !== 0) return w;
//   const se = document.scrollingElement ?? document.documentElement;
//   return se.scrollTop ?? 0;
// }

type HeroGridCrossfadeProps = {
  className?: string;
};

export function HeroGridCrossfade({ className = "" }: HeroGridCrossfadeProps) {
  // const [overlayParallaxY, setOverlayParallaxY] = useState(0);
  // const rafRef = useRef<number | null>(null);
  //
  // useEffect(() => {
  //   const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  //
  //   const apply = () => {
  //     rafRef.current = null;
  //     if (reduceMotion.matches) {
  //       setOverlayParallaxY(0);
  //       return;
  //     }
  //     const scrollY = getDocumentScrollY();
  //     const t = Math.min(Math.max(scrollY, 0), PARALLAX_SCROLL_CAP);
  //     setOverlayParallaxY(-t * PARALLAX_OVERLAY_PER_SCROLL);
  //   };
  //
  //   const schedule = () => {
  //     if (rafRef.current != null) return;
  //     rafRef.current = requestAnimationFrame(apply);
  //   };
  //
  //   apply();
  //   window.addEventListener("scroll", schedule, { passive: true, capture: true });
  //   window.addEventListener("resize", schedule);
  //   reduceMotion.addEventListener("change", apply);
  //   return () => {
  //     window.removeEventListener("scroll", schedule, { capture: true });
  //     window.removeEventListener("resize", schedule);
  //     reduceMotion.removeEventListener("change", apply);
  //     if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
  //   };
  // }, []);

  return (
    <div
      className={`relative aspect-[1.547] w-full overflow-hidden rounded-2xl ${className}`}
      role="img"
      aria-label="App preview showing light and dark grid layouts"
    >
      <BackgroundVideoLayer />
      <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center p-[2%] sm:p-[3%] md:p-[4%]">
        <div className="relative h-[94%] w-[96%] max-w-[1280px]">
          <img
            src={lightGrid}
            alt=""
            className="hero-grid-fade-a absolute inset-0 h-full w-full object-contain object-center"
            draggable={false}
          />
          <img
            src={darkGrid}
            alt=""
            className="hero-grid-fade-b absolute inset-0 h-full w-full object-contain object-center"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
