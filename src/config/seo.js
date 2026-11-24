export const SITE_NAME = "ExoVault";
export const SITE_TAGLINE = "Personal finance tracking & intelligence";
export const SITE_URL =
  (import.meta.env.VITE_SITE_URL || "").replace(/\/$/, "") ||
  (typeof window !== "undefined" ? window.location.origin : "https://exovault.app");

export const DEFAULT_DESCRIPTION =
  "ExoVault is a modern expense tracker with budgets, analytics, AI-assisted logging, and secure Firebase sync—built for clarity, not spreadsheet chaos.";

export const DEFAULT_KEYWORDS =
  "expense tracker, budget app, personal finance, spending analytics, money manager, ExoVault";

/** @typedef {{ title: string; description: string; noindex?: boolean; keywords?: string }} SeoEntry */

/** @type {Record<string, SeoEntry>} */
export const ROUTE_SEO = {
  "/": {
    title: "Smart expense tracking & financial insights",
    description:
      "Track spending, set budgets, and visualize cash flow with ExoVault. Free to start—secure cloud sync, reports, and AI-assisted expense logging.",
    keywords: "expense tracker, budget planner, finance dashboard, free money app",
  },
  "/login": {
    title: "Sign in",
    description:
      "Sign in to ExoVault to access your dashboard, transactions, reports, and personalized budget alerts.",
    keywords: "ExoVault login, sign in, finance app",
  },
  "/signup": {
    title: "Create your account",
    description:
      "Create a free ExoVault account in seconds. Start tracking expenses, budgets, and financial health with encrypted Firebase storage.",
    keywords: "ExoVault signup, create account, free expense tracker",
  },
  "/expenses": {
    title: "Transactions",
    description:
      "Manage your transaction ledger—add, edit, filter, export CSV, and organize spending by category in ExoVault.",
    noindex: true,
  },
  "/reports": {
    title: "Reports & analytics",
    description:
      "Explore spending trends, category breakdowns, and weekly habits with ExoVault visual reports and money intelligence.",
    noindex: true,
  },
  "/settings": {
    title: "Settings",
    description:
      "Configure monthly budget, categories, currency, alert thresholds, theme, and data export in ExoVault settings.",
    noindex: true,
  },
};

/** Dashboard when user is logged in on `/` */
export const DASHBOARD_SEO = {
  title: "Overview",
  description:
    "Your ExoVault overview—spending summary, budget progress, insights, and cash flow charts for the selected period.",
  noindex: true,
};

/**
 * @param {string} pathname
 * @param {boolean} isAuthenticated
 * @returns {SeoEntry & { path: string }}
 */
export function resolveSeo(pathname, isAuthenticated) {
  const path = pathname === "" ? "/" : pathname;

  if (path === "/" && isAuthenticated) {
    return { ...DASHBOARD_SEO, path: "/" };
  }

  const entry = ROUTE_SEO[path] || {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
  };

  return { ...entry, path };
}
