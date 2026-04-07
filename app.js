const BRAND_GRADIENT = `
  <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#3D7FAB" />
    <stop offset="50%" stop-color="#4DA68B" />
    <stop offset="100%" stop-color="#51AC52" />
  </linearGradient>
`;

const SVG_START = `<?xml version="1.0" encoding="UTF-8"?>`;
const VIEWBOX = "0 0 86 86";

const templateDefinitions = {
  juniors: {
    label: "Juniors Become Seniors",
    stickerName: "juniors-become-seniors",
    lines: ["JUNIORS", "BECOME", "SENIORS"],
    qrUrl: "https://agentforce.consultantcloud.io/?utm_source=agentforce&utm_medium=qr&utm_campaign=agentforce_2026&utm_content=sticker_1",
    qrColor: "#FFFFFF",
  },
  certified: {
    label: "Get Certified Faster",
    stickerName: "get-certified-faster",
    lines: ["GET CERTIFIED", "FASTER", ""],
    qrUrl: "https://agentforce.consultantcloud.io/?utm_source=agentforce&utm_medium=qr&utm_campaign=agentforce_2026&utm_content=sticker_2",
    qrColor: "#242424",
  },
  architect: {
    label: "Future Solution Architect",
    stickerName: "future-solution-architect",
    lines: ["FUTURE", "SOLUTION", "ARCHITECT"],
    qrUrl: "https://agentforce.consultantcloud.io/?utm_source=agentforce&utm_medium=qr&utm_campaign=agentforce_2026&utm_content=sticker_3",
    qrColor: "#FFFFFF",
  },
};

const state = {
  template: "juniors",
  stickerName: templateDefinitions.juniors.stickerName,
  lines: [...templateDefinitions.juniors.lines],
  qrUrl: templateDefinitions.juniors.qrUrl,
  svg: "",
  assets: {
    darkLogo: "",
    transparentLogo: "",
  },
};

const refs = {
  template: document.querySelector("#template"),
  stickerName: document.querySelector("#stickerName"),
  line1: document.querySelector("#line1"),
  line2: document.querySelector("#line2"),
  line3: document.querySelector("#line3"),
  qrUrl: document.querySelector("#qrUrl"),
  preview: document.querySelector("#preview"),
  status: document.querySelector("#status"),
  downloadSvg: document.querySelector("#downloadSvg"),
  downloadPng: document.querySelector("#downloadPng"),
};

bootstrap().catch((error) => {
  console.error(error);
  setStatus("The app could not start correctly.");
});

async function bootstrap() {
  state.assets.darkLogo = await fileToDataUrl("./assets/logo-dark.jpg");
  state.assets.transparentLogo = await fileToDataUrl("./assets/logo-transparent.png");

  for (const [value, template] of Object.entries(templateDefinitions)) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = template.label;
    refs.template.append(option);
  }

  refs.template.addEventListener("change", (event) => {
    const nextTemplate = templateDefinitions[event.target.value];
    state.template = event.target.value;
    state.stickerName = nextTemplate.stickerName;
    state.lines = [...nextTemplate.lines];
    state.qrUrl = nextTemplate.qrUrl;
    syncFormFromState();
    render();
  });

  refs.stickerName.addEventListener("input", (event) => {
    state.stickerName = slugify(event.target.value) || "cc-sticker";
    if (event.target.value !== state.stickerName) {
      event.target.value = state.stickerName;
    }
  });

  [refs.line1, refs.line2, refs.line3].forEach((input, index) => {
    input.addEventListener("input", (event) => {
      state.lines[index] = normalizeLine(event.target.value);
      if (event.target.value !== state.lines[index]) {
        event.target.value = state.lines[index];
      }
      render();
    });
  });

  refs.qrUrl.addEventListener("input", (event) => {
    state.qrUrl = event.target.value.trim();
    render();
  });

  refs.downloadSvg.addEventListener("click", async () => {
    await render();
    downloadFile(`${state.stickerName}.svg`, state.svg, "image/svg+xml;charset=utf-8");
    setStatus("SVG downloaded.");
  });

  refs.downloadPng.addEventListener("click", async () => {
    await render();
    await downloadPng();
  });

  syncFormFromState();
  await render();
}

function syncFormFromState() {
  refs.template.value = state.template;
  refs.stickerName.value = state.stickerName;
  refs.line1.value = state.lines[0] ?? "";
  refs.line2.value = state.lines[1] ?? "";
  refs.line3.value = state.lines[2] ?? "";
  refs.qrUrl.value = state.qrUrl;
}

async function render() {
  setStatus("Rendering preview...");

  try {
    const qrImage = await createQrDataUrl(
      state.qrUrl || "https://consultantcloud.io/",
      templateDefinitions[state.template].qrColor,
    );
    const templateRenderer = renderers[state.template];
    state.svg = templateRenderer({ ...state, qrImage });
    refs.preview.innerHTML = state.svg.replace(/^<\?xml[^>]*>\s*/, "");
    setStatus("Preview updated.");
  } catch (error) {
    console.error(error);
    refs.preview.innerHTML = "";
    setStatus("Could not render the sticker. Check the QR URL and try again.");
  }
}

function createQrDataUrl(url, darkColor) {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(
      url,
      {
        margin: 0,
        width: 700,
        color: {
          dark: darkColor,
          light: "#0000",
        },
        errorCorrectionLevel: "Q",
      },
      (error, output) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(output);
      },
    );
  });
}

