import { Code2, Palette, Search, Send } from "@repo/ui/icons";
import type { LucideIcon } from "@repo/ui/icons";
import type { MessageKey } from "../../../../i18n/types";

export const steps: {
  Icon: LucideIcon;
  titleKey: MessageKey;
  copyKey: MessageKey;
}[] = [
  { Icon: Search, titleKey: "howDiscoverTitle", copyKey: "howDiscoverCopy" },
  { Icon: Palette, titleKey: "howDesignTitle", copyKey: "howDesignCopy" },
  { Icon: Code2, titleKey: "howBuildTitle", copyKey: "howBuildCopy" },
  { Icon: Send, titleKey: "howLaunchTitle", copyKey: "howLaunchCopy" },
];
