import { PosterConfig, POSTER_WIDTH, POSTER_HEIGHT } from "./poster-config";

// One Piece-style wanted poster layout proportions
const L = {
  wantedY: 55,
  wantedSize: 72,

  ruleY: 92,

  photoX: 42,
  photoY: 100,
  photoW: 516,
  photoH: 440,

  doaY: 567,
  doaSize: 21,
  doaSpacing: 4,

  nameY: 606,
  nameSize: 42,

  epithetY: 632,
  epithetSize: 14,

  bountyY: 658,
  bountySize: 28,

  footerY: 705,
  footerSize: 8.5,
  footerLineH: 12,

  marineY: 790,
  marineSize: 34,
};

let noiseCanvas: HTMLCanvasElement | null = null;

function getNoiseCanvas(): HTMLCanvasElement {
  if (noiseCanvas) return noiseCanvas;
  const s = 128;
  noiseCanvas = document.createElement("canvas");
  noiseCanvas.width = s;
  noiseCanvas.height = s;
  const ctx = noiseCanvas.getContext("2d")!;
  const id = ctx.createImageData(s, s);
  for (let i = 0; i < id.data.length; i += 4) {
    id.data[i] = 120 + (Math.random() - 0.5) * 60;
    id.data[i + 1] = 100 + (Math.random() - 0.5) * 50;
    id.data[i + 2] = 70 + (Math.random() - 0.5) * 40;
    id.data[i + 3] = 15 + Math.random() * 25;
  }
  ctx.putImageData(id, 0, 0);
  return noiseCanvas;
}

