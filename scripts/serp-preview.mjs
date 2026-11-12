import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const publicDir = path.join(rootDir, "public");
const outDir = path.join(rootDir, "serp-previews");

fs.mkdirSync(outDir, { recursive: true });

const PUBLIC_ROUTES = [
  { route: "/", slug: "home" },
  { route: "/about", slug: "about" },
  { route: "/academics", slug: "academics" },
  { route: "/projects", slug: "projects" },
  { route: "/publication", slug: "publication" },
  { route: "/experience", slug: "experience" },
  { route: "/awards", slug: "awards" },
  { route: "/terms-and-privacy", slug: "terms-and-privacy" },
];

const faviconSvg = fs.readFileSync(path.join(publicDir, "favicon.svg"), "utf8");
const faviconDataUri = `data:image/svg+xml;base64,${Buffer.from(faviconSvg, "utf8").toString("base64")}`;

function decodeHtmlEntities(str) {
  return String(str)
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function readRouteMetadataFromDist(route) {
  const htmlPath =
    route === "/"
      ? path.join(distDir, "index.html")
      : path.join(distDir, route.slice(1), "index.html");

  if (!fs.existsSync(htmlPath)) {
    throw new Error(
      `Missing ${htmlPath}. Run "VITE_SITE_URL=https://kazishakib.com npm run build" before "npm run serp-preview".`
    );
  }

  const html = fs.readFileSync(htmlPath, "utf8");
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
  const descMatch = html.match(/<meta name="description" content="([^"]*)"\s*\/?>/);
  const canonMatch = html.match(/<link rel="canonical" href="([^"]*)"\s*\/?>/);
  const ldMatch = html.match(/<script id="seo-json-ld" type="application\/ld\+json">([\s\S]*?)<\/script>/);

  let siteName = "Kazi Shakib";
  if (ldMatch) {
    try {
      const parsed = JSON.parse(ldMatch[1]);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      const ws = arr.find((x) => x["@type"] === "WebSite");
      if (ws?.name) siteName = ws.name;
    } catch {}
  }

  return {
    route,
    title: decodeHtmlEntities(titleMatch ? titleMatch[1] : ""),
    description: decodeHtmlEntities(descMatch ? descMatch[1] : ""),
    canonicalUrl: decodeHtmlEntities(canonMatch ? canonMatch[1] : ""),
    siteName,
  };
}

function truncateChars(text, maxChars) {
  if (text.length <= maxChars) {
    return { text, truncated: false };
  }
  const sliced = text.slice(0, maxChars - 3).replace(/\s+\S*$/, "");
  return { text: `${sliced}...`, truncated: true };
}

function formatBreadcrumbUrl(canonicalUrl) {
  try {
    const u = new URL(canonicalUrl);
    const origin = `${u.protocol}//${u.host}`;
    const segments = u.pathname.split("/").filter(Boolean);
    if (segments.length === 0) return origin;
    return `${origin} › ${segments.join(" › ")}`;
  } catch {
    return canonicalUrl;
  }
}

function findBrowserExecutable() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);

  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  throw new Error("Could not find Edge or Chrome executable for SERP preview rendering.");
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browserPath = findBrowserExecutable();
const port = 9261;
const userDataDir = path.join(os.tmpdir(), `ks-serp-preview-${process.pid}`);
fs.mkdirSync(userDataDir, { recursive: true });

const proc = spawn(
  browserPath,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--window-size=900,700",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    "about:blank",
  ],
  { stdio: "ignore" }
);

