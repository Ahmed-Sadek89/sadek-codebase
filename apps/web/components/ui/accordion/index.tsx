"use client";

import { Accordion } from "@repo/ui/accordion";
import { cn } from "@repo/ui/utils";
import { AccordionCard, type AccordionListItem } from "./accordion-card";

export type { AccordionListItem };

/**
 * A list of accordion cards with one item open at a time (it can be closed).
 * The first item starts open unless `defaultOpenFirst` is false. Built on
 * the shadcn primitives in @repo/ui/accordion.
 */
export function AccordionList({
  items,
  defaultOpenFirst = true,
  className,
}: {
  items: AccordionListItem[];
  defaultOpenFirst?: boolean;
  className?: string;
}) {
  return (
    <Accordion
      className={cn("flex flex-col gap-3 sm:gap-4", className)}
      collapsible
      defaultValue={defaultOpenFirst ? items[0]?.value : undefined}
      type="single"
    >
      {items.map((item) => (
        <AccordionCard item={item} key={item.value} />
      ))}
    </Accordion>
  );
}
