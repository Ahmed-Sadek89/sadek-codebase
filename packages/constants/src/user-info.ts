/** User-info rules shared by the backend (entity, CreateUserInfoDto) and the dashboard form. Links use URL_MAX (./url). */
export const USER_INFO_HEAD_TITLE_MAX = 100;
export const USER_INFO_SHORT_DESCRIPTION_MAX = 255;
/** Lowest allowed value of the four counters (yearsOfExp, companies, ...). */
export const USER_INFO_COUNT_MIN = 0;

/** Max length of `phoneNumber` and `whatsappNumber`. */
export const PHONE_MAX = 20;
/** An optional leading +, then 7–15 digits; spaces, dashes and brackets allowed between them. */
export const PHONE_PATTERN = /^\+?(?:[\s()-]*\d){7,15}[\s()-]*$/;
