import { useLayoutEffect } from "react";

/** Stable id for `filter: url(#…)` on background videos (must match BackgroundVideoLayer). */
export const NS_DITHER_FILTER_ID = "ns-dither-filter";

const DITHER_TILE_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAA5ElEQVQYlQXBgQbCUABA0fdrk0ySSZJJkiRJMjOTTGZmkiRJZiYzyczMzGQmfdrtHPH7/TgcDuR5zna7pWka9vs9aZqyXq8R0+mU5/OJoihcLhfG4zFBENDtdjmdToj3+81yueTz+WCaJnEcM5/PKcsSXdcRsizjeR6j0YjH40Gr1cJxHAaDAbfbDVHXNbvdjiRJWK1WfL9fLMsiyzI2mw1CVVV836fT6XA8HplMJoRhSK/X43w+I6IoYjabURQFmqbxer1YLBZUVYVhGAhJkrBtm36/z/V6pd1u47ouw+GQ+/3OH4/Fn8FvF/NxAAAAAElFTkSuQmCC";

/**
 * Global SVG filter defs for 1-bit-style dither on the *canvas* that composites each
 * video frame (see BackgroundVideoLayer). Applied to a bitmap so it works in Safari;
 * WebKit ignores these filters on `<video>`. feImage tile size is adjusted on resize
 * so the pattern stays stable across devicePixelRatio.
 */
export function DitherFilterDefs() {
  useLayoutEffect(() => {
    let rafId = 0;
    let resizeScheduled = false;

    const applyDitherTileSize = () => {
      resizeScheduled = false;
      const dpr = window.devicePixelRatio || 1;
      const size = 8 / dpr;
      const w = size.toFixed(6);
      document.querySelectorAll(`feImage[data-dither-tile]`).forEach((el) => {
        // Skip if unchanged: resize often fires when scrolling (e.g. mobile URL bar)
        // without DPR changing; touching feImage invalidates the filter and flickers canvases.
        if (el.getAttribute("width") === w && el.getAttribute("height") === w) {
          return;
        }
        el.setAttribute("width", w);
        el.setAttribute("height", w);
      });
    };

    const scheduleDitherTileSize = () => {
      if (resizeScheduled) return;
      resizeScheduled = true;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        applyDitherTileSize();
      });
    };

    applyDitherTileSize();
    window.addEventListener("resize", scheduleDitherTileSize);
    return () => {
      window.removeEventListener("resize", scheduleDitherTileSize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <svg
      className="pointer-events-none fixed h-0 w-0 overflow-hidden"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <filter
          id={NS_DITHER_FILTER_ID}
          colorInterpolationFilters="sRGB"
          x="0"
          y="0"
          width="100%"
          height="100%"
        >
          <feFlood
            floodColor="#000000"
            floodOpacity="0.5"
            x="0%"
            y="0%"
            result="flood"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="flood"
            result="blend1"
          />
          <feImage
            data-dither-tile=""
            href={DITHER_TILE_PNG}
            x="0"
            y="0"
            width="8"
            height="8"
            result="image1"
          />
          <feTile in="image1" result="tile" />
          <feBlend mode="overlay" in="blend1" in2="tile" result="blend2" />
          <feColorMatrix
            in="blend2"
            type="saturate"
            values="0"
            result="desat"
          />
          <feComponentTransfer in="desat">
            <feFuncR type="discrete" tableValues="0 1" />
            <feFuncG type="discrete" tableValues="0 1" />
            <feFuncB type="discrete" tableValues="0 1" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
}
