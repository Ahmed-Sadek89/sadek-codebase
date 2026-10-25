import type { UserInfoDetails } from "@repo/types/user-info";
import {
  Briefcase,
  Building2,
  CodeXml,
  Cpu,
  FileText,
  FolderGit2,
  Link2,
  Mail,
  MessageCircle,
  Phone,
  type LucideIcon,
} from "@repo/ui/icons";
import type { MessageKey } from "../../../i18n/types";
import type { UserInfoFormInput } from "../schema";

type CountField =
  "yearsOfExp" | "companies" | "projectNumbers" | "techMastering";
type LinkField =
  | "phoneNumber"
  | "whatsappNumber"
  | "gmail"
  | "linkedin"
  | "github"
  | "cv";

/** The four numbers shown as stat cards, in display order. */
export const USER_INFO_STATS: {
  field: CountField;
  labelKey: MessageKey;
  icon: LucideIcon;
}[] = [
  { field: "yearsOfExp", labelKey: "userInfoYearsOfExp", icon: Briefcase },
  { field: "companies", labelKey: "userInfoCompanies", icon: Building2 },
  {
    field: "projectNumbers",
    labelKey: "userInfoProjectNumbers",
    icon: FolderGit2,
  },
  { field: "techMastering", labelKey: "userInfoTechMastering", icon: Cpu },
];

/** The contact rows; `href` turns a stored value into a link target. */
/** `tel:` link: the digits with a leading + kept (spaces, dashes, brackets dropped). */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** WhatsApp chat link: wa.me takes the digits only, with the country code. */
export const whatsappHref = (phone: string) =>
  `https://wa.me/${phone.replace(/\D/g, "")}`;

export const USER_INFO_LINKS: {
  field: LinkField;
  labelKey: MessageKey;
  icon: LucideIcon;
  href: (value: string) => string;
}[] = [
  {
    field: "phoneNumber",
    labelKey: "userInfoPhoneLabel",
    icon: Phone,
    href: telHref,
  },
  {
    field: "whatsappNumber",
    labelKey: "userInfoWhatsappLabel",
    icon: MessageCircle,
    href: whatsappHref,
  },
  {
    field: "gmail",
    labelKey: "userInfoGmailLabel",
    icon: Mail,
    href: (value) => `mailto:${value}`,
  },
  {
    field: "linkedin",
    labelKey: "userInfoLinkedinLabel",
    icon: Link2,
    href: (value) => value,
  },
  {
    field: "github",
    labelKey: "userInfoGithubLabel",
    icon: CodeXml,
    href: (value) => value,
  },
  {
    field: "cv",
    labelKey: "userInfoCvLabel",
    icon: FileText,
    href: (value) => value,
  },
];

/** Hosts a CV link may point to: Google Drive files and Google Docs. */
const GOOGLE_DRIVE_HOSTS = ["drive.google.com", "docs.google.com"];

/** True for an https Google Drive or Google Docs URL. */
export function isGoogleDriveUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" && GOOGLE_DRIVE_HOSTS.includes(url.hostname)
    );
  } catch {
    return false;
  }
}

export const USER_INFO_FORM_DEFAULT_VALUES = {
  headTitle_en: "",
  headTitle_ar: "",
  shortDescription_en: "",
  shortDescription_ar: "",
  description_en: "",
  description_ar: "",
  yearsOfExp: 0,
  companies: 0,
  projectNumbers: 0,
  techMastering: 0,
  phoneNumber: "",
  whatsappNumber: "",
  gmail: "",
  linkedin: "",
  github: "",
  cvSource: "upload",
  cv: "",
  cvLink: "",
} satisfies UserInfoFormInput;

/**
 * The CV fields for a saved value: a Drive link opens in link mode, anything
 * else (an uploaded file's URL, or none) in upload mode.
 */
export function toCvFields(
  savedCv: string | null | undefined,
): Pick<UserInfoFormInput, "cvSource" | "cv" | "cvLink"> {
  return savedCv && isGoogleDriveUrl(savedCv)
    ? { cvSource: "link", cv: "", cvLink: savedCv }
    : { cvSource: "upload", cv: savedCv ?? "", cvLink: "" };
}

/** Form values for the saved row, or the blank defaults when creating. */
export function toUserInfoFormInput(
  userInfo?: UserInfoDetails | null,
): UserInfoFormInput {
  if (!userInfo) return USER_INFO_FORM_DEFAULT_VALUES;
  return {
    headTitle_en: userInfo.headTitle_en,
    headTitle_ar: userInfo.headTitle_ar ?? "",
    shortDescription_en: userInfo.shortDescription_en,
    shortDescription_ar: userInfo.shortDescription_ar ?? "",
    description_en: userInfo.description_en,
    description_ar: userInfo.description_ar ?? "",
    yearsOfExp: userInfo.yearsOfExp,
    companies: userInfo.companies,
    projectNumbers: userInfo.projectNumbers,
    techMastering: userInfo.techMastering,
    phoneNumber: userInfo.phoneNumber,
    whatsappNumber: userInfo.whatsappNumber,
    gmail: userInfo.gmail ?? "",
    linkedin: userInfo.linkedin ?? "",
    github: userInfo.github ?? "",
    ...toCvFields(userInfo.cv),
  };
}

/** True for the backend's 404, which GET /user-info/me sends before the row exists. */
export function isNotFoundError(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("response" in error)) {
    return false;
  }
  const { response } = error as { response?: { status?: number } };
  return response?.status === 404;
}
