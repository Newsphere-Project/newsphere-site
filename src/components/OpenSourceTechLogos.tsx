import type { ReactNode } from "react";

/**
 * Monochrome tech marks for the open-source section (fill/stroke use currentColor).
 */
export function OpenSourceTechLogos() {
  return (
    <div
      className="text-black flex w-full flex-wrap items-center justify-center gap-x-10 gap-y-6"
      aria-label="Technologies used: React, TypeScript, Vite, Tauri, Rust, Tailwind CSS"
    >
      <TechMark label="React">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path
            d="M18.6789 15.9759C18.6789 14.5415 17.4796 13.3785 16 13.3785C14.5206 13.3785 13.3211 14.5415 13.3211 15.9759C13.3211 17.4105 14.5206 18.5734 16 18.5734C17.4796 18.5734 18.6789 17.4105 18.6789 15.9759Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M24.7004 11.1537C25.2661 8.92478 25.9772 4.79148 23.4704 3.39016C20.9753 1.99495 17.7284 4.66843 16.0139 6.27318C14.3044 4.68442 10.9663 2.02237 8.46163 3.42814C5.96751 4.82803 6.73664 8.8928 7.3149 11.1357C4.98831 11.7764 1 13.1564 1 15.9759C1 18.7874 4.98416 20.2888 7.29698 20.9289C6.71658 23.1842 5.98596 27.1909 8.48327 28.5877C10.9973 29.9932 14.325 27.3945 16.0554 25.7722C17.7809 27.3864 20.9966 30.0021 23.4922 28.6014C25.9956 27.1963 25.3436 23.1184 24.7653 20.8625C27.0073 20.221 31 18.7523 31 15.9759C31 13.1835 26.9903 11.7923 24.7004 11.1537ZM24.4162 19.667C24.0365 18.5016 23.524 17.2623 22.8971 15.9821C23.4955 14.7321 23.9881 13.5088 24.3572 12.3509C26.0359 12.8228 29.7185 13.9013 29.7185 15.9759C29.7185 18.07 26.1846 19.1587 24.4162 19.667ZM22.85 27.526C20.988 28.571 18.2221 26.0696 16.9478 24.8809C17.7932 23.9844 18.638 22.9422 19.4625 21.7849C20.9129 21.6602 22.283 21.4562 23.5256 21.1777C23.9326 22.7734 24.7202 26.4763 22.85 27.526ZM9.12362 27.5111C7.26143 26.47 8.11258 22.8946 8.53957 21.2333C9.76834 21.4969 11.1286 21.6865 12.5824 21.8008C13.4123 22.9332 14.2816 23.9741 15.1576 24.8857C14.0753 25.9008 10.9945 28.557 9.12362 27.5111ZM2.28149 15.9759C2.28149 13.874 5.94207 12.8033 7.65904 12.3326C8.03451 13.5165 8.52695 14.7544 9.12123 16.0062C8.51925 17.2766 8.01977 18.5341 7.64085 19.732C6.00369 19.2776 2.28149 18.0791 2.28149 15.9759ZM9.1037 4.50354C10.9735 3.45416 13.8747 6.00983 15.1159 7.16013C14.2444 8.06754 13.3831 9.1006 12.5603 10.2265C11.1494 10.3533 9.79875 10.5569 8.55709 10.8297C8.09125 9.02071 7.23592 5.55179 9.1037 4.50354ZM20.3793 11.5771C21.3365 11.6942 22.2536 11.85 23.1147 12.0406C22.8562 12.844 22.534 13.6841 22.1545 14.5453C21.6044 13.5333 21.0139 12.5416 20.3793 11.5771ZM16.0143 8.0481C16.6054 8.66897 17.1974 9.3623 17.7798 10.1145C16.5985 10.0603 15.4153 10.0601 14.234 10.1137C14.8169 9.36848 15.414 8.67618 16.0143 8.0481ZM9.8565 14.5444C9.48329 13.6862 9.16398 12.8424 8.90322 12.0275C9.75918 11.8418 10.672 11.69 11.623 11.5748C10.9866 12.5372 10.3971 13.5285 9.8565 14.5444ZM11.6503 20.4657C10.6679 20.3594 9.74126 20.2153 8.88556 20.0347C9.15044 19.2055 9.47678 18.3435 9.85796 17.4668C10.406 18.4933 11.0045 19.4942 11.6503 20.4657ZM16.0498 23.9915C15.4424 23.356 14.8365 22.6531 14.2448 21.8971C15.4328 21.9423 16.6231 21.9424 17.811 21.891C17.2268 22.6608 16.6369 23.3647 16.0498 23.9915ZM22.1667 17.4222C22.5677 18.3084 22.9057 19.1657 23.1742 19.9809C22.3043 20.1734 21.3652 20.3284 20.3757 20.4435C21.015 19.4607 21.6149 18.4536 22.1667 17.4222ZM18.7473 20.5941C16.9301 20.72 15.1016 20.7186 13.2838 20.6044C12.2509 19.1415 11.3314 17.603 10.5377 16.0058C11.3276 14.4119 12.2404 12.8764 13.2684 11.4158C15.0875 11.2825 16.9178 11.2821 18.7369 11.4166C19.7561 12.8771 20.6675 14.4086 21.4757 15.9881C20.6771 17.5812 19.7595 19.1198 18.7473 20.5941ZM22.8303 4.4666C24.7006 5.51254 23.8681 9.22726 23.4595 10.8426C22.2149 10.5641 20.8633 10.3569 19.4483 10.2281C18.6239 9.09004 17.7698 8.05518 16.9124 7.15949C18.1695 5.98441 20.9781 3.43089 22.8303 4.4666Z"
            fill="currentColor"
          />
        </svg>
      </TechMark>

      <TechMark label="TypeScript">
        <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path
            d="M12.5 8V7.83333C12.5 7.09695 11.903 6.5 11.1667 6.5H10C9.17157 6.5 8.5 7.17157 8.5 8C8.5 8.82843 9.17157 9.5 10 9.5H11C11.8284 9.5 12.5 10.1716 12.5 11C12.5 11.8284 11.8284 12.5 11 12.5H10C9.17157 12.5 8.5 11.8284 8.5 11M8 6.5H3M5.5 6.5V13M0.5 0.5H14.5V14.5H0.5V0.5Z"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </TechMark>

      <TechMark label="Vite">
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            fill="currentColor"
            d="m8.286 10.578.512-8.657a.306.306 0 0 1 .247-.282L17.377.006a.306.306 0 0 1 .353.385l-1.558 5.403a.306.306 0 0 0 .352.385l2.388-.46a.306.306 0 0 1 .332.438l-6.79 13.55-.123.19a.294.294 0 0 1-.252.14c-.177 0-.35-.152-.305-.369l1.095-5.301a.306.306 0 0 0-.388-.355l-1.433.435a.306.306 0 0 1-.389-.354l.69-3.375a.306.306 0 0 0-.37-.36l-2.32.536a.306.306 0 0 1-.374-.316zm14.976-7.926L17.284 3.74l-.544 1.887 2.077-.4a.8.8 0 0 1 .84.369.8.8 0 0 1 .034.783L12.9 19.93l-.013.025-.015.023-.122.19a.801.801 0 0 1-.672.37.826.826 0 0 1-.634-.302.8.8 0 0 1-.16-.67l1.029-4.981-1.12.34a.81.81 0 0 1-.86-.262.802.802 0 0 1-.165-.67l.63-3.08-2.027.468a.808.808 0 0 1-.768-.233.81.81 0 0 1-.217-.6l.389-6.57-7.44-1.33a.612.612 0 0 0-.64.906L11.58 23.691a.612.612 0 0 0 1.066-.004l11.26-20.135a.612.612 0 0 0-.644-.9z"
          />
        </svg>
      </TechMark>

      <TechMark label="Tauri">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 128 128"
          aria-hidden
        >
          <path
            fill="currentColor"
            d="M86.242 46.547a12.19 12.19 0 0 1-24.379 0c0-6.734 5.457-12.191 12.191-12.191a12.19 12.19 0 0 1 12.188 12.191zm0 0"
          />
          <path
            fill="currentColor"
            d="M41.359 81.453a12.19 12.19 0 1 1 24.383 0c0 6.734-5.457 12.191-12.191 12.191S41.36 88.187 41.36 81.453zm0 0"
          />
          <path
            fill="currentColor"
            d="M99.316 85.637a46.5 46.5 0 0 1-16.059 6.535 32.675 32.675 0 0 0 1.797-10.719 33.3 33.3 0 0 0-.242-4.02 32.69 32.69 0 0 0 6.996-3.418 32.7 32.7 0 0 0 12.066-14.035 32.71 32.71 0 0 0-21.011-44.934 32.72 32.72 0 0 0-33.91 10.527 32.85 32.85 0 0 0-1.48 1.91 54.32 54.32 0 0 0-17.848 5.184A46.536 46.536 0 0 1 60.25 2.094a46.53 46.53 0 0 1 26.34-.375c8.633 2.418 16.387 7.273 22.324 13.984s9.813 15 11.16 23.863a46.537 46.537 0 0 1-20.758 46.071zM30.18 41.156l11.41 1.402a32.44 32.44 0 0 1 1.473-6.469 46.44 46.44 0 0 0-12.883 5.066zm0 0"
          />
          <path
            fill="currentColor"
            d="M28.207 42.363a46.49 46.49 0 0 1 16.188-6.559 32.603 32.603 0 0 0-2.004 11.297 32.56 32.56 0 0 0 .188 3.512 32.738 32.738 0 0 0-6.859 3.371A32.7 32.7 0 0 0 23.652 68.02c-2.59 5.742-3.461 12.113-2.52 18.34s3.668 12.051 7.844 16.77 9.617 8.129 15.684 9.824 12.496 1.605 18.512-.262a32.72 32.72 0 0 0 15.402-10.266 34.9 34.9 0 0 0 1.484-1.918 54.283 54.283 0 0 0 17.855-5.223 46.528 46.528 0 0 1-8.723 16.012 46.511 46.511 0 0 1-21.918 14.609 46.53 46.53 0 0 1-26.34.375 46.6 46.6 0 0 1-22.324-13.984A46.56 46.56 0 0 1 7.453 88.434a46.53 46.53 0 0 1 3.582-26.098 46.533 46.533 0 0 1 17.172-19.973zm69.074 44.473c-.059.035-.121.066-.18.102.059-.035.121-.066.18-.102zm0 0"
          />
        </svg>
      </TechMark>

      <TechMark label="Rust">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 106 106" aria-hidden>
          <g transform="translate(53, 53)">
            <path
              transform="translate(0.5, 0.5)"
              fill="currentColor"
              fillRule="evenodd"
              d="M -9,-15 H 4 C 12,-15 12,-7 4,-7 H -9 Z     M -40,22 H 0 V 11 H -9 V 3 H 1 C 12,3 6,22 15,22 H 40     V 3 H 34 V 5 C 34,13 25,12 24,7 C 23,2 19,-2 18,-2 C 33,-10 24,-26 12,-26 H -35     V -15 H -25 V 11 H -40 Z"
            />
            <g mask="url(#open-src-rust-holes)">
              <circle r="43" fill="none" stroke="currentColor" strokeWidth="9" />
              <g>
                <polygon
                  id="open-src-rust-cog"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  fill="none"
                  points="46,3 51,0 46,-3"
                />
                <use href="#open-src-rust-cog" transform="rotate(11.25)" />
                <use href="#open-src-rust-cog" transform="rotate(22.50)" />
                <use href="#open-src-rust-cog" transform="rotate(33.75)" />
                <use href="#open-src-rust-cog" transform="rotate(45.00)" />
                <use href="#open-src-rust-cog" transform="rotate(56.25)" />
                <use href="#open-src-rust-cog" transform="rotate(67.50)" />
                <use href="#open-src-rust-cog" transform="rotate(78.75)" />
                <use href="#open-src-rust-cog" transform="rotate(90.00)" />
                <use href="#open-src-rust-cog" transform="rotate(101.25)" />
                <use href="#open-src-rust-cog" transform="rotate(112.50)" />
                <use href="#open-src-rust-cog" transform="rotate(123.75)" />
                <use href="#open-src-rust-cog" transform="rotate(135.00)" />
                <use href="#open-src-rust-cog" transform="rotate(146.25)" />
                <use href="#open-src-rust-cog" transform="rotate(157.50)" />
                <use href="#open-src-rust-cog" transform="rotate(168.75)" />
                <use href="#open-src-rust-cog" transform="rotate(180.00)" />
                <use href="#open-src-rust-cog" transform="rotate(191.25)" />
                <use href="#open-src-rust-cog" transform="rotate(202.50)" />
                <use href="#open-src-rust-cog" transform="rotate(213.75)" />
                <use href="#open-src-rust-cog" transform="rotate(225.00)" />
                <use href="#open-src-rust-cog" transform="rotate(236.25)" />
                <use href="#open-src-rust-cog" transform="rotate(247.50)" />
                <use href="#open-src-rust-cog" transform="rotate(258.75)" />
                <use href="#open-src-rust-cog" transform="rotate(270.00)" />
                <use href="#open-src-rust-cog" transform="rotate(281.25)" />
                <use href="#open-src-rust-cog" transform="rotate(292.50)" />
                <use href="#open-src-rust-cog" transform="rotate(303.75)" />
                <use href="#open-src-rust-cog" transform="rotate(315.00)" />
                <use href="#open-src-rust-cog" transform="rotate(326.25)" />
                <use href="#open-src-rust-cog" transform="rotate(337.50)" />
                <use href="#open-src-rust-cog" transform="rotate(348.75)" />
              </g>
              <g>
                <polygon
                  id="open-src-rust-mount"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinejoin="round"
                  fill="none"
                  points="-7,-42 0,-35 7,-42"
                />
                <use href="#open-src-rust-mount" transform="rotate(72)" />
                <use href="#open-src-rust-mount" transform="rotate(144)" />
                <use href="#open-src-rust-mount" transform="rotate(216)" />
                <use href="#open-src-rust-mount" transform="rotate(288)" />
              </g>
            </g>
            <mask id="open-src-rust-holes">
              <rect x="-60" y="-60" width="120" height="120" fill="white" />
              <circle id="open-src-rust-hole" cy="-40" r="3" fill="black" />
              <use href="#open-src-rust-hole" transform="rotate(72)" />
              <use href="#open-src-rust-hole" transform="rotate(144)" />
              <use href="#open-src-rust-hole" transform="rotate(216)" />
              <use href="#open-src-rust-hole" transform="rotate(288)" />
            </mask>
          </g>
        </svg>
      </TechMark>

      <TechMark label="Tailwind CSS">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 54 33"
          aria-hidden
        >
          <g clipPath="url(#open-src-tailwind-clip)">
            <path
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
            />
          </g>
          <defs>
            <clipPath id="open-src-tailwind-clip">
              <path fill="#fff" d="M0 0h54v32.4H0z" />
            </clipPath>
          </defs>
        </svg>
      </TechMark>
    </div>
  );
}

function TechMark({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center [&_svg]:h-full [&_svg]:w-full [&_svg]:max-w-none"
      title={label}
    >
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
