import site from "../content/site.json";
import legal from "../content/legal.json";
import hero from "../content/hero.json";
import currentStatus from "../content/currentStatus.json";
import about from "../content/about.json";
import academics from "../content/academics.json";
import projects from "../content/projects.json";
import publications from "../content/publications.json";
import experience from "../content/experience.json";
import awards from "../content/awards.json";

export interface SummaryStat {
  label: string;
  value: string;
  note: string;
}

export interface HeroData {
  leftPill: string;
  handwrittenIntro: string;
  rightPill: string;
  mainName: string;
  leftStickyNote: string;
  centerStatusBadge: string;
  rightStickyNote: string;
  headlineLine1: string;
  headlineLine2: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
}

export type HomeSectionCategory =
  | "Education"
  | "Work"
  | "Volunteering"
  | "Research"
  | "Awards"
  | "Projects"
  | "Custom";

export interface CurrentWorkItem {
  index: string;
  section?: HomeSectionCategory;
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
  ongoing: boolean;
  showOnHome: boolean;
}

export interface CurrentStatusData {
  eyebrow: string;
  title: string;
  subtitle: string;
  bulletsHeading: string;
  updatedBadgeText: string;
  sectionOrder: HomeSectionCategory[];
  items: CurrentWorkItem[];
  cvBannerEyebrow: string;
  cvBannerTitle: string;
  cvBannerDescription: string;
  cvPrimaryLabel: string;
  cvSecondaryLabel: string;
  cvSecondaryLink: string;
}

export interface AboutHighlight {
  title: string;
  subtitle: string;
  iconName: string;
}

export interface ContactChannel {
  name: string;
  subtitle: string;
  href: string;
  iconName: string;
  external: boolean;
}

export interface AboutData {
  eyebrow: string;
  title: string;
  subtitle: string;
  profileImageUrl: string;
  fullName: string;
  roleHeadline: string;
  location: string;
  bioParagraphs: string[];
  highlights: AboutHighlight[];
  contactEyebrow: string;
  contactTitle: string;
  contactChannels: ContactChannel[];
  languagesEyebrow: string;
  languagesContent: string;
}

export interface BenchmarkCard {
  label: string;
  value: string;
  note: string;
  logoUrl: string;
  logoAlt: string;
}

