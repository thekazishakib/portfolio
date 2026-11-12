import type {
  AwardItem,
  EducationItem,
  HomeSectionCategory,
  LeadershipItem,
  PortfolioData,
  ProjectItem,
  PublicationItem,
  WorkExperienceItem,
} from "../data/portfolio";

export const HOME_SECTION_OPTIONS: readonly HomeSectionCategory[] = [
  "Education",
  "Work",
  "Volunteering",
  "Research",
  "Awards",
  "Projects",
  "Custom",
];

export interface HomeStatusItem {
  id: string;
  sourceSection: HomeSectionCategory;
  categoryLabel: string;
  timeframe: string;
  role: string;
  organization: string;
  logoUrl: string;
  logoAlt: string;
  location: string;
  summary: string;
  keyDeliverables: string[];
  proofSummary: string;
  link: string;
  linkLabel: string;
}

interface HomeOverrides {
  homeEyebrow?: string;
  homeTitle?: string;
  homeOrganization?: string;
  homePeriod?: string;
  homeLocation?: string;
  homeSummary?: string;
  homeBullets?: string[];
  homeBadge?: string;
  homeLink?: string;
  homeLinkLabel?: string;
}

const isVisibleOnHome = (item: { ongoing?: boolean; showOnHome?: boolean }): boolean =>
  Boolean(item.ongoing || item.showOnHome);

const pickText = (overrideVal: string | undefined, fallbackVal: string): string => {
  const trimmed = overrideVal?.trim();
  return trimmed ? trimmed : fallbackVal;
};

const pickBullets = (
  overrideBullets: string[] | undefined,
  fallbackBullets: string[] | undefined
): string[] => {
  if (overrideBullets && overrideBullets.length > 0) {
    return overrideBullets;
  }
  return fallbackBullets ? [...fallbackBullets] : [];
};

const pickHomeSummary = (
  homeSummary: string | undefined,
  bullets: string[] | undefined,
  fallbackText: string
): string => {
  const customSummary = homeSummary?.trim();
  if (customSummary) return customSummary;
  const firstBullet = bullets?.[0]?.trim();
  if (firstBullet) return firstBullet;
  return fallbackText;
};

const buildMappedItem = (
  id: string,
  sourceSection: HomeSectionCategory,
  item: HomeOverrides & { logoUrl: string; logoAlt: string },
  defaults: {
    categoryLabel: string;
    timeframe: string;
    role: string;
    organization: string;
    location: string;
    bullets?: string[];
    summaryFallback: string;
    proofSummary: string;
    link: string;
    linkLabel: string;
  }
): HomeStatusItem => {
  const bullets = pickBullets(item.homeBullets, defaults.bullets);
  const resolvedLink = pickText(item.homeLink, defaults.link);
  return {
    id,
    sourceSection,
    categoryLabel: pickText(item.homeEyebrow, defaults.categoryLabel),
    timeframe: pickText(item.homePeriod, defaults.timeframe),
    role: pickText(item.homeTitle, defaults.role),
    organization: pickText(item.homeOrganization, defaults.organization),
    logoUrl: item.logoUrl,
    logoAlt: item.logoAlt,
    location: pickText(item.homeLocation, defaults.location),
    summary: pickHomeSummary(item.homeSummary, bullets, defaults.summaryFallback),
    keyDeliverables: bullets,
    proofSummary: pickText(item.homeBadge, defaults.proofSummary),
    link: resolvedLink,
    linkLabel: pickText(
      item.homeLinkLabel,
      item.homeLink?.trim() ? "View Details" : defaults.linkLabel
    ),
  };
};

const mapEducationItem = (item: EducationItem, idx: number): HomeStatusItem => {
  const customBullets = item.homeBullets && item.homeBullets.length > 0 ? item.homeBullets : undefined;
  const fallbackBullets = item.homeSummary?.trim() && item.details ? [item.details] : [];
  return buildMappedItem(`education-${idx}`, "Education", item, {
    categoryLabel: "Education",
    timeframe: item.year,
    role: item.degree,
    organization: item.institution,
    location: item.location,
    bullets: customBullets ?? fallbackBullets,
    summaryFallback: item.details || item.result,
    proofSummary: item.result,
    link: "/academics",
    linkLabel: "View Academics",
  });
};

const mapWorkItem = (item: WorkExperienceItem, idx: number): HomeStatusItem =>
  buildMappedItem(`work-${idx}`, "Work", item, {
    categoryLabel: item.status,
    timeframe: item.period,
    role: item.role,
    organization: item.company,
    location: item.location,
    bullets: item.highlights,
    summaryFallback: item.summary,
    proofSummary: item.stats
      .slice(0, 3)
      .map((stat) => `${stat.label}: ${stat.value}`)
      .join(" · "),
    link: "/experience",
    linkLabel: "View Experience",
  });

