import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import { PORTFOLIO_DATA } from "./data/portfolio";
import { getHomeStatusItems } from "./lib/currentStatus";
import { getPageTitle } from "./lib/pageTitle";
import {
  DEFAULT_OG_IMAGE_PATH,
  getRouteJsonLd,
  getRouteSeo,
  getSitemapRoutes,
  PUBLIC_ROUTES,
  SITE_NAME,
  SITE_URL,
  validateProductionSiteUrl,
} from "./lib/seo";

export function renderRoute(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  );
}

export {
  DEFAULT_OG_IMAGE_PATH,
  getHomeStatusItems,
  getPageTitle,
  getRouteJsonLd,
  getRouteSeo,
  getSitemapRoutes,
  PORTFOLIO_DATA,
  PUBLIC_ROUTES,
  SITE_NAME,
  SITE_URL,
  validateProductionSiteUrl,
};
