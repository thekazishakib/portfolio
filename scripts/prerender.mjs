import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadEnv } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const ssrDir = path.join(rootDir, "dist-ssr");
const publicDir = path.join(rootDir, "public");

const fileEnv = loadEnv("production", rootDir, "");
const mergedEnv = { ...fileEnv, ...process.env };

const entryServerPath = pathToFileURL(path.join(ssrDir, "entry-server.js")).href;
const {
  getHomeStatusItems,
  getPageTitle,
  getRouteJsonLd,
  getRouteSeo,
  getSitemapRoutes,
  PORTFOLIO_DATA,
  PUBLIC_ROUTES,
  renderRoute,
  validateProductionSiteUrl,
} = await import(entryServerPath);

const siteUrl = validateProductionSiteUrl(mergedEnv.VITE_SITE_URL);
const portfolioData = PORTFOLIO_DATA;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getGitLastMod(files) {
  if (!files || files.length === 0) return null;
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...files], {
      cwd: rootDir,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null;
  } catch {
    return null;
  }
}

const templateHtml = fs.readFileSync(path.join(distDir, "index.html"), "utf8");

function buildRouteHtml(routePath) {
  const seo = getRouteSeo(routePath, siteUrl);
  const title = getPageTitle(routePath);
  const schemas = getRouteJsonLd(routePath, portfolioData, siteUrl);
  const appHtml = renderRoute(routePath);

  const jsonLdTag =
    schemas.length > 0
      ? `\n    <script id="seo-json-ld" type="application/ld+json">${JSON.stringify(
          schemas.length === 1 ? schemas[0] : schemas
        )}</script>`
      : "";

  let html = templateHtml
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${escapeHtml(seo.description)}" />`
    )
    .replace(
      /<meta name="robots" content="[^"]*" \/>/,
      `<meta name="robots" content="${escapeHtml(seo.robots)}" />`
    )
    .replace(
      /<meta property="og:title" content="[^"]*" \/>/,
      `<meta property="og:title" content="${escapeHtml(title)}" />`
    )
    .replace(
      /<meta property="og:description" content="[^"]*" \/>/,
      `<meta property="og:description" content="${escapeHtml(seo.description)}" />`
    )
    .replace(
      /<meta property="og:type" content="[^"]*" \/>/,
      `<meta property="og:type" content="${escapeHtml(seo.ogType)}" />`
    )
    .replace(
      /<meta property="og:url" content="[^"]*" \/>/,
      `<meta property="og:url" content="${escapeHtml(seo.ogUrl)}" />`
    )
    .replace(
      /<meta property="og:image" content="[^"]*" \/>/,
      `<meta property="og:image" content="${escapeHtml(seo.ogImageUrl)}" />`
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*" \/>/,
      `<meta name="twitter:title" content="${escapeHtml(title)}" />`
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*" \/>/,
      `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`
    )
    .replace(
      /<meta name="twitter:image" content="[^"]*" \/>/,
      `<meta name="twitter:image" content="${escapeHtml(seo.ogImageUrl)}" />`
    )
    .replace(
      /<link rel="canonical" href="[^"]*" \/>/,
      `<link rel="canonical" href="${escapeHtml(seo.canonicalUrl)}" />${jsonLdTag}`
    )
    .replace(
      '<div id="root"></div>',
      `<div id="root" data-route="${escapeHtml(routePath)}">${appHtml}</div>`
    );

  return html;
}

const routesToPrerender = [
  ...PUBLIC_ROUTES,
  "/articles",
  "/skills",
  "/terms",
  "/privacy",
];

for (const route of routesToPrerender) {
  const html = buildRouteHtml(route);
  const outPath =
    route === "/"
      ? path.join(distDir, "index.html")
      : path.join(distDir, route.slice(1), "index.html");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, "utf8");
}

// Write 404.html
const notFoundHtml = buildRouteHtml("/404");
fs.writeFileSync(path.join(distDir, "404.html"), notFoundHtml, "utf8");

// Generate sitemap.xml (public canonical routes only; use real git commit date or omit lastmod)
const sitemapRoutes = getSitemapRoutes();
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes
  .map((r) => {
    const loc = r.canonicalPath === "/" ? `${siteUrl}/` : `${siteUrl}${r.canonicalPath}`;
    const lastmod = getGitLastMod(r.sourceFiles);
    const lastmodLine = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";
    return `  <url>
    <loc>${escapeHtml(loc)}</loc>${lastmodLine}
  </url>`;
  })
  .join("\n")}
</urlset>
`;

// Generate robots.txt
const robotsTxt = `User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