const renderers = {
  juniors: ({ lines, qrImage, assets }) => `${SVG_START}
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}" width="860" height="860">
  <defs>
    ${BRAND_GRADIENT}
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-opacity="0.12" />
    </filter>
  </defs>
  <rect x="3" y="3" width="80" height="80" rx="12" fill="#030A03" filter="url(#shadow)" />
  ${headlineText(lines, {
    x: 43,
    yStart: 22.5,
    yStep: 11.7,
    fill: "#FFFFFF",
    size: 10.6,
    weight: 900,
    spacing: -0.5,
  })}
  <rect x="16" y="50.5" width="54" height="1.4" rx="0.7" fill="url(#brandGradient)" />
  <image href="${qrImage}" x="33" y="53.5" width="20" height="20" preserveAspectRatio="none" />
  <image href="${assets.darkLogo}" x="12" y="74.5" width="62" height="8.5" preserveAspectRatio="xMidYMid meet" />
</svg>`,

  certified: ({ lines, qrImage, assets }) => `${SVG_START}
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}" width="860" height="860">
  <defs>
    ${BRAND_GRADIENT}
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-opacity="0.12" />
    </filter>
    <filter id="motionBlur" x="-30%" y="-10%" width="160%" height="120%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="2.5 0" />
    </filter>
  </defs>
  <rect x="3" y="3" width="80" height="80" rx="12" fill="#FFFFFF" stroke="#ECECEC" stroke-width="0.5" filter="url(#shadow)" />
  <text x="43" y="26" fill="#242424" font-family="Inter, Arial, sans-serif" font-size="8.6" font-weight="900" text-anchor="middle" letter-spacing="-0.4">${escapeXml(lines[0])}</text>
  <text x="47" y="39" fill="url(#brandGradient)" font-family="Inter, Arial, sans-serif" font-size="13.8" font-weight="900" font-style="italic" text-anchor="middle" letter-spacing="-0.7" opacity="0.35" filter="url(#motionBlur)">${escapeXml(lines[1])}</text>
  <text x="43" y="39" fill="url(#brandGradient)" font-family="Inter, Arial, sans-serif" font-size="13.8" font-weight="900" font-style="italic" text-anchor="middle" letter-spacing="-0.7">${escapeXml(lines[1])}</text>
  <line x1="6" y1="47" x2="18" y2="47" stroke="url(#brandGradient)" stroke-width="0.6" opacity="0.4" />
  <line x1="6" y1="49" x2="14" y2="49" stroke="url(#brandGradient)" stroke-width="0.35" opacity="0.25" />
  <line x1="68" y1="47" x2="80" y2="47" stroke="url(#brandGradient)" stroke-width="0.6" opacity="0.4" />
  <line x1="72" y1="49" x2="80" y2="49" stroke="url(#brandGradient)" stroke-width="0.35" opacity="0.25" />
  <rect x="14" y="43.5" width="58" height="1.2" rx="0.6" fill="url(#brandGradient)" />
  <image href="${qrImage}" x="33" y="46.5" width="20" height="20" preserveAspectRatio="none" />
  <rect x="11" y="69.5" width="64" height="10.5" rx="5.25" fill="#030A03" />
  <image href="${assets.darkLogo}" x="14" y="70.6" width="58" height="8.2" preserveAspectRatio="xMidYMid meet" />
</svg>`,

  architect: ({ lines, qrImage, assets }) => `${SVG_START}
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}" width="860" height="860">
  <defs>
    ${BRAND_GRADIENT}
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-opacity="0.12" />
    </filter>
  </defs>
  <rect x="3" y="3" width="80" height="80" rx="12" fill="#242424" filter="url(#shadow)" />
  <rect x="3" y="3" width="80" height="80" rx="12" fill="none" stroke="url(#brandGradient)" stroke-width="0.8" opacity="0.65" />
  ${headlineText(lines, {
    x: 43,
    yStart: 21.5,
    yStep: 11.3,
    fill: "#FFFFFF",
    size: 8.7,
    weight: 800,
    spacing: -0.35,
  })}
  <rect x="16" y="49.3" width="54" height="1.4" rx="0.7" fill="url(#brandGradient)" />
  <image href="${qrImage}" x="34.5" y="53.5" width="17" height="17" preserveAspectRatio="none" />
  <rect x="16" y="72.5" width="54" height="0.9" rx="0.45" fill="url(#brandGradient)" />
  <image href="${assets.transparentLogo}" x="14" y="73.5" width="58" height="8" preserveAspectRatio="xMidYMid meet" />
</svg>`,
};

function headlineText(lines, config) {
  return lines
    .filter(Boolean)
    .map((line, index) => {
      const y = config.yStart + config.yStep * index;
      return `<text x="${config.x}" y="${y}" fill="${config.fill}" font-family="Inter, Arial, sans-serif" font-size="${config.size}" font-weight="${config.weight}" text-anchor="middle" letter-spacing="${config.spacing}">${escapeXml(line)}</text>`;
    })
    .join("\n");
}

function normalizeLine(value) {
  return value.toUpperCase().replace(/\s+/g, " ").trim().slice(0, 24);
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function fileToDataUrl(path) {
  const response = await fetch(path);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function downloadPng() {
  const blob = new Blob([state.svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const image = new Image();

  image.decoding = "async";

  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
    image.src = url;
  });

  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 1200;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, 1200, 1200);
  URL.revokeObjectURL(url);

  const pngUrl = canvas.toDataURL("image/png");
  const anchor = document.createElement("a");
  anchor.href = pngUrl;
  anchor.download = `${state.stickerName}.png`;
  anchor.click();
  setStatus("PNG downloaded.");
}

function setStatus(message) {
  refs.status.textContent = message;
}
