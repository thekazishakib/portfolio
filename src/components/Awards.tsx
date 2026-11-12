import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { SquareArrowOutUpRight as ExternalLink } from "lucide-react";

import { usePortfolio } from "../context/PortfolioContext";

export function Awards() {
  const { data } = usePortfolio();
  const { awardsData } = data;

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center mb-10 sm:mb-14">
        <p className="figma-eyebrow text-[#7e8976] dark:text-[#9fa895] mb-3">
          {awardsData.eyebrow}
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.025em] text-[#2d2d2a] dark:text-[#eae6df] mb-3 sm:mb-4">
          {awardsData.title}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-[#7e8976] dark:text-[#9fa895] max-w-2xl mx-auto">
          {awardsData.subtitle}
        </p>
      </div>

      <div className="mb-14 sm:mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 pb-3 border-b border-[#e6e3d8] dark:border-[#3a3936]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.06em] text-[#7e8976] dark:text-[#9fa895]">
              {awardsData.awardsEyebrow}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2d2d2a] dark:text-[#eae6df]">
              {awardsData.awardsTitle}
            </h2>
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.06em] text-[#7e8976] dark:text-[#9fa895]">
            {awardsData.awardsRightNote}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {awardsData.awards.map((award, index) => (
            <motion.div
              key={`${award.title}-${index}`}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`p-5 sm:p-6 rounded-[12px] bg-[#ffffff] dark:bg-[#252422] border border-[#e6e3d8] dark:border-[#3a3936] flex flex-col justify-between gap-4 ${
                index === 0 ? "md:col-span-2" : ""
              }`}
            >
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    {award.logoUrl?.trim() && (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[12px] bg-[#ffffff] dark:bg-[#252422] border border-[#dcd8cc] dark:border-[#3a3936] p-[2px] shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={award.logoUrl.trim()}
                          alt={award.logoAlt || `${award.organization} logo`}
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
                        {award.organization}
                      </span>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#2d2d2a] dark:text-[#eae6df] leading-snug tabular-nums">
                        <span>{award.title}</span>
                      </h3>
                    </div>
                  </div>

                  <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-[#f2f0e9] dark:bg-[#2a2926] border border-[#e6e3d8] dark:border-[#3a3936] font-mono text-xs font-semibold text-[#2d2d2a] dark:text-[#eae6df] tabular-nums shrink-0">
                    {award.year}
                  </span>
                </div>

                <p className="text-sm text-[#7e8976] dark:text-[#9fa895] leading-relaxed">
                  {award.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#e6e3d8]/80 dark:border-[#3a3936]/80 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
                <span className="font-mono text-xs font-medium text-[#2d2d2a] dark:text-[#eae6df] tabular-nums">
                  {award.highlight}
                </span>
                {award.link?.trim() &&
                  (award.link.trim().startsWith("/") ? (
                    <Link
                      to={award.link.trim()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f2f0e9] dark:bg-[#2a2926] border border-[#e6e3d8] dark:border-[#3a3936] text-xs font-medium text-[#2d2d2a] dark:text-[#eae6df] hover:opacity-85 transition-opacity shrink-0"
                    >
                      <span>{award.linkLabel || "View Link"}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <a
                      href={award.link.trim()}
                      target={award.link.trim().startsWith("http") ? "_blank" : undefined}
                      rel={award.link.trim().startsWith("http") ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f2f0e9] dark:bg-[#2a2926] border border-[#e6e3d8] dark:border-[#3a3936] text-xs font-medium text-[#2d2d2a] dark:text-[#eae6df] hover:opacity-85 transition-opacity shrink-0"
                    >
                      <span>{award.linkLabel || "View Link"}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mb-14 sm:mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 pb-3 border-b border-[#e6e3d8] dark:border-[#3a3936]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.06em] text-[#7e8976] dark:text-[#9fa895]">
              {awardsData.certificationsEyebrow}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2d2d2a] dark:text-[#eae6df]">
              {awardsData.certificationsTitle}
            </h2>
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.06em] text-[#7e8976] dark:text-[#9fa895]">
            {awardsData.certificationsRightNote}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {awardsData.certifications.map((cert, index) => (
            <motion.div
              key={`${cert.title}-${index}`}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="p-5 sm:p-6 rounded-[12px] bg-[#ffffff] dark:bg-[#252422] border border-[#e6e3d8] dark:border-[#3a3936] flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-3">
                <div className="flex items-start gap-3.5 min-w-0">
                  {cert.logoUrl?.trim() && (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[12px] bg-[#ffffff] dark:bg-[#252422] border border-[#dcd8cc] dark:border-[#3a3936] p-[2px] shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={cert.logoUrl.trim()}
                        alt={cert.logoAlt || `${cert.issuer} logo`}
                        width={56}
                        height={56}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover rounded-[9px] border border-[#e6e3d8]/50 dark:border-[#3a3936]/50"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#7e8976] dark:text-[#9fa895] block">
                      {cert.issuer}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#2d2d2a] dark:text-[#eae6df] leading-snug tabular-nums">
                      <span>{cert.title}</span>
                    </h3>
                  </div>
                </div>

                <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-[#f2f0e9] dark:bg-[#2a2926] border border-[#e6e3d8] dark:border-[#3a3936] font-mono text-xs font-semibold text-[#2d2d2a] dark:text-[#eae6df] tabular-nums shrink-0">
                  {cert.date}
                </span>
              </div>

              <div className="pt-3 border-t border-[#e6e3d8]/80 dark:border-[#3a3936]/80 flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-[#7e8976] dark:text-[#9fa895] tabular-nums min-w-0 flex-1">
                  {cert.credentialNote}
                </span>
                {cert.link?.trim() &&
                  (cert.link.trim().startsWith("/") ? (
                    <Link
                      to={cert.link.trim()}
                      aria-label={`${cert.linkLabel || "Certificate"} — ${cert.title}`}
                      className="ml-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f2f0e9] dark:bg-[#2a2926] border border-[#e6e3d8] dark:border-[#3a3936] text-xs font-medium text-[#2d2d2a] dark:text-[#eae6df] hover:opacity-85 transition-opacity shrink-0"
                    >
                      <span>{cert.linkLabel || "Certificate"}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <a
                      href={cert.link.trim()}
                      target={cert.link.trim() !== "#" ? "_blank" : undefined}
                      rel={cert.link.trim() !== "#" ? "noopener noreferrer" : undefined}
                      aria-label={`${cert.linkLabel || "Certificate"} — ${cert.title}`}
                      className="ml-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f2f0e9] dark:bg-[#2a2926] border border-[#e6e3d8] dark:border-[#3a3936] text-xs font-medium text-[#2d2d2a] dark:text-[#eae6df] hover:opacity-85 transition-opacity shrink-0"
                    >
                      <span>{cert.linkLabel || "Certificate"}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 pb-3 border-b border-[#e6e3d8] dark:border-[#3a3936]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.06em] text-[#7e8976] dark:text-[#9fa895]">
              {awardsData.skillsEyebrow}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2d2d2a] dark:text-[#eae6df]">
              {awardsData.skillsTitle}
            </h2>
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.06em] text-[#7e8976] dark:text-[#9fa895]">
            {awardsData.skillsRightNote}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {awardsData.directSkills.map((skill, index) => (
            <motion.div
              key={`${skill.name}-${index}`}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              className="p-3.5 sm:p-4 rounded-[12px] bg-[#ffffff] dark:bg-[#252422] border border-[#e6e3d8] dark:border-[#3a3936] flex items-center gap-3"
            >
              {skill.logoUrl?.trim() && (
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[10px] bg-[#ffffff] dark:bg-[#252422] border border-[#dcd8cc] dark:border-[#3a3936] p-[2px] shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={skill.logoUrl.trim()}
                    alt={skill.logoAlt || `${skill.name} logo`}
                    width={44}
                    height={44}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover rounded-[8px] border border-[#e6e3d8]/50 dark:border-[#3a3936]/50"
                  />
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-[#2d2d2a] dark:text-[#eae6df] leading-snug truncate">
                  {skill.name}
                </h3>
                <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.05em] text-[#7e8976] dark:text-[#9fa895] truncate">
                  {skill.category}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