export function renderPoster(
  ctx: CanvasRenderingContext2D,
  config: PosterConfig,
  photoImage: HTMLImageElement | null,
  scale: number = 1,
) {
  const w = POSTER_WIDTH;
  const h = POSTER_HEIGHT;
  ctx.canvas.width = w * scale;
  ctx.canvas.height = h * scale;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  drawPaper(ctx, config, w, h);
  drawBorder(ctx, config, w, h);
  drawWanted(ctx, config, w);
  drawRule(ctx, config, w);
  drawPhoto(ctx, config, photoImage, w);
  drawDeadOrAlive(ctx, config, w);
  drawName(ctx, config, w);
  drawEpithet(ctx, config, w);
  drawBounty(ctx, config, w);
  drawFooter(ctx, config);
  if (config.showMarine !== false) drawMarine(ctx, config, w);
  if (config.showCornerOrnaments) drawScrollCorners(ctx, config, w, h);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawPaper(
  ctx: CanvasRenderingContext2D,
  c: PosterConfig,
  w: number,
  h: number,
) {
  ctx.fillStyle = c.paperColor;
  ctx.fillRect(0, 0, w, h);

  const t = c.textureIntensity;
  if (t <= 0) return;

  const stainAlpha =
    c.paperTexture === "smooth"
      ? 0
      : t * (c.paperTexture === "burnt" ? 0.8 : 0.6);
  if (stainAlpha > 0) {
    for (const [sx, sy, sr] of [
      [w * 0.2, h * 0.3, 150],
      [w * 0.7, h * 0.6, 200],
      [w * 0.5, h * 0.8, 120],
      [w * 0.1, h * 0.1, 100],
      [w * 0.9, h * 0.2, 80],
    ]) {
      const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
      g.addColorStop(0, `rgba(160,120,60,${0.08 * stainAlpha})`);
      g.addColorStop(1, "rgba(160,120,60,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
  }

  if (c.paperTexture !== "smooth") {
    const noise = getNoiseCanvas();
    const pat = ctx.createPattern(noise, "repeat");
    if (pat) {
      ctx.fillStyle = pat;
      ctx.globalAlpha = t * 0.3;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    }
  }

  const vigStr = c.paperTexture === "burnt" ? t * 0.8 : t * 0.4;
  const vg = ctx.createRadialGradient(
    w / 2,
    h / 2,
    Math.min(w, h) * 0.3,
    w / 2,
    h / 2,
    Math.max(w, h) * 0.7,
  );
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, `rgba(60,30,10,${vigStr * 0.4})`);
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, w, h);

  if (c.paperTexture === "burnt") {
    const edgeW = 30 * t;
    ctx.fillStyle = `rgba(30,15,5,${t * 0.25})`;
    ctx.fillRect(0, 0, edgeW, h);
    ctx.fillRect(w - edgeW, 0, edgeW, h);
    ctx.fillRect(0, 0, w, edgeW);
    ctx.fillRect(0, h - edgeW, w, edgeW);
  }
}

function drawBorder(
  ctx: CanvasRenderingContext2D,
  c: PosterConfig,
  w: number,
  h: number,
) {
  if (c.borderStyle === "none") return;
  const p = 20;
  ctx.strokeStyle = c.borderColor;
  if (c.borderStyle === "simple") {
    ctx.lineWidth = 3;
    ctx.strokeRect(p, p, w - 2 * p, h - 2 * p);
  } else if (c.borderStyle === "double") {
    ctx.lineWidth = 2;
    ctx.strokeRect(p - 4, p - 4, w - 2 * p + 8, h - 2 * p + 8);
    ctx.strokeRect(p + 2, p + 2, w - 2 * p - 4, h - 2 * p - 4);
  } else if (c.borderStyle === "ornate") {
    ctx.lineWidth = 4;
    ctx.strokeRect(p - 6, p - 6, w - 2 * p + 12, h - 2 * p + 12);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(p, p, w - 2 * p, h - 2 * p);
  }
}

function drawWanted(
  ctx: CanvasRenderingContext2D,
  c: PosterConfig,
  w: number,
) {
  ctx.save();
  ctx.fillStyle = c.textColor;
  ctx.font = `900 ${L.wantedSize}px "${c.headerFont}", serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0,0,0,0.15)";
  ctx.shadowBlur = 2;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 2;
  ctx.fillText("WANTED", w / 2, L.wantedY);
  ctx.restore();
}

function drawRule(ctx: CanvasRenderingContext2D, c: PosterConfig, w: number) {
  ctx.strokeStyle = c.textColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(L.photoX, L.ruleY);
  ctx.lineTo(w - L.photoX, L.ruleY);
  ctx.stroke();
}

function drawPhoto(
  ctx: CanvasRenderingContext2D,
  c: PosterConfig,
  img: HTMLImageElement | null,
  w: number,
) {
  const px = L.photoX;
  const py = L.photoY;
  const pw = L.photoW;
  const ph = L.photoH;

  // Outer dark frame
  ctx.fillStyle = c.borderColor;
  ctx.fillRect(px - 4, py - 4, pw + 8, ph + 8);

  if (img && c.photo.dataUrl) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(px, py, pw, ph);
    ctx.clip();

    const { zoom, offsetX, offsetY, rotation } = c.photo;
    const iAsp = img.width / img.height;
    const aAsp = pw / ph;
    let dw: number, dh: number;
    if (iAsp > aAsp) {
      dh = ph * zoom;
      dw = dh * iAsp;
    } else {
      dw = pw * zoom;
      dh = dw / iAsp;
    }
    const dx = px + (pw - dw) / 2 + offsetX * pw * 0.3;
    const dy = py + (ph - dh) / 2 + offsetY * ph * 0.3;

    if (rotation !== 0) {
      ctx.translate(px + pw / 2, py + ph / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-(px + pw / 2), -(py + ph / 2));
    }
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();
  } else {
    ctx.fillStyle = "#2a1f14";
    ctx.fillRect(px, py, pw, ph);
    ctx.fillStyle = "#4a3828";
    ctx.font = "bold 90px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("?", w / 2, py + ph / 2);
  }

  // Inner border
  ctx.strokeStyle = c.borderColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(px, py, pw, ph);
}

function drawDeadOrAlive(
  ctx: CanvasRenderingContext2D,
  c: PosterConfig,
  w: number,
) {
  if (!c.deadOrAlive) return;

  const y = L.doaY;
  ctx.fillStyle = c.textColor;
  ctx.font = `bold ${L.doaSize}px "${c.bodyFont}", serif`;
  ctx.textBaseline = "middle";

  const text = c.deadOrAlive;
  let totalW = 0;
  for (let i = 0; i < text.length; i++) {
    totalW += ctx.measureText(text[i]).width;
    if (i < text.length - 1) totalW += L.doaSpacing;
  }

  let cx = (w - totalW) / 2;
  ctx.textAlign = "left";
  for (let i = 0; i < text.length; i++) {
    ctx.fillText(text[i], cx, y);
    cx += ctx.measureText(text[i]).width + L.doaSpacing;
  }

  // Scroll ornaments
  const lx = (w - totalW) / 2 - 10;
  const rx = (w + totalW) / 2 + 10;
  drawScroll(ctx, c.textColor, lx, y, 1);
  drawScroll(ctx, c.textColor, rx, y, -1);
}

function drawScroll(
  ctx: CanvasRenderingContext2D,
  color: string,
  x: number,
  y: number,
  dir: number,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.8;

  // Curly bracket shape pointing outward
  ctx.beginPath();
  ctx.moveTo(x + dir * 6, y - 16);
  ctx.quadraticCurveTo(x - dir * 4, y - 10, x - dir * 12, y);
  ctx.quadraticCurveTo(x - dir * 4, y + 10, x + dir * 6, y + 16);
  ctx.stroke();

  // Small end curls
  ctx.beginPath();
  ctx.arc(x + dir * 8, y - 17, 2.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + dir * 8, y + 17, 2.5, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawName(ctx: CanvasRenderingContext2D, c: PosterConfig, w: number) {
  if (!c.name) return;

  // Auto middle-dot formatting: spaces become · separators
  const display = c.name.replace(/\s+/g, "·");

  const maxW = w - 60;
  let fs = L.nameSize;
  ctx.fillStyle = c.textColor;
  ctx.font = `bold ${fs}px "${c.nameFont}", serif`;
  while (ctx.measureText(display).width > maxW && fs > 16) {
    fs -= 2;
    ctx.font = `bold ${fs}px "${c.nameFont}", serif`;
  }
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(display, w / 2, L.nameY);
}

function drawEpithet(
  ctx: CanvasRenderingContext2D,
  c: PosterConfig,
  w: number,
) {
  if (!c.epithet) return;
  ctx.fillStyle = c.textColor;
  ctx.globalAlpha = 0.7;
  ctx.font = `italic ${L.epithetSize}px "${c.bodyFont}", serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`"${c.epithet}"`, w / 2, L.epithetY);
  ctx.globalAlpha = 1;
}

