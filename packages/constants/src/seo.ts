/** SEO-row rules shared by the backend (entity, CreateSeoDto) and the dashboard form. URLs use URL_MAX (./url). */
export const SEO_META_TITLE_MAX = 70;
export const SEO_META_DESCRIPTION_MAX = 170;
export const SEO_OG_TITLE_MAX = 100;
export const SEO_OG_DESCRIPTION_MAX = 200;
export const SEO_OG_IMAGE_ALT_MAX = 150;
export const SEO_JOB_TITLE_MAX = 100;

/** An X/Twitter handle: an optional @, then 1–15 letters, digits or underscores. */
export const TWITTER_HANDLE_PATTERN = /^@?\w{1,15}$/;
/** The longest handle the pattern allows ("@" + 15). */
export const TWITTER_HANDLE_MAX = 16;
