import type { UserInfoDetails } from "@repo/types/user-info";
import { Briefcase, Code2, FileText, Mail } from "@repo/ui/icons";
import type { LucideIcon } from "@repo/ui/icons";
import type { MessageKey } from "../../../../../i18n/types";
import { hasText } from "../../../utils";

/** Shown as `text` as-is (an email address) or as the translated `labelKey`. */
export type ContactDetail = { href: string; Icon: LucideIcon } & (
  { text: string } | { labelKey: MessageKey }
);

/** The ways to reach the portfolio owner that are set on their user-info. */
export function getContactDetails(info: UserInfoDetails): ContactDetail[] {
  const details: (ContactDetail | null)[] = [
    hasText(info.gmail)
      ? { text: info.gmail, href: `mailto:${info.gmail}`, Icon: Mail }
      : null,
    hasText(info.linkedin)
      ? { labelKey: "socialLinkedin", href: info.linkedin, Icon: Briefcase }
      : null,
    hasText(info.github)
      ? { labelKey: "socialGithub", href: info.github, Icon: Code2 }
      : null,
    hasText(info.cv)
      ? { labelKey: "socialResume", href: info.cv, Icon: FileText }
      : null,
  ];
  return details.filter((detail) => detail !== null);
}
