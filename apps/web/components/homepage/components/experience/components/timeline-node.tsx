import { cn } from "@repo/ui/utils";

/** The marker on the timeline line; current jobs get a filled, pulsing dot. */
export function TimelineNode({
  isCurrent,
  className,
}: {
  isCurrent: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute top-7 z-10 grid size-10 place-items-center sm:top-8 sm:size-12",
        className,
      )}
    >
      {isCurrent && (
        <span className="absolute size-5 animate-ping rounded-full bg-primary/40 motion-reduce:animate-none" />
      )}
      <span
        className={cn(
          "relative size-4 rounded-full border-2 ring-4 ring-surface transition-colors duration-300",
          isCurrent
            ? "border-primary bg-primary"
            : "border-primary/60 bg-card group-hover/item:bg-primary/60",
        )}
      />
    </span>
  );
}
