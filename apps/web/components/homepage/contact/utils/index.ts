import type { UserInfoDetails } from "@repo/types/user-info";
import { Briefcase, Code2, FileText, Mail } from "@repo/ui/icons";
import type { LucideIcon } from "@repo/ui/icons";
import { hasText } from "../../utils";

export type ContactDetail = {
  label: string;
  href: string;
  Icon: LucideIcon;
};

/** The ways to reach the portfolio owner that are set on their user-info. */
export function getContactDetails(info: UserInfoDetails): ContactDetail[] {
  const details: (ContactDetail | null)[] = [
    hasText(info.gmail)
      ? { label: info.gmail, href: `mailto:${info.gmail}`, Icon: Mail }
      : null,
    hasText(info.linkedin)
      ? { label: "LinkedIn", href: info.linkedin, Icon: Briefcase }
      : null,
    hasText(info.github)
      ? { label: "GitHub", href: info.github, Icon: Code2 }
      : null,
    hasText(info.cv)
      ? { label: "Resume", href: info.cv, Icon: FileText }
      : null,
  ];
  return details.filter((detail) => detail !== null);
}
