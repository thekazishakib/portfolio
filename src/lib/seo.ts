import { PORTFOLIO_DATA, type PortfolioData } from "../data/portfolio";

const rawSiteUrl =
  (typeof import.meta !== "undefined" &&
    (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_SITE_URL) ||
  (typeof process !== "undefined" && process.env?.VITE_SITE_URL) ||
  "";

export function validateProductionSiteUrl(url: string | undefined): string {
  const trimmed = (url || "").trim().replace(/\/+$/, "");
  if (!trimmed || /todo/i.test(trimmed)) {
    throw new Error(
      'Production build failed: VITE_SITE_URL is unset or contains "TODO". Set VITE_SITE_URL to your production domain (e.g. https://kazishakib.com).'
    );
  }
  return trimmed;
}

// In dev/test when VITE_SITE_URL is unset, fall back to https://TODO-SET-DOMAIN (production builds fail via validateProductionSiteUrl)
export const SITE_URL = (rawSiteUrl.trim() || "https://TODO-SET-DOMAIN").replace(/\/+$/, "");
export const SITE_NAME = "Kazi Shakib";
// TODO: Export a 1200x630 Open Graph image to public/og.png
export const DEFAULT_OG_IMAGE_PATH = "/og.png";
export const DEFAULT_OG_IMAGE_WIDTH = 1200;
export const DEFAULT_OG_IMAGE_HEIGHT = 630;

export interface RouteSeoConfig {
  path: string;
  canonicalPath: string;
  breadcrumbName: string;
  title: string;
  description: string;
  ogType: "website" | "profile" | "article";
  robots: "index,follow" | "noindex,nofollow";
  sourceFiles: readonly string[];
  includeInSitemap: boolean;
}

export const PUBLIC_ROUTES: readonly string[] = [
  "/",
  "/about",
  "/academics",
  "/projects",
  "/publication",
  "/experience",
  "/awards",
  "/terms-and-privacy",
] as const;

const ROUTE_SEO_MAP: Record<string, RouteSeoConfig> = {
  "/": {
    path: "/",
    canonicalPath: "/",
    breadcrumbName: "Home",
    title: "Home Kazi Shakib",
    description:
      "Kazi Shakib teaches finance to 100+ students at Mentors Brother in Dhaka, builds Python and React tools, writes articles, and plays FIDE Online Arena chess.",
    ogType: "website",
    robots: "index,follow",
    sourceFiles: [
      "src/components/Hero.tsx",
      "src/components/CurrentStatus.tsx",
      "src/data/portfolio.ts",
    ],
    includeInSitemap: true,
  },
  "/about": {
    path: "/about",
    canonicalPath: "/about",
    breadcrumbName: "About Me",
    title: "About Kazi Shakib",
    description:
      "Learn about Kazi Shakib in Mirpur, Dhaka: Finance Instructor at Mentors Brother, former Hanif Enterprise Finance Intern, BAFSD IT Advisor, and chess player.",
    ogType: "profile",
    robots: "index,follow",
    sourceFiles: ["src/components/About.tsx", "src/data/portfolio.ts"],
    includeInSitemap: true,
  },
  "/academics": {
    path: "/academics",
    canonicalPath: "/academics",
    breadcrumbName: "Academic Portfolio",
    title: "Academics Kazi Shakib",
    description:
      "Academic history and test scores for Kazi Shakib in Dhaka: SAT 1420 (770 Math), Duolingo English Test (DET 135), SR Dream IT diploma, and BAF Shaheen HSC.",
    ogType: "website",
    robots: "index,follow",
    sourceFiles: ["src/components/AcademicPortfolio.tsx", "src/data/portfolio.ts"],
    includeInSitemap: true,
  },
  "/projects": {
    path: "/projects",
    canonicalPath: "/projects",
    breadcrumbName: "Selected Projects",
    title: "Projects Kazi Shakib",
    description:
      "Eight web, Python, and data projects by Kazi Shakib, including the BAFSD Business Club site, Hanif Challan Autofiller, SmartBus, and 2.6M-row market analysis.",
    ogType: "website",
    robots: "index,follow",
    sourceFiles: ["src/components/Projects.tsx", "src/data/portfolio.ts"],
    includeInSitemap: true,
  },
  "/publication": {
    path: "/publication",
    canonicalPath: "/publication",
    breadcrumbName: "Publication",
    title: "Publication Kazi Shakib",
    description:
      "Articles written by Kazi Shakib on inflation, the 100 Taka note, USD-BDT exchange rates, gold in retirement, and household savings for Bangladeshi readers.",
    ogType: "website",
    robots: "index,follow",
    sourceFiles: ["src/components/Blog.tsx", "src/data/portfolio.ts"],
    includeInSitemap: true,
  },
  "/articles": {
    path: "/articles",
    canonicalPath: "/publication",
    breadcrumbName: "Publication",
    title: "Publication Kazi Shakib",
    description:
      "Articles written by Kazi Shakib on inflation, the 100 Taka note, USD-BDT exchange rates, gold in retirement, and household savings for Bangladeshi readers.",
    ogType: "website",
    robots: "index,follow",
    sourceFiles: ["src/components/Blog.tsx", "src/data/portfolio.ts"],
    includeInSitemap: false,
  },
  "/experience": {
    path: "/experience",
    canonicalPath: "/experience",
    breadcrumbName: "Experience & Leadership",
    title: "Experience Kazi Shakib",
    description:
      "Work history and volunteering for Kazi Shakib: Finance Instructor at Mentors Brother, Best Intern at Hanif Enterprise, BAFSD Business Club IT, and ICTOBD.",
    ogType: "website",
    robots: "index,follow",
    sourceFiles: ["src/components/Experience.tsx", "src/data/portfolio.ts"],
    includeInSitemap: true,
  },
  "/awards": {
    path: "/awards",
    canonicalPath: "/awards",
    breadcrumbName: "Awards & Skills",
    title: "Awards & Skills Kazi Shakib",
    description:
      "Awards, certificates, and skills for Kazi Shakib: Hanif Enterprise Best Intern, ICTOBD Rank 41, FIDE 1700+ (#16 BD), Duke of Edinburgh Bronze, SAT, Python.",
    ogType: "website",
    robots: "index,follow",
    sourceFiles: ["src/components/Awards.tsx", "src/data/portfolio.ts"],
    includeInSitemap: true,
  },
  "/skills": {
    path: "/skills",
    canonicalPath: "/awards",
    breadcrumbName: "Awards & Skills",
    title: "Awards & Skills Kazi Shakib",
    description:
      "Awards, certificates, and skills for Kazi Shakib: Hanif Enterprise Best Intern, ICTOBD Rank 41, FIDE 1700+ (#16 BD), Duke of Edinburgh Bronze, SAT, Python.",
    ogType: "website",
    robots: "index,follow",
    sourceFiles: ["src/components/Awards.tsx", "src/data/portfolio.ts"],
    includeInSitemap: false,
  },
  "/terms-and-privacy": {
    path: "/terms-and-privacy",
    canonicalPath: "/terms-and-privacy",
    breadcrumbName: "Terms & Privacy",
    title: "Terms & Privacy Kazi Shakib",
    description:
      "Terms of use, copyright notice, third-party trademark disclaimer, external link policy, and visitor privacy information for Kazi Shakib's personal portfolio.",
    ogType: "website",
    robots: "index,follow",
    sourceFiles: ["src/components/TermsAndPrivacy.tsx", "src/data/portfolio.ts"],
    includeInSitemap: true,
  },
  "/terms": {
    path: "/terms",
    canonicalPath: "/terms-and-privacy",
    breadcrumbName: "Terms & Privacy",
    title: "Terms & Privacy Kazi Shakib",
    description:
      "Terms of use, copyright notice, third-party trademark disclaimer, external link policy, and visitor privacy information for Kazi Shakib's personal portfolio.",
    ogType: "website",
    robots: "index,follow",
    sourceFiles: ["src/components/TermsAndPrivacy.tsx", "src/data/portfolio.ts"],
    includeInSitemap: false,
  },
  "/privacy": {
    path: "/privacy",
    canonicalPath: "/terms-and-privacy",
    breadcrumbName: "Terms & Privacy",
    title: "Terms & Privacy Kazi Shakib",
    description:
      "Terms of use, copyright notice, third-party trademark disclaimer, external link policy, and visitor privacy information for Kazi Shakib's personal portfolio.",
    ogType: "website",
    robots: "index,follow",
    sourceFiles: ["src/components/TermsAndPrivacy.tsx", "src/data/portfolio.ts"],
    includeInSitemap: false,
  },
};

const NOT_FOUND_SEO: RouteSeoConfig = {
  path: "/404",
  canonicalPath: "/404",
  breadcrumbName: "Page Not Found",
  title: "Page Not Found Kazi Shakib",
  description: "The requested page could not be found on Kazi Shakib's portfolio.",
  ogType: "website",
  robots: "noindex,nofollow",
  sourceFiles: ["src/components/NotFound.tsx"],
  includeInSitemap: false,
};

export function normalizePathname(pathname: string): string {
  const cleaned = pathname.trim().replace(/\/+$/, "").toLowerCase();
  return cleaned || "/";
}

export function isKnownRoute(pathname: string): boolean {
  const normalized = normalizePathname(pathname);
  return Object.hasOwn(ROUTE_SEO_MAP, normalized);
}

export function getRouteSeo(pathname: string, baseUrl: string = SITE_URL) {
  const normalized = normalizePathname(pathname);
  const config = Object.hasOwn(ROUTE_SEO_MAP, normalized)
    ? ROUTE_SEO_MAP[normalized]
    : NOT_FOUND_SEO;

  const cleanBase = baseUrl.replace(/\/+$/, "");
  const canonicalUrl =
    config.canonicalPath === "/"
      ? `${cleanBase}/`
      : `${cleanBase}${config.canonicalPath}`;
  const ogImageUrl = `${cleanBase}${DEFAULT_OG_IMAGE_PATH}`;

  return {
    ...config,
    siteName: SITE_NAME,
    canonicalUrl,
    ogUrl: canonicalUrl,
    ogImageUrl,
    ogImageWidth: DEFAULT_OG_IMAGE_WIDTH,
    ogImageHeight: DEFAULT_OG_IMAGE_HEIGHT,
    twitterCard: "summary_large_image" as const,
  };
}

function parseIsoDateOrNull(rawDate: string): string | null {
  if (!rawDate || /pending/i.test(rawDate)) return null;
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

export function getRouteJsonLd(
  pathname: string,
  portfolioData: PortfolioData = PORTFOLIO_DATA,
  baseUrl: string = SITE_URL
): Record<string, unknown>[] {
  const normalized = normalizePathname(pathname);
  if (!Object.hasOwn(ROUTE_SEO_MAP, normalized)) {
    return [];
  }

  const config = ROUTE_SEO_MAP[normalized];
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const homeUrl = `${cleanBase}/`;
  const canonicalUrl =
    config.canonicalPath === "/" ? homeUrl : `${cleanBase}${config.canonicalPath}`;

  const sameAs = portfolioData.socialLinks
    .map((item) => item.url?.trim())
    .filter((url): url is string => Boolean(url && url.startsWith("http")));

  const publicEmail = portfolioData.about.contactChannels
    .find((ch) => ch.name.toLowerCase() === "email")
    ?.subtitle?.trim();

  const personSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: portfolioData.about.fullName,
    jobTitle: portfolioData.about.roleHeadline,
    url: homeUrl,
    image: `${cleanBase}${DEFAULT_OG_IMAGE_PATH}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressCountry: "BD",
    },
    ...(publicEmail ? { email: publicEmail } : {}),
    sameAs,
  };

  const websiteSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: homeUrl,
  };

  const schemas: Record<string, unknown>[] = [];

  if (config.canonicalPath === "/") {
    schemas.push(personSchema, websiteSchema);
    return schemas;
  }

  if (config.canonicalPath === "/about") {
    schemas.push(personSchema);
  }

  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: config.breadcrumbName,
        item: canonicalUrl,
      },
    ],
  });

  if (config.canonicalPath === "/publication") {
    for (const pub of portfolioData.articlesData.publications) {
      const isoDate = parseIsoDateOrNull(pub.date);
      if (pub.title && isoDate && pub.link && pub.link.startsWith("http")) {
        schemas.push({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: pub.title,
          datePublished: isoDate,
          url: pub.link,
          description: pub.abstract,
          author: {
            "@type": "Person",
            name: portfolioData.about.fullName,
            url: homeUrl,
          },
        });
      }
    }
  }

  return schemas;
}

export function getSitemapRoutes(): RouteSeoConfig[] {
  return PUBLIC_ROUTES.map((route) => ROUTE_SEO_MAP[route]).filter(
    (r): r is RouteSeoConfig => Boolean(r && r.includeInSitemap)
  );
}
