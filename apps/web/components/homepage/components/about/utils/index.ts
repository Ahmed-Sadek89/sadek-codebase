import type { UserInfoDetails } from "@repo/types/user-info";
import type { MessageKey } from "../../../../../i18n/types";

export type Stat = { value: string; labelKey: MessageKey };

/** The four counters stored on the user-info row. */
export function getStats(info: UserInfoDetails): Stat[] {
  return [
    { value: `${info.yearsOfExp}+`, labelKey: "aboutStatYears" },
    { value: `${info.projectNumbers}+`, labelKey: "aboutStatProjects" },
    { value: String(info.companies), labelKey: "aboutStatCompanies" },
    { value: String(info.techMastering), labelKey: "aboutStatTech" },
  ];
}