export interface EducationItem {
  institution: string;
  location: string;
  year: string;
  degree: string;
  details?: string;
  result: string;
  logoUrl: string;
  logoAlt: string;
  ongoing: boolean;
  showOnHome: boolean;
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

export interface AcademicsData {
  eyebrow: string;
  title: string;
  subtitle: string;
  benchmarkCards: BenchmarkCard[];
  historyEyebrow: string;
  historyTitle: string;
  historyRange: string;
  educationHistory: EducationItem[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  year: string;
  tech: string[];
  summary: string;
  highlights: string[];
  impact: string;
  logoUrl: string;
  logoAlt: string;
  githubUrl: string;
  liveUrl: string;
  sourceLabel?: string;
  liveLabel?: string;
  footerShortName?: string;
  ongoing: boolean;
  showOnHome: boolean;
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

export interface ProjectsData {
  eyebrow: string;
  title: string;
  subtitle: string;
  summaryStats: SummaryStat[];
  projects: ProjectItem[];
  footerMaxProjects: number;
}

export interface PublicationItem {
  id: string;
  type: string;
  title: string;
  publisher: string;
  date: string;
  status: string;
  logoUrl: string;
  logoAlt: string;
  abstract: string;
  highlights: string[];
  tags: string[];
  link: string;
  linkLabel: string;
  footerTag?: string;
  ongoing: boolean;
  showOnHome: boolean;
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

export interface ExtraArticleLink {
  title: string;
  tag: string;
  href: string;
  external: boolean;
}

export interface ArticlesData {
  eyebrow: string;
  title: string;
  subtitle: string;
  summaryStats: SummaryStat[];
  publications: PublicationItem[];
  footerExtraLinks: ExtraArticleLink[];
  footerMaxArticles: number;
}

export interface WorkStat {
  label: string;
  value: string;
}

export interface WorkExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  status: string;
  logoUrl: string;
  logoAlt: string;
  summary: string;
  highlights: string[];
  stats: WorkStat[];
  ongoing: boolean;
  showOnHome: boolean;
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

export interface LeadershipItem {
  role: string;
  organization: string;
  period: string;
  type: string;
  logoUrl: string;
  logoAlt: string;
  summary: string;
  highlights: string[];
  badge: string;
  link?: string;
  linkLabel?: string;
  ongoing: boolean;
  showOnHome: boolean;
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

export interface ExperienceData {
  eyebrow: string;
  title: string;
  subtitle: string;
  summaryStats: SummaryStat[];
  workSectionEyebrow: string;
  workSectionTitle: string;
  workSectionRightNote: string;
  workExperiences: WorkExperienceItem[];
  leadershipSectionEyebrow: string;
  leadershipSectionTitle: string;
  leadershipSectionRightNote: string;
  leadershipAndVolunteering: LeadershipItem[];
}

export interface AwardItem {
  title: string;
  organization: string;
  year: string;
  highlight: string;
  description: string;
  logoUrl: string;
  logoAlt: string;
  link?: string;
  linkLabel?: string;
  ongoing: boolean;
  showOnHome: boolean;
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

export interface CertificationItem {
  title: string;
  issuer: string;
  date: string;
  credentialNote: string;
  logoUrl: string;
  logoAlt: string;
  link: string;
  linkLabel?: string;
}

export interface DirectSkillItem {
  name: string;
  category: string;
  logoUrl: string;
  logoAlt: string;
}

export interface AwardsData {
  eyebrow: string;
  title: string;
  subtitle: string;
  awardsEyebrow: string;
  awardsTitle: string;
  awardsRightNote: string;
  awards: AwardItem[];
  certificationsEyebrow: string;
  certificationsTitle: string;
  certificationsRightNote: string;
  certifications: CertificationItem[];
  skillsEyebrow: string;
  skillsTitle: string;
  skillsRightNote: string;
  directSkills: DirectSkillItem[];
}

export interface FooterContactLink {
  label: string;
  href: string;
  iconName: string;
  external: boolean;
}

export interface HeaderNavLabels {
  home: string;
  about: string;
  academics: string;
  projects: string;
  publication: string;
  experience: string;
  awards: string;
}

export interface HeaderData {
  brandName: string;
  brandTitle: string;
  resumeTitle: string;
  resumeAriaLabel: string;
  navLabels: HeaderNavLabels;
}

export interface SocialLinkItem {
  name: string;
  url: string;
  icon: string;
  showInHeader?: boolean;
  showInFooter?: boolean;
}

export interface FooterData {
  brandName: string;
  primaryDescription: string;
  secondaryDescription: string;
  location: string;
  navColumnTitle: string;
  resumeLinkLabel: string;
  projectsColumnTitle: string;
  publicationColumnTitle: string;
  contactColumnTitle: string;
  contactLinks: FooterContactLink[];
  copyrightName: string;
  bottomTagline: string;
}

export interface NotFoundData {
  eyebrow: string;
  title: string;
  description: string;
  backLabel: string;
}

export interface LegalParagraph {
  text: string;
}

export interface LegalTermsData {
  effectiveDate: string;
  pageTitle: string;
  pageSubtitle: string;
  lastUpdatedNote: string;
  intellectualPropertyTitle: string;
  intellectualPropertyText: LegalParagraph[];
  thirdPartyLogosTitle: string;
  thirdPartyLogosText: LegalParagraph[];
  externalLinksTitle: string;
  externalLinksText: LegalParagraph[];
  privacyPolicyTitle: string;
  privacyPolicyText: LegalParagraph[];
  contactEmail: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonLabel: string;
}

export interface PortfolioData {
  lastUpdatedLabel: string;
  lastUpdatedDate: string;
  resumeUrl: string;
  header: HeaderData;
  socialLinks: SocialLinkItem[];
  legalTerms: LegalTermsData;
  hero: HeroData;
  currentStatus: CurrentStatusData;
  about: AboutData;
  academics: AcademicsData;
  projectsData: ProjectsData;
  articlesData: ArticlesData;
  experienceData: ExperienceData;
  awardsData: AwardsData;
  footer: FooterData;
  notFound: NotFoundData;
}

export const PORTFOLIO_DATA: PortfolioData = {
  lastUpdatedLabel: site.lastUpdatedLabel,
  lastUpdatedDate: site.lastUpdatedDate,
  resumeUrl: site.resumeUrl,
  header: site.header,
  socialLinks: site.socialLinks,
  legalTerms: legal,
  hero,
  currentStatus: currentStatus as CurrentStatusData,
  about,
  academics,
  projectsData: projects,
  articlesData: publications,
  experienceData: experience,
  awardsData: awards,
  footer: site.footer,
  notFound: site.notFound,
};
