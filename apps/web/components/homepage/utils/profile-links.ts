import type { UserInfoDetails } from "@repo/types/user-info";
import type { MessageKey } from "../../../i18n/types";
import type { ProfileLinkKind } from "../../ui/brand-icon/profile-link-icon";
import { hasText } from "./text";

export type { ProfileLinkKind };

export type ProfileLink = {
  kind: ProfileLinkKind;
  labelKey: MessageKey;
  href: string;
  /** The raw value: the address for `email`, the URL otherwise. */
  value: string;
};

/**
 * The profile links set on user-info, in display order. `fallbackEmail`
 * (the account email) is used when user-info has no Gmail.
 */
export function getProfileLinks(
  info: UserInfoDetails,
  fallbackEmail?: string,
): ProfileLink[] {
  const email = hasText(info.gmail) ? info.gmail : fallbackEmail;
  const links: (ProfileLink | null)[] = [
    hasText(info.cv)
      ? { kind: "cv", labelKey: "socialResume", href: info.cv, value: info.cv }
      : null,
    hasText(email)
      ? {
          kind: "email",
          labelKey: "socialEmail",
          href: `mailto:${email}`,
          value: email,
        }
      : null,
    hasText(info.linkedin)
      ? {
          kind: "linkedin",
          labelKey: "socialLinkedin",
          href: info.linkedin,
          value: info.linkedin,
        }
      : null,
    hasText(info.github)
      ? {
          kind: "github",
          labelKey: "socialGithub",
          href: info.github,
          value: info.github,
        }
      : null,
  ];
  return links.filter((link) => link !== null);
}
