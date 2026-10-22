import type { ReactNode } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/accordion";

export type AccordionListItem = {
  /** Unique per list; also what `defaultValue` matches. */
  value: string;
  /** Short marker in the leading tile, e.g. "01" or an icon. Optional. */
  badge?: ReactNode;
  title: ReactNode;
  /** One line under the title, visible while closed. */
  description?: ReactNode;
  /** Revealed when open. A string is shown as a paragraph (line breaks kept). */
  content?: ReactNode;
};

/** One accordion item as a card: badge, title and description; the content when open. */
export function AccordionCard({ item }: { item: AccordionListItem }) {
  const hasBadge = item.badge !== undefined;
  return (
    <AccordionItem
      className="group rounded-2xl border border-border bg-card shadow-sm transition duration-300 last:border-b hover:border-border-strong data-[state=open]:border-primary/40 data-[state=open]:shadow-lg data-[state=open]:shadow-primary/10"
      value={item.value}
    >
      <AccordionTrigger className="items-center gap-4 px-4 py-4 hover:no-underline sm:gap-5 sm:px-6 sm:py-5 [&>svg]:size-5 [&>svg]:translate-y-0 group-data-[state=open]:[&>svg]:text-primary">
        {hasBadge && (
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-sm font-bold text-primary ring-1 ring-primary/20 transition-colors duration-300 group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground sm:size-12 sm:text-base">
            {item.badge}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold text-foreground sm:text-lg">
            {item.title}
          </span>
          {item.description && (
            <span className="mt-0.5 block text-xs font-normal text-muted-foreground sm:text-sm">
              {item.description}
            </span>
          )}
        </span>
      </AccordionTrigger>
      {item.content && (
        // With a badge, indented to line up with the title (tile + gap).
        <AccordionContent
          className={
            hasBadge
              ? "px-4 pb-5 ps-[72px] sm:px-6 sm:pb-6 sm:ps-[92px]"
              : "px-4 pb-5 sm:px-6 sm:pb-6"
          }
        >
          {typeof item.content === "string" ? (
            <p className="border-s-2 border-primary/30 ps-4 text-sm leading-[1.85] whitespace-pre-line text-muted-foreground sm:text-[15px]">
              {item.content}
            </p>
          ) : (
            item.content
          )}
        </AccordionContent>
      )}
    </AccordionItem>
  );
}
