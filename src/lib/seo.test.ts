import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "vitest";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { getHomeStatusItems } from "./currentStatus";
import { renderRoute } from "../entry-server";
import { getPageTitle } from "./pageTitle";
import {
  getRouteJsonLd,
  getRouteSeo,
  getSitemapRoutes,
  isKnownRoute,
  PUBLIC_ROUTES,
  SITE_URL,
  validateProductionSiteUrl,
} from "./seo";

test("all public routes have exact expected titles, 150-160 char descriptions, and self-referencing canonicals", () => {
  const expectedTitles: Record<string, string> = {
    "/": "Home Kazi Shakib",
    "/about": "About Kazi Shakib",
    "/academics": "Academics Kazi Shakib",
    "/projects": "Projects Kazi Shakib",
    "/publication": "Publication Kazi Shakib",
    "/experience": "Experience Kazi Shakib",
    "/awards": "Awards & Skills Kazi Shakib",
    "/terms-and-privacy": "Terms & Privacy Kazi Shakib",
  };

  for (const route of PUBLIC_ROUTES) {
    const seo = getRouteSeo(route, "https://example.com");
    assert.equal(seo.title, expectedTitles[route], `Route ${route} title mismatch`);
    assert.equal(getPageTitle(route), expectedTitles[route]);
    assert.ok(
      seo.description.length >= 150 && seo.description.length <= 160,
      `Route ${route} description length ${seo.description.length} outside 150-160: "${seo.description}"`
    );
    assert.equal(seo.robots, "index,follow");
    const expectedCanonical = route === "/" ? "https://example.com/" : `https://example.com${route}`;
    assert.equal(seo.canonicalUrl, expectedCanonical);
  }

  assert.ok(getRouteSeo("/academics").description.includes("SAT 1420"));
  assert.ok(getRouteSeo("/academics").description.includes("DET 135"));
  assert.ok(getRouteSeo("/publication").description.includes("inflation"));
  assert.ok(getRouteSeo("/publication").description.includes("gold"));
});

test("alias routes use canonical titles/URLs, and unknown routes use 404 title and noindex", () => {
  assert.equal(getRouteSeo("/articles", "https://example.com").canonicalUrl, "https://example.com/publication");
  assert.equal(getRouteSeo("/articles").title, "Publication Kazi Shakib");
  assert.equal(getPageTitle("/articles"), "Publication Kazi Shakib");

  assert.equal(getRouteSeo("/skills", "https://example.com").canonicalUrl, "https://example.com/awards");
  assert.equal(getRouteSeo("/skills").title, "Awards & Skills Kazi Shakib");
  assert.equal(getPageTitle("/skills"), "Awards & Skills Kazi Shakib");

  assert.equal(getRouteSeo("/terms", "https://example.com").canonicalUrl, "https://example.com/terms-and-privacy");
  assert.equal(getRouteSeo("/terms").title, "Terms & Privacy Kazi Shakib");
  assert.equal(getPageTitle("/terms"), "Terms & Privacy Kazi Shakib");

  assert.equal(getRouteSeo("/privacy", "https://example.com").canonicalUrl, "https://example.com/terms-and-privacy");
  assert.equal(getRouteSeo("/privacy").title, "Terms & Privacy Kazi Shakib");
  assert.equal(getPageTitle("/privacy"), "Terms & Privacy Kazi Shakib");

  const unknownPath = "/" + ["ad", "min"].join("");
  assert.equal(isKnownRoute(unknownPath), false);
  const unknownRouteSeo = getRouteSeo(unknownPath, "https://example.com");
  assert.equal(unknownRouteSeo.title, "Page Not Found Kazi Shakib");
  assert.equal(getPageTitle(unknownPath), "Page Not Found Kazi Shakib");
  assert.equal(unknownRouteSeo.robots, "noindex,nofollow");

  const missingSeo = getRouteSeo("/does-not-exist", "https://example.com");
  assert.equal(missingSeo.title, "Page Not Found Kazi Shakib");
  assert.equal(getPageTitle("/does-not-exist"), "Page Not Found Kazi Shakib");
  assert.equal(missingSeo.robots, "noindex,nofollow");

  const sitemapPaths = getSitemapRoutes().map((r) => r.path);
  assert.deepEqual(sitemapPaths, [...PUBLIC_ROUTES]);
});

