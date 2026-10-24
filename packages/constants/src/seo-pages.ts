/**
 * The website (apps/web) pages that have SEO, shared by the backend (entity
 * enum, DTO validation), the dashboard (page select, filters) and the web app.
 * A const object, not a TS `enum`, so Node can load this file as is.
 * Add a value when the website gets a new page.
 */
export const SeoPageName = {
  HOME: "home",
} as const;

// Same name as the object on purpose: one import gives the values and the type, like an enum.
// eslint-disable-next-line no-redeclare
export type SeoPageName = (typeof SeoPageName)[keyof typeof SeoPageName];

/** Every page name, in declaration order. */
export const SEO_PAGE_NAMES = Object.values(SeoPageName) as [
  SeoPageName,
  ...SeoPageName[],
];

export function isSeoPageName(value: unknown): value is SeoPageName {
  return SEO_PAGE_NAMES.includes(value as SeoPageName);
}
