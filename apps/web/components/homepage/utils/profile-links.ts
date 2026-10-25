import type { UserInfoDetails } from "@repo/types/user-info";
import type { MessageKey } from "../../../i18n/types";
import type { ProfileLinkKind } from "../../ui/brand-icon/profile-link-icon";
import { hasText } from "./text";

export type { ProfileLinkKind };

export type ProfileLink = {
  kind: ProfileLinkKind;
  labelKey: MessageKey;
  href: string;
  /** The raw value: the address for `email`, the number for `phone`/`whatsapp`, the URL otherwise. */
  value: string;
};

/** Links that stay in the tab: they open the mail or phone app, not a page. */
const SAME_TAB_KINDS: ReadonlySet<ProfileLinkKind> = new Set(["email", "phone"]);

/** `target` for a profile link's anchor. */
export function linkTarget(kind: ProfileLinkKind) {
  return SAME_TAB_KINDS.has(kind) ? undefined : "_blank";
}

/** `tel:` link: the digits with a leading + kept (spaces, dashes, brackets dropped). */
const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** WhatsApp chat link: wa.me takes the digits only, with the country code. */
const whatsappHref = (phone: string) =>
  `https://wa.me/${phone.replace(/\D/g, "")}`;

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
    hasText(info.phoneNumber)
      ? {
          kind: "phone",
          labelKey: "socialPhone",
          href: telHref(info.phoneNumber),
          value: info.phoneNumber,
        }
      : null,
    hasText(info.whatsappNumber)
      ? {
          kind: "whatsapp",
          labelKey: "socialWhatsapp",
          href: whatsappHref(info.whatsappNumber),
          value: info.whatsappNumber,
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
