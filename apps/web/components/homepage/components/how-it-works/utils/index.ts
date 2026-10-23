import { Code2, Palette, Search, Send } from "@repo/ui/icons";
import type { LucideIcon } from "@repo/ui/icons";
import type { MessageKey } from "../../../../../i18n/types";

export type Step = {
  Icon: LucideIcon;
  titleKey: MessageKey;
  copyKey: MessageKey;
};

/** The four steps of the process, in order. */
export const steps: Step[] = [
  { Icon: Search, titleKey: "howDiscoverTitle", copyKey: "howDiscoverCopy" },
  { Icon: Palette, titleKey: "howDesignTitle", copyKey: "howDesignCopy" },
  { Icon: Code2, titleKey: "howBuildTitle", copyKey: "howBuildCopy" },
  { Icon: Send, titleKey: "howLaunchTitle", copyKey: "howLaunchCopy" },
];

export type Review = {
  name: string;
  quoteKey: MessageKey;
  roleKey: MessageKey;
  /** Out of 5. */
  rating: number;
};
