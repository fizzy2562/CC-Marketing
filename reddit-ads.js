const W = 1200;
const H = 628;

const BG = [3, 10, 3];
const TEXT_MUTED = [205, 210, 208];
const CTA_BG = [81, 172, 82];
const WHITE = [255, 255, 255];
const CYAN = [85, 220, 245];
const MINT = [130, 245, 195];

const DEFAULT_CTA = "Sign up free · Premium access for 72 hours";

const BRAND_FEATURES = [
  ["Guides & Playbooks", "book"],
  ["Training & Courses", "cap"],
  ["Tools & Templates", "window"],
  ["Community & Insights", "chat"],
];

const AD_CONFIGS = [
  {
    id: "brand-hero",
    name: "Brand Hero",
    filename: "reddit-ad-01-brand-hero.png",
    headlineLabel: "Unlock Your Salesforce Potential.",
    headlineLines: [
      [["Unlock Your ", WHITE], ["Salesforce", CYAN], [" Potential.", WHITE]],
    ],
    sub: "Resources built for consultants & admins.",
    cta: DEFAULT_CTA,
    featureRow: BRAND_FEATURES,
  },
  {
    id: "certification",
    name: "Certification",
    filename: "reddit-ad-02-certification.png",
    headlineLabel: "Pass Salesforce certs faster",
    headlineLines: [
      [["Pass Salesforce", WHITE]],
      [["certs faster", CYAN]],
    ],
    sub: "Practice exams + curated study paths.",
    cta: DEFAULT_CTA,
    featureRow: null,
  },
  {
    id: "ccgpt",
    name: "CC-GPT",
    filename: "reddit-ad-03-ccgpt.png",
    headlineLabel: "CC-GPT: your Salesforce study copilot",
    headlineLines: [
      [["CC-GPT", CYAN], [": your ", WHITE]],
      [["Salesforce ", CYAN], ["study copilot", WHITE]],
    ],
    sub: "Smart prompts. Daily practice.",
    cta: DEFAULT_CTA,
    featureRow: null,
  },
  {
    id: "jobs",
    name: "Jobs",
    filename: "reddit-ad-04-jobs.png",
    headlineLabel: "Salesforce roles in one place",
    headlineLines: [
      [["Salesforce roles in ", WHITE]],
      [["one place", CYAN]],
    ],
    sub: "See openings from consultancies and end users.",
    cta: DEFAULT_CTA,
    featureRow: null,
  },
  {
    id: "free-tier",
    name: "Free Tier",
    filename: "reddit-ad-05-free-tier.png",
    headlineLabel: "Start free — upgrade when you're ready",
    headlineLines: [
      [["Start ", WHITE], ["free", MINT], [" — upgrade when you're ready", WHITE]],
    ],
    sub: "Free: curated content, jobs & CC-GPT (daily limit). Premium: full practice exams & higher CC-GPT limits. New signups: 72 hours of Premium.",
    cta: DEFAULT_CTA,
    featureRow: null,
  },
  {
    id: "community",
    name: "Community",
    filename: "reddit-ad-06-community.png",
    headlineLabel: "Built by consultants for consultants",
    headlineLines: [
      [["Built by ", WHITE], ["consultants", CYAN]],
      [["for ", WHITE], ["consultants", CYAN]],
    ],
    sub: "Cert prep, insights, and community support in one platform.",
    cta: DEFAULT_CTA,
    featureRow: null,
  },
];

// ── Drawing helpers (ported 1:1 from the Node script) ─────────────────────────

const rgba = (arr, a = 1) => `rgba(${arr[0]}, ${arr[1]}, ${arr[2]}, ${a})`;

function segWidth(ctx, text) {
  return Math.ceil(ctx.measureText(text).width);
}

function wrapLines(text, widthChars) {
  const parts = text.split("\n");
  const lines = [];
  for (const part of parts) {
    const words = part.trim().split(/\s+/).filter(Boolean);
    if (!words.length) { lines.push(""); continue; }
    let cur = "";
    for (const w of words) {
      const test = cur ? `${cur} ${w}` : w;
      if (test.length <= widthChars) { cur = test; } else { if (cur) lines.push(cur); cur = w; }
    }
    if (cur) lines.push(cur);
  }
  return lines;
}

function drawTextStroke(ctx, text, x, y, fill, stroke = [0, 0, 0], sw = 2) {
  ctx.lineWidth = sw;
  ctx.strokeStyle = rgba(stroke, 1);
  ctx.strokeText(text, x, y);
  ctx.fillStyle = rgba(fill, 1);
  ctx.fillText(text, x, y);
}

function drawHeadlineSegmented(ctx, x0, y, lines, font, lineGap = 52) {
  ctx.font = font;
  ctx.textBaseline = "top";
  let yCur = y;
  for (const line of lines) {
    let x = x0;
    for (const [chunk, fill] of line) {
      drawTextStroke(ctx, chunk, x, yCur, fill, [0, 0, 0], 2);
      x += segWidth(ctx, chunk);
    }
    yCur += lineGap;
  }
  return yCur;
}