try {
  let targets = [];
  for (let i = 0; i < 30; i++) {
    await sleep(250);
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      targets = await res.json();
      if (targets.find((t) => t.type === "page")) break;
    } catch {}
  }

  const page = targets.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let msgId = 1;
  function send(method, params = {}) {
    const id = msgId++;
    ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve) => {
      const handler = (ev) => {
        const msg = JSON.parse(ev.data);
        if (msg.id === id) {
          ws.removeEventListener("message", handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener("message", handler);
    });
  }

  await send("Page.enable");
  await send("Runtime.enable");

  // Ensure public/favicon-48x48.png exists (48x48 PNG required by Google Search results)
  const faviconPngPath = path.join(publicDir, "favicon-48x48.png");
  if (!fs.existsSync(faviconPngPath)) {
    await send("Emulation.setDeviceMetricsOverride", {
      width: 48,
      height: 48,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await send("Emulation.setDefaultBackgroundColorOverride", {
      color: { r: 0, g: 0, b: 0, a: 0 },
    });
    const iconHtml = `<!doctype html><html><body style="margin:0;padding:0;overflow:hidden;background:transparent;"><img src="${faviconDataUri}" width="48" height="48" style="display:block;width:48px;height:48px;" /></body></html>`;
    await send("Page.navigate", {
      url: `data:text/html;base64,${Buffer.from(iconHtml, "utf8").toString("base64")}`,
    });
    await sleep(200);
    const iconShot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(faviconPngPath, Buffer.from(iconShot.data, "base64"));
    await send("Emulation.setDefaultBackgroundColorOverride", {});
  }

  const DESKTOP_DESC_LIMIT = 158;
  const MOBILE_DESC_LIMIT = 120;
  const DESKTOP_TITLE_MAX_PX = 600;
  const MOBILE_TITLE_MAX_PX = 340;

  const truncationReport = [];

  for (const item of PUBLIC_ROUTES) {
    const meta = readRouteMetadataFromDist(item.route);
    const breadcrumb = formatBreadcrumbUrl(meta.canonicalUrl);
    const desktopDesc = truncateChars(meta.description, DESKTOP_DESC_LIMIT);
    const mobileDesc = truncateChars(meta.description, MOBILE_DESC_LIMIT);

    const previewWidth = 760;
    const previewHeight = 470;

    await send("Emulation.setDeviceMetricsOverride", {
      width: previewWidth,
      height: previewHeight,
      deviceScaleFactor: 2,
      mobile: false,
    });

    const cardHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 24px 28px;
    width: ${previewWidth}px;
    height: ${previewHeight}px;
    background: #f8f9fa;
    font-family: Arial, sans-serif;
    color: #202124;
    position: relative;
    overflow: hidden;
  }
  .sim-badge {
    position: absolute;
    top: 12px;
    right: 16px;
    font-size: 11px;
    font-weight: 600;
    color: #5f6368;
    background: #e8eaed;
    border: 1px solid #dadce0;
    border-radius: 6px;
    padding: 4px 8px;
    letter-spacing: 0.02em;
  }
  .section-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #5f6368;
    margin-bottom: 8px;
  }
  .serp-card {
    background: #ffffff;
    border: 1px solid #dadce0;
    border-radius: 12px;
    padding: 18px 22px;
    margin-bottom: 18px;
    box-shadow: 0 1px 2px rgba(60,64,67,0.06);
  }
  .serp-card.mobile {
    width: 392px;
    padding: 16px 16px;
    margin-bottom: 0;
  }
  .byline {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 6px;
  }
  .favicon-box {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #f1f3f4;
    border: 1px solid #e8eaed;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .favicon-box img {
    width: 18px;
    height: 18px;
    display: block;
    border-radius: 3px;
  }
  .site-meta {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .site-name {
    font-size: 14px;
    line-height: 20px;
    color: #202124;
    font-weight: 400;
  }
  .breadcrumb {
    font-size: 12px;
    line-height: 18px;
    color: #4d5156;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 560px;
  }
  .mobile .breadcrumb {
    max-width: 310px;
  }
  .title {
    font-size: 20px;
    line-height: 26px;
    color: #1a0dab;
    font-weight: 400;
    margin: 2px 0 4px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .desktop .title {
    max-width: ${DESKTOP_TITLE_MAX_PX}px;
  }
  .mobile .title {
    font-size: 19px;
    line-height: 25px;
    max-width: ${MOBILE_TITLE_MAX_PX}px;
  }
  .description {
    font-size: 14px;
    line-height: 22px;
    color: #4d5156;
    margin: 0;
    max-width: 600px;
  }
  .mobile .description {
    max-width: 360px;
  }
</style>
</head>
<body>
  <div class="sim-badge">SIMULATION, real Google results may differ</div>

  <div class="section-label">Desktop Google Result (${escapeHtml(item.route)})</div>
  <div class="serp-card desktop">
    <div class="byline">
      <div class="favicon-box"><img src="${faviconDataUri}" alt="" /></div>
      <div class="site-meta">
        <div class="site-name">${escapeHtml(meta.siteName)}</div>
        <div class="breadcrumb">${escapeHtml(breadcrumb)}</div>
      </div>
    </div>
    <div id="desktop-title" class="title">${escapeHtml(meta.title)}</div>
    <p class="description">${escapeHtml(desktopDesc.text)}</p>
  </div>

  <div class="section-label">Mobile Google Result (${escapeHtml(item.route)})</div>
  <div class="serp-card mobile">
    <div class="byline">
      <div class="favicon-box"><img src="${faviconDataUri}" alt="" /></div>
      <div class="site-meta">
        <div class="site-name">${escapeHtml(meta.siteName)}</div>
        <div class="breadcrumb">${escapeHtml(breadcrumb)}</div>
      </div>
    </div>
    <div id="mobile-title" class="title">${escapeHtml(meta.title)}</div>
    <p class="description">${escapeHtml(mobileDesc.text)}</p>
  </div>
</body>
</html>`;

    await send("Page.navigate", {
      url: `data:text/html;base64,${Buffer.from(cardHtml, "utf8").toString("base64")}`,
    });
    await sleep(250);

    const metricsRes = await send("Runtime.evaluate", {
      expression: `JSON.stringify({
        desktopTitleScrollW: document.getElementById("desktop-title").scrollWidth,
        desktopTitleClientW: document.getElementById("desktop-title").clientWidth,
        mobileTitleScrollW: document.getElementById("mobile-title").scrollWidth,
        mobileTitleClientW: document.getElementById("mobile-title").clientWidth
      })`,
      returnByValue: true,
    });
    const m = JSON.parse(metricsRes.result.value);

    const shot = await send("Page.captureScreenshot", { format: "png" });
    const outPath = path.join(outDir, `${item.slug}.png`);
    fs.writeFileSync(outPath, Buffer.from(shot.data, "base64"));

    truncationReport.push({
      route: item.route,
      file: `serp-previews/${item.slug}.png`,
      title: meta.title,
      titleChars: meta.title.length,
      desktopTitleTruncated: m.desktopTitleScrollW > m.desktopTitleClientW,
      mobileTitleTruncated: m.mobileTitleScrollW > m.mobileTitleClientW,
      descChars: meta.description.length,
      desktopDescTruncated: desktopDesc.truncated,
      mobileDescTruncated: mobileDesc.truncated,
      mobileDescPreview: mobileDesc.text,
    });
  }

  console.log("=== SERP Preview Generation Report ===");
  for (const r of truncationReport) {
    console.log(
      `${r.route.padEnd(20)} -> ${r.file.padEnd(36)} | Title: "${r.title}" (${r.titleChars} chars, desktopPxTrunc=${r.desktopTitleTruncated}, mobilePxTrunc=${r.mobileTitleTruncated}) | Desc: ${r.descChars} chars (desktop158Trunc=${r.desktopDescTruncated}, mobile120Trunc=${r.mobileDescTruncated})`
    );
  }

  ws.close();
} finally {
  proc.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch {}
  process.exit(0);
}
