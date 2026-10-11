import type { AuthorizedRequest } from "@repo/types/auth";

/** Bearer header for routes behind the backend's JwtAuthGuard. */
export const authHeaders = ({ accessToken }: AuthorizedRequest) => ({
  Authorization: `Bearer ${accessToken}`,
});
