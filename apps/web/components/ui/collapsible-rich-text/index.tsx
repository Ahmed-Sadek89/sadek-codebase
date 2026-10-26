"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "@repo/ui/icons";
import { RichTextContent } from "@repo/ui/rich-text";
import { cn } from "@repo/ui/utils";
import { useCollapsible } from "./use-collapsible";

/**
 * Rich text clamped (about 9 lines by default) with a fade until "Read more" opens it;
 * short text shows in full with no toggle. Used by the Work and Teaching
 * descriptions. `fadeClassName` must match the background behind the text.
 */
export function CollapsibleRichText({
  html,
  className,
  fadeClassName = "from-card",
  collapsedClassName = "max-h-64",
}: {
  html: string;
  /** Classes for the text itself. */
  className?: string;
  fadeClassName?: string;
  /** The clamp while collapsed; defaults to about 9 lines. */
  collapsedClassName?: string;
}) {
  const t = useTranslations();
  const id = useId();
  const { ref, isOverflowing, isExpanded, toggle } = useCollapsible<HTMLDivElement>();
  const isClamped = isOverflowing && !isExpanded;

  return (
    <div>
      <div className="relative">
        <div
          className={cn("overflow-hidden", !isExpanded && collapsedClassName)}
          data-expanded={isExpanded}
          id={id}
          ref={ref}
        >
          <RichTextContent className={className} html={html} />
        </div>
        {isClamped && (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t to-transparent",
              fadeClassName,
            )}
          />
        )}
      </div>
      {isOverflowing && (
        <button
          aria-controls={id}
          aria-expanded={isExpanded}
          className="mt-2 inline-flex items-center gap-1 rounded-full text-sm font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          onClick={toggle}
          type="button"
        >
          {isExpanded ? t("showLess") : t("readMore")}
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "size-4 transition-transform duration-200 motion-reduce:transition-none",
              isExpanded && "rotate-180",
            )}
          />
        </button>
      )}
    </div>
  );
}
