import type { CurrentUser } from "@repo/types/auth";
import {
  AtSign,
  CalendarPlus,
  Fingerprint,
  ImageIcon,
  LogIn,
  LogOut,
  Mail,
  UserRound,
  type LucideIcon,
} from "@repo/ui/icons";
import type { MessageKey } from "../../../i18n/types";
import type { ProfileFormInput } from "../schema";

type DateField = "createdAt" | "lastLoginAt" | "lastLogoutAt";
type DetailField = "username" | "email" | "id" | "avatarUrl" | "coverPhotoUrl";

/** The account dates in the activity timeline, in display order. */
export const PROFILE_DATES: {
  field: DateField;
  labelKey: MessageKey;
  icon: LucideIcon;
}[] = [
  { field: "createdAt", labelKey: "profileCreatedAt", icon: CalendarPlus },
  { field: "lastLoginAt", labelKey: "profileLastLoginAt", icon: LogIn },
  { field: "lastLogoutAt", labelKey: "profileLastLogoutAt", icon: LogOut },
];

/**
 * The rows of the account details card. `kind` picks the rendering: text in
 * its own direction, left-to-right text (emails, ids), or a set/not-set badge.
 */
export const PROFILE_DETAILS: {
  field: DetailField;
  labelKey: MessageKey;
  icon: LucideIcon;
  kind: "text" | "ltr" | "image";
}[] = [
  {
    field: "username",
    labelKey: "profileUsernameLabel",
    icon: AtSign,
    kind: "text",
  },
  { field: "email", labelKey: "profileEmailLabel", icon: Mail, kind: "ltr" },
  { field: "id", labelKey: "profileUserId", icon: Fingerprint, kind: "ltr" },
  {
    field: "avatarUrl",
    labelKey: "profileAvatarLabel",
    icon: UserRound,
    kind: "image",
  },
  {
    field: "coverPhotoUrl",
    labelKey: "profileCoverLabel",
    icon: ImageIcon,
    kind: "image",
  },
];

/** Up to two initials, e.g. "ahmed sadek" → "AS". */
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

/** The saved user as form values; a missing image is "". */
export const toProfileFormInput = (user: CurrentUser): ProfileFormInput => ({
  username: user.username,
  email: user.email,
  avatarUrl: user.avatarUrl ?? "",
  coverPhotoUrl: user.coverPhotoUrl ?? "",
});
