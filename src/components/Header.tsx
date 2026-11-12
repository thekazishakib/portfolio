import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  BriefcaseBusiness as Briefcase,
  MenuSquare as Menu,
  X,
  Trophy,
  GraduationCap,
  House as Home,
  UserRound as User,
  NotebookText as BookOpen,
  SquareCode as Code,
  FileUser as CvIcon,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "../lib/utils";
import { usePortfolio } from "../context/PortfolioContext";
import { DynamicIcon } from "../lib/iconMap";

export function Header() {
  const { data } = usePortfolio();
  const { resumeUrl, socialLinks, header } = data;
  const trimmedResumeUrl = resumeUrl?.trim() || "";
  const headerSocialLinks = socialLinks.filter(
    (item) => item.showInHeader && Boolean(item.url?.trim())
  );
  const navItems = [
    { name: header.navLabels.home, path: "/", icon: Home },
    { name: header.navLabels.about, path: "/about", icon: User },
    { name: header.navLabels.academics, path: "/academics", icon: GraduationCap },
    { name: header.navLabels.projects, path: "/projects", icon: Code },
    { name: header.navLabels.publication, path: "/publication", icon: BookOpen },
    { name: header.navLabels.experience, path: "/experience", icon: Briefcase },
    { name: header.navLabels.awards, path: "/awards", icon: Trophy },
  ];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    if (path === "/awards") {
      return location.pathname.startsWith("/awards") || location.pathname.startsWith("/skills");
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-3 sm:top-4 left-0 right-0 z-50 flex justify-center px-3 sm:px-4">
      <nav
        className={cn(
          "relative z-50 ios-glass-card flex items-center justify-between rounded-full w-full max-w-[72rem] px-3 py-2 xl:transition-[max-width,padding,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isScrolled
            ? "xl:max-w-[66rem] xl:px-5 xl:py-2"
            : "xl:max-w-[72rem] xl:px-6 xl:py-2.5"
        )}
      >
        <Link
          to="/"
          title={header.brandTitle}
          className="px-1 sm:px-1.5 py-0.5 cursor-pointer group shrink-0"
        >
          <span className="font-bold text-base sm:text-lg tracking-tighter text-[#2d2d2a] dark:text-[#eae6df] group-hover:text-[#7e8976] dark:group-hover:text-[#9fa895] transition-colors whitespace-nowrap">
            {header.brandName}
            <span className="text-[#7e8976] dark:text-[#9fa895]">.</span>
          </span>
        </Link>

        <div className="hidden xl:flex items-center gap-0.5 shrink-0 mx-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path} aria-current={active ? "page" : undefined}
                className={cn(
                  "relative px-2 lg:px-3 py-1.5 rounded-full text-[11.5px] lg:text-[13px] font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer",
                  active
                    ? "text-[#2d2d2a] dark:text-[#eae6df] font-semibold"
                    : "text-[#7e8976] dark:text-[#9fa895] hover:text-[#2d2d2a] dark:hover:text-[#eae6df] hover:bg-[#e6e3d8]/50 dark:hover:bg-[#2a2926]/60"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="bubble"
                    className="absolute inset-0 bg-[#e6e3d8]/80 dark:bg-[#2a2926] border border-[#e6e3d8] dark:border-[#3a3936] rounded-full z-0 pointer-events-none"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="hidden xl:flex items-center shrink-0 pl-2 lg:pl-3 border-l border-[#e6e3d8] dark:border-[#3a3936]">
          <div className="flex items-center gap-0.5 lg:gap-1">
            {headerSocialLinks.map((item, idx) => {
              const url = item.url.trim();
              const isExternal = url.startsWith("http");
              return (
                <a
                  key={`${item.name}-${idx}`}
                  href={url}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-transparent flex items-center justify-center text-[#7e8976] dark:text-[#9fa895] hover:bg-[#e6e3d8]/60 dark:hover:bg-[#2a2926] hover:text-[#2d2d2a] dark:hover:text-[#eae6df] transition-colors shrink-0 cursor-pointer"
                  title={item.name}
                  aria-label={item.name}
                >
                  <DynamicIcon name={item.icon} className="w-4 h-4" />
                </a>
              );
            })}
            {trimmedResumeUrl && (
              <a
                href={trimmedResumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-transparent flex items-center justify-center text-[#2d2d2a] dark:text-[#eae6df] hover:bg-[#e6e3d8]/60 dark:hover:bg-[#2a2926] hover:text-[#7e8976] dark:hover:text-[#9fa895] transition-colors shrink-0 cursor-pointer group"
                title={header.resumeTitle}
                aria-label={header.resumeAriaLabel}
              >
                <CvIcon className="w-4 h-4  transition-transform" />
              </a>
            )}
            <ThemeToggle />
          </div>
        </div>

        <div className="compact-nav-actions flex items-center gap-1 xl:hidden ml-auto">
          {trimmedResumeUrl && (
            <a
              href={trimmedResumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center text-[#2d2d2a] dark:text-[#eae6df] hover:text-[#7e8976] dark:hover:text-[#9fa895] transition-colors"
              title={header.resumeTitle}
              aria-label={header.resumeAriaLabel}
            >
              <CvIcon className="w-4 h-4" />
            </a>
          )}
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-[#2d2d2a] dark:text-[#eae6df] cursor-pointer"
            aria-label="Toggle Menu" aria-expanded={isMobileMenuOpen} aria-controls="mobile-navigation"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-[2px] xl:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              id="mobile-navigation" className="absolute top-[4.5rem] left-3 right-3 sm:left-auto sm:right-4 sm:w-80 z-50 ios-glass-card rounded-2xl p-3.5 flex flex-col gap-1 max-h-[calc(100vh-5rem)] overflow-y-auto xl:hidden shadow-lg"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {navItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.name}
                      to={item.path} aria-current={active ? "page" : undefined}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer",
                        active
                          ? "ios-glass-pill text-[#2d2d2a] dark:text-[#eae6df] font-semibold"
                          : "text-[#7e8976] dark:text-[#9fa895] hover:bg-black/5 dark:hover:bg-white/10"
                      )}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
              <div className="h-px bg-[#e6e3d8] dark:bg-[#3a3936] my-1.5" />
              <div className="flex items-center justify-around py-1">
                {headerSocialLinks.map((item, idx) => {
                  const url = item.url.trim();
                  const isExternal = url.startsWith("http");
                  return (
                    <a
                      key={`${item.name}-mobile-${idx}`}
                      href={url}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="p-2 rounded-full text-[#7e8976] dark:text-[#9fa895] hover:text-[#2d2d2a] dark:hover:text-[#eae6df] transition-colors"
                      aria-label={item.name}
                      title={item.name}
                    >
                      <DynamicIcon name={item.icon} className="w-4 h-4" />
                    </a>
                  );
                })}
                {trimmedResumeUrl && (
                  <a
                    href={trimmedResumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full text-[#2d2d2a] dark:text-[#eae6df] hover:text-[#7e8976] dark:hover:text-[#9fa895] transition-colors"
                    aria-label={header.resumeAriaLabel}
                    title={header.resumeTitle}
                  >
                    <CvIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
