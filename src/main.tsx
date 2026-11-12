import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { isKnownRoute, normalizePathname } from './lib/seo.ts';
import './index.css';

const rootElement = document.getElementById('root')!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

const currentPath = normalizePathname(window.location.pathname);
const prerenderedRoute = rootElement.dataset.route;
const canHydrate =
  rootElement.hasChildNodes() &&
  (prerenderedRoute === currentPath ||
    (prerenderedRoute === '/404' && !isKnownRoute(currentPath)));

if (canHydrate) {
  hydrateRoot(rootElement, app);
} else {
  rootElement.innerHTML = '';
  createRoot(rootElement).render(app);
}
