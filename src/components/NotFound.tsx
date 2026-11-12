import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

export function NotFound() {
  const {
    data: { notFound },
  } = usePortfolio();

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-3xl mx-auto text-center">
      <div className="p-8 sm:p-12 rounded-[16px] bg-[#ffffff] dark:bg-[#252422] border border-[#e6e3d8] dark:border-[#3a3936] space-y-5">
        <p className="figma-eyebrow text-[#7e8976] dark:text-[#9fa895]">
          {notFound.eyebrow}
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.025em] text-[#2d2d2a] dark:text-[#eae6df]">
          {notFound.title}
        </h1>
        <p className="text-sm sm:text-base text-[#7e8976] dark:text-[#9fa895] max-w-md mx-auto leading-relaxed">
          {notFound.description}
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2d2d2a] hover:bg-[#7e8976] dark:bg-[#eae6df] dark:hover:bg-[#9fa895] text-[#ffffff] dark:text-[#1c1b19] font-sans text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{notFound.backLabel}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