function drawReadabilityScrim(ctx) {
  const fadeEnd = Math.floor(W * 0.56);
  const maxA = 108 / 255;
  const grad = ctx.createLinearGradient(0, 0, fadeEnd, 0);
  grad.addColorStop(0, rgba([2, 8, 4], maxA));
  grad.addColorStop(1, rgba([2, 8, 4], 0));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, fadeEnd, H);
}

function drawBottomScrim(ctx) {
  ctx.fillStyle = rgba([2, 8, 4], 72 / 255);
  ctx.fillRect(0, H - 168, W, 168);
}

function drawRoundedRect(ctx, x, y, w, h, r, fill) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
  ctx.fillStyle = rgba(fill, 1);
  ctx.fill();
}

function drawRoundedRectStroke(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
  ctx.stroke();
}

function line(ctx, x1, y1, x2, y2, lw = 2) {
  const old = ctx.lineWidth;
  ctx.lineWidth = lw;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.lineWidth = old;
}

function poly(ctx, pts) {
  if (!pts.length) return;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.stroke();
}

function circleStroke(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
}

function drawLineIcon(ctx, kind, cx, cy, color, sw = 2) {
  ctx.strokeStyle = rgba(color, 1);
  ctx.fillStyle = rgba(color, 1);
  ctx.lineWidth = sw;

  if (kind === "book") {
    drawRoundedRectStroke(ctx, cx - 14, cy - 10, 16, 22, 2);
    drawRoundedRectStroke(ctx, cx - 2, cy - 10, 16, 22, 2);
    line(ctx, cx, cy - 10, cx, cy + 12);
  } else if (kind === "cap") {
    poly(ctx, [[cx, cy - 14], [cx + 16, cy - 4], [cx, cy + 2], [cx - 16, cy - 4]]);
    line(ctx, cx - 18, cy + 2, cx + 18, cy + 2);
    line(ctx, cx - 10, cy + 2, cx - 6, cy + 10);
    line(ctx, cx + 10, cy + 2, cx + 6, cy + 10);
  } else if (kind === "window") {
    drawRoundedRectStroke(ctx, cx - 16, cy - 12, 32, 24, 4);
    line(ctx, cx - 16, cy - 4, cx + 16, cy - 4);
    for (const dx of [-8, 0, 8]) circleStroke(ctx, cx + dx, cy - 9, 2);
    line(ctx, cx - 10, cy + 2, cx + 10, cy + 2, 1);
    line(ctx, cx - 10, cy + 6, cx + 6, cy + 6, 1);
  } else if (kind === "chat") {
    drawRoundedRectStroke(ctx, cx - 14, cy - 6, 20, 16, 3);
    drawRoundedRectStroke(ctx, cx - 4, cy - 14, 18, 16, 3);
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy + 10);
    ctx.lineTo(cx - 6, cy + 14);
    ctx.lineTo(cx - 2, cy + 10);
    ctx.closePath();
    ctx.fill();
  }
}

function drawFeatureIconRow(ctx, x0, yIconCenter, items, iconColor = CYAN) {
  const colW = 128;
  ctx.font = `15px Arial, "Helvetica Neue", Helvetica, sans-serif`;
  ctx.textBaseline = "top";
  items.forEach(([label, kind], i) => {
    const cx = x0 + Math.floor(colW / 2) + i * colW;
    drawLineIcon(ctx, kind, cx, yIconCenter, iconColor, 2);
    const wrappedLines = wrapLines(label, 14).slice(0, 2);
    let ly = yIconCenter + 20;
    for (const wl of wrappedLines) {
      const w = segWidth(ctx, wl);
      drawTextStroke(ctx, wl, cx - Math.floor(w / 2), ly, TEXT_MUTED, [0, 0, 0], 1);
      ly += 17;
    }
  });
}

