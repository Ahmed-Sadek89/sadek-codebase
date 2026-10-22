import type { UserInfoDetails } from "@repo/types/user-info";

export type Stat = { value: string; label: string };

/** The four counters stored on the user-info row. */
export function getStats(info: UserInfoDetails): Stat[] {
  return [
    { value: `${info.yearsOfExp}+`, label: "Years Experience" },
    { value: `${info.projectNumbers}+`, label: "Projects Shipped" },
    { value: String(info.companies), label: "Companies" },
    { value: String(info.techMastering), label: "Technologies Mastered" },
  ];
}
