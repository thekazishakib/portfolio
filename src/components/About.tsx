import { motion } from "motion/react";
import { MapPinHouse as MapPin, SquareArrowOutUpRight as ExternalLink } from "lucide-react";

import { usePortfolio } from "../context/PortfolioContext";
import { DynamicIcon } from "../lib/iconMap";

export function About() {
  const { data } = usePortfolio();
  const { about } = data;

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center mb-10 sm:mb-14">
        <p className="figma-eyebrow text-[#7e8976] dark:text-[#9fa895] mb-3">
          {about.eyebrow}
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.025em] text-[#2d2d2a] dark:text-[#eae6df] mb-3 sm:mb-4">
          {about.title}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-[#7e8976] dark:text-[#9fa895] max-w-2xl mx-auto">
          {about.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 md:p-8 rounded-[12px] bg-[#ffffff] dark:bg-[#252422] border border-[#e6e3d8] dark:border-[#3a3936] space-y-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start pb-6 border-b border-[#e6e3d8] dark:border-[#3a3936]">
            {about.profileImageUrl?.trim() && (
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-[12px] overflow-hidden border border-[#dcd8cc] dark:border-[#3a3936] p-[2px] shrink-0 bg-[#ffffff] dark:bg-[#2a2926]">
                <img
                  src={about.profileImageUrl.trim()}
                  alt={`${about.fullName} — ${about.roleHeadline}`}
                  width={128}
                  height={128}
                  decoding="async"
                  className="w-full h-full object-cover rounded-[9px]"
                />
              </div>
            )}
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-[#2d2d2a] dark:text-[#eae6df]">
                {about.fullName}
              </h2>
              <p className="text-[#7e8976] dark:text-[#9fa895] font-medium text-base md:text-lg">
                {about.roleHeadline}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-[#7e8976] dark:text-[#9fa895] text-sm pt-1">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {about.location}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-[#7e8976] dark:text-[#9fa895] leading-relaxed text-sm md:text-base">
            {about.bioParagraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-[#e6e3d8] dark:border-[#3a3936]">
            {about.highlights.map((item, idx) => (
              <motion.div
                key={`${item.title}-${idx}`}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className="p-4 rounded-[10px] bg-[#f2f0e9]/70 dark:bg-[#2a2926]/70 border border-[#e6e3d8] dark:border-[#3a3936] flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-[10px] bg-[#ffffff] dark:bg-[#1c1b19] border border-[#e6e3d8] dark:border-[#3a3936] flex items-center justify-center text-[#2d2d2a] dark:text-[#eae6df] shrink-0">
                  <DynamicIcon name={item.iconName} className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2d2d2a] dark:text-[#eae6df] tabular-nums">
                    <span>{item.title}</span>
                  </h3>
                  <p className="text-xs text-[#7e8976] dark:text-[#9fa895] tabular-nums">
                    {item.subtitle}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8 rounded-[12px] bg-[#ffffff] dark:bg-[#252422] border border-[#e6e3d8] dark:border-[#3a3936] flex flex-col justify-between gap-8">
          <div className="space-y-4">
            <div className="pb-3 border-b border-[#e6e3d8] dark:border-[#3a3936]">
              <p className="font-mono text-xs uppercase tracking-[0.06em] text-[#7e8976] dark:text-[#9fa895]">
                {about.contactEyebrow}
              </p>
              <h2 className="text-xl font-bold text-[#2d2d2a] dark:text-[#eae6df]">
                {about.contactTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {about.contactChannels
                .filter((channel) => Boolean(channel.href?.trim()))
                .map((channel, i) => (
                  <a
                    key={`${channel.name}-${i}`}
                    href={channel.href.trim()}
                    target={channel.external ? "_blank" : undefined}
                    rel={channel.external ? "noopener noreferrer" : undefined}
                    className="flex items-center justify-between p-3 rounded-[10px] bg-[#f2f0e9]/70 dark:bg-[#2a2926]/70 border border-[#e6e3d8] dark:border-[#3a3936] hover:border-[#2d2d2a] dark:hover:border-[#eae6df] transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <DynamicIcon
                        name={channel.iconName}
                        className="w-4 h-4 text-[#2d2d2a] dark:text-[#eae6df] shrink-0"
                      />
                      <div className="truncate">
                        <p className="font-bold text-[#2d2d2a] dark:text-[#eae6df] text-sm">
                          {channel.name}
                        </p>
                        <p className="text-xs text-[#7e8976] dark:text-[#9fa895] truncate">
                          {channel.subtitle}
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#7e8976] dark:text-[#9fa895] shrink-0" />
                  </a>
                ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#e6e3d8] dark:border-[#3a3936] space-y-2">
            <p className="font-mono text-xs uppercase tracking-[0.06em] text-[#7e8976] dark:text-[#9fa895]">
              {about.languagesEyebrow}
            </p>
            <p className="text-sm text-[#2d2d2a] dark:text-[#eae6df] font-medium">
              {about.languagesContent}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