// Generate llms.txt & llms-full.txt from static portfolio data
const d = portfolioData;
const llmsTxt = `# ${d.about.fullName}

> ${d.about.roleHeadline} (${d.about.location}). ${d.about.bioParagraphs[0]}

## Public Pages

- [Home](${siteUrl}/): Current roles, teaching, club advisory, and writing overview.
- [About Me](${siteUrl}/about): Biography, highlights, languages, and direct contact channels.
- [Academic Portfolio](${siteUrl}/academics): SAT 1420, Duolingo English Test 135, SR Dream IT diploma, and school history.
- [Selected Projects](${siteUrl}/projects): Open-source Python tools, web platforms, and data analysis projects.
- [Publication](${siteUrl}/publication): Articles on inflation, purchasing power, gold, and retirement savings.
- [Experience & Leadership](${siteUrl}/experience): Work experience at Mentors Brother and Hanif Enterprise, plus club leadership and volunteering.
- [Awards & Skills](${siteUrl}/awards): Honors, certifications, and technical/finance skills.
- [Terms & Privacy](${siteUrl}/terms-and-privacy): Copyright notice, third-party trademark notice, and visitor privacy policy.

## Contact & Profiles

- Email: ${d.legalTerms.contactEmail}
${d.socialLinks
  .filter((s) => Boolean(s.url?.trim()) && s.url.trim().startsWith("http"))
  .slice(0, 4)
  .map((s) => `- ${s.name}: ${s.url.trim()}`)
  .join("\n")}
`;

const llmsFullTxt = `# ${d.about.fullName} — Full Portfolio Reference

> ${d.about.roleHeadline} · ${d.about.location}

## Biography

${d.about.bioParagraphs.join("\n\n")}

- Languages: ${d.about.languagesContent}

## Current Work (${siteUrl}/)

${getHomeStatusItems(d)
  .map(
    (item) =>
      `### ${item.role} — ${item.organization} (${item.timeframe}${item.location ? `, ${item.location}` : ""})\n${item.summary}\n${item.keyDeliverables.map((k) => `- ${k}`).join("\n")}`
  )
  .join("\n\n")}

## Education & Test Scores (${siteUrl}/academics)

### Standardized Tests & Focus
${d.academics.benchmarkCards.map((c) => `- ${c.label}: ${c.value} (${c.note})`).join("\n")}

### Education History
${d.academics.educationHistory
  .map(
    (e) =>
      `- ${e.institution} (${e.year}, ${e.location}): ${e.degree} — ${e.result}${e.details ? ` (${e.details})` : ""}`
  )
  .join("\n")}

## Selected Projects (${siteUrl}/projects)

${d.projectsData.projects
  .map(
    (p) =>
      `### ${p.title} (${p.category}, ${p.year})\n${p.summary}\n- Tech: ${p.tech.join(", ")}\n- Impact: ${p.impact}${p.githubUrl ? `\n- Source: ${p.githubUrl}` : ""}${p.liveUrl ? `\n- Link: ${p.liveUrl}` : ""}`
  )
  .join("\n\n")}

## Publications (${siteUrl}/publication)

${d.articlesData.publications
  .map(
    (pub) =>
      `### ${pub.title} (${pub.publisher}, ${pub.date})\n${pub.abstract}\n- Status: ${pub.status}${pub.link ? `\n- Link: ${pub.link}` : ""}`
  )
  .join("\n\n")}

## Experience & Volunteering (${siteUrl}/experience)

### Professional Experience
${d.experienceData.workExperiences
  .map(
    (w) =>
      `#### ${w.role} — ${w.company} (${w.period}, ${w.location})\n${w.summary}\n${w.highlights.map((h) => `- ${h}`).join("\n")}`
  )
  .join("\n\n")}

### Volunteering & Leadership
${d.experienceData.leadershipAndVolunteering
  .map(
    (l) =>
      `#### ${l.role} — ${l.organization} (${l.period})\n${l.summary}\n${l.highlights.map((h) => `- ${h}`).join("\n")}`
  )
  .join("\n\n")}

## Awards, Certifications & Skills (${siteUrl}/awards)

### Honors & Awards
${d.awardsData.awards.map((a) => `- ${a.title} (${a.organization}, ${a.year}): ${a.description}`).join("\n")}

### Certifications
${d.awardsData.certifications.map((c) => `- ${c.title} (${c.issuer}, ${c.date}): ${c.credentialNote}`).join("\n")}

### Skills
${d.awardsData.directSkills.map((s) => `- ${s.name} (${s.category})`).join("\n")}

## Contact & Profiles

- Website: ${siteUrl}/
- Email: ${d.legalTerms.contactEmail}
${d.socialLinks
  .filter((s) => Boolean(s.url?.trim()) && s.url.trim().startsWith("http"))
  .map((s) => `- ${s.name}: ${s.url.trim()}`)
  .join("\n")}
`;

for (const dir of [publicDir, distDir]) {
  fs.writeFileSync(path.join(dir, "sitemap.xml"), sitemapXml, "utf8");
  fs.writeFileSync(path.join(dir, "robots.txt"), robotsTxt, "utf8");
  fs.writeFileSync(path.join(dir, "llms.txt"), llmsTxt, "utf8");
  fs.writeFileSync(path.join(dir, "llms-full.txt"), llmsFullTxt, "utf8");
}

fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(
  `Prerendered ${routesToPrerender.length} routes + 404.html from static data, and generated sitemap.xml, robots.txt, llms.txt, llms-full.txt (SITE_URL=${siteUrl}).`
);