test("validateProductionSiteUrl throws when VITE_SITE_URL is unset or contains TODO", () => {
  assert.throws(() => validateProductionSiteUrl(undefined), /VITE_SITE_URL/);
  assert.throws(() => validateProductionSiteUrl(""), /VITE_SITE_URL/);
  assert.throws(() => validateProductionSiteUrl("https://TODO-SET-DOMAIN"), /TODO/);
  assert.equal(validateProductionSiteUrl("https://kazishakib.com/"), "https://kazishakib.com");
});

test("structured data blocks are valid JSON with WebSite name 'Kazi Shakib' and no unsupported schema types", () => {
  const forbiddenTypes = new Set([
    "Organization",
    "LocalBusiness",
    "Product",
    "Review",
    "AggregateRating",
    "FAQPage",
  ]);

  const homeBlocks = getRouteJsonLd("/", PORTFOLIO_DATA, "https://kazishakib.com");
  const websiteBlock = homeBlocks.find((b) => b["@type"] === "WebSite");
  assert.ok(websiteBlock, "Expected WebSite JSON-LD on /");
  assert.equal(websiteBlock.name, "Kazi Shakib");

  for (const route of PUBLIC_ROUTES) {
    const blocks = getRouteJsonLd(route);
    assert.ok(blocks.length > 0, `Expected JSON-LD on ${route}`);
    for (const block of blocks) {
      const serialized = JSON.stringify(block);
      const parsed = JSON.parse(serialized) as Record<string, unknown>;
      assert.equal(parsed["@context"], "https://schema.org");
      assert.equal(typeof parsed["@type"], "string");
      assert.ok(!forbiddenTypes.has(parsed["@type"] as string));
      assert.ok(!serialized.includes('"Pending'));
    }
  }

  assert.equal(getRouteJsonLd("/unknown-route").length, 0);
  assert.ok(SITE_URL.length > 0);
});

