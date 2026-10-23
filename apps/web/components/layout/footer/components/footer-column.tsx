import type { ReactNode } from "react";

/** A titled footer column (a labelled nav landmark). */
export function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <nav aria-label={title} className="flex flex-col gap-4">
      <h3 className="text-sm font-bold tracking-wider text-foreground uppercase">
        {title}
      </h3>
      {children}
    </nav>
  );
}
