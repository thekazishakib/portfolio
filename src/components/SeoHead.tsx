import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import { getPageTitle } from "../lib/pageTitle";
import { getRouteJsonLd, getRouteSeo } from "../lib/seo";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function SeoHead() {
  const location = useLocation();
  const { data } = usePortfolio();

  useEffect(() => {
    const seo = getRouteSeo(location.pathname);
    const title = getPageTitle(location.pathname, location.search);
    document.title = title;

    upsertMeta("name", "description", seo.description);
    upsertMeta("name", "robots", seo.robots);
    upsertLink("canonical", seo.canonicalUrl);

    upsertMeta("property", "og:site_name", seo.siteName);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", seo.description);
    upsertMeta("property", "og:type", seo.ogType);
    upsertMeta("property", "og:url", seo.ogUrl);
    upsertMeta("property", "og:image", seo.ogImageUrl);
    upsertMeta("property", "og:image:width", String(seo.ogImageWidth));
    upsertMeta("property", "og:image:height", String(seo.ogImageHeight));

    upsertMeta("name", "twitter:card", seo.twitterCard);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", seo.description);
    upsertMeta("name", "twitter:image", seo.ogImageUrl);

    const schemas = getRouteJsonLd(location.pathname, data);
    const existingScript = document.getElementById("seo-json-ld");
    if (schemas.length === 0) {
      if (existingScript) existingScript.remove();
    } else {
      let scriptEl = existingScript as HTMLScriptElement | null;
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.id = "seo-json-ld";
        scriptEl.type = "application/ld+json";
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
    }
  }, [location.pathname, location.search, data]);

  return null;
}

