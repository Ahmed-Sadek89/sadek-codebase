/**
 * Link rules shared by the backend (`@IsUrl` options, column lengths) and the
 * dashboard forms: an http(s) URL whose host is a domain with a TLD or an IPv4
 * address, at most URL_MAX characters.
 */
export const URL_PROTOCOLS = ["http", "https"] as const;

/** Max length of every stored URL (the varchar(255) link columns). */
export const URL_MAX = 255;
