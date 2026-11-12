import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { MoveUpRight as ArrowUpRight, FileUser as FileText } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { getHomeStatusItems } from "../lib/currentStatus";

export function CurrentStatus() {
  const { data } = usePortfolio();
  const { currentStatus, resumeUrl } = data;
  const trimmedResumeUrl = resumeUrl?.trim() || "";
  const cvSecondaryLink = currentStatus.cvSecondaryLink?.trim() || "";
  const isSecondaryExternal = cvSecondaryLink.startsWith("http") || cvSecondaryLink.startsWith("mailto:");
  const homeItems = getHomeStatusItems(data);

  return (
    <div
      id="current-status"
      className="w-full bg-[#f2f0e9] dark:bg-[#1c1b19] border-t border-[#e6e3d8] dark:border-[#3a3936]"
    >
      <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="pb-8 sm:pb-10 border-b border-[#e6e3d8] dark:border-[#3a3936] flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6">
          <div className="space-y-2">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-[#7e8976] dark:text-[#9fa895]">
              {currentStatus.eyebrow}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold tracking-[-0.025em] text-[#2d2d2a] dark:text-[#eae6df] leading-tight">
              {currentStatus.title}
            </h2>
          </div>

          <div className="max-w-md space-y-2">
            <p className="text-sm md:text-base text-[#7e8976] dark:text-[#9fa895] leading-relaxed">
              {currentStatus.subtitle}
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#e6e3d8] dark:divide-[#3a3936] border-b border-[#e6e3d8] dark:border-[#3a3936]">
          {homeItems.map((item, idx) => {
            const isRoleOnRight = idx % 2 === 1;
            const displayIndex = String(idx + 1).padStart(2, "0");
            const link = item.link?.trim() || "";
            const isExternal = link.startsWith("http") || link.startsWith("mailto:");

            return (
              <motion.article
                key={item.id}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12 items-center"
              >
                <div
                  className={`lg:col-span-5 flex flex-col space-y-4 ${
                    isRoleOnRight
                      ? "lg:order-2 lg:items-end lg:text-right"
                      : "lg:order-1 lg:items-start lg:text-left"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2.5 font-mono text-xs text-[#7e8976] dark:text-[#9fa895] tabular-nums ${
                      isRoleOnRight ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    <span className="px-2.5 py-0.5 rounded-full bg-[#ffffff] dark:bg-[#252422] border border-[#e6e3d8] dark:border-[#3a3936] font-bold text-[#2d2d2a] dark:text-[#eae6df]">
                      {displayIndex}
                    </span>
                    <span className="uppercase tracking-[0.05em]">{item.categoryLabel}</span>
                  </div>

                  <div
                    className={`flex items-center gap-4 pt-1 ${
                      isRoleOnRight ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    {item.logoUrl?.trim() && (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[14px] bg-[#ffffff] dark:bg-[#252422] border border-[#dcd8cc] dark:border-[#3a3936] p-[2px] shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={item.logoUrl.trim()}
                          alt={item.logoAlt || `${item.organization} logo`}
                          width={64}
                          height={64}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover rounded-[11px] border border-[#e6e3d8]/50 dark:border-[#3a3936]/50"
                        />
                      </div>
                    )}

                    <div className="space-y-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-[#2d2d2a] dark:text-[#eae6df] tracking-tight leading-snug">
                        {item.role}
                      </h3>
                      <div className="text-sm sm:text-base font-semibold text-[#7e8976] dark:text-[#9fa895]">
                        {item.organization}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex flex-wrap items-center gap-2 font-mono text-xs text-[#7e8976] dark:text-[#9fa895] tabular-nums ${
                      isRoleOnRight ? "lg:justify-end" : "lg:justify-start"
                    }`}
                  >
                    <span className="px-3 py-1 rounded-full bg-[#ffffff] dark:bg-[#252422] border border-[#e6e3d8] dark:border-[#3a3936] text-[#2d2d2a] dark:text-[#eae6df]">
                      {item.timeframe}
                    </span>
                    {item.location && (
                      <>
                        <span>·</span>
                        <span>{item.location}</span>
                      </>
                    )}
                  </div>
                </div>

                <div
                  className={`lg:col-span-7 p-6 sm:p-8 rounded-[16px] bg-[#ffffff] dark:bg-[#252422] border border-[#e6e3d8] dark:border-[#3a3936] shadow-[0px_1px_3px_rgba(0,0,0,0.04)] space-y-5 ${
                    isRoleOnRight ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <p className="text-base text-[#2d2d2a] dark:text-[#eae6df] leading-relaxed">
                    {item.summary}
                  </p>

                  {item.keyDeliverables.length > 0 && (
                    <div className="space-y-2.5 pt-3 border-t border-[#e6e3d8] dark:border-[#3a3936]">
                      <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#7e8976] dark:text-[#9fa895]">
                        {currentStatus.bulletsHeading}
                      </p>
                      <ul className="space-y-2 text-sm text-[#7e8976] dark:text-[#9fa895]">
                        {item.keyDeliverables.map((point, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="font-mono text-xs text-[#2d2d2a] dark:text-[#eae6df] mt-0.5">
                              —
                            </span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(item.proofSummary || link) && (
                    <div className="pt-4 border-t border-[#e6e3d8] dark:border-[#3a3936] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                      {item.proofSummary ? (
                        <span className="font-mono text-xs text-[#7e8976] dark:text-[#9fa895] tabular-nums">
                          {item.proofSummary}
                        </span>
                      ) : (
                        <span />
                      )}

                      {link &&
                        (isExternal ? (
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group self-start sm:self-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#7e8976] hover:bg-[#2d2d2a] dark:bg-[#9fa895] dark:hover:bg-[#eae6df] text-[#ffffff] dark:text-[#1c1b19] font-sans text-xs font-semibold tracking-wide transition-colors shrink-0 shadow-xs"
                          >
                            <span>{item.linkLabel || "View Link"}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </a>
                        ) : (
                          <Link
                            to={link}
                            className="group self-start sm:self-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#7e8976] hover:bg-[#2d2d2a] dark:bg-[#9fa895] dark:hover:bg-[#eae6df] text-[#ffffff] dark:text-[#1c1b19] font-sans text-xs font-semibold tracking-wide transition-colors shrink-0 shadow-xs"
                          >
                            <span>{item.linkLabel || "View Details"}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-16 p-6 md:p-8 rounded-[16px] bg-[#ffffff] dark:bg-[#252422] border border-[#e6e3d8] dark:border-[#3a3936] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="font-mono text-xs uppercase tracking-[0.06em] text-[#7e8976] dark:text-[#9fa895]">
              {currentStatus.cvBannerEyebrow}
            </div>
            <h3 className="text-2xl font-bold text-[#2d2d2a] dark:text-[#eae6df] tracking-tight">
              {currentStatus.cvBannerTitle}
            </h3>
            <p className="text-sm text-[#7e8976] dark:text-[#9fa895] leading-relaxed">
              {currentStatus.cvBannerDescription}
            </p>
          </div>

          {(trimmedResumeUrl || cvSecondaryLink) && (
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {trimmedResumeUrl && (
                <a
                  href={trimmedResumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#2d2d2a] hover:bg-[#7e8976] dark:bg-[#eae6df] dark:hover:bg-[#9fa895] text-[#ffffff] dark:text-[#1c1b19] font-sans text-sm font-semibold transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>{currentStatus.cvPrimaryLabel}</span>
                </a>
              )}
              {cvSecondaryLink &&
                (isSecondaryExternal ? (
                  <a
                    href={cvSecondaryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full bg-[#7e8976]/15 hover:bg-[#7e8976] text-[#2d2d2a] hover:text-[#ffffff] dark:bg-[#9fa895]/20 dark:hover:bg-[#9fa895] dark:text-[#eae6df] dark:hover:text-[#1c1b19] border border-[#7e8976]/40 dark:border-[#9fa895]/40 text-sm font-semibold transition-colors"
                  >
                    <span>{currentStatus.cvSecondaryLabel}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                ) : (
                  <Link
                    to={cvSecondaryLink}
                    className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full bg-[#7e8976]/15 hover:bg-[#7e8976] text-[#2d2d2a] hover:text-[#ffffff] dark:bg-[#9fa895]/20 dark:hover:bg-[#9fa895] dark:text-[#eae6df] dark:hover:text-[#1c1b19] border border-[#7e8976]/40 dark:border-[#9fa895]/40 text-sm font-semibold transition-colors"
                  >
                    <span>{currentStatus.cvSecondaryLabel}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
