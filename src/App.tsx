import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { CurrentStatus } from "./components/CurrentStatus";
import { About } from "./components/About";
import { AcademicPortfolio } from "./components/AcademicPortfolio";
import { Projects } from "./components/Projects";
import { Experience } from "./components/Experience";
import { Awards } from "./components/Awards";
import { Blog } from "./components/Blog";
import { Footer } from "./components/Footer";
import { TermsAndPrivacy } from "./components/TermsAndPrivacy";
import { NotFound } from "./components/NotFound";
import { SeoHead } from "./components/SeoHead";
import { PortfolioProvider } from "./context/PortfolioContext";

const HomePage = () => (
  <>
    <Hero />
    <CurrentStatus />
  </>
);

const TermsAndPrivacyPage = ({ defaultTab }: { defaultTab?: "terms" | "privacy" }) => (
  <div className="pt-8">
    <TermsAndPrivacy defaultTab={defaultTab} />
  </div>
);

const AboutPage = () => (
  <div className="pt-8">
    <About />
  </div>
);

const AcademicsPage = () => (
  <div className="pt-8">
    <AcademicPortfolio />
  </div>
);

const ProjectsPage = () => (
  <div className="pt-8">
    <Projects />
  </div>
);

const ArticlesPage = () => (
  <div className="pt-8">
    <Blog />
  </div>
);

const ExperiencePage = () => (
  <div className="pt-8">
    <Experience />
  </div>
);

const AwardsSkillsPage = () => (
  <div className="pt-8">
    <Awards />
  </div>
);

const NotFoundPage = () => (
  <div className="pt-8">
    <NotFound />
  </div>
);

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname, location.hash]);

  return (
    <PortfolioProvider>
      <SeoHead />
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans flex flex-col">
        <Header />
        <main id="main-content" tabIndex={-1} className="flex-grow">
          <motion.div
            key={location.pathname}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/academics" element={<AcademicsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/publication" element={<ArticlesPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/experience" element={<ExperiencePage />} />
              <Route path="/awards" element={<AwardsSkillsPage />} />
              <Route path="/skills" element={<AwardsSkillsPage />} />
              <Route path="/terms-and-privacy" element={<TermsAndPrivacyPage />} />
              <Route path="/terms" element={<TermsAndPrivacyPage defaultTab="terms" />} />
              <Route path="/privacy" element={<TermsAndPrivacyPage defaultTab="privacy" />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </motion.div>
        </main>
        <Footer />
      </div>
    </PortfolioProvider>
  );
}
