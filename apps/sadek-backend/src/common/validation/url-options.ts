import { URL_PROTOCOLS } from '@repo/constants/url';

/**
 * `@IsUrl` options for every stored link: http(s) only, with a TLD. The
 * dashboard's `isHttpUrl` (apps/dashboard/utils/validation.ts) applies the same rule.
 */
export const URL_OPTIONS = {
    protocols: [...URL_PROTOCOLS],
    require_tld: true,
    require_protocol: true,
    require_valid_protocol: true,
};
