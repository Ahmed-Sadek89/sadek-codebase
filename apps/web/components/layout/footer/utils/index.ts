import type { MessageKey } from "../../../../i18n/types";

/** The "What I do" column: the three roles, linking to the sections that show them. */
export const serviceLinks: { labelKey: MessageKey; href: string }[] = [
  { labelKey: "footerFrontEnd", href: "#skills" },
  { labelKey: "footerBackEnd", href: "#skills" },
  { labelKey: "footerTechInstructor", href: "#about" },
];

/** "Copyright © Sadek - 2026": always the current year. */
export function currentYear() {
  return new Date().getFullYear();
}
