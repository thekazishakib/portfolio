import { Link } from "react-router-dom";
import {
  MapPinHouse as MapPin,
  MoveUpRight as ArrowUpRight
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { DynamicIcon } from "../lib/iconMap";

export function Footer() {
  const { data } = usePortfolio();
  const { footer, header, projectsData, articlesData, resumeUrl, socialLinks } = data;
  const trimmedResumeUrl = resumeUrl?.trim() || "";
  const footerSocialLinks = socialLinks.filter(
    (item) => item.showInFooter && Boolean(item.url?.trim())
  );
  const navLinks = [
    { name: header.navLabels.home, path: "/" },
    { name: header.navLabels.about, path: "/about" },
    { name: header.navLabels.academics, path: "/academics" },
    { name: header.navLabels.projects, path: "/projects" },
    { name: header.navLabels.publication, path: "/publication" },
    { name: header.navLabels.experience, path: "/experience" },
    { name: header.navLabels.awards, path: "/awards" }
  ];

  const maxProjects = projectsData.footerMaxProjects || 8;
  const syncedProjects = projectsData.projects.slice(0, maxProjects).map((proj) => {
    const href = proj.liveUrl || proj.githubUrl || "/projects";
    const external = href.startsWith("http");
    return {
      name: proj.footerShortName || proj.title,
      href,
      external
    };
  });

  const maxArticles = articlesData.footerMaxArticles || 4;
  const dynamicPubLinks = articlesData.publications.map((pub) => {
    const href = pub.link || "/publication";
    const external = href.startsWith("http");
    return {
      title: pub.title,
      tag: pub.footerTag || `${pub.publisher} · ${pub.date}`,
      href,
      external
    };
  });

  const combinedArticleLinks = [
    ...dynamicPubLinks,
    ...(articlesData.footerExtraLinks || []).filter((extra) => Boolean(extra.href?.trim()))
  ].slice(0, maxArticles);

  return (
    <footer className="pt-10 sm:pt-12 pb-8 px-4 sm:px-6 border-t border-[#e6e3d8] dark:border-[#3a3936] bg-[#f2f0e9] dark:bg-[#1c1b19]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-x-5 gap-y-8 sm:gap-8 pb-10">
          <div className="col-span-2 md:col-span-4 lg:col-span-4 space-y-3.5 pr-0 lg:pr-4">
            <Link
              to="/"
              className="inline-block text-xl font-bold text-[#2d2d2a] dark:text-[#eae6df] tracking-tight hover:opacity-85 transition-opacity"
            >
              {footer.brandName}
              <span className="text-[#7e8976] dark:text-[#9fa895]">.</span>
            </Link>

            <p className="text-[#2d2d2a] dark:text-[#eae6df] text-sm font-medium leading-relaxed">
              {footer.primaryDescription}
            </p>

            <p className="text-[#7e8976] dark:text-[#9fa895] text-xs leading-relaxed">
              {footer.secondaryDescription}
            </p>

            <div className="flex items-center gap-1.5 text-xs text-[#7e8976] dark:text-[#9fa895] pt-0.5">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-[#2d2d2a] dark:text-[#eae6df]" />
              <span>{footer.location}</span>
            </div>

            {footerSocialLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {footerSocialLinks.map((item, idx) => {
                  const url = item.url.trim();
                  const isExternal = url.startsWith("http");
                  return (
                    <a
                      key={`${item.name}-${idx}`}
                      href={url}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      aria-label={item.name}
                      title={item.name}
                      className="w-8 h-8 rounded-[8px] bg-[#ffffff] dark:bg-[#252422] border border-[#e6e3d8] dark:border-[#3a3936] flex items-center justify-center text-[#7e8976] dark:text-[#9fa895] hover:text-[#2d2d2a] dark:hover:text-[#eae6df] transition-colors"
                    >
                      <DynamicIcon name={item.icon} className="w-3.5 h-3.5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-3 min-w-0">
            <h2 className="figma-eyebrow text-[#2d2d2a] dark:text-[#eae6df]">
              {footer.navColumnTitle}
            </h2>
            <ul className="space-y-2 text-xs">
              {navLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-[#7e8976] dark:text-[#9fa895] hover:text-[#2d2d2a] dark:hover:text-[#eae6df] transition-colors font-medium"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              {trimmedResumeUrl && (
                <li>
                  <a
                    href={trimmedResumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#2d2d2a] dark:text-[#eae6df] font-semibold hover:opacity-80 transition-opacity"
                  >
                    <span>{footer.resumeLinkLabel}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-3 min-w-0">
            <h2 className="figma-eyebrow text-[#2d2d2a] dark:text-[#eae6df]">
              {footer.projectsColumnTitle}
            </h2>
            <ul className="space-y-2 text-xs">
              {syncedProjects.map((proj, idx) => (
                <li key={`${proj.name}-${idx}`}>
                  {proj.external ? (
                    <a
                      href={proj.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#7e8976] dark:text-[#9fa895] hover:text-[#2d2d2a] dark:hover:text-[#eae6df] transition-colors inline-flex items-center gap-1 max-w-full"
                    >
                      <span className="truncate">{proj.name}</span>
                      <ArrowUpRight className="w-3 h-3 shrink-0 opacity-60" />
                    </a>
                  ) : (
                    <Link
                      to={proj.href}
                      className="text-[#7e8976] dark:text-[#9fa895] hover:text-[#2d2d2a] dark:hover:text-[#eae6df] transition-colors block truncate"
                    >
                      {proj.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-3 min-w-0">
            <h2 className="figma-eyebrow text-[#2d2d2a] dark:text-[#eae6df]">
              {footer.publicationColumnTitle}
            </h2>
            <ul className="space-y-2.5 text-xs">
              {combinedArticleLinks.map((art, idx) => (
                <li key={`${art.title}-${idx}`}>
                  {art.external ? (
                    <a
                      href={art.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <span className="text-[#2d2d2a] dark:text-[#eae6df] font-medium group-hover:underline leading-snug block">
                        {art.title}
                      </span>
                      <span className="text-[11px] text-[#7e8976] dark:text-[#9fa895]">
                        {art.tag}
                      </span>
                    </a>
                  ) : (
                    <Link to={art.href} className="group block">
                      <span className="text-[#2d2d2a] dark:text-[#eae6df] font-medium group-hover:underline leading-snug block">
                        {art.title}
                      </span>
                      <span className="text-[11px] text-[#7e8976] dark:text-[#9fa895]">
                        {art.tag}
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-3 min-w-0">
            <h2 className="figma-eyebrow text-[#2d2d2a] dark:text-[#eae6df]">
              {footer.contactColumnTitle}
            </h2>
            <ul className="space-y-2 text-xs">
              {footer.contactLinks
                .filter((item) => Boolean(item.href?.trim()))
                .map((item, idx) => (
                  <li key={`${item.label}-${idx}`}>
                    <a
                      href={item.href.trim()}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-2 text-[#7e8976] dark:text-[#9fa895] hover:text-[#2d2d2a] dark:hover:text-[#eae6df] transition-colors"
                    >
                      <DynamicIcon
                        name={item.iconName}
                        className="w-3.5 h-3.5 shrink-0 text-[#2d2d2a] dark:text-[#eae6df]"
                      />
                      <span className="truncate">{item.label}</span>
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#e6e3d8] dark:border-[#3a3936] pt-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="font-mono text-xs uppercase tracking-[0.06em] text-[#7e8976] dark:text-[#9fa895] tabular-nums">
              © {new Date().getFullYear()} {footer.copyrightName}. All Rights Reserved.
            </p>
            <span className="hidden sm:inline text-[#7e8976] dark:text-[#9fa895]">·</span>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#f2f0e9] dark:bg-[#1c1b19] border border-[#e6e3d8] dark:border-[#3a3936] font-mono text-[11px] text-[#2d2d2a] dark:text-[#eae6df]">
              <span>
                {data.lastUpdatedLabel} {data.lastUpdatedDate || "26 October 2026"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-[#7e8976] dark:text-[#9fa895]">
            <Link
              to="/terms"
              className="hover:text-[#2d2d2a] dark:hover:text-[#eae6df] transition-colors hover:underline underline-offset-2"
            >
              Terms & Conditions
            </Link>
            <span>·</span>
            <Link
              to="/privacy"
              className="hover:text-[#2d2d2a] dark:hover:text-[#eae6df] transition-colors hover:underline underline-offset-2"
            >
              Privacy Policy
            </Link>
          </div>

          <p className="font-mono text-xs uppercase tracking-[0.06em] text-[#7e8976] dark:text-[#9fa895]">
            {footer.bottomTagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
