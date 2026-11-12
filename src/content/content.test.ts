import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import Ajv from "ajv";
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { describe, it } from "vitest";
import YAML from "yaml";
import { renderRoute } from "../entry-server";
import { PortfolioProvider } from "../context/PortfolioContext";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { CurrentStatus } from "../components/CurrentStatus";
import { About } from "../components/About";
import { AcademicPortfolio } from "../components/AcademicPortfolio";
import { Projects } from "../components/Projects";
import { Blog } from "../components/Blog";
import { Experience } from "../components/Experience";
import { Awards } from "../components/Awards";
import { Footer } from "../components/Footer";
import { NotFound } from "../components/NotFound";
import { TermsAndPrivacy } from "../components/TermsAndPrivacy";
import { PORTFOLIO_DATA, type PortfolioData } from "../data/portfolio";
import { getHomeStatusItems } from "../lib/currentStatus";
import { ICON_OPTIONS } from "../lib/iconMap";
import { PUBLIC_ROUTES } from "../lib/seo";
import { validateContent } from "../../scripts/validate-content.mjs";

function makeTempContentCopy(): string {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-content-test-"));
  fs.cpSync(path.resolve("src"), path.join(tmpDir, "src"), { recursive: true });
  fs.cpSync(path.resolve("public"), path.join(tmpDir, "public"), { recursive: true });
  return tmpDir;
}

function mutateJson(tmpDir: string, file: string, mutator: (doc: Record<string, unknown>) => void) {
  const target = path.join(tmpDir, "src", "content", file);
  const doc = JSON.parse(fs.readFileSync(target, "utf8")) as Record<string, unknown>;
  mutator(doc);
  fs.writeFileSync(target, JSON.stringify(doc, null, 2));
}

