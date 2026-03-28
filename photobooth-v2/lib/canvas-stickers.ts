import type { StickerFrameType } from "@/lib/photobooth-types";

/** Draw cute corner stickers on a canvas (after video is drawn). */
export function drawStickerCorners(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: StickerFrameType
): void {
  if (frame === "none") return;

  ctx.save();

  const pad = width * 0.08;
  const size = Math.min(width, height) * 0.14;
  const positions: [number, number][] = [
    [pad + size, pad + size],
    [width - pad - size, pad + size],
    [pad + size, height - pad - size],
    [width - pad - size, height - pad - size],
  ];

  for (const [x, y] of positions) {
    if (frame === "flower") drawFlower(ctx, x, y, size);
    else if (frame === "star") drawStar(ctx, x, y, size);
    else if (frame === "heart") drawHeart(ctx, x, y, size);
  }

  ctx.restore();
}

function drawFlower(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  const r = size * 0.5;
  const petalR = size * 0.35;
  ctx.fillStyle = "rgba(255, 182, 193, 0.95)";
  ctx.strokeStyle = "rgba(255, 105, 180, 0.6)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    const px = x + Math.cos(a) * r * 0.7;
    const py = y + Math.sin(a) * r * 0.7;
    ctx.beginPath();
    ctx.arc(px, py, petalR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(255, 255, 200, 0.95)";
  ctx.beginPath();
  ctx.arc(x, y, petalR * 0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  const outer = size;
  const inner = size * 0.45;
  const points = 5;
  ctx.fillStyle = "rgba(255, 215, 0, 0.9)";
  ctx.strokeStyle = "rgba(255, 165, 0, 0.7)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outer : inner;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const px = x + Math.cos(a) * radius;
    const py = y + Math.sin(a) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  const s = size * 0.9;
  ctx.fillStyle = "rgba(255, 105, 180, 0.9)";
  ctx.strokeStyle = "rgba(219, 112, 147, 0.8)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.3);
  ctx.bezierCurveTo(x, y - s * 0.4, x - s, y - s * 0.4, x - s * 0.5, y + s * 0.2);
  ctx.bezierCurveTo(x, y + s * 0.6, x, y + s * 0.6, x, y + s);
  ctx.bezierCurveTo(x, y + s * 0.6, x, y + s * 0.6, x + s * 0.5, y + s * 0.2);
  ctx.bezierCurveTo(x + s, y - s * 0.4, x, y - s * 0.4, x, y + s * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}
