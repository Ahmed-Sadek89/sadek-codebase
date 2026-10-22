import type { UserInfoDetails } from "@repo/types/user-info";
import {
  BriefcaseBusiness,
  CalendarClock,
  Layers,
  Rocket,
} from "@repo/ui/icons";
import type { LucideIcon } from "@repo/ui/icons";
import type { MessageKey } from "../../../../../i18n/types";

export type Stat = { value: string; labelKey: MessageKey; Icon: LucideIcon };

/** The four counters stored on the user-info row. */
export function getStats(info: UserInfoDetails): Stat[] {
  return [
    {
      value: `${info.yearsOfExp}+`,
      labelKey: "aboutStatYears",
      Icon: CalendarClock,
    },
    {
      value: `${info.projectNumbers}+`,
      labelKey: "aboutStatProjects",
      Icon: Rocket,
    },
    {
      value: String(info.companies),
      labelKey: "aboutStatCompanies",
      Icon: BriefcaseBusiness,
    },
    {
      value: String(info.techMastering),
      labelKey: "aboutStatTech",
      Icon: Layers,
    },
  ];
}

/** Descriptions longer than this start collapsed behind "Read more". */
export const COLLAPSE_AFTER_CHARS = 320;