describe("content validation and assembly", () => {
  it("validates all production content JSON files, icons, links, and uploads", () => {
    const result = validateContent(process.cwd());
    assert.equal(result.filesChecked, 10);
    assert.ok(result.iconCount >= 15);
    assert.ok(Array.isArray(result.warnings));
    assert.ok(
      result.warnings.some((w: string) => w.includes("currentStatus.json") && w.includes("University Admission Preparation"))
    );
    assert.ok(
      result.warnings.some((w: string) => w.includes("experience.json") && w.includes("Mentors Brother"))
    );
  });

  it("assembles all 10 JSON sections into PORTFOLIO_DATA and renders all 8 public routes", () => {
    assert.equal(PORTFOLIO_DATA.footer.brandName, "KAZI SHAKIB");
    assert.ok(PORTFOLIO_DATA.hero.mainName.length > 0);
    assert.equal(PORTFOLIO_DATA.currentStatus.items.length, 2);
    const homeItems = getHomeStatusItems(PORTFOLIO_DATA);
    assert.deepEqual(
      homeItems.map((item) => item.role),
      [
        "University Admission Preparation",
        "Finance Instructor",
        "Alumni IT Advisor",
        "Economic Writer & FIDE Arena Competitor",
      ]
    );
    assert.deepEqual(
      homeItems[1],
      {
        id: "work-0",
        sourceSection: "Work",
        categoryLabel: "Teaching & Corporate Finance",
        timeframe: "Aug 2026 – Present",
        role: "Finance Instructor",
        organization: "Mentors Brother",
        logoUrl: "/uploads/exp-mentors-brother.jpg",
        logoAlt: "Mentors Brother Logo",
        location: "Mirpur, Dhaka",
        summary:
          "Teaching corporate finance, capital budgeting, and valuation to 100+ commerce students through worked examples and practice problems.",
        keyDeliverables: [
          "Teaching 8+ valuation methods, including IRR, NPV, Payback Period, and EBITDA",
          "Working through Time Value of Money (TVM) and multi-period annuity problems",
          "Helped at-risk students in my classes achieve a 100% final exam pass rate",
        ],
        proofSummary: "100+ Students Taught · 100% Exam Pass Rate · 8+ Valuation Methods",
        link: "/experience",
        linkLabel: "View Experience",
      }
    );
    assert.deepEqual(
      homeItems[2],
      {
        id: "volunteering-0",
        sourceSection: "Volunteering",
        categoryLabel: "Software & Club Advisory",
        timeframe: "Oct 2025 – Present",
        role: "Alumni IT Advisor",
        organization: "BAFSD Business Club",
        logoUrl: "/uploads/exp-bafsd-leadership.jpg",
        logoAlt: "BAFSD Business Club Logo",
        location: "BAF Shaheen College Dhaka",
        summary:
          "Helping the club’s executive committee maintain its 11-page website and automated certificate delivery for business events.",
        keyDeliverables: [
          "Maintaining the club's 11-page React, TypeScript, and Firebase website on Vercel",
          "Running automated e-certificate delivery with Google Apps Script and AutoCrat",
          "Showing new club members how to manage the site and event registrations",
        ],
        proofSummary: "11-Page React/TS Platform · Firebase & Vercel · Automated E-Certificates",
        link: "/experience",
        linkLabel: "View Experience",
      }
    );
    assert.equal(PORTFOLIO_DATA.academics.educationHistory.length, 6);
    assert.equal(PORTFOLIO_DATA.projectsData.projects.length, 8);
    assert.equal(PORTFOLIO_DATA.articlesData.publications.length, 3);
    assert.equal(PORTFOLIO_DATA.experienceData.workExperiences.length, 2);
    assert.equal(PORTFOLIO_DATA.awardsData.awards.length, 5);
    assert.equal(PORTFOLIO_DATA.awardsData.certifications.length, 4);

    assert.equal(PUBLIC_ROUTES.length, 8);
    for (const route of PUBLIC_ROUTES) {
      const html = renderRoute(route);
      assert.ok(html.includes("<h1"), `Expected <h1> in SSR HTML for ${route}`);
      assert.ok(html.length > 500, `Expected non-trivial HTML for ${route}`);
      if (route === "/") {
        assert.ok(html.includes("Teaching &amp; Corporate Finance") || html.includes("Teaching & Corporate Finance"));
        assert.ok(html.includes("Mirpur, Dhaka"));
        assert.ok(html.includes("Software &amp; Club Advisory") || html.includes("Software & Club Advisory"));
        assert.ok(html.includes("BAFSD Business Club"));
      }
    }
  });

  it("fails with file and field names when JSON is invalid or rules are violated", () => {
    // 1. Corrupt JSON syntax
    let tmpDir = makeTempContentCopy();
    try {
      fs.writeFileSync(path.join(tmpDir, "src", "content", "hero.json"), "{ invalid json");
      assert.throws(() => validateContent(tmpDir), /hero\.json.*invalid JSON syntax/i);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }

    // 2. Leading/trailing spaces, public/ image path, missing image, bad link, "#" outside certifications, unknown icon
    tmpDir = makeTempContentCopy();
    try {
      mutateJson(tmpDir, "hero.json", (d) => {
        d.mainName = " SHAKIB ";
      });
      mutateJson(tmpDir, "about.json", (d) => {
        d.profileImageUrl = "public/uploads/kazi-shakib-profile.jpg";
        (d.highlights as Array<Record<string, unknown>>)[0].iconName = "DoesNotExistIcon";
      });
      mutateJson(tmpDir, "projects.json", (d) => {
        const first = (d.projects as Array<Record<string, unknown>>)[0];
        first.logoUrl = "/uploads/missing-file.png";
        first.githubUrl = "#";
      });
      mutateJson(tmpDir, "site.json", (d) => {
        d.resumeUrl = "http://insecure.example.com";
      });

      assert.throws(
        () => validateContent(tmpDir),
        (err: Error) =>
          err.message.includes("hero.json -> mainName") &&
          err.message.includes("about.json -> profileImageUrl") &&
          err.message.includes("about.json -> highlights[0].iconName") &&
          err.message.includes("projects.json -> projects[0].logoUrl") &&
          err.message.includes("projects.json -> projects[0].githubUrl") &&
          err.message.includes("site.json -> resumeUrl")
      );
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }

    // 3. Reject "/public/..." image paths and both forbidden GitHub token prefixes across content & root/admin files
    tmpDir = makeTempContentCopy();
    try {
      mutateJson(tmpDir, "academics.json", (d) => {
        (d.benchmarkCards as Array<Record<string, unknown>>)[0].logoUrl = "/public/uploads/sat-logo.jpg";
      });
      mutateJson(tmpDir, "legal.json", (d) => {
        d.pageSubtitle = `bad ${["ghp", "_123456"].join("")}`;
      });
      fs.writeFileSync(
        path.join(tmpDir, ".env.local"),
        `GITHUB_TOKEN=${["github", "_pat", "_123456"].join("")}\n`
      );
      fs.appendFileSync(
        path.join(tmpDir, "public", "admin", "config.yml"),
        `\n# test ${["ghp", "_999999"].join("")}\n`
      );
      assert.throws(
        () => validateContent(tmpDir),
        (err: Error) =>
          err.message.includes("academics.json -> benchmarkCards[0].logoUrl") &&
          err.message.includes("legal.json -> pageSubtitle") &&
          err.message.includes(".env.local -> (file)") &&
          err.message.includes("public/admin/config.yml -> (file)")
      );
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
    // 4. Reject missing assets/images references in src/**/*.css and src/**/*.tsx
    tmpDir = makeTempContentCopy();
    try {
      fs.appendFileSync(
        path.join(tmpDir, "src", "index.css"),
        `\n.broken-bg { background-image: url("./${["assets", "images", "academic-study-emblem.svg"].join("/")}"); }\n`
      );
      fs.writeFileSync(
        path.join(tmpDir, "src", "components", "BrokenFixture.tsx"),
        `export const x = "../${["assets", "images", "missing-file.png"].join("/")}";\n`
      );
      assert.throws(
        () => validateContent(tmpDir),
        (err: Error) =>
          err.message.includes("src/index.css") &&
          err.message.includes("academic-study-emblem.svg") &&
          err.message.includes("src/components/BrokenFixture.tsx") &&
          err.message.includes("missing-file.png")
      );
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }

    // 5. Reject missing or invalid sectionOrder entries in currentStatus.json
    tmpDir = makeTempContentCopy();
    try {
      mutateJson(tmpDir, "currentStatus.json", (d) => {
        d.sectionOrder = ["Education", "Work", "Work"];
      });
      assert.throws(
        () => validateContent(tmpDir),
        (err: Error) => err.message.includes("currentStatus.json -> sectionOrder")
      );
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }

    // 6. Reject homeBullets with more than 4 items
    tmpDir = makeTempContentCopy();
    try {
      mutateJson(tmpDir, "projects.json", (d) => {
        d.projects[0].homeBullets = ["One", "Two", "Three", "Four", "Five"];
      });
      assert.throws(
        () => validateContent(tmpDir),
        (err: Error) => err.message.includes("projects.json -> projects[0].homeBullets")
      );
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }

    // 7. Reject invalid homeLink URL
    tmpDir = makeTempContentCopy();
    try {
      mutateJson(tmpDir, "awards.json", (d) => {
        d.awards[0].homeLink = "http://insecure.example.com";
      });
      assert.throws(
        () => validateContent(tmpDir),
        (err: Error) => err.message.includes("awards.json -> awards[0].homeLink")
      );
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }

    // 8. Allow empty optional links/images and empty resumeUrl; reject mailto: on resumeUrl
    tmpDir = makeTempContentCopy();
    try {
      mutateJson(tmpDir, "site.json", (d) => {
        d.resumeUrl = "";
        (d.socialLinks as Array<{ url: string }>)[0].url = "";
        (d.footer as { contactLinks: Array<{ href: string }> }).contactLinks[0].href = "";
      });
      mutateJson(tmpDir, "about.json", (d) => {
        d.profileImageUrl = "";
        d.contactChannels[0].href = "";
      });
      mutateJson(tmpDir, "projects.json", (d) => {
        d.projects[0].logoUrl = "";
        d.projects[0].githubUrl = "";
        d.projects[0].liveUrl = "";
      });
      mutateJson(tmpDir, "publications.json", (d) => {
        d.publications[0].logoUrl = "";
        d.publications[0].link = "";
      });
      mutateJson(tmpDir, "awards.json", (d) => {
        d.awards[0].link = "";
        d.certifications[0].link = "";
      });
      const okResult = validateContent(tmpDir);
      assert.equal(okResult.filesChecked, 10);

      mutateJson(tmpDir, "site.json", (d) => {
        d.resumeUrl = "mailto:not-resume@example.com";
      });
      assert.throws(
        () => validateContent(tmpDir),
        (err: Error) => err.message.includes("site.json -> resumeUrl")
      );
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }

    // 9. Reject bullet lists > 4, while warning (< 3) without failing
    tmpDir = makeTempContentCopy();
    try {
      mutateJson(tmpDir, "projects.json", (d) => {
        d.projects[0].highlights = ["1", "2"];
      });
      const warnResult = validateContent(tmpDir);
      assert.ok(
        warnResult.warnings.some((w: string) => w.includes("projects.json") && w.includes("projects[0].highlights"))
      );

      mutateJson(tmpDir, "projects.json", (d) => {
        d.projects[0].highlights = ["1", "2", "3", "4", "5"];
      });
      assert.throws(
        () => validateContent(tmpDir),
        (err: Error) => err.message.includes("projects.json -> projects[0].highlights")
      );
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it("controls Current Status on Home via ongoing, showOnHome, home* overrides/fallbacks, and sectionOrder", () => {
    const clone = (): PortfolioData => structuredClone(PORTFOLIO_DATA);

    // (a): ongoing=true (even when showOnHome=false) or showOnHome=true appears on Home and falls back to main item fields when home* are empty
    const withOngoing = clone();
    const proj0 = withOngoing.projectsData.projects[0];
    proj0.ongoing = true;
    proj0.showOnHome = false;
    proj0.homeEyebrow = "";
    proj0.homeTitle = "";
    proj0.homeOrganization = "";
    proj0.homePeriod = "";
    proj0.homeLocation = "";
    proj0.homeSummary = "";
    proj0.homeBullets = [];
    proj0.homeBadge = "";
    proj0.homeLink = "";
    proj0.homeLinkLabel = "";

    const pub1 = withOngoing.articlesData.publications[1];
    pub1.ongoing = false;
    pub1.showOnHome = true;
    pub1.homeSummary = "";
    pub1.homeBullets = [];

    const withOngoingItems = getHomeStatusItems(withOngoing);
    const projectCard = withOngoingItems.find((i) => i.role === proj0.title);
    const articleCard = withOngoingItems.find((i) => i.role === pub1.title);
    assert.ok(projectCard, "ongoing=true project should appear on Home");
    assert.equal(projectCard.categoryLabel, proj0.category);
    assert.equal(projectCard.timeframe, proj0.year);
    assert.equal(projectCard.organization, proj0.tech.slice(0, 3).join(" · "));
    assert.equal(projectCard.summary, proj0.highlights[0]);
    assert.deepEqual(projectCard.keyDeliverables, proj0.highlights);
    assert.equal(projectCard.proofSummary, proj0.impact);
    assert.equal(projectCard.link, proj0.liveUrl);
    assert.equal(projectCard.linkLabel, proj0.liveLabel);
    assert.ok(articleCard, "showOnHome=true publication should appear on Home");
    assert.equal(articleCard.summary, pub1.highlights[0]);

    // (b): both flags false removes item from Home
    const withHidden = clone();
    withHidden.experienceData.workExperiences[0].ongoing = false;
    withHidden.experienceData.workExperiences[0].showOnHome = false;
    const hiddenItems = getHomeStatusItems(withHidden);
    assert.equal(
      hiddenItems.some((i) => i.role === "Finance Instructor"),
      false,
      "Item with ongoing=false and showOnHome=false must not appear on Home"
    );

    // (c): Home order follows sectionOrder, while items inside the same section keep their page order
    const reordered = clone();
    reordered.projectsData.projects[0].showOnHome = true;
    reordered.projectsData.projects[2].showOnHome = true;
    reordered.currentStatus.sectionOrder = [
      "Projects",
      "Work",
      "Custom",
      "Volunteering",
      "Education",
      "Research",
      "Awards",
    ];
    const orderedRoles = getHomeStatusItems(reordered).map((i) => i.role);
    assert.deepEqual(orderedRoles, [
      reordered.projectsData.projects[0].title,
      reordered.projectsData.projects[2].title,
      "Finance Instructor",
      "Economic Writer & FIDE Arena Competitor",
      "Alumni IT Advisor",
      "University Admission Preparation",
    ]);

    // (d): Non-empty home* fields override main fields, while empty ones still fall back
    const overridden = clone();
    const award0 = overridden.awardsData.awards[0];
    award0.showOnHome = true;
    award0.homeEyebrow = "Custom Award Eyebrow";
    award0.homeTitle = "Custom Home Award Title";
    award0.homeOrganization = "";
    award0.homePeriod = "2025 – 2026";
    award0.homeLocation = "Dhaka";
    award0.homeSummary = "Custom home summary for award.";
    award0.homeBullets = ["Bullet A", "Bullet B"];
    award0.homeBadge = "Custom Bottom Badge";
    award0.homeLink = "https://example.com/custom-award";
    award0.homeLinkLabel = "Custom Link";
    const awardCard = getHomeStatusItems(overridden).find((i) => i.id === "award-0");
    assert.ok(awardCard, "overridden award should appear on Home");
    assert.equal(awardCard.categoryLabel, "Custom Award Eyebrow");
    assert.equal(awardCard.role, "Custom Home Award Title");
    assert.equal(awardCard.organization, award0.organization);
    assert.equal(awardCard.timeframe, "2025 – 2026");
    assert.equal(awardCard.location, "Dhaka");
    assert.equal(awardCard.summary, "Custom home summary for award.");
    assert.deepEqual(awardCard.keyDeliverables, ["Bullet A", "Bullet B"]);
    assert.equal(awardCard.proofSummary, "Custom Bottom Badge");
    assert.equal(awardCard.link, "https://example.com/custom-award");
    assert.equal(awardCard.linkLabel, "Custom Link");
  });

  it("hides buttons and images when links, images, or resumeUrl are empty, while keeping certification '#' buttons", () => {
    const renderWithData = (
      data: PortfolioData,
      Component: React.ComponentType,
      route = "/"
    ): string =>
      renderToString(
        React.createElement(
          StaticRouter,
          { location: route },
          React.createElement(PortfolioProvider, {
            value: data,
            children: React.createElement(Component),
          })
        )
      );

    // 1. Empty link hides buttons across Projects, Blog, Experience, Awards, CurrentStatus, About, Header, Footer; "#" kept on certifications
    const emptyLinks = structuredClone(PORTFOLIO_DATA);
    emptyLinks.projectsData.projects = [
      {
        ...emptyLinks.projectsData.projects[0],
        githubUrl: "",
        sourceLabel: "Hidden Source Btn",
        liveUrl: "",
        liveLabel: "Hidden Overview Btn",
      },
    ];
    const projHtml = renderWithData(emptyLinks, Projects, "/projects");
    assert.equal(projHtml.includes("Hidden Source Btn"), false);
    assert.equal(projHtml.includes("Hidden Overview Btn"), false);

    emptyLinks.articlesData.publications = [
      {
        ...emptyLinks.articlesData.publications[0],
        link: "",
        linkLabel: "Hidden Article Btn",
      },
    ];
    const blogHtml = renderWithData(emptyLinks, Blog, "/publication");
    assert.equal(blogHtml.includes("Hidden Article Btn"), false);

    emptyLinks.experienceData.leadershipAndVolunteering = [
      {
        ...emptyLinks.experienceData.leadershipAndVolunteering[0],
        link: "",
        linkLabel: "Hidden Club Portal Btn",
      },
    ];
    const expHtml = renderWithData(emptyLinks, Experience, "/experience");
    assert.equal(expHtml.includes("Hidden Club Portal Btn"), false);

    emptyLinks.awardsData.awards = [
      {
        ...emptyLinks.awardsData.awards[0],
        link: "",
        linkLabel: "Hidden Award Btn",
      },
    ];
    emptyLinks.awardsData.certifications = [
      {
        ...emptyLinks.awardsData.certifications[0],
        link: "#",
        linkLabel: "Keep Hash Cert Btn",
      },
      {
        ...emptyLinks.awardsData.certifications[1],
        link: "",
        linkLabel: "Hidden Empty Cert Btn",
      },
    ];
    const awardsHtml = renderWithData(emptyLinks, Awards, "/awards");
    assert.equal(awardsHtml.includes("Hidden Award Btn"), false);
    assert.equal(awardsHtml.includes("Keep Hash Cert Btn"), true);
    assert.equal(awardsHtml.includes('href="#"'), true);
    assert.equal(awardsHtml.includes("Hidden Empty Cert Btn"), false);

    emptyLinks.currentStatus.cvSecondaryLink = "";
    emptyLinks.currentStatus.cvSecondaryLabel = "Hidden CV Secondary Btn";
    emptyLinks.currentStatus.items[0].link = "";
    emptyLinks.currentStatus.items[0].linkLabel = "Hidden Status Btn";
    const statusLinkHtml = renderWithData(emptyLinks, CurrentStatus, "/");
    assert.equal(statusLinkHtml.includes("Hidden CV Secondary Btn"), false);
    assert.equal(statusLinkHtml.includes("Hidden Status Btn"), false);

    emptyLinks.about.contactChannels = emptyLinks.about.contactChannels.map((c) => ({
      ...c,
      href: "",
    }));
    const aboutLinkHtml = renderWithData(emptyLinks, About, "/about");
    assert.equal(aboutLinkHtml.includes("<a"), false);
    assert.equal(aboutLinkHtml.includes("GitHub &amp; Code") || aboutLinkHtml.includes("thekazishakib@gmail.com"), false);

    emptyLinks.socialLinks = emptyLinks.socialLinks.map((s) => ({ ...s, url: "" }));
    emptyLinks.footer.contactLinks = emptyLinks.footer.contactLinks.map((c) => ({
      ...c,
      href: "",
    }));
    const footerNoSocialHtml = renderWithData(emptyLinks, Footer, "/");
    assert.equal(footerNoSocialHtml.includes("thekazishakib@gmail.com"), false);
    assert.equal(footerNoSocialHtml.includes("bd.linkedin.com"), false);

    // 2. Empty image hides <img> and its box across every component
    const emptyImages = structuredClone(PORTFOLIO_DATA);
    emptyImages.about.profileImageUrl = "";
    emptyImages.academics.benchmarkCards = emptyImages.academics.benchmarkCards.map((c) => ({
      ...c,
      logoUrl: "",
    }));
    emptyImages.academics.educationHistory = emptyImages.academics.educationHistory.map((e) => ({
      ...e,
      logoUrl: "",
    }));
    emptyImages.projectsData.projects = emptyImages.projectsData.projects.map((p) => ({
      ...p,
      logoUrl: "",
    }));
    emptyImages.articlesData.publications = emptyImages.articlesData.publications.map((p) => ({
      ...p,
      logoUrl: "",
    }));
    emptyImages.experienceData.workExperiences = emptyImages.experienceData.workExperiences.map(
      (w) => ({ ...w, logoUrl: "" })
    );
    emptyImages.experienceData.leadershipAndVolunteering =
      emptyImages.experienceData.leadershipAndVolunteering.map((l) => ({ ...l, logoUrl: "" }));
    emptyImages.awardsData.awards = emptyImages.awardsData.awards.map((a) => ({
      ...a,
      logoUrl: "",
    }));
    emptyImages.awardsData.certifications = emptyImages.awardsData.certifications.map((c) => ({
      ...c,
      logoUrl: "",
    }));
    emptyImages.awardsData.directSkills = emptyImages.awardsData.directSkills.map((s) => ({
      ...s,
      logoUrl: "",
    }));
    emptyImages.currentStatus.items = emptyImages.currentStatus.items.map((i) => ({
      ...i,
      logoUrl: "",
    }));

    for (const [Comp, route] of [
      [About, "/about"],
      [AcademicPortfolio, "/academics"],
      [Projects, "/projects"],
      [Blog, "/publication"],
      [Experience, "/experience"],
      [Awards, "/awards"],
      [CurrentStatus, "/"],
    ] as const) {
      const html = renderWithData(emptyImages, Comp, route);
      assert.equal(html.includes("<img"), false, `Expected no <img> on ${route} when images empty`);
    }

    // 3. Empty resumeUrl hides resume buttons in Header, Hero, CurrentStatus, and Footer
    const emptyResume = structuredClone(PORTFOLIO_DATA);
    emptyResume.resumeUrl = "";
    emptyResume.hero.secondaryCtaLabel = "Hero Resume TestLabel";
    emptyResume.currentStatus.cvPrimaryLabel = "Banner CV TestLabel";
    emptyResume.footer.resumeLinkLabel = "Footer Resume TestLabel";
    emptyResume.header.resumeAriaLabel = "Header Resume AriaLabel";
    emptyResume.header.resumeTitle = "Header Resume TitleAttr";

    const headerNoResume = renderWithData(emptyResume, Header, "/");
    const heroNoResume = renderWithData(emptyResume, Hero, "/");
    const statusNoResume = renderWithData(emptyResume, CurrentStatus, "/");
    const footerNoResume = renderWithData(emptyResume, Footer, "/");

    assert.equal(headerNoResume.includes("Header Resume AriaLabel"), false);
    assert.equal(headerNoResume.includes("Header Resume TitleAttr"), false);
    assert.equal(heroNoResume.includes("Hero Resume TestLabel"), false);
    assert.equal(statusNoResume.includes("Banner CV TestLabel"), false);
    assert.equal(footerNoResume.includes("Footer Resume TestLabel"), false);

    // 4. NotFound & TermsAndPrivacy read from JSON cleanly
    const notFoundHtml = renderWithData(PORTFOLIO_DATA, NotFound, "/missing-route");
    assert.equal(notFoundHtml.includes("404 · NOT FOUND"), true);
    assert.equal(notFoundHtml.includes("Page Not Found"), true);
    assert.equal(notFoundHtml.includes("Back to Home"), true);

    const legalHtml = renderWithData(
      PORTFOLIO_DATA,
      () => React.createElement(TermsAndPrivacy, { defaultTab: "terms" }),
      "/terms"
    );
    assert.equal(legalHtml.includes("Questions or permission requests?"), true);
    assert.equal(legalHtml.includes("Email Kazi Shakib"), true);
  });

  it("validates public/admin/config.yml against Sveltia schema and guarantees 100% JSON key coverage", () => {
    interface AdminField {
      name: string;
      label?: string;
      widget?: string;
      type?: string;
      pattern?: [string, string];
      hint?: string;
      readonly?: boolean;
      required?: boolean;
      max?: number;
      min?: number;
      options?: string[];
      label_singular?: string;
      summary?: string;
      add_to_top?: boolean;
      allow_add?: boolean;
      allow_remove?: boolean;
      allow_duplicate?: boolean;
      allow_reorder?: boolean;
      field?: AdminField;
      fields?: AdminField[];
    }
    interface AdminFile {
      name: string;
      label: string;
      file: string;
      format?: string;
      fields: AdminField[];
    }
    interface AdminConfig {
      backend: { name: string; repo: string; branch?: string; auth_methods?: string[] };
      publish_mode?: string;
      media_folder?: string;
      public_folder?: string;
      collections: Array<{ name: string; label: string; files: AdminFile[] }>;
    }

    const configText = fs.readFileSync(path.resolve("public/admin/config.yml"), "utf8");
    const config = YAML.parse(configText) as AdminConfig;

    // 1. Validate against the installed @sveltia/cms JSON schema
    const schema = JSON.parse(
      fs.readFileSync(path.resolve("node_modules/@sveltia/cms/schema/sveltia-cms.json"), "utf8")
    ) as Record<string, unknown>;
    const ajv = new Ajv({ allErrors: true, allowUnionTypes: true, strict: false });
    ajv.addFormat("uri", () => true);
    ajv.addFormat("regex", (pattern: string) => {
      try {
        new RegExp(pattern);
        return true;
      } catch {
        return false;
      }
    });
    const validate = ajv.compile(schema);
    const schemaValid = validate(config);
    assert.equal(
      schemaValid,
      true,
      `Sveltia schema errors: ${JSON.stringify(validate.errors?.slice(0, 5))}`
    );

    // 2. Backend, media paths, and single files collection in site page order
    assert.equal(config.backend.name, "github");
    assert.deepEqual(config.backend.auth_methods, ["token"]);
    assert.equal(config.publish_mode, "simple");
    assert.equal(config.media_folder, "public/uploads");
    assert.equal(config.public_folder, "/uploads");

    assert.equal(config.collections.length, 1);
    const filesCollection = config.collections[0].files;
    assert.deepEqual(
      filesCollection.map((f) => f.file),
      [
        "src/content/hero.json",
        "src/content/currentStatus.json",
        "src/content/about.json",
        "src/content/academics.json",
        "src/content/projects.json",
        "src/content/publications.json",
        "src/content/experience.json",
        "src/content/awards.json",
        "src/content/legal.json",
        "src/content/site.json",
      ]
    );

    // 3. SEO titles and meta descriptions stay out of admin
    for (const forbiddenKey of ["seoTitle", "metaDescription", "ogTitle", "ogDescription"]) {
      assert.equal(configText.includes(forbiddenKey), false);
    }

    // 4. Every JSON key (top-level & nested) in every src/content/*.json maps to a field in config.yml
    const checkObjectFields = (
      filePath: string,
      items: Array<Record<string, unknown>>,
      fields: AdminField[],
      prefix = ""
    ) => {
      const fieldByName = new Map(fields.map((f) => [f.name, f]));
      const observedKeys = new Set<string>();

      for (const [idx, record] of items.entries()) {
        assert.ok(record && typeof record === "object" && !Array.isArray(record), `${filePath}:${prefix}`);
        const itemPrefix = items.length > 1 ? `${prefix}[${idx}]` : prefix;

        for (const key of Object.keys(record)) {
          observedKeys.add(key);
          const fullKey = itemPrefix ? `${itemPrefix}.${key}` : key;
          const field = fieldByName.get(key);
          assert.ok(field, `Missing field "${fullKey}" in config.yml for ${filePath}`);

          const val = record[key];
          if (Array.isArray(val)) {
            assert.equal(field.widget, "list", `${filePath}:${fullKey} must use widget: list`);
          } else if (val && typeof val === "object") {
            assert.equal(field.widget, "object", `${filePath}:${fullKey} must use widget: object`);
            assert.ok(field.fields, `${filePath}:${fullKey} object needs subfields`);
            checkObjectFields(filePath, [val as Record<string, unknown>], field.fields, fullKey);
          }
        }
      }

      for (const field of fields) {
        const fullKey = prefix ? `${prefix}.${field.name}` : field.name;
        if (field.required !== false) {
          for (const [idx, record] of items.entries()) {
            const itemPrefix = items.length > 1 ? `${prefix}[${idx}]` : prefix;
            const reqKey = itemPrefix ? `${itemPrefix}.${field.name}` : field.name;
            assert.ok(field.name in record, `Required field "${reqKey}" in config.yml missing from ${filePath}`);
          }
        }
        assert.ok(
          observedKeys.has(field.name),
          `Extra unknown field "${fullKey}" in config.yml never appears in ${filePath}`
        );
        if (field.widget === "list" && field.fields) {
          const allChildren = items.flatMap((record) =>
            Array.isArray(record[field.name]) ? (record[field.name] as Array<Record<string, unknown>>) : []
          );
          if (allChildren.length > 0) {
            checkObjectFields(filePath, allChildren, field.fields, fullKey);
          }
        }
      }
    };

    for (const fileEntry of filesCollection) {
      const jsonData = JSON.parse(fs.readFileSync(path.resolve(fileEntry.file), "utf8")) as Record<string, unknown>;
      checkObjectFields(fileEntry.file, [jsonData], fileEntry.fields);
    }

    // 5. Inspect list widgets, image hints, bullet caps, icon options, link validators, and home* overrides
    const allIcons = [...ICON_OPTIONS];
    const externalUrlFields = new Set([
      "about.contactChannels.href",
      "projects.projects.githubUrl",
      "projects.projects.liveUrl",
      "publications.publications.link",
      "publications.footerExtraLinks.href",
      "site.resumeUrl",
      "site.socialLinks.url",
      "site.footer.contactLinks.href",
    ]);
    const internalOrFlexibleLinkFields = new Set([
      "currentStatus.cvSecondaryLink",
      "currentStatus.items.link",
      "academics.educationHistory.homeLink",
      "projects.projects.homeLink",
      "publications.publications.homeLink",
      "experience.workExperiences.homeLink",
      "experience.leadershipAndVolunteering.link",
      "experience.leadershipAndVolunteering.homeLink",
      "awards.awards.link",
      "awards.awards.homeLink",
      "awards.certifications.link",
    ]);
    const homeEligibleLists = new Set([
      "academics.educationHistory",
      "projects.projects",
      "publications.publications",
      "experience.workExperiences",
      "experience.leadershipAndVolunteering",
      "awards.awards",
    ]);

    const visitFields = (prefix: string, fields: AdminField[]) => {
      for (const field of fields) {
        const keyPath = `${prefix}.${field.name}`;

        if (field.widget === "image") {
          assert.equal(field.hint, "WebP or JPG under 300 KB", `${keyPath} missing image hint`);
        }

        if (field.name === "icon" || field.name === "iconName") {
          assert.equal(field.widget, "select", `${keyPath} must be select`);
          assert.deepEqual(field.options, allIcons, `${keyPath} options must match ICON_OPTIONS`);
        }

        if (externalUrlFields.has(keyPath)) {
          assert.equal(field.type, "url", `${keyPath} must set type: url`);
        }
        if (internalOrFlexibleLinkFields.has(keyPath)) {
          assert.ok(Array.isArray(field.pattern), `${keyPath} must set regex pattern`);
          assert.notEqual(field.type, "url", `${keyPath} accepts internal paths so must not force type: url`);
        }

        if (field.widget === "list") {
          if (field.name === "sectionOrder") {
            assert.equal(field.label, "Home section order");
            assert.equal(field.allow_add, false);
            assert.equal(field.allow_remove, false);
            assert.equal(field.allow_duplicate, false);
            assert.equal(field.allow_reorder, true);
            assert.equal(field.min, 7);
            assert.equal(field.max, 7);
            assert.equal(field.field?.readonly, true);
          } else {
            assert.ok(field.label_singular, `${keyPath} missing label_singular`);
            assert.ok(field.summary, `${keyPath} missing summary`);
            assert.equal(field.add_to_top, true, `${keyPath} must set add_to_top: true`);
            assert.notEqual(field.allow_add, false);
            assert.notEqual(field.allow_remove, false);
            assert.notEqual(field.allow_reorder, false);
          }

          if (
            ["keyDeliverables", "highlights", "homeBullets"].includes(field.name) &&
            Boolean(field.field)
          ) {
            assert.equal(field.max, 4, `${keyPath} bullet list max must be 4`);
            assert.ok(
              field.hint?.includes("Write 3-4 bullets"),
              `${keyPath} must include "Write 3-4 bullets" hint`
            );
          }

          if (homeEligibleLists.has(keyPath) && field.fields) {
            const names = new Set(field.fields.map((sub) => sub.name));
            for (const reqHomeField of [
              "ongoing",
              "showOnHome",
              "homeEyebrow",
              "homeTitle",
              "homeOrganization",
              "homePeriod",
              "homeLocation",
              "homeSummary",
              "homeBullets",
              "homeBadge",
              "homeLink",
              "homeLinkLabel",
            ]) {
              assert.ok(names.has(reqHomeField), `${keyPath} missing ${reqHomeField}`);
            }
          }

          if (field.fields) visitFields(keyPath, field.fields);
        }

        if (field.widget === "object" && field.fields) {
          visitFields(keyPath, field.fields);
        }
      }
    };

    for (const fileEntry of filesCollection) {
      visitFields(fileEntry.name, fileEntry.fields);
    }
  });

  it("contains no API routes, server functions, databases, or secret files in the repository", () => {
    assert.equal(fs.existsSync(path.resolve("api")), false);
    assert.equal(fs.existsSync(path.resolve("src/pages/api")), false);
    assert.equal(fs.existsSync(path.resolve(".env")), false);
    assert.equal(fs.existsSync(path.resolve(".env.local")), false);
    assert.equal(fs.existsSync(path.resolve(".env.production")), false);
    const pkg = JSON.parse(fs.readFileSync(path.resolve("package.json"), "utf8")) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const allDeps = new Set([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ]);
    for (const serverOrDbPkg of ["express", "fastify", "prisma", "drizzle-orm", "mongoose", "pg", "sqlite3", "better-sqlite3"]) {
      assert.equal(allDeps.has(serverOrDbPkg), false, `Unexpected server/DB dependency: ${serverOrDbPkg}`);
    }
  });
});

