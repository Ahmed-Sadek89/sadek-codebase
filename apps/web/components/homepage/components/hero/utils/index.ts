import type { UserInfoDetails } from "@repo/types/user-info";
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
export function getSocialLinks(info: UserInfoDetails): SocialLink[] {
  const links: (SocialLink | null)[] = [
    hasText(info.github)
      ? { labelKey: "socialGithub", href: info.github, Icon: Code2 }
      : null,
    hasText(info.linkedin)
      ? { labelKey: "socialLinkedin", href: info.linkedin, Icon: Briefcase }
      : null,
    hasText(info.gmail)
      ? { labelKey: "socialEmail", href: `mailto:${info.gmail}`, Icon: Mail }
      : null,
  ];
  return links.filter((link) => link !== null);
}
