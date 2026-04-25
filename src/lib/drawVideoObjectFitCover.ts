/**
 * Draw a video into a 2D canvas with the same effective crop as
 * `object-fit: cover` + `object-position` (percent 0–100 expressed as 0–1 in `objectPosition`).
 */
export function drawVideoObjectFitCover(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  destWidth: number,
  destHeight: number,
  objectPosition: { x: number; y: number }
): void {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  if (!vw || !vh || !destWidth || !destHeight) {
    return;
  }

  const videoAR = vw / vh;
  const destAR = destWidth / destHeight;

  if (videoAR > destAR) {
    const sourceH = vh;
    const sourceW = vh * destAR;
    const sourceY = 0;
    const sourceX = (vw - sourceW) * objectPosition.x;
    ctx.drawImage(
      video,
      sourceX,
      sourceY,
      sourceW,
      sourceH,
      0,
      0,
      destWidth,
      destHeight
    );
  } else {
    const sourceW = vw;
    const sourceH = vw / destAR;
    const sourceX = 0;
    const sourceY = (vh - sourceH) * objectPosition.y;
    ctx.drawImage(
      video,
      sourceX,
      sourceY,
      sourceW,
      sourceH,
      0,
      0,
      destWidth,
      destHeight
    );
  }
}
