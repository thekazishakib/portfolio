import { motion } from "motion/react";
import React from "react";
import { MapPinHouse as MapPin } from "lucide-react";

import { usePortfolio, EducationItem } from "../context/PortfolioContext";

const EducationCard: React.FC<{ edu: EducationItem }> = ({ edu }) => {
  return (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-4 sm:p-6 rounded-[12px] bg-[#ffffff] dark:bg-[#252422] border border-[#e6e3d8] dark:border-[#3a3936] flex gap-3.5 sm:gap-4"
    >
      {edu.logoUrl?.trim() && (
        <div className="mt-0.5 shrink-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[12px] bg-[#ffffff] dark:bg-[#252422] border border-[#dcd8cc] dark:border-[#3a3936] p-[2px] shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex items-center justify-center overflow-hidden">
            <img
              src={edu.logoUrl.trim()}
              alt={edu.logoAlt || `${edu.institution} logo`}
              width={56}
              height={56}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover rounded-[9px] border border-[#e6e3d8]/50 dark:border-[#3a3936]/50"
            />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.06em] text-[#7e8976] dark:text-[#9fa895] tabular-nums">
            {edu.year}
          </span>
          <span className="flex items-center gap-1 text-xs text-[#7e8976] dark:text-[#9fa895]">
            <MapPin className="w-3 h-3 shrink-0" />
            {edu.location}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-[#2d2d2a] dark:text-[#eae6df] leading-snug">
          {edu.institution}
        </h3>

        <div>
          <p className="text-sm font-medium text-[#2d2d2a] dark:text-[#eae6df]">
            {edu.degree}
          </p>
          {edu.details && (
            <p className="text-xs text-[#7e8976] dark:text-[#9fa895] mt-1 leading-relaxed">
              {edu.details}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-[#e6e3d8]/80 dark:border-[#3a3936]/80">
          <span className="font-mono text-xs font-semibold text-[#2d2d2a] dark:text-[#eae6df] tabular-nums">
            {edu.result}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export function AcademicPortfolio() {
  const { data } = usePortfolio();
  const { academics } = data;

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center mb-10 sm:mb-14">
        <p className="figma-eyebrow text-[#7e8976] dark:text-[#9fa895] mb-3">
          {academics.eyebrow}
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.025em] text-[#2d2d2a] dark:text-[#eae6df] mb-3 sm:mb-4">
          {academics.title}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-[#7e8976] dark:text-[#9fa895] max-w-2xl mx-auto">
          {academics.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-12 sm:mb-14">
        {academics.benchmarkCards.map((card, idx) => (
          <motion.div
            key={`${card.label}-${idx}`}
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.06 }}
            className={`p-5 sm:p-6 rounded-[12px] bg-[#ffffff] dark:bg-[#252422] border border-[#e6e3d8] dark:border-[#3a3936] flex items-start gap-4 ${
              idx === 2 ? "sm:col-span-2 lg:col-span-1" : ""
            }`}
          >
            {card.logoUrl?.trim() && (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[12px] bg-[#ffffff] dark:bg-[#252422] border border-[#dcd8cc] dark:border-[#3a3936] p-[2px] shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src={card.logoUrl.trim()}
                  alt={card.logoAlt || `${card.label} logo`}
                  width={56}
                  height={56}
                  decoding="async"
                  className="w-full h-full object-cover rounded-[9px] border border-[#e6e3d8]/50 dark:border-[#3a3936]/50"
                />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-mono text-xs uppercase tracking-[0.06em] text-[#7e8976] dark:text-[#9fa895] mb-1">
                {card.label}
              </p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2d2d2a] dark:text-[#eae6df] tabular-nums">
                <span>{card.value}</span>
              </p>
              <p className="text-xs text-[#7e8976] dark:text-[#9fa895] mt-1">
                {card.note}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 pb-3 border-b border-[#e6e3d8] dark:border-[#3a3936]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.06em] text-[#7e8976] dark:text-[#9fa895]">
              {academics.historyEyebrow}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2d2d2a] dark:text-[#eae6df]">
              {academics.historyTitle}
            </h2>
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.06em] text-[#7e8976] dark:text-[#9fa895]">
            {academics.historyRange}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {academics.educationHistory.map((edu, index) => (
            <EducationCard key={`${edu.institution}-${index}`} edu={edu} />
          ))}
        </div>
      </div>
    </section>
  );
}
