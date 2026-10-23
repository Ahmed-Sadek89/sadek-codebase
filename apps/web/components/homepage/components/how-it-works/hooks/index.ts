"use client";

import type { PublicUserInfoResponse } from "@repo/types/user-info";
import { hasText } from "../../../utils";

/** The owner's cover photo (GET /user-info/public) for the section banner, if set. */
export function useCoverPhoto(info: PublicUserInfoResponse | undefined) {
  // `user` is optional-chained so an older backend without it still renders.
  const url = info?.user?.coverPhotoUrl;
  return hasText(url) ? url : undefined;
}
