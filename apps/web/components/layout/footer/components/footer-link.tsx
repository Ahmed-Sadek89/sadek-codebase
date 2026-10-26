import Link from "next/link";
import type { ReactNode } from "react";

/** A footer link: a short accent bar slides in before the label on hover. */
export function FooterLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      className="group inline-flex items-center text-sm text-muted-foreground no-underline transition-colors hover:text-foreground focus-visible:text-foreground"
      href={href}
    >
      <span
        aria-hidden="true"
        className="h-0.5 w-0 rounded-full bg-primary transition-all duration-300 group-hover:me-2 group-hover:w-3 group-focus-visible:me-2 group-focus-visible:w-3"
      />
      {children}
    </Link>
  );
}
