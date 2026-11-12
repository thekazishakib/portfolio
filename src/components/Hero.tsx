import { MoveUpRight as ArrowUpRight, FileUser as FileText, ArrowUpLeft } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

export function Hero() {
  const { data } = usePortfolio();
  const { hero, resumeUrl } = data;

  return (
    <section className="original-hero relative min-h-screen w-full overflow-hidden flex flex-col justify-center items-center pt-24 sm:pt-28 pb-14 sm:pb-16 px-4 sm:px-6 select-none bg-[#f2f0e9] dark:bg-[#1c1b19]">
      <div
        className="absolute inset-0 pointer-events-none opacity-45 dark:opacity-15"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0px, transparent 35px, rgba(45, 45, 42, 0.06) 35px, rgba(45, 45, 42, 0.06) 36px)"
        }}
      />

      <div className="relative z-10 max-w-5xl w-full mx-auto flex flex-col items-center text-center">
        <div className="w-full max-w-2xl flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4 px-1 sm:px-2">
          <div className="order-1 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#ffffff] dark:bg-[#252422] text-[#2d2d2a] dark:text-[#eae6df] border border-[#e6e3d8] dark:border-[#3a3936] font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-[0.06em] whitespace-nowrap">
            {hero.leftPill}
          </div>

          <div className="order-3 sm:order-2 w-full sm:w-auto flex flex-col items-center mt-1 sm:mt-0">
            <span className="font-hand text-2xl sm:text-3xl text-[#2d2d2a] dark:text-[#eae6df] tracking-wide">
              {hero.handwrittenIntro}
            </span>
            <svg
              viewBox="0 0 80 10"
              className="w-16 h-2.5 text-[#7e8976] dark:text-[#9fa895] -mt-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M 4 6 Q 40 2, 76 5" />
              <path d="M 12 8 Q 40 5, 68 7" />
            </svg>
          </div>

          <div className="order-2 sm:order-3 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#ffffff] dark:bg-[#252422] text-[#2d2d2a] dark:text-[#eae6df] border border-[#e6e3d8] dark:border-[#3a3936] font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-[0.06em] whitespace-nowrap">
            {hero.rightPill}
          </div>
        </div>

        <div className="relative w-full max-w-3xl flex flex-col items-center my-2">
          <div className="relative w-full sm:w-auto max-w-[22rem] sm:max-w-none bg-[#ffffff] dark:bg-[#252422] border border-[#e6e3d8] dark:border-[#3a3936] rounded-[12px] px-6 sm:px-14 md:px-16 py-6 sm:py-9 md:py-10 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.08)]">
            <svg
              viewBox="0 0 500 160"
              preserveAspectRatio="none"
              className="absolute inset-1.5 w-[calc(100%-12px)] h-[calc(100%-12px)] pointer-events-none text-[#7e8976] dark:text-[#9fa895]"
            >
              <path
                d="M 8 10 L 492 5 L 495 152 L 10 155 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>

            <h1 className="hero-name font-pixel text-[2.65rem] sm:text-7xl md:text-8xl font-bold tracking-tight text-[#2d2d2a] dark:text-[#eae6df] leading-none">
              {hero.mainName}
            </h1>
          </div>

          <div className="w-full max-w-[22rem] sm:max-w-2xl lg:max-w-3xl flex flex-wrap lg:flex-nowrap items-center justify-between gap-y-3 gap-x-2 mt-3 sm:mt-4 px-1 sm:px-4">
            <div className="order-1 flex items-center gap-1 sm:gap-1.5 -mt-1">
              <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-[12px] bg-[#ffffff] dark:bg-[#252422] text-[#2d2d2a] dark:text-[#eae6df] border border-[#e6e3d8] dark:border-[#3a3936] font-hand text-lg sm:text-2xl font-bold -rotate-2 whitespace-nowrap">
                {hero.leftStickyNote}
              </div>
              <ArrowUpRight aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6 text-[#7e8976] dark:text-[#9fa895] shrink-0 -mt-4 sm:-mt-5" />
            </div>

            <div className="order-3 lg:order-2 w-full lg:w-auto flex justify-center">
              <div className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#ffffff] dark:bg-[#252422] border border-[#e6e3d8] dark:border-[#3a3936] flex items-center justify-center gap-2 text-[10px] sm:text-xs font-mono font-medium uppercase tracking-[0.06em] text-[#7e8976] dark:text-[#9fa895] text-center">
                <span>{hero.centerStatusBadge}</span>
              </div>
            </div>

            <div className="order-2 lg:order-3 flex items-center gap-1 sm:gap-1.5 -mt-1">
              <ArrowUpLeft aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6 text-[#7e8976] dark:text-[#9fa895] shrink-0 -mt-4 sm:-mt-5" />
              <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-[12px] bg-[#ffffff] dark:bg-[#252422] text-[#2d2d2a] dark:text-[#eae6df] border border-[#e6e3d8] dark:border-[#3a3936] font-hand text-lg sm:text-2xl font-bold rotate-2 whitespace-nowrap">
                {hero.rightStickyNote}
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-4xl mt-6 sm:mt-10 flex items-center justify-center px-2 sm:px-4">
          <h2 className="hero-tagline text-[1.75rem] sm:text-4xl md:text-5xl lg:text-[56px] font-normal text-[#2d2d2a] dark:text-[#eae6df] tracking-[-0.03em] leading-[1.15] sm:leading-[1.08] max-w-2xl">
            <span className="inline-flex items-center flex-wrap justify-center gap-2 sm:gap-3">
              <span>{hero.headlineLine1}</span>
            </span>
            <br />
            <span className="inline-flex items-center flex-wrap justify-center gap-2 sm:gap-3 mt-1.5">
              <span>{hero.headlineLine2}</span>
            </span>
          </h2>
        </div>

        <div className="hero-actions mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-3.5 w-full sm:w-auto px-2">
          <button
            type="button"
            onClick={() => {
              const target = document.getElementById("current-status");
              if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
            className="group inline-flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-full bg-[#2d2d2a] hover:bg-[#7e8976] dark:bg-[#252422] dark:hover:bg-[#eae6df] text-[#ffffff] hover:text-[#ffffff] dark:text-[#eae6df] dark:hover:text-[#1c1b19] border border-[#2d2d2a] hover:border-[#7e8976] dark:border-[#3a3936] dark:hover:border-[#eae6df] font-sans text-sm sm:text-base font-medium  transition-colors duration-300 cursor-pointer"
          >
            <span className="w-6 h-6 rounded-full bg-[#7e8976] group-hover:bg-[#2d2d2a] dark:bg-[#2a2926] dark:group-hover:bg-[#1c1b19] text-[#ffffff] dark:text-[#eae6df] dark:group-hover:text-[#eae6df] flex items-center justify-center transition-colors duration-300">
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
            <span>{hero.primaryCtaLabel}</span>
          </button>

          {resumeUrl?.trim() && (
            <a
              href={resumeUrl.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-full bg-[#ffffff] dark:bg-[#252422] text-[#2d2d2a] dark:text-[#eae6df] border border-[#e6e3d8] dark:border-[#3a3936] hover:border-[#2d2d2a] dark:hover:border-[#eae6df] font-sans text-sm sm:text-base font-medium  transition-colors"
            >
              <span className="w-6 h-6 rounded-full bg-[#f2f0e9] dark:bg-[#2a2926] text-[#2d2d2a] dark:text-[#eae6df] border border-[#e6e3d8] dark:border-[#3a3936] flex items-center justify-center">
                <FileText className="w-3.5 h-3.5" />
              </span>
              <span>{hero.secondaryCtaLabel}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