function drawImageCover(ctx, img) {
  const srcRatio = img.width / img.height;
  const dstRatio = W / H;
  let sx = 0, sy = 0, sw = img.width, sh = img.height;
  if (srcRatio > dstRatio) {
    sw = Math.round(img.height * dstRatio);
    sx = Math.round((img.width - sw) / 2);
  } else {
    sh = Math.round(img.width / dstRatio);
    sy = Math.round((img.height - sh) / 2);
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
}

// ── Logo loading ──────────────────────────────────────────────────────────────

let logoCache = null;

async function loadLogo() {
  if (logoCache) return logoCache;
  // Fetch and convert to data URL to avoid canvas taint issues
  const resp = await fetch("./assets/logo-transparent.png");
  const blob = await resp.blob();
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
  logoCache = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
  return logoCache;
}

// ── Core composition ──────────────────────────────────────────────────────────

async function composeAd(canvas, config, bgImg = null) {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = rgba(BG, 1);
  ctx.fillRect(0, 0, W, H);

  if (bgImg) drawImageCover(ctx, bgImg);
  drawReadabilityScrim(ctx);
  drawBottomScrim(ctx);

  const logo = await loadLogo();
  const logoH = 76;
  const logoW = Math.round((logo.width * logoH) / logo.height);
  ctx.drawImage(logo, 44, 44, logoW, logoH);

  const titleFont = `bold 46px Arial, "Helvetica Neue", Helvetica, sans-serif`;
  const subFont = `26px Arial, "Helvetica Neue", Helvetica, sans-serif`;
  const ctaFont = `bold 24px Arial, "Helvetica Neue", Helvetica, sans-serif`;

  let y = 44 + logoH + 24;
  const xText = 44;

  y = drawHeadlineSegmented(ctx, xText, y, config.headlineLines, titleFont);
  y += 8;

  ctx.font = subFont;
  ctx.textBaseline = "top";
  for (const lineText of wrapLines(config.sub, 40)) {
    drawTextStroke(ctx, lineText, xText, y, TEXT_MUTED, [0, 0, 0], 1);
    y += 34;
  }

  const ctaY = H - 100;

  if (config.featureRow) {
    drawFeatureIconRow(ctx, xText, ctaY - 102, config.featureRow, CYAN);
  }

  ctx.font = ctaFont;
  ctx.textBaseline = "top";
  const cta = config.cta || DEFAULT_CTA;
  const tw = segWidth(ctx, cta);
  const padX = 28;
  const padY = 16;
  const pillW = tw + padX * 2;
  const pillH = 24 + padY * 2;

  drawRoundedRect(ctx, 44, ctaY, pillW, pillH, 14, CTA_BG);
  drawTextStroke(ctx, cta, 44 + padX, ctaY + padY - 2, WHITE, [15, 50, 20], 1);
}

// ── UI state & helpers ────────────────────────────────────────────────────────

const bgImages = new Array(AD_CONFIGS.length).fill(null);

function getCanvas(i) { return document.getElementById(`canvas-${i}`); }
function getSubEl(i)  { return document.getElementById(`sub-${i}`); }
function getCtaEl(i)  { return document.getElementById(`cta-${i}`); }

function getLiveConfig(i) {
  return {
    ...AD_CONFIGS[i],
    sub: getSubEl(i)?.value ?? AD_CONFIGS[i].sub,
    cta: getCtaEl(i)?.value ?? AD_CONFIGS[i].cta,
  };
}

async function renderAd(i) {
  await composeAd(getCanvas(i), getLiveConfig(i), bgImages[i]);
}

function downloadAd(i) {
  getCanvas(i).toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = AD_CONFIGS[i].filename;
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
}

async function generateAll() {
  const statusEl = document.getElementById("global-status");
  const btn = document.getElementById("generate-all");
  btn.disabled = true;

  try {
    const zip = new JSZip();
    for (let i = 0; i < AD_CONFIGS.length; i++) {
      statusEl.textContent = `Generating ${i + 1} / ${AD_CONFIGS.length}…`;
      await renderAd(i);
      const blob = await new Promise((resolve) => getCanvas(i).toBlob(resolve, "image/png"));
      zip.file(AD_CONFIGS[i].filename, blob);
    }
    statusEl.textContent = "Creating ZIP…";
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reddit-ads.zip";
    a.click();
    URL.revokeObjectURL(url);
    statusEl.textContent = "All 6 ads downloaded!";
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Error generating ads — check the console.";
  } finally {
    btn.disabled = false;
  }
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────

async function init() {
  // Preload logo so first renders are fast
  try { await loadLogo(); } catch { /* non-fatal */ }

  for (let i = 0; i < AD_CONFIGS.length; i++) {
    const subEl = getSubEl(i);
    const ctaEl = getCtaEl(i);
    const bgUpload = document.getElementById(`bg-upload-${i}`);
    const bgLabel  = document.getElementById(`bg-label-${i}`);
    const downloadBtn = document.getElementById(`download-${i}`);

    subEl.value = AD_CONFIGS[i].sub;
    ctaEl.value = AD_CONFIGS[i].cta;

    subEl.addEventListener("input", () => renderAd(i));
    ctaEl.addEventListener("input", () => renderAd(i));

    bgUpload.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      bgLabel.textContent = file.name;
      const reader = new FileReader();
      const dataUrl = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
      const img = await new Promise((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = reject;
        el.src = dataUrl;
      });
      bgImages[i] = img;
      renderAd(i);
    });

    downloadBtn.addEventListener("click", () => downloadAd(i));

    // Kick off initial render (don't block the loop)
    renderAd(i);
  }

  document.getElementById("generate-all").addEventListener("click", generateAll);
}

document.addEventListener("DOMContentLoaded", init);
