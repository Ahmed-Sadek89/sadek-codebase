import type { SVGProps } from "react";
import {
  CvIcon,
  GithubIcon,
  GmailIcon,
  LinkedinIcon,
  PhoneIcon,
  WhatsappIcon,
  type BrandIcon,
} from ".";
export type ProfileLinkKind =
  | "cv"
  | "email"
  | "phone"
  | "whatsapp"
  | "linkedin"
  | "github";

/** Each profile link's icon and the brand colour it takes on hover/focus. */
export const profileLinkStyles: Record<
  ProfileLinkKind,
  { Icon: BrandIcon; hover: string }
> = {
  cv: { Icon: CvIcon, hover: "hover:text-primary focus-visible:text-primary" },
  email: {
    Icon: GmailIcon,
    hover: "hover:text-[#EA4335] focus-visible:text-[#EA4335]",
  },
  phone: {
    Icon: PhoneIcon,
    hover: "hover:text-primary focus-visible:text-primary",
  },
  whatsapp: {
    Icon: WhatsappIcon,
    hover: "hover:text-[#25D366] focus-visible:text-[#25D366]",
  },
  linkedin: {
    Icon: LinkedinIcon,
    hover: "hover:text-[#0A66C2] focus-visible:text-[#0A66C2]",
  },
  // GitHub's mark is black/white: follow the theme's foreground.
  github: {
    Icon: GithubIcon,
    hover: "hover:text-foreground focus-visible:text-foreground",
  },
};

export function ProfileLinkIcon({
  kind,
  ...props
}: { kind: ProfileLinkKind } & SVGProps<SVGSVGElement>) {
  const { Icon } = profileLinkStyles[kind];
  return <Icon {...props} />;
}
