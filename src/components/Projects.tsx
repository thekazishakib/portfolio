import { motion } from "motion/react";
import { Github, SquareArrowOutUpRight as ExternalLink, BadgeCheck as CheckCircle2 } from "lucide-react";

import { usePortfolio } from "../context/PortfolioContext";

export function Projects() {
  const { data } = usePortfolio();
  const { projectsData } = data;

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center mb-10 sm:mb-12">
        <p className="figma-eyebrow text-[#7e8976] dark:text-[#9fa895] mb-3">
          {projectsData.eyebrow}
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.025em] text-[#2d2d2a] dark:text-[#eae6df] mb-3 sm:mb-4">
          {projectsData.title}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-[#7e8976] dark:text-[#9fa895] max-w-xl mx-auto">
          {projectsData.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
        {projectsData.summaryStats.map((stat, idx) => (
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
            <p className="text-xs text-[#7e8976] dark:text-[#9fa895] mt-1">
              {stat.note}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {projectsData.projects.map((project, index) => (
          <motion.div
            key={`${project.id}-${index}`}
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="p-5 sm:p-6 md:p-7 rounded-[12px] bg-[#ffffff] dark:bg-[#252422] border border-[#e6e3d8] dark:border-[#3a3936] flex flex-col justify-between gap-6"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  {project.logoUrl?.trim() && (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[12px] bg-[#ffffff] dark:bg-[#252422] border border-[#dcd8cc] dark:border-[#3a3936] p-[2px] shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={project.logoUrl.trim()}
                        alt={project.logoAlt || `${project.title} logo`}
                        width={56}
                        height={56}
                        loading={index < 2 ? "eager" : "lazy"}
                        decoding="async"
                        className="w-full h-full object-cover rounded-[9px] border border-[#e6e3d8]/50 dark:border-[#3a3936]/50"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#7e8976] dark:text-[#9fa895] block">
                      {project.category} · {project.year}
                    </span>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#2d2d2a] dark:text-[#eae6df] leading-snug">
                      {project.title}
                    </h2>
                  </div>
                </div>
              </div>

              <p className="text-[#7e8976] dark:text-[#9fa895] text-sm leading-relaxed">
                {project.summary}
              </p>

              {project.highlights.length > 0 && (
                <ul className="space-y-2 pt-3 border-t border-[#e6e3d8] dark:border-[#3a3936]">
                  {project.highlights.map((item, i) => (
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
              {project.tech.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t, i) => (
                    <span
                      key={`${t}-${i}`}
                      className="px-2.5 py-1 rounded-full bg-[#f2f0e9] dark:bg-[#2a2926] border border-[#e6e3d8] dark:border-[#3a3936] font-mono text-[11px] text-[#2d2d2a] dark:text-[#eae6df]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <span className="font-mono text-xs font-semibold text-[#7e8976] dark:text-[#9fa895] uppercase tracking-[0.05em] tabular-nums">
                  {project.impact}
                </span>

                {(project.githubUrl?.trim() || project.liveUrl?.trim()) && (
                  <div className="flex items-center gap-2 shrink-0">
                    {project.githubUrl?.trim() && (
                      <a
                        href={project.githubUrl.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.sourceLabel || "Source"} for ${project.title}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f2f0e9] dark:bg-[#2a2926] border border-[#e6e3d8] dark:border-[#3a3936] text-xs font-medium text-[#2d2d2a] dark:text-[#eae6df] hover:opacity-85 transition-opacity"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>{project.sourceLabel || "Source"}</span>
                      </a>
                    )}
                    {project.liveUrl?.trim() && (
                      <a
                        href={project.liveUrl.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.liveLabel || "Overview"} for ${project.title}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2d2d2a] text-[#ffffff] dark:bg-[#eae6df] dark:text-[#1c1b19] text-xs font-medium hover:opacity-90 transition-opacity"
                      >
                        <span>{project.liveLabel || "Overview"}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
