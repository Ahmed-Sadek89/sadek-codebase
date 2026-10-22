import type { PublicUserInfoResponse } from "@repo/types/user-info";
import { getProfileLinks, type ProfileLink } from "../../../utils";

/** CV, email, LinkedIn and GitHub links; the account email stands in for a missing Gmail. */
export function getHeroLinks(info: PublicUserInfoResponse): ProfileLink[] {
  // `user` is optional-chained so an older backend without the profile
  // fields does not crash the hero.
  return getProfileLinks(info, info.user?.email);
}

/** "Ahmed Sadek" -> "AS": shown in the avatar circle when there is no photo. */
export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toLocaleUpperCase())
    .join("");
}
