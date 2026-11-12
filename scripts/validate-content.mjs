import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REQUIRED_JSON_FILES = [
  "site.json",
  "hero.json",
  "currentStatus.json",
  "about.json",
  "academics.json",
  "projects.json",
  "publications.json",
  "experience.json",
  "awards.json",
  "legal.json",
];

const HOME_SECTION_CHOICES = [
  "Education",
  "Work",
  "Volunteering",
  "Research",
  "Awards",
  "Projects",
  "Custom",
];

// Built dynamically so this validator file never triggers its own token-prefix check.
const FORBIDDEN_TOKEN_PREFIXES = [
  ["ghp", "_"].join(""),
  ["github", "_pat", "_"].join(""),
];

export function loadValidIcons(rootDir = process.cwd()) {
  const iconMapPath = path.join(rootDir, "src", "lib", "iconMap.tsx");
  const source = fs.readFileSync(iconMapPath, "utf8");
  const match = source.match(/export\s+const\s+ICON_OPTIONS\s*=\s*\[([\s\S]*?)\]\s*as\s+const/);
  if (!match) {
    throw new Error("src/lib/iconMap.tsx: could not locate ICON_OPTIONS array");
  }
  const icons = [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  if (icons.length === 0) {
    throw new Error("src/lib/iconMap.tsx: ICON_OPTIONS is empty");
  }
  return new Set(icons);
}

function isPlainObject(val) {
  return Boolean(val) && typeof val === "object" && !Array.isArray(val);
}

export function validateContent(rootDir = process.cwd()) {
  const errors = [];
  const warnings = [];
  const validIcons = loadValidIcons(rootDir);
  const contentDir = path.join(rootDir, "src", "content");

  const fail = (file, field, message) => {
    errors.push(`${file} -> ${field}: ${message}`);
  };

  const warn = (file, field, message) => {
    warnings.push(`${file} -> ${field}: ${message}`);
  };

  const checkString = (file, field, val, { required = true, minLen = 1 } = {}) => {
    if (val === undefined || val === null) {
      if (required) fail(file, field, "missing required string field");
      return false;
    }
    if (typeof val !== "string") {
      fail(file, field, `expected string, got ${typeof val}`);
      return false;
    }
    if (val !== val.trim()) {
      fail(file, field, "string must not have leading or trailing spaces");
      return false;
    }
    if (required && val.length < minLen) {
      fail(file, field, "required string must not be empty");
      return false;
    }
    return true;
  };

  const checkBoolean = (file, field, val) => {
    if (typeof val !== "boolean") {
      fail(file, field, `expected boolean, got ${typeof val}`);
      return false;
    }
    return true;
  };

  const checkPositiveInt = (file, field, val) => {
    if (typeof val !== "number" || !Number.isInteger(val) || val < 1) {
      fail(file, field, `expected positive integer, got ${JSON.stringify(val)}`);
      return false;
    }
    return true;
  };

  const checkImage = (file, field, val, { required = false } = {}) => {
    if (!required && (val === undefined || val === null || val === "")) {
      return;
    }
    if (!checkString(file, field, val, { required })) return;
    if (!required && val === "") return;
    if (val.startsWith("public/") || val.startsWith("/public/")) {
      fail(file, field, `image path must start with "/uploads/", never "public/" (got "${val}")`);
      return;
    }
    if (!val.startsWith("/uploads/")) {
      fail(file, field, `image path must start with "/uploads/" (got "${val}")`);
      return;
    }
    const relFromUploads = val.slice("/uploads/".length);
    if (!relFromUploads || relFromUploads.includes("..") || relFromUploads.includes("\\")) {
      fail(file, field, `invalid upload filename "${val}"`);
      return;
    }
    const diskPath = path.join(rootDir, "public", "uploads", relFromUploads);
    if (!fs.existsSync(diskPath) || !fs.statSync(diskPath).isFile() || fs.statSync(diskPath).size === 0) {
      fail(file, field, `referenced image does not exist on disk: public/uploads/${relFromUploads}`);
    }
  };

  const checkIcon = (file, field, val) => {
    if (!checkString(file, field, val, { required: true })) return;
    if (!validIcons.has(val)) {
      fail(file, field, `unknown iconName "${val}". Valid options: ${[...validIcons].join(", ")}`);
    }
  };

  const checkLink = (
    file,
    field,
    val,
    { required = true, allowInternal = false, allowHash = false, httpsOnly = false } = {}
  ) => {
    if (!required && (val === undefined || val === null || val === "")) {
      return;
    }
    if (!checkString(file, field, val, { required })) return;
    if (!required && val === "") return;

    if (val === "#") {
      if (!allowHash || httpsOnly) {
        fail(file, field, '"#" placeholder links are only allowed on awardsData.certifications[].link');
      }
      return;
    }
    if (val.startsWith("public/") || val.startsWith("/public/")) {
      fail(file, field, `invalid link path "${val}" (must not start with "public/")`);
      return;
    }
    if (httpsOnly) {
      if (!val.startsWith("https://")) {
        fail(file, field, `invalid URL "${val}": must start with "https://"`);
        return;
      }
      if (!URL.canParse(val)) {
        fail(file, field, `malformed https:// URL "${val}"`);
      }
      return;
    }
    const isExternal = val.startsWith("https://") || val.startsWith("mailto:");
    const isInternal = allowInternal && val.startsWith("/") && !val.startsWith("//");
    if (!isExternal && !isInternal) {
      const allowed = allowInternal
        ? 'start with "https://", "mailto:", or "/"'
        : 'start with "https://" or "mailto:"';
      fail(file, field, `invalid URL "${val}": must ${allowed}${allowHash ? ' or equal "#"' : ""}`);
      return;
    }
    if (val.startsWith("https://") && !URL.canParse(val)) {
      fail(file, field, `malformed https:// URL "${val}"`);
    }
  };

  const checkEmail = (file, field, val) => {
    if (!checkString(file, field, val, { required: true })) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      fail(file, field, `invalid email address "${val}"`);
    }
  };

  const checkStringArray = (file, field, arr, minItems = 1) => {
    if (!Array.isArray(arr) || arr.length < minItems) {
      fail(file, field, `expected array with at least ${minItems} item(s)`);
      return;
    }
    arr.forEach((item, idx) => checkString(file, `${field}[${idx}]`, item, { required: true }));
  };

  const checkBulletList = (
    file,
    field,
    itemLabel,
    arr,
    { minItems = 1, maxItems = 4, warnBelow = 3 } = {}
  ) => {
    if (!Array.isArray(arr)) {
      fail(file, field, "expected array of bullet strings");
      return;
    }
    if (arr.length < minItems) {
      fail(file, field, `expected array with at least ${minItems} item(s)`);
    }
    if (arr.length > maxItems) {
      fail(file, field, `expected at most ${maxItems} bullets, got ${arr.length}`);
    }
    if (arr.length > 0 && arr.length < warnBelow) {
      warn(
        file,
        `${field} (${itemLabel})`,
        `has ${arr.length} bullet(s); recommended at least ${warnBelow}`
      );
    }
    arr.forEach((item, idx) => checkString(file, `${field}[${idx}]`, item, { required: true }));
  };

  const checkObjectArray = (file, field, arr, minItems, validateItem) => {
    if (!Array.isArray(arr) || arr.length < minItems) {
      fail(file, field, `expected array with at least ${minItems} item(s)`);
      return;
    }
    arr.forEach((item, idx) => {
      const itemField = `${field}[${idx}]`;
      if (!isPlainObject(item)) {
        fail(file, itemField, "expected object item");
        return;
      }
      validateItem(item, itemField);
    });
  };

  const checkSummaryStats = (file, field, arr) =>
    checkObjectArray(file, field, arr, 1, (s, p) => {
      checkString(file, `${p}.label`, s.label);
      checkString(file, `${p}.value`, s.value);
      checkString(file, `${p}.note`, s.note);
    });

  // Walk every JSON value globally to catch leading/trailing spaces & accidental PAT strings
  const scanAllStrings = (file, node, fieldPath) => {
    if (Array.isArray(node)) {
      node.forEach((item, i) => scanAllStrings(file, item, `${fieldPath}[${i}]`));
      return;
    }
    if (isPlainObject(node)) {
      for (const [k, v] of Object.entries(node)) {
        scanAllStrings(file, v, fieldPath ? `${fieldPath}.${k}` : k);
      }
      return;
    }
    if (typeof node === "string") {
      if (node !== node.trim()) {
        fail(file, fieldPath, "string must not have leading or trailing whitespace");
      }
      for (const prefix of FORBIDDEN_TOKEN_PREFIXES) {
        if (node.includes(prefix)) {
          fail(file, fieldPath, `string contains forbidden GitHub token prefix "${prefix}"`);
        }
      }
    }
  };

  const docs = {};
  for (const filename of REQUIRED_JSON_FILES) {
    const filePath = path.join(contentDir, filename);
    if (!fs.existsSync(filePath)) {
      fail(filename, "(file)", "missing required content JSON file");
      continue;
    }
    let parsed;
    try {
      parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (err) {
      fail(filename, "(json)", `invalid JSON syntax: ${err.message}`);
      continue;
    }
    if (!isPlainObject(parsed)) {
      fail(filename, "(root)", "expected top-level JSON object");
      continue;
    }
    scanAllStrings(filename, parsed, "");
    docs[filename] = parsed;
  }

  // Per-file schema rules matching PortfolioData interfaces in src/data/portfolio.ts
  if (docs["site.json"]) {
    const f = "site.json";
    const d = docs[f];
    checkString(f, "lastUpdatedLabel", d.lastUpdatedLabel);
    checkString(f, "lastUpdatedDate", d.lastUpdatedDate);
    checkLink(f, "resumeUrl", d.resumeUrl, { required: false, httpsOnly: true });

    if (!isPlainObject(d.header)) {
      fail(f, "header", "expected object");
    } else {
      for (const key of ["brandName", "brandTitle", "resumeTitle", "resumeAriaLabel"]) {
        checkString(f, `header.${key}`, d.header[key]);
      }
      if (!isPlainObject(d.header.navLabels)) {
        fail(f, "header.navLabels", "expected object");
      } else {
        for (const key of [
          "home",
          "about",
          "academics",
          "projects",
          "publication",
          "experience",
          "awards",
        ]) {
          checkString(f, `header.navLabels.${key}`, d.header.navLabels[key]);
        }
      }
    }

    checkObjectArray(f, "socialLinks", d.socialLinks, 0, (item, p) => {
      checkString(f, `${p}.name`, item.name);
      checkLink(f, `${p}.url`, item.url, { required: false });
      checkIcon(f, `${p}.icon`, item.icon);
      if (item.showInHeader !== undefined) checkBoolean(f, `${p}.showInHeader`, item.showInHeader);
      if (item.showInFooter !== undefined) checkBoolean(f, `${p}.showInFooter`, item.showInFooter);
    });

    if (!isPlainObject(d.footer)) {
      fail(f, "footer", "expected object");
    } else {
      for (const key of [
        "brandName",
        "primaryDescription",
        "secondaryDescription",
        "location",
        "navColumnTitle",
        "resumeLinkLabel",
        "projectsColumnTitle",
        "publicationColumnTitle",
        "contactColumnTitle",
        "copyrightName",
        "bottomTagline",
      ]) {
        checkString(f, `footer.${key}`, d.footer[key]);
      }
      checkObjectArray(f, "footer.contactLinks", d.footer.contactLinks, 0, (item, p) => {
        checkString(f, `${p}.label`, item.label);
        checkLink(f, `${p}.href`, item.href, { required: false });
        checkIcon(f, `${p}.iconName`, item.iconName);
        checkBoolean(f, `${p}.external`, item.external);
      });
    }

    if (!isPlainObject(d.notFound)) {
      fail(f, "notFound", "expected object");
    } else {
      for (const key of ["eyebrow", "title", "description", "backLabel"]) {
        checkString(f, `notFound.${key}`, d.notFound[key]);
      }
    }
  }

  if (docs["hero.json"]) {
    const f = "hero.json";
    const d = docs[f];
    for (const key of [
      "leftPill",
      "handwrittenIntro",
      "rightPill",
      "mainName",
      "leftStickyNote",
      "centerStatusBadge",
      "rightStickyNote",
      "headlineLine1",
      "headlineLine2",
      "primaryCtaLabel",
      "secondaryCtaLabel",
    ]) {
      checkString(f, key, d[key]);
    }
  }

  const checkHomeFlags = (file, fieldPrefix, item, itemLabel = fieldPrefix) => {
    checkBoolean(file, `${fieldPrefix}.ongoing`, item.ongoing);
    checkBoolean(file, `${fieldPrefix}.showOnHome`, item.showOnHome);
    for (const key of [
      "homeEyebrow",
      "homeTitle",
      "homeOrganization",
      "homePeriod",
      "homeLocation",
      "homeSummary",
      "homeBadge",
      "homeLinkLabel",
    ]) {
      checkString(file, `${fieldPrefix}.${key}`, item[key], {
        required: false,
        minLen: 0,
      });
    }
    checkLink(file, `${fieldPrefix}.homeLink`, item.homeLink, {
      required: false,
      allowInternal: true,
    });
    if (item.homeBullets !== undefined) {
      checkBulletList(file, `${fieldPrefix}.homeBullets`, itemLabel, item.homeBullets, {
        minItems: 0,
        maxItems: 4,
        warnBelow: 3,
      });
    }
  };

  if (docs["currentStatus.json"]) {
    const f = "currentStatus.json";
    const d = docs[f];
    for (const key of [
      "eyebrow",
      "title",
      "subtitle",
      "bulletsHeading",
      "updatedBadgeText",
      "cvBannerEyebrow",
      "cvBannerTitle",
      "cvBannerDescription",
      "cvPrimaryLabel",
      "cvSecondaryLabel",
    ]) {
      checkString(f, key, d[key]);
    }
    checkLink(f, "cvSecondaryLink", d.cvSecondaryLink, { required: false, allowInternal: true });
    if (!Array.isArray(d.sectionOrder)) {
      fail(f, "sectionOrder", "expected array of home section names");
    } else {
      const seenSections = new Set();
      d.sectionOrder.forEach((sec, idx) => {
        if (!checkString(f, `sectionOrder[${idx}]`, sec)) return;
        if (!HOME_SECTION_CHOICES.includes(sec)) {
          fail(
            f,
            `sectionOrder[${idx}]`,
            `unknown section "${sec}". Valid choices: ${HOME_SECTION_CHOICES.join(", ")}`
          );
          return;
        }
        if (seenSections.has(sec)) {
          fail(f, `sectionOrder[${idx}]`, `duplicate section "${sec}"`);
        }
        seenSections.add(sec);
      });
      for (const reqSection of HOME_SECTION_CHOICES) {
        if (!seenSections.has(reqSection)) {
          fail(f, "sectionOrder", `missing required section "${reqSection}"`);
        }
      }
    }
    checkObjectArray(f, "items", d.items, 0, (item, p) => {
      if (item.section !== undefined) {
        if (checkString(f, `${p}.section`, item.section) && !HOME_SECTION_CHOICES.includes(item.section)) {
          fail(
            f,
            `${p}.section`,
            `unknown section "${item.section}". Valid choices: ${HOME_SECTION_CHOICES.join(", ")}`
          );
        }
      }
      for (const key of [
        "index",
        "categoryLabel",
        "timeframe",
        "role",
        "organization",
        "location",
        "summary",
        "proofSummary",
      ]) {
        checkString(f, `${p}.${key}`, item[key]);
      }
      checkString(f, `${p}.logoAlt`, item.logoAlt, { required: false, minLen: 0 });
      checkString(f, `${p}.linkLabel`, item.linkLabel, { required: false, minLen: 0 });
      checkImage(f, `${p}.logoUrl`, item.logoUrl);
      checkBulletList(f, `${p}.keyDeliverables`, item.role || p, item.keyDeliverables, {
        minItems: 1,
        maxItems: 4,
        warnBelow: 3,
      });
      checkLink(f, `${p}.link`, item.link, { required: false, allowInternal: true });
      checkBoolean(f, `${p}.ongoing`, item.ongoing);
      checkBoolean(f, `${p}.showOnHome`, item.showOnHome);
    });
  }

  if (docs["about.json"]) {
    const f = "about.json";
    const d = docs[f];
    for (const key of [
      "eyebrow",
      "title",
      "subtitle",
      "fullName",
      "roleHeadline",
      "location",
      "contactEyebrow",
      "contactTitle",
      "languagesEyebrow",
      "languagesContent",
    ]) {
      checkString(f, key, d[key]);
    }
    checkImage(f, "profileImageUrl", d.profileImageUrl);
    checkStringArray(f, "bioParagraphs", d.bioParagraphs, 1);
    checkObjectArray(f, "highlights", d.highlights, 1, (item, p) => {
      checkString(f, `${p}.title`, item.title);
      checkString(f, `${p}.subtitle`, item.subtitle);
      checkIcon(f, `${p}.iconName`, item.iconName);
    });
    checkObjectArray(f, "contactChannels", d.contactChannels, 1, (item, p) => {
      checkString(f, `${p}.name`, item.name);
      checkString(f, `${p}.subtitle`, item.subtitle);
      checkLink(f, `${p}.href`, item.href, { required: false });
      checkIcon(f, `${p}.iconName`, item.iconName);
      checkBoolean(f, `${p}.external`, item.external);
    });
  }

  if (docs["academics.json"]) {
    const f = "academics.json";
    const d = docs[f];
    for (const key of [
      "eyebrow",
      "title",
      "subtitle",
      "historyEyebrow",
      "historyTitle",
      "historyRange",
    ]) {
      checkString(f, key, d[key]);
    }
    checkObjectArray(f, "benchmarkCards", d.benchmarkCards, 1, (item, p) => {
      checkString(f, `${p}.label`, item.label);
      checkString(f, `${p}.value`, item.value);
      checkString(f, `${p}.note`, item.note);
      checkImage(f, `${p}.logoUrl`, item.logoUrl);
      checkString(f, `${p}.logoAlt`, item.logoAlt, { required: false, minLen: 0 });
    });
    checkObjectArray(f, "educationHistory", d.educationHistory, 1, (item, p) => {
      checkString(f, `${p}.institution`, item.institution);
      checkString(f, `${p}.location`, item.location);
      checkString(f, `${p}.year`, item.year);
      checkString(f, `${p}.degree`, item.degree);
      checkString(f, `${p}.details`, item.details, { required: false, minLen: 0 });
      checkString(f, `${p}.result`, item.result);
      checkImage(f, `${p}.logoUrl`, item.logoUrl);
      checkString(f, `${p}.logoAlt`, item.logoAlt, { required: false, minLen: 0 });
      checkHomeFlags(f, p, item, item.institution || p);
    });
  }

  if (docs["projects.json"]) {
    const f = "projects.json";
    const d = docs[f];
    checkString(f, "eyebrow", d.eyebrow);
    checkString(f, "title", d.title);
    checkString(f, "subtitle", d.subtitle);
    checkSummaryStats(f, "summaryStats", d.summaryStats);
    checkPositiveInt(f, "footerMaxProjects", d.footerMaxProjects);
    checkObjectArray(f, "projects", d.projects, 1, (item, p) => {
      for (const key of ["id", "title", "category", "year", "summary", "impact"]) {
        checkString(f, `${p}.${key}`, item[key]);
      }
      checkString(f, `${p}.logoAlt`, item.logoAlt, { required: false, minLen: 0 });
      checkStringArray(f, `${p}.tech`, item.tech, 1);
      checkBulletList(f, `${p}.highlights`, item.title || p, item.highlights, {
        minItems: 1,
        maxItems: 4,
        warnBelow: 3,
      });
      checkImage(f, `${p}.logoUrl`, item.logoUrl);
      checkLink(f, `${p}.githubUrl`, item.githubUrl, { required: false });
      checkLink(f, `${p}.liveUrl`, item.liveUrl, { required: false });
      checkString(f, `${p}.sourceLabel`, item.sourceLabel, { required: false, minLen: 0 });
      checkString(f, `${p}.liveLabel`, item.liveLabel, { required: false, minLen: 0 });
      checkString(f, `${p}.footerShortName`, item.footerShortName, { required: false, minLen: 0 });
      checkHomeFlags(f, p, item, item.title || p);
    });
  }

  if (docs["publications.json"]) {
    const f = "publications.json";
    const d = docs[f];
    checkString(f, "eyebrow", d.eyebrow);
    checkString(f, "title", d.title);
    checkString(f, "subtitle", d.subtitle);
    checkSummaryStats(f, "summaryStats", d.summaryStats);
    checkPositiveInt(f, "footerMaxArticles", d.footerMaxArticles);
    checkObjectArray(f, "publications", d.publications, 1, (item, p) => {
      for (const key of [
        "id",
        "type",
        "title",
        "publisher",
        "date",
        "status",
        "abstract",
      ]) {
        checkString(f, `${p}.${key}`, item[key]);
      }
      checkString(f, `${p}.logoAlt`, item.logoAlt, { required: false, minLen: 0 });
      checkString(f, `${p}.linkLabel`, item.linkLabel, { required: false, minLen: 0 });
      checkImage(f, `${p}.logoUrl`, item.logoUrl);
      checkBulletList(f, `${p}.highlights`, item.title || p, item.highlights, {
        minItems: 1,
        maxItems: 4,
        warnBelow: 3,
      });
      checkStringArray(f, `${p}.tags`, item.tags, 1);
      checkLink(f, `${p}.link`, item.link, { required: false });
      checkString(f, `${p}.footerTag`, item.footerTag, { required: false, minLen: 0 });
      checkHomeFlags(f, p, item, item.title || p);
    });
    checkObjectArray(f, "footerExtraLinks", d.footerExtraLinks, 0, (item, p) => {
      checkString(f, `${p}.title`, item.title);
      checkString(f, `${p}.tag`, item.tag);
      checkLink(f, `${p}.href`, item.href, { required: false });
      checkBoolean(f, `${p}.external`, item.external);
    });
  }

  if (docs["experience.json"]) {
    const f = "experience.json";
    const d = docs[f];
    for (const key of [
      "eyebrow",
      "title",
      "subtitle",
      "workSectionEyebrow",
      "workSectionTitle",
      "workSectionRightNote",
      "leadershipSectionEyebrow",
      "leadershipSectionTitle",
      "leadershipSectionRightNote",
    ]) {
      checkString(f, key, d[key]);
    }
    checkSummaryStats(f, "summaryStats", d.summaryStats);
    checkObjectArray(f, "workExperiences", d.workExperiences, 1, (item, p) => {
      for (const key of ["company", "role", "period", "location", "status", "summary"]) {
        checkString(f, `${p}.${key}`, item[key]);
      }
      checkString(f, `${p}.logoAlt`, item.logoAlt, { required: false, minLen: 0 });
      checkImage(f, `${p}.logoUrl`, item.logoUrl);
      checkBulletList(f, `${p}.highlights`, item.company || p, item.highlights, {
        minItems: 1,
        maxItems: 4,
        warnBelow: 3,
      });
      checkObjectArray(f, `${p}.stats`, item.stats, 1, (st, sp) => {
        checkString(f, `${sp}.label`, st.label);
        checkString(f, `${sp}.value`, st.value);
      });
      checkHomeFlags(f, p, item, item.company || p);
    });
    checkObjectArray(f, "leadershipAndVolunteering", d.leadershipAndVolunteering, 1, (item, p) => {
      for (const key of ["role", "organization", "period", "type", "summary", "badge"]) {
        checkString(f, `${p}.${key}`, item[key]);
      }
      checkString(f, `${p}.logoAlt`, item.logoAlt, { required: false, minLen: 0 });
      checkImage(f, `${p}.logoUrl`, item.logoUrl);
      checkBulletList(f, `${p}.highlights`, item.role || p, item.highlights, {
        minItems: 1,
        maxItems: 4,
        warnBelow: 3,
      });
      checkLink(f, `${p}.link`, item.link, { required: false, allowInternal: true });
      checkString(f, `${p}.linkLabel`, item.linkLabel, { required: false, minLen: 0 });
      checkHomeFlags(f, p, item, item.role || p);
    });
  }

  if (docs["awards.json"]) {
    const f = "awards.json";
    const d = docs[f];
    for (const key of [
      "eyebrow",
      "title",
      "subtitle",
      "awardsEyebrow",
      "awardsTitle",
      "awardsRightNote",
      "certificationsEyebrow",
      "certificationsTitle",
      "certificationsRightNote",
      "skillsEyebrow",
      "skillsTitle",
      "skillsRightNote",
    ]) {
      checkString(f, key, d[key]);
    }
    checkObjectArray(f, "awards", d.awards, 1, (item, p) => {
      for (const key of ["title", "organization", "year", "highlight", "description"]) {
        checkString(f, `${p}.${key}`, item[key]);
      }
      checkString(f, `${p}.logoAlt`, item.logoAlt, { required: false, minLen: 0 });
      checkImage(f, `${p}.logoUrl`, item.logoUrl);
      checkLink(f, `${p}.link`, item.link, { required: false, allowInternal: true });
      checkString(f, `${p}.linkLabel`, item.linkLabel, { required: false, minLen: 0 });
      checkHomeFlags(f, p, item, item.title || p);
    });
    checkObjectArray(f, "certifications", d.certifications, 1, (item, p) => {
      for (const key of ["title", "issuer", "date", "credentialNote"]) {
        checkString(f, `${p}.${key}`, item[key]);
      }
      checkString(f, `${p}.logoAlt`, item.logoAlt, { required: false, minLen: 0 });
      checkImage(f, `${p}.logoUrl`, item.logoUrl);
      checkLink(f, `${p}.link`, item.link, { required: false, allowInternal: true, allowHash: true });
      checkString(f, `${p}.linkLabel`, item.linkLabel, { required: false, minLen: 0 });
    });
    checkObjectArray(f, "directSkills", d.directSkills, 1, (item, p) => {
      for (const key of ["name", "category"]) {
        checkString(f, `${p}.${key}`, item[key]);
      }
      checkString(f, `${p}.logoAlt`, item.logoAlt, { required: false, minLen: 0 });
      checkImage(f, `${p}.logoUrl`, item.logoUrl);
    });
  }

  if (docs["legal.json"]) {
    const f = "legal.json";
    const d = docs[f];
    for (const key of [
      "effectiveDate",
      "pageTitle",
      "pageSubtitle",
      "lastUpdatedNote",
      "intellectualPropertyTitle",
      "thirdPartyLogosTitle",
      "externalLinksTitle",
      "privacyPolicyTitle",
      "ctaTitle",
      "ctaDescription",
      "ctaButtonLabel",
    ]) {
      checkString(f, key, d[key]);
    }
    for (const key of [
      "intellectualPropertyText",
      "thirdPartyLogosText",
      "externalLinksText",
      "privacyPolicyText",
    ]) {
      checkObjectArray(f, key, d[key], 1, (item, p) => {
        checkString(f, `${p}.text`, item.text);
      });
    }
    checkEmail(f, "contactEmail", d.contactEmail);
  }

  // Verify no stylesheet, TSX/TS module, or HTML entry references missing files under assets/images
  const assetScanTargets = [path.join(rootDir, "index.html")];
  const collectSrcCode = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        collectSrcCode(entryPath);
      } else if (/\.(css|tsx|ts)$/i.test(entry.name) && !/\.test\.(ts|tsx)$/i.test(entry.name)) {
        assetScanTargets.push(entryPath);
      }
    }
  };
  collectSrcCode(path.join(rootDir, "src"));

  for (const filePath of assetScanTargets) {
    if (!fs.existsSync(filePath)) continue;
    const rel = path.relative(rootDir, filePath).replace(/\\/g, "/");
    const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
    lines.forEach((line, idx) => {
      const regex = /assets[\\/]images(?:[\\/]([^\s"'`);?]+))?/gi;
      let match;
      while ((match = regex.exec(line)) !== null) {
        const assetFile = match[1];
        if (!assetFile) {
          fail(`${rel}:${idx + 1}`, "assets/images", "stale assets/images reference found");
          continue;
        }
        const diskAsset = path.join(rootDir, "src", "assets", "images", assetFile);
        if (!fs.existsSync(diskAsset) || !fs.statSync(diskAsset).isFile()) {
          fail(
            `${rel}:${idx + 1}`,
            "assets/images",
            `referenced file does not exist: src/assets/images/${assetFile} (moved files live at /uploads/<file>)`
          );
        }
      }
    });
  }

  // Scan all non-binary repository files (including root configs and .env*) for accidental PAT tokens
  const ignoredDirs = new Set([".git", "node_modules", "dist", "dist-ssr", ".vercel"]);
  const binaryExtRe = /\.(png|jpe?g|webp|gif|ico|svg|woff2?|ttf|otf|wasm|zip|pdf|mp4|webm|avif)$/i;
  const walkRepoFiles = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!ignoredDirs.has(entry.name)) {
          walkRepoFiles(path.join(dir, entry.name));
        }
        continue;
      }
      if (binaryExtRe.test(entry.name) || entry.name === "package-lock.json") continue;
      const entryPath = path.join(dir, entry.name);
      const text = fs.readFileSync(entryPath, "utf8");
      for (const prefix of FORBIDDEN_TOKEN_PREFIXES) {
        if (text.includes(prefix)) {
          const rel = path.relative(rootDir, entryPath).replace(/\\/g, "/");
          fail(rel, "(file)", `contains forbidden GitHub token prefix "${prefix}"`);
        }
      }
    }
  };
  walkRepoFiles(rootDir);

  if (errors.length > 0) {
    throw new Error(`Content validation failed (${errors.length} error(s)):\n  - ${errors.join("\n  - ")}`);
  }

  return {
    filesChecked: REQUIRED_JSON_FILES.length,
    iconCount: validIcons.size,
    warnings,
  };
}

const isCli =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isCli) {
  try {
    const summary = validateContent(process.cwd());
    for (const warning of summary.warnings) {
      console.warn(`[validate-content] WARNING: ${warning}`);
    }
    console.log(
      `[validate-content] Passed: ${summary.filesChecked} JSON files, ${summary.iconCount} icons verified${
        summary.warnings.length > 0 ? ` (${summary.warnings.length} warning(s))` : ""
      }.`
    );
  } catch (err) {
    console.error(`[validate-content] ERROR:\n${err.message}`);
    process.exit(1);
  }
}
