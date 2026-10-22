import type { UserInfoDetails } from "@repo/types/user-info";
import { Briefcase, Code2, Mail } from "@repo/ui/icons";
import type { LucideIcon } from "@repo/ui/icons";
import { hasText } from "../../utils";

export type SocialLink = { label: string; href: string; Icon: LucideIcon };

/** The profile links that are set, in display order. */
export function getSocialLinks(info: UserInfoDetails): SocialLink[] {
  const links: (SocialLink | null)[] = [
    hasText(info.github)
      ? { label: "GitHub", href: info.github, Icon: Code2 }
      : null,
    hasText(info.linkedin)
      ? { label: "LinkedIn", href: info.linkedin, Icon: Briefcase }
      : null,
    hasText(info.gmail)
      ? { label: "Email", href: `mailto:${info.gmail}`, Icon: Mail }
      : null,
  ];
  return links.filter((link) => link !== null);
}
