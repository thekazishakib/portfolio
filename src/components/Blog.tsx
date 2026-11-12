import { motion } from "motion/react";
import { CalendarDays as Calendar, SquareArrowOutUpRight as ExternalLink, BadgeCheck as CheckCircle2 } from "lucide-react";

import { usePortfolio } from "../context/PortfolioContext";

export function Blog() {
  const { data } = usePortfolio();
  const { articlesData } = data;

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center mb-10 sm:mb-12">
        <p className="figma-eyebrow text-[#7e8976] dark:text-[#9fa895] mb-3">
          {articlesData.eyebrow}
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.025em] text-[#2d2d2a] dark:text-[#eae6df] mb-3 sm:mb-4">
          {articlesData.title}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-[#7e8976] dark:text-[#9fa895] max-w-2xl mx-auto">
          {articlesData.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
        {articlesData.summaryStats.map((stat, idx) => (
          <motion.div
            key={`${stat.label}-${idx}`}
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
            className="p-4 sm:p-5 rounded-[12px] bg-[#ffffff] dark:bg-[#252422] border border-[#e6e3d8] dark:border-[#3a3936]"
          >
            <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.06em] text-[#7e8976] dark:text-[#9fa895] mb-1">
              {stat.label}
            </p>
            <p className="text-lg sm:text-2xl md:text-3xl font-bold text-[#2d2d2a] dark:text-[#eae6df] tabular-nums">
              <span>{stat.value}</span>
            </p>
            <p className="text-xs text-[#7e8976] dark:text-[#9fa895] mt-1 tabular-nums">
              {stat.note}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {articlesData.publications.map((pub, idx) => (
          <motion.article
            key={`${pub.id}-${idx}`}
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.06 }}
            className="p-5 sm:p-6 md:p-8 rounded-[12px] bg-[#ffffff] dark:bg-[#252422] border border-[#e6e3d8] dark:border-[#3a3936] flex flex-col justify-between gap-6"
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#e6e3d8] dark:border-[#3a3936]">
                <span className="px-3 py-1 rounded-full bg-[#f2f0e9] dark:bg-[#2a2926] border border-[#e6e3d8] dark:border-[#3a3936] font-mono text-xs font-semibold uppercase tracking-[0.05em] text-[#2d2d2a] dark:text-[#eae6df]">
                  {pub.type}
                </span>

                <div className="flex items-center gap-1.5 font-mono text-xs text-[#7e8976] dark:text-[#9fa895]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{pub.date}</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 sm:gap-4">
                {pub.logoUrl?.trim() && (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[12px] bg-[#ffffff] dark:bg-[#252422] border border-[#dcd8cc] dark:border-[#3a3936] p-[2px] shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex items-center justify-center shrink-0 overflow-hidden mt-0.5">
                    <img
                      src={pub.logoUrl.trim()}
                      alt={pub.logoAlt || `${pub.publisher} logo`}
                      width={56}
                      height={56}
                      decoding="async"
                      className="w-full h-full object-cover rounded-[9px] border border-[#e6e3d8]/50 dark:border-[#3a3936]/50"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-mono text-xs uppercase tracking-[0.06em] text-[#7e8976] dark:text-[#9fa895] mb-1">
                    {pub.publisher}
                  </p>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2d2d2a] dark:text-[#eae6df] leading-snug">
                    {pub.title}
                  </h2>
                </div>
              </div>

              <p className="text-[#7e8976] dark:text-[#9fa895] text-sm md:text-base leading-relaxed">
                {pub.abstract}
              </p>

              {pub.highlights.length > 0 && (
                <ul className="space-y-2.5 pt-3 border-t border-[#e6e3d8] dark:border-[#3a3936]">
                  {pub.highlights.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-[#2d2d2a] dark:text-[#eae6df]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#7e8976] dark:text-[#9fa895] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-[#e6e3d8] dark:border-[#3a3936]">
              {pub.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {pub.tags.map((tag, i) => (
                    <span
                      key={`${tag}-${i}`}
                      className="px-2.5 py-1 rounded-full bg-[#f2f0e9] dark:bg-[#2a2926] border border-[#e6e3d8] dark:border-[#3a3936] font-mono text-[11px] text-[#2d2d2a] dark:text-[#eae6df]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <span className="font-mono text-xs font-semibold text-[#7e8976] dark:text-[#9fa895] tabular-nums">
                  {pub.status}
                </span>

                {pub.link?.trim() && (
                  <a
                    href={pub.link.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2d2d2a] text-[#ffffff] dark:bg-[#eae6df] dark:text-[#1c1b19] text-xs font-medium hover:opacity-90 transition-opacity shrink-0"
                  >
                    <span>{pub.linkLabel || "Read Article"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