const mapLeadershipItem = (item: LeadershipItem, idx: number): HomeStatusItem => {
  const link = item.link?.trim() || "";
  return buildMappedItem(`volunteering-${idx}`, "Volunteering", item, {
    categoryLabel: item.type,
    timeframe: item.period,
    role: item.role,
    organization: item.organization,
    location: "",
    bullets: item.highlights,
    summaryFallback: item.summary,
    proofSummary: item.badge,
    link: link || "/experience",
    linkLabel: link ? item.linkLabel?.trim() || "View Link" : "View Experience",
  });
};

const mapPublicationItem = (item: PublicationItem, idx: number): HomeStatusItem => {
  const link = item.link?.trim() || "";
  return buildMappedItem(`research-${idx}`, "Research", item, {
    categoryLabel: item.type,
    timeframe: item.date,
    role: item.title,
    organization: item.publisher,
    location: "",
    bullets: item.highlights,
    summaryFallback: item.abstract,
    proofSummary: item.footerTag?.trim() || item.status,
    link: link || "/publication",
    linkLabel: link ? item.linkLabel?.trim() || "Read Article" : "View Publication",
  });
};

const mapAwardItem = (item: AwardItem, idx: number): HomeStatusItem => {
  const link = item.link?.trim() || "";
  return buildMappedItem(`award-${idx}`, "Awards", item, {
    categoryLabel: item.highlight,
    timeframe: item.year,
    role: item.title,
    organization: item.organization,
    location: "",
    bullets: [],
    summaryFallback: item.description,
    proofSummary: item.highlight,
    link: link || "/awards",
    linkLabel: link ? item.linkLabel?.trim() || "View Link" : "View Awards",
  });
};

const mapProjectItem = (item: ProjectItem, idx: number): HomeStatusItem => {
  const liveUrl = item.liveUrl?.trim() || "";
  const githubUrl = item.githubUrl?.trim() || "";
  const link = liveUrl || githubUrl || "/projects";
  const linkLabel = liveUrl
    ? item.liveLabel?.trim() || "Overview"
    : githubUrl
      ? item.sourceLabel?.trim() || "Source"
      : "View Projects";

  return buildMappedItem(`project-${idx}`, "Projects", item, {
    categoryLabel: item.category,
    timeframe: item.year,
    role: item.title,
    organization: item.tech.slice(0, 3).join(" · "),
    location: "",
    bullets: item.highlights,
    summaryFallback: item.summary,
    proofSummary: item.impact,
    link,
    linkLabel,
  });
};

export function getHomeStatusItems(data: PortfolioData): HomeStatusItem[] {
  const byCategory: Record<HomeSectionCategory, HomeStatusItem[]> = {
    Education: [],
    Work: [],
    Volunteering: [],
    Research: [],
    Awards: [],
    Projects: [],
    Custom: [],
  };

  data.academics.educationHistory.forEach((item, idx) => {
    if (isVisibleOnHome(item)) byCategory.Education.push(mapEducationItem(item, idx));
  });
  data.experienceData.workExperiences.forEach((item, idx) => {
    if (isVisibleOnHome(item)) byCategory.Work.push(mapWorkItem(item, idx));
  });
  data.experienceData.leadershipAndVolunteering.forEach((item, idx) => {
    if (isVisibleOnHome(item)) byCategory.Volunteering.push(mapLeadershipItem(item, idx));
  });
  data.articlesData.publications.forEach((item, idx) => {
    if (isVisibleOnHome(item)) byCategory.Research.push(mapPublicationItem(item, idx));
  });
  data.awardsData.awards.forEach((item, idx) => {
    if (isVisibleOnHome(item)) byCategory.Awards.push(mapAwardItem(item, idx));
  });
  data.projectsData.projects.forEach((item, idx) => {
    if (isVisibleOnHome(item)) byCategory.Projects.push(mapProjectItem(item, idx));
  });

  data.currentStatus.items.forEach((item, idx) => {
    if (!isVisibleOnHome(item)) return;
    const targetSection: HomeSectionCategory =
      item.section && HOME_SECTION_OPTIONS.includes(item.section) ? item.section : "Custom";
    byCategory[targetSection].push({
      id: `custom-${idx}`,
      sourceSection: targetSection,
      categoryLabel: item.categoryLabel,
      timeframe: item.timeframe,
      role: item.role,
      organization: item.organization,
      logoUrl: item.logoUrl,
      logoAlt: item.logoAlt,
      location: item.location,
      summary: item.summary,
      keyDeliverables: item.keyDeliverables,
      proofSummary: item.proofSummary,
      link: item.link,
      linkLabel: item.linkLabel,
    });
  });

  const seen = new Set<HomeSectionCategory>();
  const orderedSections: HomeSectionCategory[] = [];
  for (const section of data.currentStatus.sectionOrder) {
    if (HOME_SECTION_OPTIONS.includes(section) && !seen.has(section)) {
      seen.add(section);
      orderedSections.push(section);
    }
  }
  for (const fallback of HOME_SECTION_OPTIONS) {
    if (!seen.has(fallback)) {
      seen.add(fallback);
      orderedSections.push(fallback);
    }
  }

  return orderedSections.flatMap((section) => byCategory[section]);
}
