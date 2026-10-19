"use client";

import { useTranslations } from "next-intl";
import { ExternalLink, type LucideIcon } from "@repo/ui/icons";

type ContactItemProps = {
  label: string;
  icon: LucideIcon;
  /** The stored value; null shows "Not set". */
  value: string | null;
  href: string | null;
  /** Shown instead of the raw value, e.g. "Open CV" for a file URL. */
  linkText?: string;
};

export function ContactItem({
  label,
  icon: Icon,
  value,
  href,
  linkText,
}: ContactItemProps) {
  const t = useTranslations();
  const isExternal = href !== null && !href.startsWith("mailto:");

  return (
    <li className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {value && href ? (
          <a
            href={href}
            dir="ltr"
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer noopener" : undefined}
            title={value}
            className="inline-flex max-w-full items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            <span className="truncate">{linkText ?? value}</span>
            {isExternal && (
              <ExternalLink className="size-3.5 shrink-0" aria-hidden />
            )}
          </a>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            {t("userInfoNotSet")}
          </p>
        )}
      </div>
    </li>
  );
}
