import { getRouteSeo } from "./seo";

export function getPageTitle(pathname: string, _search = ""): string {
  return getRouteSeo(pathname).title;
}