test("every route's data is present, every /uploads image exists on disk, and every external URL starts with https:// or mailto:", () => {
  // 1. Every route's data is present and renders non-empty HTML
  assert.ok(PORTFOLIO_DATA.hero.mainName.length > 0);
  assert.equal(PORTFOLIO_DATA.currentStatus.items.length, 2);
  assert.equal(getHomeStatusItems(PORTFOLIO_DATA).length, 4);
  assert.equal(PORTFOLIO_DATA.about.bioParagraphs.length, 3);
  assert.equal(PORTFOLIO_DATA.about.highlights.length, 4);
  assert.equal(PORTFOLIO_DATA.about.contactChannels.length, 9);
  assert.equal(PORTFOLIO_DATA.academics.benchmarkCards.length, 3);
  assert.equal(PORTFOLIO_DATA.academics.educationHistory.length, 6);
  assert.equal(PORTFOLIO_DATA.projectsData.projects.length, 8);
  assert.equal(PORTFOLIO_DATA.articlesData.publications.length, 3);
  assert.equal(PORTFOLIO_DATA.articlesData.footerExtraLinks.length, 2);
  assert.equal(PORTFOLIO_DATA.experienceData.workExperiences.length, 2);
  assert.equal(PORTFOLIO_DATA.experienceData.leadershipAndVolunteering.length, 4);
  assert.equal(PORTFOLIO_DATA.awardsData.awards.length, 5);
  assert.equal(PORTFOLIO_DATA.awardsData.certifications.length, 4);
  assert.equal(PORTFOLIO_DATA.awardsData.directSkills.length, 8);
  assert.equal(PORTFOLIO_DATA.legalTerms.intellectualPropertyText.length, 3);
  assert.equal(PORTFOLIO_DATA.legalTerms.thirdPartyLogosText.length, 3);
  assert.equal(PORTFOLIO_DATA.legalTerms.externalLinksText.length, 2);
  assert.equal(PORTFOLIO_DATA.legalTerms.privacyPolicyText.length, 3);
  assert.equal(PORTFOLIO_DATA.footer.contactLinks.length, 7);

  for (const route of PUBLIC_ROUTES) {
    const html = renderRoute(route);
    assert.ok(html.includes("<h1"), `Expected rendered <h1> on route ${route}`);
  }

  // 2. Every non-empty image path in PORTFOLIO_DATA resolves under public/uploads/
  const imageValues: string[] = [
    PORTFOLIO_DATA.about.profileImageUrl,
    ...PORTFOLIO_DATA.currentStatus.items.map((i) => i.logoUrl),
    ...PORTFOLIO_DATA.academics.benchmarkCards.map((i) => i.logoUrl),
    ...PORTFOLIO_DATA.academics.educationHistory.map((i) => i.logoUrl),
    ...PORTFOLIO_DATA.projectsData.projects.map((i) => i.logoUrl),
    ...PORTFOLIO_DATA.articlesData.publications.map((i) => i.logoUrl),
    ...PORTFOLIO_DATA.experienceData.workExperiences.map((i) => i.logoUrl),
    ...PORTFOLIO_DATA.experienceData.leadershipAndVolunteering.map((i) => i.logoUrl),
    ...PORTFOLIO_DATA.awardsData.awards.map((i) => i.logoUrl),
    ...PORTFOLIO_DATA.awardsData.certifications.map((i) => i.logoUrl),
    ...PORTFOLIO_DATA.awardsData.directSkills.map((i) => i.logoUrl),
  ].filter((img): img is string => Boolean(img && img.trim()));

  const uniqueUploads = new Set(imageValues);
  assert.ok(uniqueUploads.size >= 40, `Expected at least 40 unique /uploads/ images, found ${uniqueUploads.size}`);

  for (const img of imageValues) {
    assert.equal(typeof img, "string");
    assert.ok(img.trim().length > 0, "Expected non-empty resolved image URL");
    assert.ok(img.startsWith("/uploads/"), `Expected image path to start with "/uploads/", got "${img}"`);
    const fullPath = path.resolve("public", img.slice(1));
    assert.ok(fs.existsSync(fullPath), `Missing image file on disk: ${fullPath}`);
    assert.ok(fs.statSync(fullPath).size > 0, `Empty image file on disk: ${fullPath}`);
  }

  // 3. Every non-empty external URL in PORTFOLIO_DATA starts with https:// or mailto:
  const isAllowedExternalUrl = (url: string) =>
    url.startsWith("https://") || url.startsWith("mailto:");

  const externalUrls: { label: string; url: string }[] = [
    ...(PORTFOLIO_DATA.resumeUrl
      ? [{ label: "resumeUrl", url: PORTFOLIO_DATA.resumeUrl }]
      : []),
    ...PORTFOLIO_DATA.socialLinks
      .filter((s) => Boolean(s.url?.trim()))
      .map((s) => ({
        label: `socialLinks.${s.name}`,
        url: s.url,
      })),
    ...PORTFOLIO_DATA.about.contactChannels
      .filter((c) => Boolean(c.href?.trim()))
      .map((c) => ({
        label: `about.contactChannels.${c.name}`,
        url: c.href,
      })),
    ...PORTFOLIO_DATA.projectsData.projects.flatMap((p) => [
      ...(p.githubUrl ? [{ label: `projects.${p.id}.githubUrl`, url: p.githubUrl }] : []),
      ...(p.liveUrl ? [{ label: `projects.${p.id}.liveUrl`, url: p.liveUrl }] : []),
    ]),
    ...PORTFOLIO_DATA.articlesData.publications
      .filter((p) => Boolean(p.link?.trim()))
      .map((p) => ({
        label: `publications.${p.id}.link`,
        url: p.link,
      })),
    ...PORTFOLIO_DATA.articlesData.footerExtraLinks
      .filter((l) => Boolean(l.href?.trim()))
      .map((l) => ({
        label: `footerExtraLinks.${l.title}`,
        url: l.href,
      })),
    ...PORTFOLIO_DATA.experienceData.leadershipAndVolunteering
      .filter((l) => Boolean(l.link?.trim()))
      .map((l) => ({ label: `leadership.${l.organization}`, url: l.link! })),
    ...PORTFOLIO_DATA.awardsData.awards
      .filter((a) => Boolean(a.link?.trim()))
      .map((a) => ({ label: `awards.${a.title}`, url: a.link! })),
    ...PORTFOLIO_DATA.awardsData.certifications
      .filter((c) => Boolean(c.link?.trim()) && c.link !== "#")
      .map((c) => ({ label: `certifications.${c.title}`, url: c.link })),
    ...PORTFOLIO_DATA.footer.contactLinks
      .filter((c) => Boolean(c.href?.trim()))
      .map((c) => ({
        label: `footer.contactLinks.${c.label}`,
        url: c.href,
      })),
  ];

  for (const { label, url } of externalUrls) {
    assert.ok(
      isAllowedExternalUrl(url),
      `Expected ${label} ("${url}") to start with https:// or mailto:`
    );
  }
});

