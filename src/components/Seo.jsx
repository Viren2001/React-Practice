import { useEffect } from "react";
import {
  SITE_NAME,
  SITE_URL,
  SITE_TAGLINE,
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
} from "../config/seo";

function upsertMeta(attr, key, content) {
  if (content == null || content === "") return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Updates document title and standard SEO / Open Graph / Twitter tags.
 */
export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  noindex = false,
  keywords = DEFAULT_KEYWORDS,
}) {
  useEffect(() => {
    const pageTitle =
      !title || title === SITE_NAME ? SITE_NAME : `${title} · ${SITE_NAME}`;
    const canonical = `${SITE_URL}${path === "/" ? "" : path}`;
    const robots = noindex ? "noindex, nofollow" : "index, follow";

    document.title = pageTitle;
    document.documentElement.lang = "en";

    upsertMeta("name", "description", description);
    upsertMeta("name", "keywords", keywords);
    upsertMeta("name", "author", SITE_NAME);
    upsertMeta("name", "robots", robots);
    upsertMeta("name", "theme-color", "#d946ef");

    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:title", pageTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:locale", "en_US");

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", pageTitle);
    upsertMeta("name", "twitter:description", description);

    upsertLink("canonical", canonical);

    upsertMeta("property", "og:image", `${SITE_URL}/favicon.svg`);
    upsertMeta("name", "twitter:image", `${SITE_URL}/favicon.svg`);

    upsertMeta("name", "application-name", SITE_NAME);
    upsertMeta("name", "apple-mobile-web-app-title", SITE_NAME);
  }, [title, description, path, noindex, keywords]);

  return null;
}

export { SITE_TAGLINE };
