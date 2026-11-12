import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Copy, Mail, Printer } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

export function TermsAndPrivacy({ defaultTab = "terms" }: { defaultTab?: "terms" | "privacy" }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const requestedTab = searchParams.get("tab");
  const activeTab = requestedTab === "terms" || requestedTab === "privacy" ? requestedTab : defaultTab;
  const [copyStatus, setCopyStatus] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const { data: { legalTerms } } = usePortfolio();
  const sections = activeTab === "terms" ? [
    { id: "ownership", title: legalTerms.intellectualPropertyTitle, paragraphs: legalTerms.intellectualPropertyText },
    { id: "third-parties", title: legalTerms.thirdPartyLogosTitle, paragraphs: legalTerms.thirdPartyLogosText },
    { id: "external-links", title: legalTerms.externalLinksTitle, paragraphs: legalTerms.externalLinksText },
  ] : [
    { id: "privacy-policy", title: legalTerms.privacyPolicyTitle, paragraphs: legalTerms.privacyPolicyText },
  ];

  useEffect(() => { setCopyStatus(""); }, [activeTab]);

  const copyPolicy = async () => {
    try {
      if (!contentRef.current) return;
      await navigator.clipboard.writeText(contentRef.current.innerText);
      setCopyStatus("Policy copied");
    } catch {
      setCopyStatus("Could not copy. Select the text and copy it manually.");
    }
  };

  return (
    <article className="legal-page">
      <div className="legal-toolbar">
        <Link to="/" className="legal-back"><ArrowLeft size={16} />Back to portfolio</Link>
        <div className="legal-actions">
          <button type="button" onClick={copyPolicy}><Copy size={16} />Copy policy</button>
          <button type="button" onClick={() => window.print()}><Printer size={16} />Print / PDF</button>
        </div>
      </div>
      <p className="legal-copy-status" role="status">{copyStatus}</p>

      <div className="legal-heading">
        <p className="legal-meta">Effective {legalTerms.effectiveDate}</p>
        <h1>{legalTerms.pageTitle}</h1>
        <p>{legalTerms.pageSubtitle}</p>
      </div>

      <nav className="legal-tabs" aria-label="Choose policy">
        {(["terms", "privacy"] as const).map(tab => (
          <button key={tab} type="button" aria-pressed={activeTab === tab} aria-controls="policy-content"
            onClick={() => {
              navigate(tab === "terms" ? "/terms" : "/privacy");
            }}>
            {tab === "terms" ? "Terms & conditions" : "Privacy policy"}
          </button>
        ))}
      </nav>

      <div className="legal-layout">
        <aside className="legal-contents" aria-label="On this page">
          <p>On this page</p>
          {sections.map((section, index) => (
            <a key={section.id} href={`#${section.id}`}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              {section.id === "ownership" ? "Your use of my work" : section.id === "third-parties" ? "Names & logos" : section.id === "external-links" ? "External links" : "Your privacy"}
            </a>
          ))}
          <a href="#legal-contact"><span aria-hidden="true">↗</span>Questions & permissions</a>
        </aside>

        <div id="policy-content" ref={contentRef} className="legal-document" aria-label={activeTab === "terms" ? "Terms and conditions" : "Privacy policy"}>
          <div className="legal-document-heading">
            <h2>{activeTab === "terms" ? "Terms & conditions" : "Privacy policy"}</h2>
            <p>Kazi Shakib · Effective {legalTerms.effectiveDate}</p>
          </div>
          {sections.map(section => (
            <section key={section.id} id={section.id} className="legal-section">
              <h3>{section.title}</h3>
              {section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph.text}</p>)}
            </section>
          ))}
        </div>
      </div>

      <section id="legal-contact" className="legal-contact">
        <div><h2>{legalTerms.ctaTitle}</h2><p>{legalTerms.ctaDescription}</p></div>
        {legalTerms.contactEmail?.trim() && (
          <a href={`mailto:${legalTerms.contactEmail.trim()}`}><Mail size={18} />{legalTerms.ctaButtonLabel}</a>
        )}
      </section>
    </article>
  );
}