test("vercel.json keeps strict public CSP unchanged and applies noindex + narrow CSP to /admin/*", () => {
  const vercelConfig = JSON.parse(fs.readFileSync(path.resolve("vercel.json"), "utf8"));
  const indexHtml = fs.readFileSync(path.resolve("index.html"), "utf8");
  const adminHtml = fs.readFileSync(path.resolve("admin/index.html"), "utf8");

  assert.ok(fs.existsSync(path.resolve("public/favicon.svg")));
  assert.ok(fs.existsSync(path.resolve("public/favicon-48x48.png")));
  assert.ok(indexHtml.includes('href="/favicon.svg"'));
  assert.ok(indexHtml.includes('href="/favicon-48x48.png"'));
  assert.ok(indexHtml.includes('sizes="48x48"'));
  assert.ok(adminHtml.includes('<meta name="robots" content="noindex, nofollow" />'));

  assert.equal(vercelConfig.cleanUrls, true);
  assert.equal(vercelConfig.trailingSlash, false);
  assert.equal("rewrites" in vercelConfig, false);

  const headerRules = vercelConfig.headers as Array<{
    source: string;
    headers: Array<{ key: string; value: string }>;
  }>;
  const baseIdx = headerRules.findIndex((rule) => rule.source === "/(.*)");
  const publicCspIdx = headerRules.findIndex((rule) => rule.source === "/((?!admin(?:/|$)).*)");
  const adminExactIdx = headerRules.findIndex((rule) => rule.source === "/admin");
  const adminSubIdx = headerRules.findIndex((rule) => rule.source === "/admin/(.*)");
  assert.equal(baseIdx, 0);
  assert.ok(publicCspIdx > baseIdx);
  assert.ok(adminExactIdx > publicCspIdx);
  assert.ok(adminSubIdx > publicCspIdx);
  assert.equal(
    headerRules[baseIdx].headers.some((h) => h.key === "Content-Security-Policy" || h.key === "X-Robots-Tag"),
    false
  );

  const expectedPublicCsp =
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'";
  const publicCsp = headerRules[publicCspIdx].headers.find((h) => h.key === "Content-Security-Policy")?.value;
  assert.equal(publicCsp, expectedPublicCsp);
  assert.ok(!publicCsp?.includes("accounts.google.com"));
  assert.ok(!publicCsp?.includes("googleusercontent.com"));

  // Verify every route pattern resolves to at most one CSP rule (never public + admin together)
  const sourceRegexes = headerRules.map((r) => ({
    source: r.source,
    re: new RegExp(`^${r.source.replace(/\.\*/g, ".*")}$`),
    hasCsp: r.headers.some((h) => h.key === "Content-Security-Policy"),
    hasRobots: r.headers.some((h) => h.key === "X-Robots-Tag"),
  }));
  for (const probe of ["/", "/about", "/administrator", "/admin", "/admin/", "/admin/index.html", "/admin/config.yml"]) {
    const matchedCsp = sourceRegexes.filter((r) => r.hasCsp && r.re.test(probe));
    const matchedRobots = sourceRegexes.filter((r) => r.hasRobots && r.re.test(probe));
    assert.equal(matchedCsp.length, 1, `Expected exactly 1 CSP rule for ${probe}, got ${matchedCsp.map((m) => m.source)}`);
    const isAdminProbe = probe === "/admin" || probe.startsWith("/admin/");
    assert.equal(matchedRobots.length, isAdminProbe ? 1 : 0, `Unexpected X-Robots-Tag match count for ${probe}`);
    assert.equal(matchedCsp[0].source === "/((?!admin(?:/|$)).*)", !isAdminProbe);
  }

  for (const idx of [adminExactIdx, adminSubIdx]) {
    const hdrs = headerRules[idx].headers;
    assert.equal(hdrs.find((h) => h.key === "X-Robots-Tag")?.value, "noindex, nofollow");
    const adminCsp = hdrs.find((h) => h.key === "Content-Security-Policy")?.value || "";
    assert.ok(adminCsp.includes("script-src 'self'"));
    assert.ok(adminCsp.includes("https://api.github.com"));
    assert.ok(adminCsp.includes("https://raw.githubusercontent.com"));
    assert.ok(adminCsp.includes("https://avatars.githubusercontent.com"));
    assert.ok(adminCsp.includes("https://www.githubstatus.com"));
    assert.ok(!adminCsp.includes("unsafe-eval' ;")); // allows 'wasm-unsafe-eval', never unsafe-eval
    assert.ok(!adminCsp.includes(" 'unsafe-eval'"));
    assert.ok(!adminCsp.includes("unpkg.com"));
    assert.ok(!adminCsp.includes("cdn.jsdelivr.net"));
  }
});
