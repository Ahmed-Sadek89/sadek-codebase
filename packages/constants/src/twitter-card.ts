/**
 * Share card sizes for the `twitter:card` meta tag, shared by the backend
 * (entity enum, DTO validation), the dashboard (card-size select) and the web
 * app. A const object, not a TS `enum`, so Node can load this file as is.
 */
export const TwitterCard = {
  SUMMARY: "summary",
  SUMMARY_LARGE_IMAGE: "summary_large_image",
} as const;

// Same name as the object on purpose: one import gives the values and the type, like an enum.
// eslint-disable-next-line no-redeclare
export type TwitterCard = (typeof TwitterCard)[keyof typeof TwitterCard];

/** Every card size, in declaration order. */
export const TWITTER_CARDS = Object.values(TwitterCard) as [
  TwitterCard,
  ...TwitterCard[],
];

/** The card size a new SEO row gets when none is chosen. */
export const DEFAULT_TWITTER_CARD: TwitterCard = TwitterCard.SUMMARY_LARGE_IMAGE;
