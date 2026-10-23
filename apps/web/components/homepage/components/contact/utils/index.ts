import type { UserInfoDetails } from "@repo/types/user-info";
import { getProfileLinks, type ProfileLink } from "../../../utils";

/** The ways to reach the portfolio owner that are set on their user-info. */
export function getContactDetails(info: UserInfoDetails): ProfileLink[] {
  return getProfileLinks(info);
}

export const CONTACT_FORM_DEFAULT_VALUES = {
  name: "",
  email: "",
  subject: "",
  message: "",
};
