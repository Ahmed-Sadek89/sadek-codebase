import type { PublicUserInfoResponse } from "@repo/types/user-info";
import { Briefcase, Code2, Mail } from "@repo/ui/icons";
import type { LucideIcon } from "@repo/ui/icons";
import type { MessageKey } from "../../../../../i18n/types";
import { hasText } from "../../../utils";

export type SocialLink = {
  labelKey: MessageKey;
  href: string;
  Icon: LucideIcon;
};

/** The profile links that are set, in display order. */
export function getSocialLinks(info: PublicUserInfoResponse): SocialLink[] {
  // The user-info Gmail first, else the account email. `user` is optional-chained
  // so an older backend without the profile fields does not crash the hero.
  const email = hasText(info.gmail) ? info.gmail : info.user?.email;
  const links: (SocialLink | null)[] = [
    hasText(info.github)
      ? { labelKey: "socialGithub", href: info.github, Icon: Code2 }
      : null,
    hasText(info.linkedin)
      ? { labelKey: "socialLinkedin", href: info.linkedin, Icon: Briefcase }
      : null,
    hasText(email)
      ? { labelKey: "socialEmail", href: `mailto:${email}`, Icon: Mail }
      : null,
  ];
  return links.filter((link) => link !== null);
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
