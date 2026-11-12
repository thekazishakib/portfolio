import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Award, BadgeCheck as CheckCircle2, SquareArrowOutUpRight as ExternalLink } from "lucide-react";

import { usePortfolio } from "../context/PortfolioContext";

export function Experience() {
  const { data } = usePortfolio();
  const { experienceData } = data;

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center mb-10 sm:mb-12">
        <p className="figma-eyebrow text-[#7e8976] dark:text-[#9fa895] mb-3">
          {experienceData.eyebrow}
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.025em] text-[#2d2d2a] dark:text-[#eae6df] mb-3 sm:mb-4">
          {experienceData.title}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-[#7e8976] dark:text-[#9fa895] max-w-2xl mx-auto">
          {experienceData.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-14">
        {experienceData.summaryStats.map((stat, idx) => (
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

      <div className="mb-14 sm:mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 pb-3 border-b border-[#e6e3d8] dark:border-[#3a3936]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.06em] text-[#7e8976] dark:text-[#9fa895]">
              {experienceData.workSectionEyebrow}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2d2d2a] dark:text-[#eae6df]">
              {experienceData.workSectionTitle}
            </h2>
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.06em] text-[#7e8976] dark:text-[#9fa895]">
            {experienceData.workSectionRightNote}
          </span>
        </div>

        <div className="space-y-6">
          {experienceData.workExperiences.map((job, jobIdx) => (
            <motion.div
              key={`${job.company}-${jobIdx}`}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: jobIdx * 0.06 }}
              className="p-5 sm:p-6 md:p-8 rounded-[12px] bg-[#ffffff] dark:bg-[#252422] border border-[#e6e3d8] dark:border-[#3a3936]"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 mb-5 border-b border-[#e6e3d8] dark:border-[#3a3936]">
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  {job.logoUrl?.trim() && (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[12px] bg-[#ffffff] dark:bg-[#252422] border border-[#dcd8cc] dark:border-[#3a3936] p-[2px] shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={job.logoUrl.trim()}
                        alt={job.logoAlt || `${job.company} logo`}
                        width={56}
                        height={56}
                        decoding="async"
                        className="w-full h-full object-cover rounded-[9px] border border-[#e6e3d8]/50 dark:border-[#3a3936]/50"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#7e8976] dark:text-[#9fa895] block">
                      {job.status} · {job.location}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#2d2d2a] dark:text-[#eae6df] leading-snug">
                      {job.role} — {job.company}
                    </h3>
                  </div>
                </div>

                <span className="px-3.5 py-1.5 rounded-full bg-[#f2f0e9] dark:bg-[#2a2926] border border-[#e6e3d8] dark:border-[#3a3936] font-mono text-xs font-semibold text-[#2d2d2a] dark:text-[#eae6df] tabular-nums self-start md:self-auto shrink-0">
                  {job.period}
                </span>
              </div>

              <p className="text-[#7e8976] dark:text-[#9fa895] text-sm md:text-base leading-relaxed mb-4">
                {job.summary}
              </p>

              {job.highlights.length > 0 && (
                <ul className="space-y-2.5 mb-6">
                  {job.highlights.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-[#2d2d2a] dark:text-[#eae6df] leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#7e8976] dark:text-[#9fa895] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}

              {job.stats.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-5 border-t border-[#e6e3d8] dark:border-[#3a3936]">
                  {job.stats.map((stat, sIdx) => (
                    <div
                      key={`${stat.label}-${sIdx}`}
                      className="p-3.5 rounded-[10px] bg-[#f2f0e9]/70 dark:bg-[#2a2926]/70 border border-[#e6e3d8] dark:border-[#3a3936]"
                    >
                      <p className="font-mono text-[11px] uppercase tracking-[0.05em] text-[#7e8976] dark:text-[#9fa895]">
                        {stat.label}
                      </p>
                      <p className="text-sm md:text-base font-bold text-[#2d2d2a] dark:text-[#eae6df] mt-0.5 tabular-nums">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 pb-3 border-b border-[#e6e3d8] dark:border-[#3a3936]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.06em] text-[#7e8976] dark:text-[#9fa895]">
              {experienceData.leadershipSectionEyebrow}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2d2d2a] dark:text-[#eae6df]">
              {experienceData.leadershipSectionTitle}
            </h2>
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.06em] text-[#7e8976] dark:text-[#9fa895]">
            {experienceData.leadershipSectionRightNote}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experienceData.leadershipAndVolunteering.map((item, idx) => (
            <motion.div
              key={`${item.role}-${idx}`}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="p-6 rounded-[12px] bg-[#ffffff] dark:bg-[#252422] border border-[#e6e3d8] dark:border-[#3a3936] flex flex-col justify-between gap-6"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  {item.logoUrl?.trim() && (
                    <div className="w-12 h-12 rounded-[12px] bg-[#ffffff] dark:bg-[#252422] border border-[#dcd8cc] dark:border-[#3a3936] p-[2px] shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={item.logoUrl.trim()}
                        alt={item.logoAlt || `${item.organization} logo`}
                        width={48}
                        height={48}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover rounded-[9px] border border-[#e6e3d8]/50 dark:border-[#3a3936]/50"
                      />
                    </div>
                  )}
                  <span className="px-2.5 py-1 rounded-full bg-[#f2f0e9] dark:bg-[#2a2926] border border-[#e6e3d8] dark:border-[#3a3936] font-mono text-[11px] text-[#7e8976] dark:text-[#9fa895] tabular-nums">
                    {item.period}
                  </span>
                </div>

                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#7e8976] dark:text-[#9fa895] mb-1">
                    {item.type}
                  </p>
                  <h3 className="text-lg md:text-xl font-bold text-[#2d2d2a] dark:text-[#eae6df] mb-1 leading-snug">
                    {item.role}
                  </h3>
                  <p className="text-xs font-medium text-[#7e8976] dark:text-[#9fa895]">
                    {item.organization}
                  </p>
                </div>

                <p className="text-sm text-[#7e8976] dark:text-[#9fa895] leading-relaxed">
                  {item.summary}
                </p>

                {item.highlights.length > 0 && (
                  <ul className="space-y-2 pt-3 border-t border-[#e6e3d8] dark:border-[#3a3936]">
                    {item.highlights.map((point, pIdx) => (
                      <li
                        key={pIdx}
                        className="flex items-start gap-2 text-xs text-[#2d2d2a] dark:text-[#eae6df] leading-relaxed"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#7e8976] dark:text-[#9fa895] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-3 border-t border-[#e6e3d8] dark:border-[#3a3936] flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <Award className="w-4 h-4 text-[#7e8976] dark:text-[#9fa895] shrink-0" />
                  <span className="font-mono text-xs font-semibold text-[#2d2d2a] dark:text-[#eae6df] tabular-nums">
                    {item.badge}
                  </span>
                </div>
                {item.link?.trim() &&
                  (item.link.trim().startsWith("/") ? (
                    <Link
                      to={item.link.trim()}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2f0e9] dark:bg-[#2a2926] border border-[#e6e3d8] dark:border-[#3a3936] text-xs font-medium text-[#2d2d2a] dark:text-[#eae6df] hover:opacity-85 transition-opacity shrink-0"
                    >
                      <span>{item.linkLabel || "View Link"}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  ) : (
                    <a
                      href={item.link.trim()}
                      target={item.link.trim().startsWith("http") ? "_blank" : undefined}
                      rel={item.link.trim().startsWith("http") ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2f0e9] dark:bg-[#2a2926] border border-[#e6e3d8] dark:border-[#3a3936] text-xs font-medium text-[#2d2d2a] dark:text-[#eae6df] hover:opacity-85 transition-opacity shrink-0"
                    >
                      <span>{item.linkLabel || "View Link"}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