function drawBounty(
  ctx: CanvasRenderingContext2D,
  c: PosterConfig,
  w: number,
) {
  if (!c.bounty) return;

  const prefix = c.bountyPrefix || "";
  const text = `${prefix}${c.bounty}-`;

  const maxW = w - 60;
  let fs = L.bountySize;
  ctx.fillStyle = c.textColor;
  ctx.font = `bold ${fs}px "${c.nameFont}", serif`;
  while (ctx.measureText(text).width > maxW && fs > 14) {
    fs -= 2;
    ctx.font = `bold ${fs}px "${c.nameFont}", serif`;
  }
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, w / 2, L.bountyY);
}

function drawFooter(
  ctx: CanvasRenderingContext2D,
  c: PosterConfig,
) {
  ctx.fillStyle = c.textColor;
  ctx.globalAlpha = 0.55;
  ctx.font = `${L.footerSize}px "${c.bodyFont}", serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const lines = [
    "ANY INFORMATION LEADING TO THE CAPTURE OF THE",
    "INDIVIDUAL ABOVE SHOULD BE REPORTED TO YOUR",
    "LOCAL BOUNTY OFFICE IMMEDIATELY.",
  ];

  let y = L.footerY;
  for (const line of lines) {
    ctx.fillText(line, L.photoX + 5, y);
    y += L.footerLineH;
  }
  ctx.globalAlpha = 1;
}

function drawMarine(
  ctx: CanvasRenderingContext2D,
  c: PosterConfig,
  w: number,
) {
  ctx.fillStyle = c.textColor;
  ctx.font = `bold ${L.marineSize}px "${c.bodyFont}", serif`;
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText("MARINE", w - L.photoX - 5, L.marineY);
}

function drawScrollCorners(
  ctx: CanvasRenderingContext2D,
  c: PosterConfig,
  w: number,
  h: number,
) {
  ctx.save();
  ctx.strokeStyle = c.borderColor;
  ctx.lineWidth = 1.5;
  const m = 15;
  const s = 25;

  for (const [cx, cy, dx, dy] of [
    [m, m, 1, 1],
    [w - m, m, -1, 1],
    [m, h - m, 1, -1],
    [w - m, h - m, -1, -1],
  ] as [number, number, number, number][]) {
    ctx.beginPath();
    ctx.moveTo(cx, cy + s * dy);
    ctx.quadraticCurveTo(cx, cy, cx + s * dx, cy);
    ctx.stroke();
  }
  ctx.restore();
}
